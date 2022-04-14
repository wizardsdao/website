import { useEffect, useState, useRef } from "react";
import { connectContractToSigner, useContractFunction } from "@usedapp/core";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { TailSpin } from "svg-loaders-react";

const AuctionInput = ({
  bidError,
  setBidError,
  auctionHouse,
  wizard,
  web3React,
  walletConnectClick,
  minBidEth,
  dispatchBidEvents,
  wizards,
  poll,
  paused,
  notActive,
}) => {
  const placeholderRef = useRef(null);
  const bidInputRef = useRef(null);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settling, setSettling] = useState(true);

  function handleBidInputChange(event) {
    setBidError("");
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes(".") && event.target.value.split(".")[1].length > 2) {
      return;
    }

    if (input === "") {
      placeholderRef.current.style.display = "block";
    } else {
      placeholderRef.current.style.display = "none";
    }
  }

  async function handleBidClick(e) {
    setLoading(true);
    e.preventDefault();

    const bid = bidInputRef.current.value;
    if (!bid.toString()) {
      setBidError(`Minimum bid is ${minBidEth} ETH`);
      setLoading(false);
      return;
    }

    if (new BigNumber(bid).lt(new BigNumber(minBidEth))) {
      setBidError(`Minimum bid is ${minBidEth} ETH`);
      setLoading(false);
      return;
    }

    const value = ethers.utils.parseEther(bid.toString());
    const contract = connectContractToSigner(
      auctionHouse,
      { signer: web3React.library.getSigner() },
      web3React.library
    );

    const sender = web3React.account;
    try {
      const gasLimit = await contract.estimateGas.createBid(
        wizard.wizardId,
        wizard.aId,
        {
          value,
        }
      );

      await contract.createBid(wizard.wizardId, wizard.id, {
        value,
        gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
      });

      setBidError("");
      setLoading(false);

      // dispatch on client so we don't have to poll immediately to get new bid data
      dispatchBidEvents({
        events: [
          {
            wizardId: wizard.wizardId,
            aId: wizard.aId,
            sender,
            value: value.toString(),
            extended: false,
            transactionHash: "",
            timestamp: new Date().getTime(),
          },
        ],
      });

      poll();
    } catch (ex) {
      setLoading(false);
      // reversion
      if (ex.code === -32603) {
        if (ex.data?.message) {
          if (ex.data?.message.includes("Auction expired")) {
            setBidError("This auction has expired.");
            return;
          }
        }

        if (ex.data?.message) {
          if (ex.data?.message.includes("All auctions have not completed")) {
            let openAuction = 0;
            for (let i = 0; i < wizards.length; i++) {
              const wiz = wizards[i];
              if (parseInt(wiz.endTime, 10) > Math.floor(Date.now() / 1000)) {
                openAuction = wiz.aId;
              }
            }

            if (openAuction) {
              setBidError(`Auction #${openAuction} still in progress`);
              return;
            }
          }
        }

        if (ex.data?.message) {
          // bid error (either not enough of doesn't exeed min % increase)
          if (ex.data?.message.includes("Must send")) {
            setBidError("You must enter at least the minimum bid amount");
            return;
          }

          if (ex.data?.message.includes("insufficient funds")) {
            setBidError(`Insufficient funds in wallet`);
            return;
          }

          if (ex.data?.message.includes("Bidder is not on whitelist")) {
            setBidError(`Only whitelisted addresses can bid today`);
            return;
          }
        }
      }

      if (ex.message) {
        // bid error (either not enough or doesn't exeed min % increase)
        if (ex.message.includes("Must send")) {
          setBidError("You must enter at least the minimum bid amount");
          return;
        }

        if (ex.message.includes("insufficient funds")) {
          setBidError(`Insufficient funds in wallet`);
          return;
        }

        if (ex.message.includes("Bidder is not on whitelist")) {
          setBidError(`Only whitelisted addresses can bid today`);
          return;
        }
      }

      setBidError(ex.data?.message || ex.message);
    }
  }

  async function handleSettleClick(e) {
    setLoading(true);
    e.preventDefault();

    const contract = connectContractToSigner(
      auctionHouse,
      { signer: web3React.library.getSigner() },
      web3React.library
    );

    try {
      if (!paused) {
        const gasLimit =
          await contract.estimateGas.settleCurrentAndCreateNewAuction();
        await contract.settleCurrentAndCreateNewAuction({
          gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
        });
      } else {
        // if contract is paused allow settlement of auction
        const gasLimit = await contract.estimateGas.settleAuction(
          ethers.BigNumber.from(wizard.aId)
        );
        await contract.settleAuction(ethers.BigNumber.from(wizard.aId), {
          gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
        });
      }

      setBidError("");
      setLoading(false);
      setSettling(true);
      poll();
    } catch (ex) {
      setLoading(false);
      // rejection on users behalf don't show error
      if (ex.code === 4001) {
        return;
      }

      if (ex.code === -32603) {
        if (ex.data?.message) {
          if (ex.data?.message.includes("All auctions have not completed")) {
            let openAuction = 0;
            for (let i = 0; i < wizards.length; i++) {
              const wiz = wizards[i];
              if (parseInt(wiz.endTime, 10) > Math.floor(Date.now() / 1000)) {
                openAuction = wiz.aId;
              }
            }

            if (openAuction) {
              setBidError(`Auction #${openAuction} still in progress`);
              return;
            }
          }

          if (ex.data?.message.includes("Auction has already been settled")) {
            setBidError(`Auction has already been settled`);
            return;
          }

          if (ex.data?.message.includes("insufficient funds")) {
            setBidError(`Insufficient funds in wallet`);
            return;
          }
        }
      }

      if (ex.message) {
        if (ex.message.includes("All auctions have not completed")) {
          let openAuction = 0;
          for (let i = 0; i < wizards.length; i++) {
            const wiz = wizards[i];
            if (parseInt(wiz.endTime, 10) > Math.floor(Date.now() / 1000)) {
              openAuction = wiz.aId;
            }
          }

          if (openAuction) {
            setBidError(`Auction #${openAuction} still in progress`);
            return;
          }
        }

        if (ex.message.includes("Auction has already been settled")) {
          setBidError(`Auction has already been settled`);
          return;
        }

        if (ex.message.includes("insufficient funds")) {
          setBidError(`Insufficient funds in wallet`);
          return;
        }
      }

      setBidError(ex.message);
    }
  }

  // timer logic - check auction status every 30 seconds, until five minutes remain, then check status every second
  useEffect(() => {
    const timeLeft =
      parseInt(wizard.endTime, 10) - Math.floor(Date.now() / 1000);

    if (wizard && timeLeft <= 0) {
      setAuctionEnded(true);
    } else {
      setAuctionEnded(false);
      const timer = setTimeout(
        () => {
          setAuctionTimer(!auctionTimer);
        },
        timeLeft > 300 ? 30000 : 1000
      );

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auctionTimer, wizard, JSON.stringify(wizards)]);

  // when we get a new wizard turn off settling state
  useEffect(() => {
    setSettling(false);
    setBidError("");
  }, [JSON.stringify(wizard)]);

  return (
    <>
      {(() => {
        if (web3React.active && notActive) {
          return (
            <div className="input-group">
              <button
                disabled={paused}
                type="button"
                className="btn connect-btn"
                onClick={handleSettleClick}
              >
                {(() => {
                  if (settling) {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "1.6rem",
                          alignItems: "center",
                        }}
                      >
                        <span>Settling</span>
                        <TailSpin width={25} height={25} />
                      </div>
                    );
                  }

                  if (loading) {
                    return <TailSpin width={25} height={25} />;
                  }

                  return paused ? "Auction paused" : "Start auction";
                })()}
              </button>
            </div>
          );
        }

        if (!web3React.active) {
          return (
            <div className="input-group">
              <button
                type="button"
                className="btn connect-btn"
                onClick={walletConnectClick}
              >
                Connect wallet
              </button>
            </div>
          );
        }

        return (
          <>
            <div className="input-group">
              <span className="bid-placeholder" ref={placeholderRef}>
                <span className="eth">Ξ</span> {minBidEth} min bid
              </span>
              <input
                disabled={auctionEnded ? true : false}
                ref={bidInputRef}
                type="number"
                min="0"
                className="form-control bid-input"
                onFocus={() => {
                  setBidError("");
                }}
                onChange={handleBidInputChange}
              />
              <button
                disabled={!web3React.active}
                type="button"
                className="btn"
                onClick={auctionEnded ? handleSettleClick : handleBidClick}
              >
                {(() => {
                  if (settling) {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "1.6rem",
                          alignItems: "center",
                        }}
                      >
                        <span>Settling</span>
                        <TailSpin width={25} height={25} />
                      </div>
                    );
                  }

                  if (loading) {
                    return <TailSpin width={25} height={25} />;
                  }

                  return auctionEnded ? "Settle auction" : "Place bid";
                })()}
              </button>
            </div>
            {bidError ? (
              <div className="bid-error-wrapper">
                <div className="bid-error">
                  <p>{bidError}</p>
                </div>
              </div>
            ) : null}
          </>
        );
      })()}
      <style jsx>{`
        .connect-btn {
          width: 100% !important;
          padding: 0.6rem 1rem;
          border-radius: 6px !important;
          height: 54px;
          font-size: 1.16rem;
          opacity: 0.85;
        }
        .bid-error-wrapper {
          display: flex;
        }
        .bid-error {
          background: rgba(255, 15, 29, 0.7);
          border-radius: 6px;
          padding: 0.25rem 0.66rem;
          width: 100%;
          margin-top: 0.6rem;
        }
        .bid-error p {
          font-size: 1.16rem;
          line-height: 32px;
          font-weight: 500;
          margin: 0;
        }
        .bid-placeholder {
          position: absolute;
          opacity: 0.5;
          top: 30%;
          left: 5%;
          z-index: 1;
          pointer-events: none;
        }
        .eth {
          font-family: sans-serif;
        }
        .btn {
          width: auto;
          margin-left: 0.6rem !important;
          background: #12004c;
          color: #fff !important;
          border: 1px solid #12004c;
          border-radius: 6px !important;
          font-size: 1.16rem;
          min-width: 175px;
        }
        .bid-input {
          padding: 0.6rem 1rem;
          border-radius: 6px !important;
          height: 54px;
          font-size: 1.16rem;
          opacity: 0.85;
        }
        .bid-input:focus {
          border: 1px solid #12004c !important;
          opacity: 1;
        }

        .connect-btn {
          margin-left: 0px !important;
        }

        @media (max-width: 568px) {
          .btn {
            min-width: 125px;
            background: #5625a4;
            color: #fff;
            border-color: #8653d8;
          }
          .bid-placeholder {
            top: 24%;
          }
          .bid-input {
            opacity: 1;
            border-color: #fff;
          }
          .bid-placeholder {
            opacity: 0.4;
            color: #000;
          }
        }
      `}</style>
    </>
  );
};

export default AuctionInput;
