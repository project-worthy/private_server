import { useState, useEffect } from "react";

import dayjs from "dayjs";

import { getActiveTimeStart, getTuple, todayTuple } from "utils/date";

/**
 * @param timeWidth domt that length of one day.
 * */
export default function useTimeInterval(timeWidth: number) {
  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();
  const [markerPositionX, setMarkerPositionX] = useState(
    getActiveTimeStart(todayTuple, timeWidth),
  );

  useEffect(() => {
    const checkTime = () => {
      const timeTuple = getTuple(dayjs());

      setMarkerPositionX(getActiveTimeStart(timeTuple, timeWidth));
    };
    setIntervalId(setInterval(checkTime, 60 * 1000));
    return () => {
      if (intervalId) clearInterval(intervalId);
      setIntervalId(undefined);
    };
  }, []);
  return markerPositionX;
}
