import { useState } from "react";

import { locale } from "dayjs";

import { Box } from "components/layouts";

import TimeScheduler, { TimeSchedulerType } from "./TimeScheduler";

locale("ko");

const timeWidth = 64;

const timeNumber: number[] = Array.from({ length: 24 }, (_, i) => i + 1);

type TimeLineProps = {
  dataSource: TimeSchedulerType[];
};

export default function TimeLine(props: TimeLineProps) {
  const { dataSource } = props;
  // const [dataSource, _] = useState(dataSource);
  return (
    <>
      <Box className="h-full " items="start">
        <div className="relative w-full h-full">
          <div className="overflow-x-scroll h-full">
            <div className="w-full ml-[25%]">
              <div className="inline-flex">
                {timeNumber.map((v) => (
                  <div
                    className=" h-5 relative "
                    key={"time" + v}
                    style={{ width: timeWidth }}
                  >
                    <span className="absolute right-0 translate-x-1/2 bg-background">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-12">
                {dataSource.map((d, i) => (
                  <TimeScheduler data={d} key={`time-scheduler-${i}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
