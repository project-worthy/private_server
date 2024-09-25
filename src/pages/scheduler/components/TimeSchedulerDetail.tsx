import { useState, useRef } from "react";

// import { Add as AddIcon } from "@mui/icons-material";
import { ButtonBase } from "@mui/material";

import { hover } from "@testing-library/user-event/dist/hover";

import { Popover, TimePopup } from "components/muiCustom";
import useMouseDetectClicknDrag from "hooks/useMouseDetectClicknDrag";
import {
  getActiveTimeStart,
  getActiveTimeEnd,
  getActiveTimeWidth,
  getTime,
  convertPosToTime,
  getRatio,
} from "utils/date";

import SchedeulerAddModal from "./SchedulerAddModal";

import type { TimeSchedulerType } from "../types";
import type { MouseEvent } from "react";
import type { TimeTuple } from "types/date";

type TimeSchedulerDetailProp = {
  data: TimeSchedulerType;
  timeWidth?: number;
};

export default function TimeSchedulerDetail(props: TimeSchedulerDetailProp) {
  const { data, timeWidth: _timeWidth } = props;
  const timeWidth = _timeWidth ?? 64;

  const [openDateAnchorEl, setOpenDateAnchorEl] = useState<HTMLElement>();
  const [hoverAnchorEl, setHoverAnchorEl] = useState<HTMLElement>();
  const [handleCurrentData, setHandleCurrentData] = useState<TimeTuple>([
    0, 0, 0,
  ]);

  // 마우스 timeline에 올리면 버튼 클릭시 모달
  const [hoverTimeTuple, setHoverTimeTuple] = useState<TimeTuple>();
  const [hoverTimeModal, setHoverTimeModal] = useState(false);

  const hovTimeDisplayRef = useRef<HTMLDivElement>(null);

  const handleClickThumb = (e: MouseEvent<HTMLElement>) =>
    setOpenDateAnchorEl(e.currentTarget);

  const thumbClicknDrag = useMouseDetectClicknDrag<HTMLElement>({
    onClick: handleClickThumb,
  });
  const timeLineClicknDrag = useMouseDetectClicknDrag<HTMLDivElement>({
    onClick: (e) => {
      setModalOpen(true);
      setTimeout(() => setHoverTimeModal(false), 300);
    },
    onHovering: (e) => {
      const { left, height } = e.currentTarget.getBoundingClientRect();
      const mousePosTime = convertPosToTime(e.clientX - left, timeWidth);

      mousePosTime[1] = Math.floor(mousePosTime[1] / 10) * 10; // floor in nearest whole number
      mousePosTime[2] = 0;
      setHoverTimeTuple(mousePosTime);
      if (!hoverTimeModal) setHoverTimeModal(true);
    },
    onDrag: (e) => console.log(e),
    onHoverEnd: () => {
      setHoverTimeTuple(undefined);
    },
  });

  const [modalOpen, setModalOpen] = useState(false);

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

  const tenMinWidth = getRatio("minute", timeWidth) * 24 * 10;

  return (
    <div className="h-12 relative mb-2" {...timeLineClicknDrag}>
      {hoverTimeModal && hoverTimeTuple && (
        <>
          <div
            className="absolute flex items-center justify-center border border-highlight h-12 rounded-sm"
            style={{
              left: getActiveTimeStart(hoverTimeTuple, timeWidth),
              top: 0,
              width: tenMinWidth,
              fontSize: "10px",
            }}
            ref={hovTimeDisplayRef}
          >
            <ButtonBase
              sx={{ width: "100%", height: "100%" }}
              // onClick={() => handleClickAddTime(hoverTimeTuple[0])}
            >
              <div className="relative" style={{ width: 10, height: 10 }}>
                <div
                  className="absolute bg-primary left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                  style={{ width: 8, height: 1 }}
                ></div>
                <div
                  className="absolute bg-primary left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                  style={{ width: 1, height: 8 }}
                ></div>
              </div>
            </ButtonBase>
          </div>
        </>
      )}
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
            {...thumbClicknDrag}
            onMouseEnter={(e) => handleHoverOpen(e, d.start)}
            onMouseLeave={handleHoverClose}
          >
            <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
          </div>
          <div
            className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
            style={{ left: getActiveTimeEnd(d, timeWidth) }}
            {...thumbClicknDrag}
            onMouseEnter={(e) => handleHoverOpen(e, d.end)}
            onMouseLeave={handleHoverClose}
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
        startNum={hoverTimeTuple}
      />
    </div>
  );
}
