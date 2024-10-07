import dayjs from "dayjs";

import type { Dayjs, ManipulateType } from "dayjs";
import type { TimeSchedulerType } from "pages/scheduler";

export type TimeTuple = [number, number, number];
export type ActiveTime = { key: string; pivot?: number } & ActiveTimeRange;
export type ActiveTimeRange = { start: number; end: number };

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

export const convertPosToTime = (pos: number, width: number): number => {
  const todayStart = dayjs().startOf("date").unix();
  return todayStart + (pos / (24 * width)) * DAY;
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

const isBetween = (src: number, a: number, b: number) =>
  src >= Math.min(a, b) && src <= Math.max(a, b);

export const getSelectRange = (
  start: number,
  ranges: ActiveTime[],
  outputSize: number,
  totalRange: [number, number],
): ActiveTimeRange | false => {
  let _start = start;
  let end = start + outputSize;
  const endInRange = ranges.find((e) => isBetween(end, e.start, e.end));
  const startInRange = ranges.find((e) => isBetween(_start, e.start, e.end));

  if (_start < totalRange[0]) return false;
  if (_start > totalRange[1]) return false;

  if (endInRange !== undefined && startInRange !== undefined) return false;
  if (startInRange) _start = startInRange.end;
  if (endInRange) end = endInRange.start;
  if (end > totalRange[1]) end = totalRange[1];

  return { start: _start, end };
};

export function isActiveTimeIntersect(
  range: ActiveTimeRange,
  ranges: ActiveTimeRange[],
): boolean {
  const { start, end } = range;

  return ranges.some((r) => start <= r.start && end >= r.end);
}
