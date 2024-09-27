import { useState, useRef, useEffect } from "react";

import { ButtonBase } from "@mui/material";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { TimePopup } from "components/muiCustom";
import { Popover } from "components/muiCustom";
import useMouseDetectClicknDrag, {
  MouseState,
} from "hooks/useMouseDetectClicknDrag";
import {
  getActiveTimeStart,
  getActiveTimeEnd,
  getActiveTimeWidth,
  getTime,
  convertPosToTime,
  getRatio,
  getTuple,
  getSelectRange,
} from "utils/date";

import type { TimeSchedulerType } from "../types";
// import type { MouseEvent } from "react";
import type { ActiveTime, TimeTuple } from "types/date";

dayjs.extend(isBetween);
type TimeSchedulerDetailProp = {
  data: TimeSchedulerType;
  timeWidth?: number;
};

function getNonOverlappingRanges(
  existingRanges: ActiveTime[],
  totalRange: number[],
): ActiveTime[] {
  existingRanges.sort((a, b) => a.start - b.start);

  const nonOverlappingRanges = [];
  let currentStart = totalRange[0];

  for (const { start, end } of existingRanges) {
    if (currentStart < start) {
      nonOverlappingRanges.push({ start: currentStart, end: start });
    }
    currentStart = Math.max(currentStart, end);
  }
  if (currentStart < totalRange[1]) {
    nonOverlappingRanges.push({ start: currentStart, end: totalRange[1] });
  }

  return nonOverlappingRanges;
}

const totalRangeStart = dayjs().startOf("date").unix();
const totalRangeEnd = dayjs().endOf("date").unix();

export default function TimeSchedulerDetail(props: TimeSchedulerDetailProp) {
  const { data, timeWidth: _timeWidth } = props;
  const timeWidth = _timeWidth ?? 64;

  const [hoverTimeLineData, setHoverTimeLineData] = useState<
    ActiveTime | false
  >(false);

  const [schedulerEditOpen, setSchedulerEditOpen] = useState(false);

  const hovTimeDisplayRef = useRef<HTMLDivElement>(null);

  const tenMinWidth = getRatio("minute", timeWidth) * 60 * 60 * 10;
  const dayStart = dayjs().startOf("date").unix();
  const dayEnd = dayjs().endOf("date").unix();
  const nonOverlap = getNonOverlappingRanges(data.activeTimes, [
    dayStart,
    dayEnd,
  ]);

  const handleTimeLinehovering = (e: MouseEvent) => {
    const { left } = (
      e.currentTarget as HTMLDivElement
    ).getBoundingClientRect();
    const mousePosTime = convertPosToTime(e.clientX - left, timeWidth);

    mousePosTime[1] = Math.floor(mousePosTime[1] / 10) * 10; // floor in nearest whole number
    mousePosTime[2] = 0;
    const startNum = getTime(mousePosTime);
    const totalRage: [number, number] = [totalRangeStart, totalRangeEnd];
    const showButton = getSelectRange(
      startNum.unix(),
      data.activeTimes,
      tenMinWidth,
      totalRage,
    );
    setHoverTimeLineData(showButton);
  };

  const handleTimeLineEnd = () => setHoverTimeLineData(false);

  const [timeLineRef] = useMouseDetectClicknDrag<HTMLDivElement>({
    onHovering: handleTimeLinehovering,
    onHoverEnd: handleTimeLineEnd,
  });

  useEffect(() => {}, []);

  return (
    <div className="h-12 relative mb-2" ref={timeLineRef}>
      <div>
        {nonOverlap.map((e, i) => (
          <div
            key={`able-drag-${data.key}-${i}`}
            className="able-drag absolute h-12"
            data-startDate={e.start}
            data-endDate={e.end}
            style={{
              left: getActiveTimeStart(e, timeWidth),
              width: getActiveTimeWidth(e, timeWidth),
            }}
          ></div>
        ))}
      </div>
      {hoverTimeLineData && (
        <>
          <div
            className="absolute flex items-center justify-center border border-highlight h-12 rounded-sm"
            style={{
              left: getActiveTimeStart(
                hoverTimeLineData as ActiveTime,
                timeWidth,
              ),
              top: 0,
              width: getActiveTimeWidth(
                hoverTimeLineData as ActiveTime,
                timeWidth,
              ),
              fontSize: "10px",
            }}
            ref={hovTimeDisplayRef}
          >
            <ButtonBase sx={{ width: "100%", height: "100%" }}>
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

          <Popover
            content={
              <div className="bg-background shadow-lg rounded-lg">
                <TimePopup
                  hourType="12"
                  hour={dayjs.unix(d.start).get("hour")}
                  minute={dayjs.unix(d.start).get("hour")}
                />
              </div>
            }
            placement="bottom"
            trigger="click"
          >
            <Popover
              content={
                <span className="p-2">
                  {dayjs.unix(d.start).format("HH:mm")}
                </span>
              }
              placement="top"
            >
              <div
                className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
                style={{ left: getActiveTimeStart(d, timeWidth) }}
              >
                <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
              </div>
            </Popover>
          </Popover>

          <Popover
            content={
              <div className="bg-background shadow-lg rounded-lg">
                <TimePopup
                  hourType="12"
                  hour={dayjs.unix(d.end).get("hour")}
                  minute={dayjs.unix(d.end).get("hour")}
                />
              </div>
            }
            placement="bottom"
            trigger="click"
          >
            <Popover
              content={
                <span className="p-2">{dayjs.unix(d.end).format("HH:mm")}</span>
              }
              placement="top"
            >
              <div
                className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-lg transition-colors"
                style={{ left: getActiveTimeEnd(d, timeWidth) }}
              >
                <div className="absolute group-hover:border-highlight group-hover:border-2 group-hover:bg-background size-3 rounded-lg translate-center"></div>
              </div>
            </Popover>
          </Popover>
        </div>
      ))}
    </div>
  );
}
