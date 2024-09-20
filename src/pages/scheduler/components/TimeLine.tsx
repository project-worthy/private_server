import AddVariableIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Paper } from "@mui/material";

import dayjs, { locale } from "dayjs";

import { Box } from "components/layouts";
import { getTimeRatio } from "utils/date";

locale("ko");

const dummyData: string[][] = [["2024-09-25 00:0:0", "2024-09-25 03:0:0"]];

const timeNumber: number[] = Array.from({ length: 24 }, (_, i) => i + 1);
export default function TimeLine() {
  console.log(getTimeRatio(dayjs("2024-09-25 24:0:0")));

  console.log(dayjs("2024-09-25 24:0:0").format("YYYY-MM-DD HH:mm:ss"));
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
                <div className="absolute flex items-center justify-between left-0 top-auto w-1/4 bg-background px-2 z-10">
                  <dl>
                    <dt>디바이스 이름</dt>
                    <dd>AE:32:43:FA</dd>
                  </dl>
                  <IconButton>
                    <MoreHorizIcon />
                  </IconButton>
                </div>
                <div className="h-[inherit] relative" style={{ width: 300 }}>
                  {dummyData.map((data, i) => (
                    <>
                      <span className="left-0">00:00</span>
                      <p
                        className="absolute h-0.5 rounded-lg bg-primary top-1/2 -translate-y-1/2 w-full"
                        key={"line" + i}
                      ></p>
                    </>
                  ))}
                </div>
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
