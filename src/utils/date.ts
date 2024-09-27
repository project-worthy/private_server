import dayjs from "dayjs";

import type { Dayjs, ManipulateType } from "dayjs";
import type { TimeSchedulerType } from "pages/scheduler";
import type { ActiveTime, TimeTuple } from "types/date";

export const MINUTE = 60;

export const HOUR = 60 * MINUTE;

export const DAY = 24 * HOUR;

export const today = dayjs();

export function getTimeRatio(date: Dayjs) {
  const todayStart = date.startOf("date");
  const diff = date.unix() - todayStart.unix();
  return diff / (24 * 60 * 60);
}

export const getTime = (data: TimeTuple) =>
  dayjs().set("hour", data[0]).set("minute", data[1]).set("second", data[2]);

export const getUnix = (data: TimeTuple) => getTime(data).unix();

export const getTuple = (data: Dayjs): TimeTuple => [
  data.get("hour"),
  data.get("minute"),
  data.get("second"),
];
export const todayTuple = getTuple(today);

export const getActiveTimePosition = (data: ActiveTime) => {
  const start = getTimeRatio(dayjs.unix(data.start));
  const end = getTimeRatio(dayjs.unix(data.end));
  return { start, end };
};

export const convertPosToTime = (pos: number, width: number): TimeTuple => {
  const todayStart = dayjs().startOf("date").unix();
  const a = dayjs.unix(todayStart + (pos / (24 * width)) * DAY);

  return getTuple(a);
};

export const getActiveTimePositions = (data: TimeSchedulerType) =>
  data.activeTimes.map((e) => getActiveTimePosition(e));

export const getActiveTimeWidth = (data: ActiveTime, width: number) => {
  const totalWidth = width * 24;
  const { start, end } = getActiveTimePosition(data);
  const diff = end - start;
  return totalWidth * diff;
};

export const getActiveTimeStart = (
  data: ActiveTime | TimeTuple,
  width: number,
) => {
  const totalWidth = width * 24;
  let start = 0;
  if (Array.isArray(data)) start = getTimeRatio(getTime(data));
  else start = getActiveTimePosition(data).start;
  return totalWidth * start;
};

export const getActiveTimeEnd = (
  data: ActiveTime | TimeTuple,
  width: number,
) => {
  const totalWidth = width * 24;
  let end = 0;
  if (Array.isArray(data)) end = getTimeRatio(getTime(data));
  else end = getActiveTimePosition(data).end;
  return totalWidth * end;
};

export const getRatio = (unit: ManipulateType, width: number) => {
  const a = dayjs();
  const b = dayjs().add(1, unit);
  return ((b.unix() - a.unix()) / DAY) * width;
};

export const getSelectRange = (
  start: number,
  ranges: ActiveTime[],
  outputSize: number,
  totalRange: [number, number],
) => {
  let end = 0;
  if (start < totalRange[0]) return false;
  if (start > totalRange[1]) return false;
  for (const r of ranges) {
    end = start + outputSize;
    if (start >= r.start && start <= r.end) return false;
    if (end >= r.start && end <= r.end) end = r.start;
  }
  if (end) if (end > totalRange[1]) end = totalRange[1];
  return [start, end];
};
