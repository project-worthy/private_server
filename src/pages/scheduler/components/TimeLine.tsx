import AddVariableIcon from "@mui/icons-material/Add";

import dayjs, { locale } from "dayjs";

import { Box } from "components/layouts";
import { getTimeRatio } from "utils/date";

import TimeScheduler from "./TimeScheduler";

locale("ko");

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
                <TimeScheduler />
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
