import { Box } from "components/layouts";

import {
  TimeLine,
  ScheduleDataProvider,
  ScheduleFilterInput,
} from "./components";

export default function Scheduler() {
  return (
    <>
      <ScheduleDataProvider>
        <div className="flex flex-col h-full">
          <div className="w-full h-full fixed flex items-center justify-center top-0 pointer-events-none">
            <img className="opacity-20" src="/svgs/logo.svg"></img>
          </div>
          <Box className="h-16 w-full">
            <ScheduleFilterInput />
          </Box>
          <div className="flex-1">
            <TimeLine />
          </div>
        </div>
      </ScheduleDataProvider>
    </>
  );
}
