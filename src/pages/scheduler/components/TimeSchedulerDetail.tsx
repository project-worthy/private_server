import { useState } from "react";

import { Popover, TimePicker } from "components/muiCustom";
import { getActiveTimeStart, getActiveTimeWidth, getTime } from "utils/date";

import type { TimeSchedulerType } from "../types";
import type { TimeTuple } from "types/date";

type TimeSchedulerDetailProp = {
  data: TimeSchedulerType;
  timeWidth?: number;
};

const timeNumber: number[] = Array.from({ length: 25 }, (_, i) => i);
export default function TimeSchedulerDetail(props: TimeSchedulerDetailProp) {
  const { data, timeWidth: _timeWidth } = props;
  const timeWidth = _timeWidth ?? 64;

  const [openDateAnchorEl, setOpenDateAnchorEl] = useState<HTMLElement>();

  const [hoverAnchorEl, setHoverAnchorEl] = useState<HTMLElement>();
  const [handleCurrentData, setHandleCurrentData] = useState<TimeTuple>([
    0, 0, 0,
  ]);

  const isDateOpen = Boolean(openDateAnchorEl);

  const handleHoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    value: TimeTuple,
  ) => {
    setHoverAnchorEl(event.currentTarget);
    setHandleCurrentData(value);
  };

  const handleHoverClose = () => {
    setHoverAnchorEl(undefined);
  };

  const isHoverOpen = () => Boolean(hoverAnchorEl);

  const handleDateOpen = (event: React.MouseEvent<HTMLElement>) =>
    setOpenDateAnchorEl(event.currentTarget);

  const handleDateClose = () => setOpenDateAnchorEl(undefined);
  return (
    <div className="h-[inherit] relative mb-2">
      <div className="flex h-[inherit] absolute">
        {/* 이거 이제 버튼 누르면 새 스케줄 생성하는 형식으로 변경 */}
        {timeNumber.map((e, i) => (
          <div
            key={i}
            style={{ height: "inherit", width: timeWidth }}
            className="hover:bg-highlight"
          ></div>
        ))}
      </div>
      {data.activeTimes.map((d, i) => (
        <div
          className=" h-[inherit] relative"
          style={{
            width: getActiveTimeWidth(d, timeWidth),
            left: getActiveTimeStart(d, timeWidth),
          }}
          key={`activeTime-${data.name}-${i}`}
        >
          <div
            className="absolute h-0.5 rounded-lg bg-highlight top-1/2 -translate-y-1/2 w-full"
            key={"line" + i}
          >
            <div
              className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
              onMouseEnter={(e) => handleHoverOpen(e, d.start)}
              onMouseLeave={handleHoverClose}
              onClick={handleDateOpen}
            >
              <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
            </div>

            <div
              className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
              onMouseEnter={(e) => handleHoverOpen(e, d.end)}
              onMouseLeave={handleHoverClose}
              onClick={handleDateOpen}
            >
              <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
            </div>
            <Popover
              open={isDateOpen}
              onClose={handleDateClose}
              anchorEl={openDateAnchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "20px",
                },
              }}
            >
              <TimePicker />
            </Popover>
            <Popover
              sx={{
                pointerEvents: "none",
                "& .MuiPaper-root": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              }}
              open={isHoverOpen()}
              onClose={handleHoverClose}
              anchorEl={hoverAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <span className="p-2">
                {getTime(handleCurrentData).format("HH:mm")}
              </span>
            </Popover>
          </div>
        </div>
      ))}
    </div>
  );
}
