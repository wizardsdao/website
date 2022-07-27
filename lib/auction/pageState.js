import { ethers } from "ethers";
const AUCTION_COUNT = 1;

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

const getDummyWizards = () => {
  const dummies = [];
  for (let i = 0; i < AUCTION_COUNT; i++) {
    const d = { ...dummyWizard, id: i + 1 };
    dummies.push(d);
  }
  return dummies;
};

export const bindEventsToWizards = (bidEvents, extendedEvents, settledEvents, createdEvents, wizards) => {
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

export const eventsToWizards = async (createdEvents, bidEvents, extendedEvents, settledEvents, wizardToken) => {
  let skipImageDownload = false;
  const temp = localStorage.getItem("wizardsv2") || "[]";

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
    return bindEventsToWizards(bidEvents, extendedEvents, settledEvents, createdEvents, wizards);
  }

  let i = 1;
  for (let event of createdEvents.slice(-AUCTION_COUNT)) {
    // cache dataURI and bg for when we skip image load
    let oldDataURI;
    for (let j = 0; j < oldWizards.length; j++) {
      if (oldWizards[j].id === i) {
        oldDataURI = oldWizards[j].dataURI;
        break;
      }
    }

    let bg;
    for (let j = 0; j < oldWizards.length; j++) {
      if (oldWizards[j].id === i) {
        bg = oldWizards[j].bg;
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
      bg: bg || 0,
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
        const dataURI = JSON.parse(window.atob((await wizardToken.tokenURI(event.wizardId)).toString().substring(29)));

        wizard.dataURI = dataURI;

        try {
          const bg = await wizardToken.seeds(event.wizardId);
          wizard.bg = bg.background;
        } catch (ex) {
          console.error(ex, "getting wizard bg");
        }
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

  localStorage.setItem("wizardsv2", JSON.stringify(wizards));
  return bindEventsToWizards(bidEvents, extendedEvents, settledEvents, createdEvents, wizards);
};

export const pageState = {
  imageLoading: false,
  wizard: { bids: [] },
  wizards: [],
  bg: "",
  wizard: {},
  previousPageId: 1,
  nextPageId: 2,
  globalError: null,
  bidError: null,
};

export const onUpdate = async (events, wizardToken, query, ps) => {
  const { createdEvents, bidEvents, extendedEvents, settledEvents } = events;

  let wizards = await eventsToWizards(createdEvents, bidEvents, extendedEvents, settledEvents, wizardToken);
  ps.imageLoading = false;

  if (!wizards.length) {
    wizards = getDummyWizards();
  }

  // get wizard data and set current wizard to render
  const widx = (!("id" in query) ? 1 : query.id) - 1;
  if (!widx in wizards) {
    return;
  }
  ps.wizards = wizards;

  const wizCopy = { ...wizards[widx] };
  ps.bg = wizCopy.bg;
  ps.wizard = wizCopy;

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

  ps.previousPageId = previousId;
  ps.nextPageId = nextId;

  return ps;
};
