import { useState } from "react";

import { locale } from "dayjs";

import { Box } from "components/layouts";

import TimeScheduler, { TimeSchedulerType } from "./TimeScheduler";

locale("ko");

const dummyData: TimeSchedulerType[] = [
  {
    name: "디바이스 1",
    macAddress: "00:00:00:00:00",
    activeTimes: [{ start: [0, 0, 0], end: [3, 0, 0] }],
  },
  {
    name: "디바이스 2",
    macAddress: "00:00:00:00:00",
    activeTimes: [{ start: [0, 0, 0], end: [3, 0, 0] }],
  },
];

const timeNumber: number[] = Array.from({ length: 24 }, (_, i) => i + 1);

export default function TimeLine() {
  const [data, _] = useState(dummyData);
  return (
    <>
      <Box className="h-full " items="start">
        <div className="relative w-full h-full">
          <div className="overflow-x-scroll h-full">
            <div className="w-full ml-[25%]">
              <div className="inline-flex">
                {timeNumber.map((v) => (
                  <div className="w-16 h-5 relative " key={"time" + v}>
                    <span className="absolute right-0 translate-x-1/2 bg-background">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-12">
                {data.map((d, i) => (
                  <TimeScheduler data={d} key={`time-scheduler-${i}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* <Paper className="w-1/4" elevation={0}> */}
        {/*   {dummyData.map((data) => { */}
        {/*     return <Box>a</Box>; */}
        {/*   })} */}
        {/*   <Box> */}
        {/*     <IconButton aria-label="add"> */}
        {/*       <AddVariableIcon /> */}
        {/*     </IconButton> */}
        {/*   </Box> */}
        {/* </Paper> */}
        {/* <Paper className="flex-1" elevation={0}> */}
        {/*   {dummyData.map((data) => { */}
        {/*     return <Box>a</Box>; */}
        {/*   })} */}
        {/* </Paper> */}
      </Box>
    </>
  );
}
