import { useState, useRef, useEffect, useContext } from "react";

import { ButtonBase } from "@mui/material";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { TimePopup } from "components/muiCustom";
import { Popover } from "components/muiCustom";
import useMouseDetectClicknDrag, {
  MouseEventState,
} from "hooks/useMouseEvents";
import {
  getActiveTimeStart,
  getActiveTimeEnd,
  getActiveTimeWidth,
  convertPosToTime,
  getRatio,
  getSelectRange,
} from "utils/date";

import { ScheduleDataContext } from "./ScheduleDataProvider";

import type { TimeSchedulerType } from "../types";
import type { ActiveTime, ActiveTimeRange } from "utils/date";

dayjs.extend(isBetween);
type TimeSchedulerDetailProp = {
  data: TimeSchedulerType;
  timeWidth?: number;
};

const totalRangeStart = dayjs().startOf("date").unix();
const totalRangeEnd = dayjs().endOf("date").unix();

export default function TimeSchedulerDetail(props: TimeSchedulerDetailProp) {
  const { data, timeWidth: _timeWidth } = props;
  const schedule = useContext(ScheduleDataContext);
  const timeWidth = _timeWidth ?? 64;

  const [hoverTimeLineData, setHoverTimeLineData] = useState<
    ActiveTimeRange | false
  >(false);

  const hovTimeDisplayRef = useRef<HTMLDivElement>(null);

  const tenMinWidth = getRatio("minute", timeWidth) * 60 * 60 * 10;

  let editingKey = "";

  const handleTimeLinehovering = (e: MouseEvent, o: MouseEventState) => {
    const { left } = (
      e.currentTarget as HTMLDivElement
    ).getBoundingClientRect();

    const curMouseUnix = convertPosToTime(e.clientX - left, timeWidth);

    const curMouseDay = dayjs.unix(curMouseUnix);
    const currentMinute = curMouseDay.get("minute");
    const minute = Math.floor(currentMinute / 10) * 10;
    const absoluteTime = dayjs
      .unix(curMouseUnix)
      .set("minute", minute)
      .set("second", 0);
    const totalRage: [number, number] = [totalRangeStart, totalRangeEnd];
    const showButton = getSelectRange(
      absoluteTime.unix(),
      data.activeTimes,
      tenMinWidth,
      totalRage,
    );
    setHoverTimeLineData(showButton);
  };

  const handleTimeLineEnd = () => setHoverTimeLineData(false);

  const hanldeMouseDrag = (e: MouseEvent, o: MouseEventState) => {
    const { mouseDownPos, isDrag } = o;
    const htmlDiv = e.currentTarget as HTMLDivElement;
    const activeTims = data.activeTimes;
    const { left } = htmlDiv.getBoundingClientRect();

    if (Boolean(hoverTimeLineData) && isDrag) setHoverTimeLineData(false);

    const mousePosTime = convertPosToTime(e.clientX - left, timeWidth);

    const editingIndex = activeTims.findIndex((at) => at.key === editingKey);

    if (editingIndex < 0) {
      const mouseDownTime = convertPosToTime(mouseDownPos.x - left, timeWidth);
      editingKey = schedule.add(data.key, {
        start: mouseDownTime,
        end: mouseDownTime,
      });
    } else schedule.change(data.key, editingKey, { end: mousePosTime });
  };
  const timeLineRef = useRef<HTMLDivElement>(null);

  useMouseDetectClicknDrag(timeLineRef, [], {
    onHovering: handleTimeLinehovering,
    onHoverEnd: handleTimeLineEnd,
    onDrag: hanldeMouseDrag,
  });

  useEffect(() => {}, []);

  return (
    <div className="h-12 relative mb-2" ref={timeLineRef}>
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
            <ButtonBase
              sx={{ width: "100%", height: "100%" }}
              onClick={() => {
                schedule.add(data.key, hoverTimeLineData);
              }}
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
              sx={{
                pointerEvents: "none",
              }}
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
                <span className="p-2 pointer-events-none">
                  {dayjs.unix(d.end).format("HH:mm")}
                </span>
              }
              placement="top"
              sx={{
                pointerEvents: "none",
              }}
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
