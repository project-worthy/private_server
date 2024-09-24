import { useState } from "react";

import { Popover, TimePopup } from "components/muiCustom";
import {
  getActiveTimeStart,
  getActiveTimeWidth,
  getRatio,
  getTime,
} from "utils/date";

import SchedeulerAddModal from "./SchedulerAddModal";

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
  const [isDrag, setIsDrag] = useState(-1);

  const [hoverAnchorEl, setHoverAnchorEl] = useState<HTMLElement>();
  const [handleCurrentData, setHandleCurrentData] = useState<TimeTuple>([
    0, 0, 0,
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const [startTime, setStartTime] = useState(0);

  const isDateOpen = Boolean(openDateAnchorEl);
  const minuteRatio = getRatio("minute", timeWidth);

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

  const isHoverOpen = Boolean(hoverAnchorEl);

  const handleMouseDown = () => setIsDrag(0);
  const handleMouseMove = (
    e: React.MouseEvent<HTMLElement>,
    basis: TimeTuple,
  ) => {
    if (isDrag > 0) {
      const a = getActiveTimeStart(basis, timeWidth);
      console.log(e.clientX - a);
    }
    if (isDrag == 0) setIsDrag(1);
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (isDrag) console.log("drag");
    else setOpenDateAnchorEl(e.currentTarget);

    setIsDrag(-1);
  };

  const handleDateClose = () => setOpenDateAnchorEl(undefined);

  const handleClickAddTime = (time: number) => {
    setModalOpen(true);
    setStartTime(time);
  };
  return (
    <div className="h-[inherit] relative mb-2">
      <div className="flex h-[inherit] absolute">
        {/* TODO: 이거 이제 버튼 누르면 새 스케줄 생성하는 형식으로 변경 */}
        {timeNumber.map((e, i) => (
          <div
            key={i}
            style={{ height: "inherit", width: timeWidth }}
            onClick={() => handleClickAddTime(i)}
            // className="hover:bg-highlight"
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
              onMouseMove={(e) => handleMouseMove(e, d.start)}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
            </div>

            <div
              className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
              onMouseEnter={(e) => handleHoverOpen(e, d.end)}
              onMouseLeave={handleHoverClose}
              onMouseMove={(e) => handleMouseMove(e, d.end)}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
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
              <TimePopup
                hour={handleCurrentData[0]}
                minute={handleCurrentData[1]}
                hourType="12"
              />
            </Popover>
            <Popover
              sx={{
                pointerEvents: "none",
                "& .MuiPaper-root": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              }}
              open={isHoverOpen}
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
            <SchedeulerAddModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              startNum={startTime}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
