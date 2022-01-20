import { useReducer, useEffect, useState } from "react";
import { getContractsForChainOrThrow } from "../sdk/dist/contract";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "@usedapp/core/node_modules/ethers";

// avg blocks per day are about 6_500, give some space for extended auctions;
const BLOCKS_PER_DAY = 8_000;

const wcCfg = {
  rpc: {
    1: process.env.NEXT_PUBLIC_MAINNET_RPC_URI, // mainnet
    4: process.env.NEXT_PUBLIC_RINKEBY_RPC_URI, // rinkeby
    31337: process.env.NEXT_PUBLIC_LOCAL_RPC_URI, // local hardhat node
  },
};

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const { auctionHouseContract, wizardTokenContract } =
  getContractsForChainOrThrow(
    CHAIN_ID,
    new JsonRpcProvider({ url: wcCfg.rpc[CHAIN_ID] })
  );

// event log query filters.
const bidFilter = auctionHouseContract.filters.AuctionBid(
  null,
  null,
  null,
  null,
  null
);

const extendedFilter = auctionHouseContract.filters.AuctionExtended(
  null,
  null,
  null
);

const createdFilter = auctionHouseContract.filters.AuctionCreated(
  null,
  null,
  null,
  null,
  null,
  null
);

const settledFilter = auctionHouseContract.filters.AuctionSettled(
  null,
  null,
  null,
  null
);

