import { useContext } from "react";

import { locale } from "dayjs";

import { Box } from "components/layouts";
import useTimeInterval from "hooks/useTimeInterval";

import { TimeScheduleDetail, TimeScheduleInfo } from ".";
import { ScheduleDataContext } from "./ScheduleDataProvider";

locale("ko");

const timeWidth = 64;

const timeNumber: number[] = Array.from({ length: 25 }, (_, i) => i);

export default function TimeLine() {
  const { data } = useContext(ScheduleDataContext);
  const markerPosX = useTimeInterval(timeWidth);

  return (
    <>
      <Box className="h-full " items="start">
        <div className="relative w-full h-full">
          <div className="overflow-x-scroll h-full">
            <div className="w-full" style={{ marginLeft: "calc(25% + 1rem)" }}>
              <div className="inline-flex">
                {timeNumber.map((v, i) => (
                  <div
                    className="py-2 sticky"
                    key={`time-display-hour-${data}-${i}`}
                    style={{ width: timeWidth, left: "calc(25% + 1rem)" }}
                  >
                    <span className="right-0 translate-x-1/2 bg-background text-primary border-l border-l-primary pr-2">
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
                {data?.map((d, i) => (
                  <TimeScheduleInfo data={d} key={`time-scheduler-info-${i}`} />
                ))}
              </div>
              <div className="mb-2 h-fit relative">
                <div
                  className="marker-timeline"
                  style={{ left: markerPosX }}
                ></div>
                {data?.map((d, i) => (
                  <TimeScheduleDetail
                    data={d}
                    timeWidth={timeWidth}
                    key={`time-scheduler-detail-${i}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
