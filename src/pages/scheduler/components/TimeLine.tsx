import { useEffect, useState } from "react";

import dayjs, { locale } from "dayjs";

import { Box } from "components/layouts";
import { getActiveTimeStart, getTuple, todayTuple } from "utils/date";

import TimeSchedulerDetail from "./TimeSchedulerDetail";
import TimeSchedulerInfo from "./TimeSchedulerInfo";

import type { TimeSchedulerType } from "../types";

locale("ko");

const timeWidth = 64;

const timeNumber: number[] = Array.from({ length: 25 }, (_, i) => i);

type TimeLineProps = {
  dataSource: TimeSchedulerType[];
};

export default function TimeLine(props: TimeLineProps) {
  const { dataSource } = props;
  const [markerPositionX, setMarkerPositionX] = useState(
    getActiveTimeStart(todayTuple, timeWidth),
  );
  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();

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

  return (
    <>
      <Box className="h-full " items="start">
        <div className="relative w-full h-full">
          <div className="overflow-x-scroll h-full">
            <div className="w-full" style={{ marginLeft: "calc(25% + 1rem)" }}>
              <div className="inline-flex">
                {timeNumber.map((v) => (
                  <div
                    className="py-2 sticky"
                    key={"time" + v}
                    style={{ width: timeWidth, left: "calc(25% + 1rem)" }}
                  >
                    <span className="right-0 translate-x-1/2 bg-background text-primary border-l border-l-primary">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="absolute left-0 w-1/4 z-10"
                style={{
                  boxShadow: "5px 0 5px -5px #333",
                }}
              >
                {dataSource.map((d, i) => (
                  <>
                    <TimeSchedulerInfo
                      data={d}
                      key={`time-scheduler-info-${i}`}
                    />
                  </>
                ))}
              </div>
              <div className="mb-2 h-fit relative">
                <div
                  className="marker-timeline"
                  style={{ left: markerPositionX }}
                ></div>
                {dataSource.map((d, i) => (
                  <>
                    <TimeSchedulerDetail
                      data={d}
                      timeWidth={timeWidth}
                      key={`time-scheduler-detail-${i}`}
                    />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
