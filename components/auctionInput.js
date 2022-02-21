import { useEffect, useState, useRef } from "react";
import { connectContractToSigner } from "@usedapp/core";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { TailSpin } from "svg-loaders-react";

const AuctionInput = ({
  inactiveAuction,
  bidError,
  setBidError,
  auctionHouse,
  wizard,
  web3React,
  minBidEth,
  dispatchBidEvents,
  wizards,
  poll,
  paused,
}) => {
  const bidInputRef = useRef(null);
  const [bidInput, setBidInput] = useState(minBidEth);
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

    setBidInput(event.target.value);
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

  useEffect(() => {
    setBidInput(minBidEth);
  }, [minBidEth]);

  return (
    <>
      <div className="input-group">
        <input
          disabled={auctionEnded ? true : false}
          ref={bidInputRef}
          className="bid-input"
          type="number"
          min="0"
          placeholder={bidInput}
          onFocus={() => {
            setBidError("");
          }}
          onChange={handleBidInputChange}
        />
        <span className="bid-placeholder">ETH</span>
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
                  <TailSpin width={30} />
                </div>
              );
            }

            if (loading) {
              return <TailSpin width={30} />;
            }

            return auctionEnded && !inactiveAuction ? "Settle" : "Bid";
          })()}
        </button>
      </div>
      {bidError ? (
        <div className="bid-error">
          <p>{bidError}</p>
        </div>
      ) : null}
      <style jsx>{`
        input:disabled {
          background: #eee;
          border-color: #333;
        }
        .mbs {
          margin-bottom: 0.5rem;
        }
        .input-group {
          margin-bottom: 1rem;
        }
        .input-group .btn {
          position: relative;
          z-index: 2;
          margin-left: 1rem !important;
          border-radius: 6px !important;
          width: 40%;
          height: 3rem;
          border: transparent;
        }
        .btn:disabled {
          pointer-events: none;
          opacity: 0.65;
        }
        .bid-placeholder {
          margin-left: -1px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          position: absolute;
          top: 25%;
          left: 43%;
          font-weight: 700;
          color: #aaa;
          z-index: 3;
        }
        @media (max-width: 992px) {
          .bid-placeholder {
            top: 20%;
            left: 44%;
          }

          .wizard {
            width: 100%;
            padding: 0;
          }
        }
        .bid-input {
          position: relative;
          flex: 1 1 auto;
          width: 1%;
          min-width: 0;
          height: 3.02rem;
          color: #000;
          border: 1 px solid #aaa !important;
          border-radius: 0.25 rem !important;
          background-color: #fff;
          font-size: 1.5rem;
          outline: none !important;
          box-shadow: none !important;
        }
        .input-group {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          width: 100%;
        }
        .btn {
          background: #171717;
          color: #fff !important;
          border: 1px solid #000;
          font-weight: 600;
        }
        .bid-error {
          background: red;
          border-radius: 6px;
          padding: 0.25rem 0.66rem;
        }
        .bid-error p {
          font-size: 1rem;
          font-weight: 500;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif !important;
          margin: 0;
        }
      `}</style>
    </>
  );
};

export default AuctionInput;
