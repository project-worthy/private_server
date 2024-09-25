import { MouseEvent, useState } from "react";

import { Popover, TimePopup } from "components/muiCustom";
import useMouseDetectClicknDrag from "hooks/useMouseDetectClicknDrag";
import {
  getActiveTimeStart,
  getActiveTimeEnd,
  getActiveTimeWidth,
  getTime,
  convertPosToTime,
} from "utils/date";

import SchedeulerAddModal from "./SchedulerAddModal";

import type { TimeSchedulerType } from "../types";
import type { TimeTuple } from "types/date";

type TimeSchedulerDetailProp = {
  data: TimeSchedulerType;
  timeWidth?: number;
};

// const timeNumber: number[] = Array.from({ length: 25 }, (_, i) => i);
// const today = dayjs();
export default function TimeSchedulerDetail(props: TimeSchedulerDetailProp) {
  const { data, timeWidth: _timeWidth } = props;
  const timeWidth = _timeWidth ?? 64;

  const [openDateAnchorEl, setOpenDateAnchorEl] = useState<HTMLElement>();

  const [hoverAnchorEl, setHoverAnchorEl] = useState<HTMLElement>();
  const [handleCurrentData, setHandleCurrentData] = useState<TimeTuple>([
    0, 0, 0,
  ]);

  // const [startDate,setStartDate] = useState(0);
  // const []

  const handleClickThumb = (e: MouseEvent<HTMLElement>) =>
    setOpenDateAnchorEl(e.currentTarget);

  const thumbClicknDrag = useMouseDetectClicknDrag<HTMLElement>({
    onClick: handleClickThumb,
  });
  const timeLineClicknDrag = useMouseDetectClicknDrag<HTMLDivElement>({
    onClick: (e) => {
      const { left } = e.currentTarget.getBoundingClientRect();
      console.log(convertPosToTime(e.clientX - left, timeWidth));
    },
    onDrag: (e) => console.log(e),
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [startTime, setStartTime] = useState(0);

  const isDateOpen = Boolean(openDateAnchorEl);

  const handleHoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    value: TimeTuple,
  ) => {
    setHoverAnchorEl(event.currentTarget);
    setHandleCurrentData(value);
  };

  const handleHoverClose = () => setHoverAnchorEl(undefined);

  const isHoverOpen = Boolean(hoverAnchorEl);

  const handleDateClose = () => setOpenDateAnchorEl(undefined);

  // const handleClickAddTime = (time: number) => {
  //   setModalOpen(true);
  //   setStartTime(time);
  // };

  return (
    <div className="h-12 relative mb-2" {...timeLineClicknDrag}>
      {data.activeTimes.map((d, i) => (
        <div key={`activeTime-${data.name}-${i}`}>
          <div
            className="absolute h-0.5 rounded-lg bg-highlight top-1/2 -translate-y-1/2 w-full"
            key={"line" + i}
            style={{
              width: getActiveTimeWidth(d, timeWidth),
              left: getActiveTimeStart(d, timeWidth),
            }}
          ></div>

          <div
            className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
            style={{ left: getActiveTimeStart(d, timeWidth) }}
            onMouseEnter={(e) => handleHoverOpen(e, d.start)}
            onMouseLeave={handleHoverClose}
            {...thumbClicknDrag}
          >
            <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
          </div>
          <div
            className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
            style={{ left: getActiveTimeEnd(d, timeWidth) }}
            onMouseEnter={(e) => handleHoverOpen(e, d.end)}
            onMouseLeave={handleHoverClose}
            {...thumbClicknDrag}
          >
            <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
          </div>
        </div>
      ))}

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
  );
}
