import Layout from "./layout/home.js";
import dayjs from "dayjs";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useRouter } from "next/router";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import AuctionTimer from "./auctionTimer";
import useAuctionHouseSubscriber from "../hooks/useAuctionHouseSubscriber";
import BidRow from "./bidRow";
import BigNumber from "bignumber.js";
import AuctionInput from "./auctionInput";
import Marquee from "./carousel";
import Accordion from "react-bootstrap/Accordion";
import { TailSpin } from "./loader";

const wcCfg = {
  rpc: {
    1: process.env.NEXT_PUBLIC_MAINNET_RPC_URI, // mainnet (use infura rpc endpoint)
    4: process.env.NEXT_PUBLIC_RINKEBY_RPC_URI, // rinkeby
    31337: process.env.NEXT_PUBLIC_LOCAL_RPC_URI, // local hardhat node
  },
};

let injected = new InjectedConnector({ supportedChainIds: [1, 31337, 4] });
let wcConnector = new WalletConnectConnector(wcCfg);

const AUCTION_COUNT = 3;

let minBidIncPercentage = new BigNumber(5);
const computeMinimumNextBid = (currentBid, minBidIncPercentage) => {
  if (currentBid.isZero()) {
    return new BigNumber(0);
  }

  return !minBidIncPercentage
    ? new BigNumber.from(0)
    : currentBid.times(minBidIncPercentage.div(100).plus(1));
};

const minBidEth = (minBid) => {
  if (minBid.toString() == "NaN") {
    minBid = new BigNumber(0);
  }
  if (minBid.isZero()) {
    return "0.07";
  }

  const eth = Number(
    ethers.utils.formatEther(ethers.BigNumber.from(minBid.toFixed()))
  );

  const roundedEth = Math.ceil(eth * 100) / 100;
  return roundedEth.toString();
};

function useQuery(router) {
  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;
  if (!ready) return {};
  return router.query;
}

const dummyWizard = {
  id: 0,
  aId: 1,
  wizardId: 0,
  lastBid: "0",
  dataURI: {
    image: "/static/img/loading.svg",
    description: "loading wizard",
  },
  bids: [],
  createdEvents: [],
  settledEvents: [],
  startTime: "0",
  endTime: "0",
  oneOfOne: false,
};
const getDummyWizards = () => {
  const dummies = [];
  for (let i = 0; i < AUCTION_COUNT; i++) {
    const d = { ...dummyWizard, id: i + 1 };
    dummies.push(d);
  }
  return dummies;
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  return library;
}

const bindEventsToWizards = (
  bidEvents,
  extendedEvents,
  settledEvents,
  createdEvents,
  wizards
) => {
  const retWizards = [];
  for (let i = 0; i < wizards.length; i++) {
    let wiz = wizards[i];

    // bind all events
    wiz.bids = wiz.bids || [];
    wiz.lastBid = "0";

    bidEvents.sort((a, b) => {
      const av = ethers.BigNumber.from(a.value);
      const bv = ethers.BigNumber.from(b.value);
      if (av.lt(bv)) {
        return -1;
      }

      if (av.gt(bv)) {
        return 1;
      }

      return 0;
    });

    bidEvents.forEach((b) => {
      if (b.wizardId === wiz.wizardId) {
        wiz.bids.push(b);
        wiz.lastBid = b.value;
      }
    });

    wiz.oneOfOne = false;
    wiz.isWhitelistDay = false;
    createdEvents.forEach((b) => {
      if (b.wizardId === wiz.wizardId) {
        wiz.oneOfOne = b.oneOfOne;
        wiz.isWhitelistDay = b.isWhitelistDay;
      }
    });

    wiz.extendedEvents = wiz.extendedEvents || [];
    extendedEvents.forEach((b) => {
      if (b.wizardId === wiz.wizardId) {
        wiz.extendedEvents.push(b);
        wiz.endTime = b.endTime;
      }
    });

    wiz.settledEvents = wiz.settledEvents || [];
    settledEvents.forEach((b) => {
      if (b.wizardId === wiz.wizardId) {
        wiz.settledEvents.push(b);
      }
    });

    retWizards.push(wiz);
  }
  return retWizards;
};