const bidEventsReducer = (state, action) => {
  const newEvents = [];

  for (let j = 0; j < action.events.length; j++) {
    let found = false;
    const newBid = action.events[j];

    for (let i = 0; i < state.length; i++) {
      const existingBid = state[i];
      if (
        existingBid.wizardId == newBid.wizardId &&
        existingBid.value == newBid.value
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      newEvents.push(newBid);
    }
  }

  return [...state, ...newEvents];
};

const createdEventsReducer = (state, action) => {
  let x = state;

  // for each incoming event we should remove a previous one in order
  action.events.forEach((_) => {
    x.shift();
  });

  return [...x, ...action.events];
};

const settledEventsReducer = (state, action) => {
  const newEvents = [];
  for (let i = 0; i < action.events.length; i++) {
    let found = false;
    const ne = action.events[i];

    for (let j = 0; j < state.length; j++) {
      const ee = state[j];
      if (ee.wizardId == ne.wizardId && ee.value == ne.value) {
        found = true;
        break;
      }
    }

    if (!found) {
      newEvents.push(ne);
    }
  }

  return [...state, ...newEvents];
};

const extEventsReducer = (state, action) => {
  const newEvents = [];
  for (let i = 0; i < action.events.length; i++) {
    let found = false;
    const ne = action.events[i];

    for (let j = 0; j < state.length; j++) {
      const ee = state[j];
      if (ee.wizardId == ne.wizardId && ee.endTime == ne.endTime) {
        found = true;
        break;
      }
    }

    if (!found) {
      newEvents.push(ne);
    }
  }

  return [...state, ...newEvents];
};

export default function useAuctionHouseSubscriber() {
  const [timerLength, setTimerLength] = useState(10000); // defalt to 10s
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reachedCap, setReachedCap] = useState(false);
  const [bidEvents, dispatchBidEvents] = useReducer(bidEventsReducer, []);
  const [createdEvents, dispatchCreatedEvents] = useReducer(
    createdEventsReducer,
    []
  );
  const [extendedEvents, dispatchExtendedEvents] = useReducer(
    extEventsReducer,
    []
  );
  const [settledEvents, dispatchSettledEvents] = useReducer(
    settledEventsReducer,
    []
  );

  const processBidFilter = async (
    wizardId,
    aId,
    sender,
    value,
    extended,
    event
  ) => {
    const timestamp = (await event.getBlock()).timestamp;
    const transactionHash = event.transactionHash;

    dispatchBidEvents({
      events: [
        {
          wizardId: wizardId.toNumber(),
          aId: aId.toNumber(),
          sender,
          value: value.toString(),
          extended,
          transactionHash,
          timestamp,
        },
      ],
    });
  };

  const auctionCreated = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };

  const processAuctionCreated = (
    wizardId,
    aId,
    startTime,
    endTime,
    oneOfOne,
    isWhitelistDay
  ) => {
    const wiz = {
      wizardId: wizardId.toNumber(),
      aId: aId.toNumber(),
      startTime,
      endTime,
      oneOfOne,
      isWhitelistDay,
    };

    auctionCreated[aId] = wiz;
    for (let i = 1; i <= 5; i++) {
      // prevent page renders by making sure we only dispatch when all 5 auctions are loaded
      // this is really only important when a new auction or the first auction is started
      // so is more of an optimization but it really improves the experience
      // this also dedupes events
      if (!auctionCreated[i]) {
        return;
      }
    }

    let col = [];
    for (let i = 1; i <= 5; i++) {
      col.push(auctionCreated[i]);
    }

    dispatchCreatedEvents({ events: col });

    for (let i = 1; i <= 5; i++) {
      // undo key reset so we only update on batched created events
      auctionCreated[i] = false;
    }
  };

  const processAuctionExtended = (wizardId, aId, endTime) => {
    dispatchExtendedEvents({
      events: [
        {
          wizardId: wizardId.toNumber(),
          aId: aId.toNumber(),
          endTime: endTime.toNumber(),
        },
      ],
    });
  };

  const processAuctionSettled = (wizardId, aId, winner, amount) => {
    dispatchSettledEvents({
      events: [
        { wizardId: wizardId.toNumber(), aId: aId.toNumber(), winner, amount },
      ],
    });
  };

  const getBids = async () => {
    try {
      const bids = await auctionHouseContract.queryFilter(
        bidFilter,
        0 - BLOCKS_PER_DAY
      );

      for (let i = 0; i < bids.length; i++) {
        const e = bids[i];
        processBidFilter(
          e.args.wizardId,
          e.args.aId,
          e.args.sender,
          e.args.value,
          e.args.extended,
          e
        );
      }
    } catch (ex) {
      console.errors("get bids", ex);
    }
  };

  const getCreatedEvents = async () => {
    try {
      const cae = await auctionHouseContract.queryFilter(
        createdFilter,
        0 - BLOCKS_PER_DAY
      );

      const latest = cae.slice(-5);
      for (let i = 0; i < latest.length; i++) {
        const e = latest[i];

        processAuctionCreated(
          e.args.wizardId,
          e.args.aId,
          e.args.startTime,
          e.args.endTime,
          e.args.oneOfOne,
          e.args.isWhitelistDay
        );
      }
    } catch (ex) {
      console.errors("get created", ex);
    }
  };

  const getExtendedEvents = async () => {
    try {
      const cae = await auctionHouseContract.queryFilter(
        extendedFilter,
        0 - BLOCKS_PER_DAY
      );

      const latest = cae.slice(-5);
      for (let i = 0; i < latest.length; i++) {
        const e = latest[i];
        processAuctionExtended(e.args.wizardId, e.args.aId, e.args.endTime);
      }
    } catch (ex) {
      console.errors("get extended", ex);
    }
  };

  const getSettledEvents = async () => {
    try {
      const cae = await auctionHouseContract.queryFilter(
        settledFilter,
        0 - BLOCKS_PER_DAY
      );

      const latest = cae.slice(-5);

      const lastSettled = "";
      for (let i = 0; i < latest.length; i++) {
        const e = latest[i];

        // see auction house last settled
        lastSettled += `Wizard #${e.args.wizardId.toString()} - ${ethers.utils
          .formatUnits(e.args.amount, "ether")
          .toString()}\n`;

        processAuctionSettled(
          e.args.wizardId,
          e.args.aId,
          e.args.winner,
          e.args.amount
        );
      }
      console.log(lastSettled);
    } catch (ex) {
      console.errors("get settled", ex);
    }
  };

  const poll = () => {
    setLoading(true);
    const fn = async () => {
      try {
        const paused = await auctionHouseContract.paused();
        setPaused(paused);

        const reachedCap = await auctionHouseContract.reachedCap();
        setReachedCap(reachedCap);
      } catch (ex) {
        console.error("getting data", ex);
      }
    };

    Promise.allSettled([
      getBids(),
      getCreatedEvents(),
      getExtendedEvents(),
      getSettledEvents(),
      fn(),
    ]).then(() => {
      setLoading(false);
    });
  };

  let onLoaded = false;
  // run setup fn that binds to events once
  useEffect(() => {
    if (!onLoaded) {
      poll();
      onLoaded = true;
    }

    const interval = setInterval(() => {
      poll();
    }, timerLength);
    return () => clearInterval(interval);
  }, [timerLength]);

  return [
    bidEvents,
    createdEvents,
    extendedEvents,
    settledEvents,
    auctionHouseContract,
    wizardTokenContract,
    setTimerLength,
    dispatchBidEvents,
    dispatchCreatedEvents,
    dispatchExtendedEvents,
    dispatchSettledEvents,
    poll,
    paused,
    reachedCap,
    loading,
    setLoading,
  ];
}
