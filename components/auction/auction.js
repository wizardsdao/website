import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import AuctionTimer from "./auctionTimer";
import useAuctionHouseSubscriber from "../../hooks/useAuctionHouseSubscriber";
import BigNumber from "bignumber.js";
import AuctionInput from "./auctionInput";
import { TailSpin } from "../loader";
import UpForAuctionNav from "./upForAuctionNav.js";
import BidHistory from "./bidHistory.js";

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
  bg: 0,
  bids: [],
  createdEvents: [],
  settledEvents: [],
  startTime: "0",
  endTime: "0",
  oneOfOne: false,
};

const colors = (bg) => {
  const values = {
    0: "#c5a3e2", // purple,
    1: "#a4addd", // blue
    2: "#e0a4ad", // red
  };

  return values[bg];
};

const setBg = (bg) => {
  const aWrapper = document.querySelector(".auction-wrapper");
  const header = document.querySelector("header");
  const color = colors(bg);
  header.style.background = color;
  aWrapper.style.background = color;
};

const getDummyWizards = () => {
  const dummies = [];
  for (let i = 0; i < AUCTION_COUNT; i++) {
    const d = { ...dummyWizard, id: i + 1 };
    dummies.push(d);
  }
  return dummies;
};

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

        const bg = await wizardToken.seeds(event.wizardId);
        console.log(bg.background, event.wizardId);

        wizard.dataURI = dataURI;
        wizard.bg = bg.background;
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

const Auction = ({ web3React }) => {
  const router = useRouter();
  const query = useQuery(router);

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
      setBg(wizCopy.bg);

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

  return (
    <>
      {(() => {
        if (globalError) {
          return (
            <div className="g-error">
              <p>{globalError}</p>
            </div>
          );
        }
      })()}
      <div className="auction-wrapper">
        <div className="container-xl">
          <UpForAuctionNav query={query} wizards={wizards} />
          <div className="row">
            <div className="col-lg-6" style={{ display: "flex" }}>
              <div className="wizard-img-wrapper">
                <div className="img-inner">
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
              return (
                <div className="col-lg-6 activity">
                  <div className="row">
                    <h2>Wizard #{wizard.wizardId}</h2>
                  </div>
                  <div className="row information">
                    <div className="col-md-6 m-sbs">
                      <h4>Current bid</h4>
                      <h2>
                        <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
                        {ethers.utils.formatEther(
                          wizard.lastBid || ethers.BigNumber.from("0")
                        )}
                      </h2>
                    </div>
                    <div className="col-md-6 m-sbs">
                      <h4>{wizard.ended ? "Auction ended" : "Ends in"}</h4>
                      <h2>
                        <AuctionTimer wizard={wizard} />
                      </h2>
                    </div>
                  </div>
                  <div className="row">
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
                  <BidHistory wizard={wizard} web3React={web3React} />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <style jsx>{`
        h2 {
          font-size: 2.16rem;
        }
        .activity {
          padding-right: 5rem;
          padding-bottom: 0;
          min-height: 510px;
          align-self: flex-end !important;
        }
        .activity h3,
        .activity h4 {
          opacity: 0.65;
        }
        .wizard-img-wrapper {
          width: 100%;
          align-self: flex-end;
        }
        .img-inner {
          position: relative;
          padding-top: 100%;
          width: 100%;
          height: 0;
        }
        .wizard-img {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: auto;
          vertical-align: middle;
        }

        .m-sbs h2 {
          margin-top: -10px;
        }

        @media (max-width: 568px) {
          .activity {
            padding-right: calc(var(--bs-gutter-x) * 0.5);
            background: #e0c1ff;
          }

          .m-sbs {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
          }

          .m-sbs h2 {
            font-size: 23px;
            line-height: 36px;
            margin-bottom: 0;
          }

          .information {
            margin: 0 0 0.9rem 0;
          }
        }
      `}</style>
    </>
  );
};

export default Auction;