// get eth logs and convert to wizard object w/ image extracted
const eventsToWizards = async (
  createdEvents,
  bidEvents,
  extendedEvents,
  settledEvents,
  wizardToken
) => {
  let skipImageDownload = false;
  const temp = localStorage.getItem("wizards") || "[]";

  const wizards = JSON.parse(temp) || [];
  let oldWizards = wizards;

  // refresh them bitches if api provider dropped an event
  if (wizards.length < AUCTION_COUNT) {
    wizards = [];
  }

  // check if wizards stored in localstorage match those coming in on events
  // (if not we have new wizards(i.e. post settlement))
  let refreshWizardLS = false;
  for (let i = 0; i < wizards.length; i++) {
    const haveWizID = wizards[i].wizardId;
    let foundMatch = false;
    for (let p = 0; p < createdEvents.length; p++) {
      const event = createdEvents[p];
      if (haveWizID == event.wizardId) {
        foundMatch = true;
      }
    }

    // refresh if got a new endtime from extended events
    // this ensures timer doesn't get reset
    for (let p = 0; p < extendedEvents.length; p++) {
      const event = extendedEvents[p];
      if (haveWizID == event.wizardId) {
        if (Number(wizards[i].endTime) !== event.endTime) {
          if (foundMatch) {
            skipImageDownload = true;
          }

          foundMatch = false;
        }
      }
    }

    // ensure we have images on wizzies otherwise get svg from contract
    if (foundMatch) {
      for (let i = 0; i < wizards.length; i++) {
        const wiz = wizards[i];
        if (!wiz.dataURI.image) {
          foundMatch = false;
          skipImageDownload = false;
          break;
        }
      }
    }

    if (!foundMatch && createdEvents.length) {
      refreshWizardLS = true;
      wizards = [];
      break;
    }
  }

  if (wizards.length && !refreshWizardLS) {
    return bindEventsToWizards(
      bidEvents,
      extendedEvents,
      settledEvents,
      createdEvents,
      wizards
    );
  }

  let i = 1;
  for (let event of createdEvents.slice(-AUCTION_COUNT)) {
    // cache dataURI for when we skip image load
    let oldDataURI;
    for (let j = 0; j < oldWizards.length; j++) {
      if (oldWizards[j].id === i) {
        oldDataURI = oldWizards[j].dataURI;
        break;
      }
    }

    let wizard = {
      id: i,
      aId: event.aId,
      wizardId: event.wizardId,
      startTime: event.startTime.toString(),
      endTime: event.endTime.toString(),
      ended: false,
      oneOfOne: event.oneOfOne,
      dataURI: oldDataURI || { image: "", description: "" },
    };

    // set end time to extended endTime if we have one
    for (let p = 0; p < extendedEvents.length; p++) {
      const event = extendedEvents[p];
      if (wizard.wizardId == event.wizardId) {
        if (Number(wizard.endTime) !== event.endTime) {
          wizard.endTime = event.endTime.toString();
        }
      }
    }

    try {
      if (!skipImageDownload) {
        const dataURI = JSON.parse(
          window.atob(
            (await wizardToken.tokenURI(event.wizardId))
              .toString()
              .substring(29)
          )
        );

        wizard.dataURI = dataURI;
      }
    } catch (ex) {
      // we only get here if attempting to get a wizard image that was burned
      // or we are in the last auction
      console.error(ex, event.wizardId);
      console.log("could not get tokenURI maybe burned", wizard);
      continue;
    }

    wizards.push(wizard);
    i++;
  }

  localStorage.setItem("wizards", JSON.stringify(wizards));
  return bindEventsToWizards(
    bidEvents,
    extendedEvents,
    settledEvents,
    createdEvents,
    wizards
  );
};

