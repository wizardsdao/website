import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState, useEffect, useRef } from "react";

dayjs.extend(duration);

const AuctionTimer = (props) => {
  const { wizard } = props;
  const [auctionTimer, setAuctionTimer] = useState(0);
  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, "s");
  useEffect(() => {
    const timeLeft = (wizard && Number(wizard.endTime)) - dayjs().unix();
    setAuctionTimer(wizard && timeLeft);

    if (wizard && timeLeft <= 0) {
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        const timeLeft = (wizard && Number(wizard.endTime)) - dayjs().unix();

        // timeout can fire after getting auction extended. Add extended time buffer
        // and carry over if we get updated endTime value
        if (timeLeft + 5 < auctionTimerRef.current) {
          setAuctionTimer(auctionTimerRef.current);
          return;
        }

        setAuctionTimer(timeLeft - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [wizard, auctionTimer]);

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());

  if (!wizard) return null;

  return (
    <>
      <span>
        {`${Math.floor(timerDuration.hours())}`}
        <span>h </span>
      </span>
      <span>
        {`${flooredMinutes}`}
        <span>m </span>
      </span>
      <span>
        {`${flooredSeconds}`}
        <span>s</span>
      </span>
    </>
  );
};

export default AuctionTimer;