const Auction = () => {
  const router = useRouter();
  const query = useQuery(router);
  const web3React = useWeb3React();

  const [
    bidEvents,
    createdEvents,
    extendedEvents,
    settledEvents,
    auctionHouse,
    wizardToken,
    setTimerLength,
    dispatchBidEvents,
    dispatchCreatedEvents,
    dispatchExtendedEvents,
    dispatchSettledEvents,
    poll,
    paused,
    reachedCap,
    loading,
  ] = useAuctionHouseSubscriber();

  // load contract methods for use
  const [wizard, setWizard] = useState(dummyWizard);
  const [imageLoading, setImageLoading] = useState(false);
  const [wizards, setWizards] = useState(getDummyWizards());
  const [previousPageId, setPreviousPageId] = useState(1);
  const [nextPageId, setNextPageId] = useState(AUCTION_COUNT);
  const [bidError, setBidError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [restartAuction, setRestartAuction] = useState(false);
  const [inactiveAuction, setInactiveAuction] = useState(false);
  const [isWhitelist, setIsWhitelist] = useState(false);

  useEffect(() => {
    if (settledEvents.length == AUCTION_COUNT && !restartAuction) {
      setRestartAuction(true);
    }
  }, [JSON.stringify(settledEvents)]);

  useEffect(() => {
    setRestartAuction(false);

    const fn = async () => {
      setImageLoading(true);
      let wizards = await eventsToWizards(
        createdEvents,
        bidEvents,
        extendedEvents,
        settledEvents,
        wizardToken
      );

      setImageLoading(false);

      if (!wizards.length) {
        wizards = getDummyWizards();
      }

      // get wizard data and set current wizard to render
      const widx = (!("id" in query) ? 1 : query.id) - 1;
      if (!widx in wizards) {
        return;
      }
      setWizards(wizards);

      const wizCopy = { ...wizards[widx] };
      setWizard(wizCopy);

      // check if today is a whitelist day
      if (wizCopy.isWhitelistDay) {
        setIsWhitelist(true);
      } else {
        setIsWhitelist(false);
      }

      // set routing state
      let id = Number(query.id || 1);
      let hasNext = false;
      let hasPrevious = false;
      let nextId = id;
      let previousId = id;
      if (widx > 0) {
        hasPrevious = true;
      }

      if (widx < AUCTION_COUNT - 1 && wizards[widx + 1] !== undefined) {
        hasNext = true;
      }

      if (hasNext) {
        nextId = id + 1;
      } else {
        nextId = 1;

        if (wizards[1] == undefined) {
          nextId = widx + 1;
        }
      }

      if (hasPrevious && wizards[widx - 1] !== undefined) {
        previousId = id - 1;
      } else {
        previousId = AUCTION_COUNT;

        if (wizards[AUCTION_COUNT - 1] == undefined) {
          previousId = widx + 1;
        }
      }

      setPreviousPageId(previousId);
      setNextPageId(nextId);
    };

    try {
      setGlobalError("");
      fn();
    } catch (ex) {
      setGlobalError("Could not connect to Ethereum network");
    }
  }, [
    JSON.stringify(query.id),
    JSON.stringify(createdEvents),
    JSON.stringify(bidEvents),
    JSON.stringify(extendedEvents),
    paused,
    restartAuction,
    loading,
  ]);

  const onWalletDisconnect = () => {
    web3React.deactivate();
  };

  const onWalletConnectClick = () => {
    const fn = async () => {
      try {
        setGlobalError("");
        if (window.ethereum) {
          if (!web3React.active && !web3React.error) {
            await web3React.activate(injected);
          }

          // if user accidently closes metamask we need to reload page, there is an outstanding fix for this
          // in the develop branch https://github.com/MetaMask/metamask-extension/issues/10085
          if (web3React.error) {
            if (
              web3React.error.message ==
              "Already processing eth_requestAccounts. Please wait."
            ) {
              injected = new InjectedConnector({
                supportedChainIds: [1, 31337, 4],
              });
              await web3React.activate(injected);
            }

            // if user rejects or cancels page try again
            if (web3React.error.message === "The user rejected the request.") {
              injected = new InjectedConnector({
                supportedChainIds: [1, 31337, 4],
              });
              await web3React.activate(injected);
            }
          }
        } else {
          if (!web3React.active && !web3React.error) {
            await web3React.activate(
              wcConnector,
              (ex) => {
                if (ex.message === "The user rejected the request.") {
                  // reset connector so it is not in a disabled state
                  wcConnector = new WalletConnectConnector(wcCfg);
                }
              },
              false
            );
          }
        }
      } catch (ex) {
        console.error(ex);
        setGlobalError("Could not connect wallet");
      }
    };

    fn();
  };

  return (
    <Layout
      isWhitelist={isWhitelist}
      title={`WizardsDAO - ${AUCTION_COUNT} Wizards every day. 2000 ever.`}
      web3Connected={web3React.active}
      walletConnectClick={onWalletConnectClick}
      walletDisconnectClick={onWalletDisconnect}
    >
      <div className="wrap">
        {(() => {
          if (globalError) {
            return (
              <div className="g-error">
                <p>{globalError}</p>
              </div>
            );
          }
        })()}
        <div className="container p hero">
          <div className="pillh center">
            <a
              href="https://twitter.com/WizardsDAOBot/status/1483146932847476738"
              className="btn btn-sm pilltitle small"
              target="_blank"
            >
              <span>Past Auction Prices</span>
            </a>
          </div>
          <div className="pillh center">
            <span className="md">{format(new Date(), "MM/dd/yy")}</span>
          </div>
          <span className="purp center pilltitle">
            {AUCTION_COUNT} NEW WIZARDS DAILY
          </span>
          <div className="wizards">
            {wizards.map((w, idx) => {
              let active = false;
              // is active if id == 1 and we are on homepage or query.id == id
              if (query.id == w.id || (!("id" in query) && w.id == 1)) {
                active = true;
              }

              let cn = active ? "thumb active" : "thumb";
              if (w.oneOfOne) {
                cn += " oneOfOne";
              }

              const timeLeft = Number(w.endTime) - dayjs().unix();
              if (timeLeft <= 300 && timeLeft >= 0) {
                cn += " pulse";
              }

              // last 25 minutes speed up pulse and update opacity
              if (timeLeft <= 150 && timeLeft >= 0) {
                cn += " pulse-urgent";
              }

              if (timeLeft <= 0) {
                cn += " done";
              }

              return (
                <div className={cn} key={idx}>
                  {(() => {
                    if (w.oneOfOne) {
                      return <div className="banner">⭐️</div>;
                    }
                  })()}
                  <Link href={`/auction/${w.id}`}>
                    <a>
                      <img
                        alt={w.dataURI?.description}
                        width={"100%"}
                        style={{ maxWidth: "60px" }}
                        src={w.dataURI?.image}
                      />
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="auction">
            <div className="wizard">
              <div className="wizard-wrapper">
                <div className="wizard-img-wrapper">
                  {loading || imageLoading ? <TailSpin /> : null}
                  <img
                    alt={wizard.dataURI?.description}
                    className="wizard-img"
                    src={wizard.dataURI?.image}
                  />
                </div>
              </div>
            </div>
            {(() => {
              if (inactiveAuction) {
                return (
                  <div className="auction-activity">
                    <div className="auction-title">
                      <div className="inactive">
                        {(() => {
                          if (reachedCap) {
                            return <h2>All wizards have been minted.</h2>;
                          }

                          return (
                            <h2>Auction starting soon please stand by...</h2>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="auction-activity">
                  <div className="auction-title">
                    <h2>Wizard #{wizard.wizardId}</h2>
                    <div className="in-auction-navigation">
                      <Link scroll={false} href={`/auction/${previousPageId}`}>
                        <a className="la">←</a>
                      </Link>
                      <Link scroll={false} href={`/auction/${nextPageId}`}>
                        <a className="ra">→</a>
                      </Link>
                    </div>
                  </div>
                  <div className="auction-bid-wrapper">
                    <div className="current-bid-col">
                      <h4>Current bid</h4>
                      <h2>
                        <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
                        {ethers.utils.formatEther(
                          wizard.lastBid || ethers.BigNumber.from("0")
                        )}
                      </h2>
                    </div>
                    <div className="auction-timer">
                      <h4>{wizard.ended ? "Auction ended" : "Ends in"}</h4>
                      <h2>
                        <AuctionTimer wizard={wizard} />
                      </h2>
                    </div>
                  </div>
                  <div className="auction-input">
                    <div className="auction-input-inner">
                      <h4 className="mbs">
                        Minimum bid:{" "}
                        {(() => {
                          return minBidEth(
                            computeMinimumNextBid(
                              BigNumber(wizard.lastBid || new BigNumber(0)),
                              minBidIncPercentage
                            )
                          );
                        })()}{" "}
                        ETH
                      </h4>
                      <AuctionInput
                        paused={paused}
                        wizards={wizards}
                        poll={poll}
                        dispatchBidEvents={dispatchBidEvents}
                        bidError={bidError}
                        auctionHouse={auctionHouse}
                        web3React={web3React}
                        wizard={wizard}
                        minBidEth={minBidEth(
                          computeMinimumNextBid(
                            BigNumber(wizard.lastBid || new BigNumber(0)),
                            minBidIncPercentage
                          )
                        )}
                        setBidError={setBidError}
                      />
                    </div>
                  </div>
                  <div className="bid-history">
                    <div className="bid-history-inner">
                      <ul className="bids">
                        {(() => {
                          let ret = [];
                          for (
                            let i = wizard.bids.length - 1;
                            i > wizard.bids.length - 4;
                            i--
                          ) {
                            if (wizard.bids[i]) {
                              ret.push(
                                <BidRow
                                  key={wizard.bids[i].value.toString()}
                                  e={wizard.bids[i]}
                                  account={web3React.account}
                                  wizardId={wizard.wizardId}
                                />
                              );
                            }
                          }

                          if (!ret.length) {
                            return null;
                          }

                          return [<span key="bleh">Latest bids</span>, ...ret];
                        })()}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <div className="alt p">
          <div className="abt wide">
            <div className="p sbs">
              <h1 style={{ lineHeight: "5rem" }}>
                {AUCTION_COUNT} Wizards everyday. 2000 ever.
              </h1>
              <img src="/static/img/wiz.svg" />
            </div>
          </div>
          <Marquee
            imgs={[
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
              "/static/img/hat.svg",
            ]}
          />
        </div>
        <div className="container cp" style={{ paddingBottom: "3rem" }}>
          <div style={{ marginBottom: 0 }} className="abt">
            <div className="p">
              <h2>How it works</h2>
              <p style={{ marginBottom: "3rem" }}>
                Wizards is an NFT community for degens. Join by winning an
                auction. Vote on how to spend The Money.
              </p>
              <Accordion>
                <Accordion.Item
                  eventKey="0"
                  style={{ background: "transparent", border: "none" }}
                >
                  <Accordion.Header style={{ background: "transparent" }}>
                    Auctions
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      WizardsDAO is auctioning {AUCTION_COUNT} wizards on-chain
                      every 24 hours until 2000 are minted. 90% of auction
                      proceeds (ETH) are automatically deposited into the
                      WizardsDAO treasury (Gnosis Safe multi-sig), where they
                      are governed by wizard owners.
                    </p>

                    <p>
                      Whenever an auction is settled, the transaction will also
                      cause {AUCTION_COUNT} new wizards to be minted and a new
                      24 hour auction to begin. While settlement is most heavily
                      incentivized for any winning bidder, it can be triggered
                      by anyone, allowing the system to trustlessly auction
                      wizards.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>WizardsDAO</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      A Gnosis Safe multi-sig treasury has been set up to store
                      WizardsDAO auction proceeds. Governance is done through
                      Snapshot.
                    </p>
                    <p>
                      A path to full decentralization should be completed by the
                      WizardsDAO community. The implementation details of this
                      are currently underway.
                    </p>
                    <p>
                      Each Wizard is an irrevocable member of WizardsDAO and
                      entitled to one vote in all governance matters. Wizards
                      votes are non-transferable (if you sell your wizard, the
                      vote goes with it).
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>On-Chain Artwork</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Wizards are stored directly on Ethereum and other networks
                      such as IPFS are not used.
                    </p>
                    <p>
                      All artwork is{" "}
                      <a
                        style={{ textDecoration: "underline" }}
                        href="https://creativecommons.org/publicdomain/zero/1.0/"
                      >
                        CC0
                      </a>
                      .
                    </p>
                    <p>
                      Wizards are generated randomly based on Ethereum block
                      hashes. As of this writing, wizards are made up of:
                    </p>
                    <ul style={{ marginLeft: "30px" }}>
                      <li>Backgrounds (3)</li>
                      <li>Background Items (6)</li>
                      <li>Accessories (7)</li>
                      <li>Bodies (13)</li>
                      <li>Clothes (20)</li>
                      <li>Mouths (16)</li>
                      <li>Eyes (7)</li>
                    </ul>
                    <br />
                    <p>
                      There are also rare 1/1 wizards that will be available for
                      auction at regular intervals.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Creator Rewards</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      10% of all auction proceeds are sent to the creators to
                      cover startup costs and expenses.
                    </p>
                    <p>
                      54 Wizards will be reserved to reward significant
                      contributors to the project. 1 wizard is distributed to
                      the creators' wallet at the beginning of every auction for
                      the first 54 auctions.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .accordion-button {
          background: transparent;
          font-size: 2.16rem;
        }
        .accordion-button:focus {
          outline: none !important;
          border: none !important;
        }
        .accordion-button:not(.collapsed) {
          background: transparent;
          color: black;
          box-shadow: none;
        }
        .accordion-button:not(.collapsed)::after {
          fill: black;
          background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
        }
        .abt .accordion .accordion-item {
          background: transparent !important;
          border: none !important;
        }
        .wizard-img-wrapper .svg-loaders-svg {
          position: absolute !important;
          right: 10px;
          top: 5px;
          width: 25px;
        }
      `}</style>
      <style jsx>{`
        .btn-sm span {
          position: relative;
        }
        .btn-sm {
          display: inline-block;
          background: #000;
          border-radius: 6px;
          max-width: 200px;
          margin: 1rem auto;
          background: rgb(249, 180, 43) !important;
          border: 1px solid rgb(224, 149, 0) !important;
          line-height: 1.6rem;
          transition: all 200ms ease;
        }
        .btn-sm:hover {
          transform: scale(1.066);
          box-shadow: 0 0 25px 1px rgba(249, 180, 43, 1);
        }
        .done {
          filter: grayscale(1);
        }
        .pulse {
          border-radius: 6px;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
          }

          70% {
            box-shadow: 0 0 0 7px rgba(255, 82, 82, 0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
          }
        }
        .pulse-urgent {
          border-radius: 6px;
          animation: pulse-urgent 300ms infinite;
        }
        @keyframes pulse-urgent {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
          }

          70% {
            box-shadow: 0 0 0 7px rgba(255, 82, 82, 0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
          }
        }
        .g-error {
          width: 100%;
          max-width: 750px;
          margin: 1rem auto;
          background: rgb(255, 15, 30);
          border-radius: 6px;
          padding: 5px 10px;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .g-error p {
          display: block;
          margin: 0;
          width: 100%;
          font-size: 16px;
          color: #202020;
        }
        .sbs {
          display: flex;
          align-items: center;
        }
        @media (max-width: 992px) {
          .sbs {
            display: block;
          }
        }
        .sbs img {
          gap: 2rem;
          max-width: 400px;
        }
        .sbs h1 {
          font-size: 4rem;
          line-height: 4rem;
          margin-top: 0;
        }
        .cp {
          padding: 6rem 0;
        }
        .in-auction-navigation {
          margin-left: 1.25rem;
          margin-top: 0.5rem;
        }
        .in-auction-navigation button:hover {
          cursor: pointer;
        }
        .la {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: none;
          background-size: contain;
          background-repeat: no-repeat;
          background-color: transparent;
          font-size: xx-large;
        }
        .ra {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: none;
          background-size: contain;
          background-repeat: no-repeat;
          background-color: transparent;
          font-size: xx-large;
        }
        .wrap {
          background: #e0c1ff;
        }
        .hero {
          padding-bottom: 0 !important;
          margin-bottom: -3rem;
        }
        @media (max-width: 992px) {
          .hero {
            margin-bottom: inherit;
          }
        }
        .alt {
          background: #d2a0fc;
          padding: 3rem 0;
          padding-bottom: 0;
        }
        .hero h2 {
          font-size: 2rem;
        }

        .bids {
          display: grid;
          text-align: start;
          list-style-type: none;
          grid-row-gap: 0.5rem;
          row-gap: 0.5rem;
          padding: 0;
        }
        @media (min-width: 992px) {
          .bid-history-inner {
            flex: 0 0 auto;
            width: 100%;
          }
        }
        .bid-history {
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
        }
        .mbs {
          margin-bottom: 0.5rem;
        }
        .btn:disabled {
          pointer-events: none;
          opacity: 0.65;
        }
        @media (max-width: 992px) {
          .wizard {
            width: 100%;
            padding: 0;
          }
        }
        @media (min-width: 992px) {
          .auction-input-inner {
            flex: 0 0 auto;
            width: 100%;
          }
        }
        .auction-input {
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
          margin-bottom: 1rem;
        }
        .auction-timer {
          padding-left: 3rem;
        }
        .auction-title {
          display: flex;
          align-items: center;
        }
        .current-bid-col {
          border-right: 1px solid #202020;
        }
        @media (min-width: 992px) {
          .current-bid-col {
            flex: 0 0 auto;
            width: 41.66666667%;
          }
        }
        @media (max-width: 992px) {
          .auction-timer {
            padding-left: 0;
          }
          .current-bid-col {
            border: none;
          }
        }
        .auction-bid-wrapper {
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
          gap: 1.75rem;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .auction-activity {
          align-self: start !important;
          padding-right: 4rem;
        }
        @media (min-width: 992px) {
          .auction-activity {
            flex: 0 0 auto;
            width: 50%;
          }
        }
        @media (max-width: 992px) {
          .auction-activity {
            padding-right: 0;
          }
        }
        .wizard-img {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .wizard-img-wrapper {
          position: relative;
          width: 100%;
        }
        @media (max-width: 992px) {
          .wizard-img-wrapper {
            margin-bottom: 1rem;
          }
        }
        .wizard-wrapper {
          align-self: flex-end;
          width: 100%;
        }
        .wizard {
          display: flex;
          padding-right: 3.5rem;
        }

        .wizard img {
          border-radius: 6px 6px 0 0;
        }
        @media (min-width: 992px) {
          .wizard {
            flex: 0 0 auto;
            width: 50%;
          }
        }
        @media (max-width: 992px) {
          .wizard {
            width: 100%;
            padding: 0;
          }
        }
        .auction {
          margin: 3rem 0;
          display: flex;
          flex-wrap: wrap;
          --bs-gutter-x: 1.5rem;
        }
        .wizards {
          display: flex;
          justify-content: center;
          max-width: 400px;
          margin: 1.6rem auto;
          text-align: center;
        }
        .wizards .thumb {
          margin: 10px;
          transition: all 0.2s ease;
        }
        .wizards .thumb img {
          border-radius: 6px;
          box-shadow: 0 0 15px 1px rgba(100, 0, 166, 0.15);
        }

        .wizards .thumb.oneOfOne {
          position: relative;
        }
        .oneOfOne .banner {
          font-size: 34px;
          position: absolute;
          top: -13px;
          right: -15px;
          transform: rotate(25deg) scale(0.5);
        }
        .wizards .thumb.active {
          transform: scale(1.25);
        }
        .wizards .thumb.active:hover {
          transform: scale(1.25);
        }
        .wizards .thumb:hover {
          transform: scale(1.1);
        }
        .wizard .thumb img {
          border-radius: 6px;
        }
        .mts {
          display: block;
          margin-top: 5px;
        }
        .mtm {
          margin-top: 1rem;
        }
        .md {
          font-size: 1.4rem;
        }
        .sm {
          font-size: 1rem;
        }
        .purp {
          color: #5a14a2;
        }
        .twit-shadow {
          transition: all 0.2s ease;
        }
        .twit-shadow:hover {
          box-shadow: 0 0 30px 1px #3d9ff8;
        }
        .center {
          text-align: center;
        }
        .pillh .pill {
          padding: 0.33rem 1rem;
          border-radius: 1rem;
          font-weight: 500;
          background: #cea5f6;
          color: #000;
        }
        .pilltitle {
          display: block;
        }
        .abt {
          margin: 1.86rem auto;
          max-width: 750px;
        }
        .abt.wide {
          max-width: 875px;
        }
        .asd {
          display: flex;
          line-height: 34px;
          align-items: center;
          justify-content: center;
          width: 11rem;
          border-radius: 6px;
          background: #3d9ff8 !important;
          font-size: 16px;
          color: #000 !important;
          padding: 6px 1.25rem;
          transition: box-shadow 0.2s ease;
          margin: 0 auto;
          margin-bottom: 1.8rem;
          border: 0 !important;
        }
        .asd span {
          display: inline-block;
          position: relative;
          width: 100%;
        }
        .ints p {
          font-size: 16px;
          font-weight: 500;
        }
        .ints .item {
          display: inline-block;
          max-width: 200px;
          background: #eaeaea;
          border-radius: 6px;
          margin: 10px;
          box-shadow: 0 0 30px 1px rgba(97, 29, 172, 0.15);
          transition: all 0.2s ease;
        }
        .ints img {
          border-radius: 6px;
        }
        .ints .item:hover {
          cursor: pointer;
          transform: scale(1.07);
        }
        .ints .h {
          margin: 1.16rem 0;
        }
        .ints {
          width: 100%;
          margin: 0 auto 4.25rem auto;
          position: relative;
          top: 0.58rem;
        }
        .hiw-ind {
          bottom: 0;
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
        }
        .hiw-ind a {
          display: block;
          font-size: 16px !important;
          font-weight: 500;
        }
        .hiw {
          margin: 2.32rem 0;
        }
        .hiw h3 {
          line-height: 30px;
          margin-bottom: 0.58rem;
        }
        .hiw img {
          margin-bottom: 1.16rem;
          border-radius: 6px;
          width: 100%;
          box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.05);
        }
        section {
          margin-top: 3.195rem;
          max-width: 580px;
        }
        @keyframes floating-inverted {
          0% {
            transform: translate(0, 0px) scale(-1, 1);
          }
          50% {
            transform: translate(0, 15px) scale(-1, 1);
          }
          100% {
            transform: translate(0, -0px) scale(-1, 1);
          }
        }
        @keyframes floating {
          0% {
            transform: translate(0, 0px);
          }
          50% {
            transform: translate(0, 15px);
          }
          100% {
            transform: translate(0, -0px);
          }
        }
        .h1 {
          position: absolute;
          height: 150px;
          right: -10%;
          opacity: 0.55;
          top: 68.5%;
          z-index: -1;
          filter: brightness(145%);
        }
        .h2 {
          position: absolute;
          height: 150px;
          left: -33%;
          opacity: 0.55;
          top: 33.5%;
          z-index: 10;
          transform: scale(-1, 1);
          filter: brightness(155%);
        }
        .t1 {
          position: absolute;
          height: 150px;
          right: -15%;
          opacity: 0.55;
          top: 0.5%;
          z-index: -1;
          filter: brightness(150%);
        }

        @media (max-width: 767px) {
          .h1 {
            position: fixed;
            right: -12%;
            transform: rotate(15deg);
            top: 85%;
          }
          .h2 {
            position: fixed;
            left: -27%;
          }
          .t1 {
            position: fixed;
            top: 1%;
            right: -16%;
          }
        }
        @media (min-device-width: 414px) and (max-device-width: 736px) {
          .h1 {
            position: absolute;
            right: -22%;
            transform: rotate(15deg);
            top: 89%;
          }
          .h2 {
            position: absolute;
            left: -27%;
            top: 20%;
          }
          .t1 {
            position: absolute;
            top: -8.5%;
            right: -18%;
          }
        }
        .hero h1 {
          margin-bottom: 1.16rem;
          margin-top: 0.16rem;
        }
        .hero p {
          margin: 0;
        }
        .hero .btn {
          background: #171717;
          color: #fff !important;
          border: 1px solid #000;
          font-weight: 600;
        }
        .hero .btn-sm {
          color: rgb(125, 92, 26) !important;
        }
        .line {
          width: 100%;
          display: block;
          text-align: center;
        }
        .word {
          display: inline-block;
          position: relative;
          transform: translateY(0%);
        }
        .pill {
          display: inline-flex;
          transition: all 0.2s ease;
          justify-content: center;
          width: auto;
          align-items: center;
        }
        .pill a {
          font-size: 16px !important;
          font-weight: 500;
          border-bottom: 1px dashed #000;
        }
        .pillh {
          display: block;
        }
        p {
          margin-bottom: 25px;
          font-size: 20px;
          line-height: 30px;
          color: #000;
        }
      `}</style>
    </Layout>
  );
};

export default function Wrapper() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Auction />
    </Web3ReactProvider>
  );
}
