import dayjs from "dayjs";

import type { Dayjs } from "dayjs";
import type { TimeSchedulerType } from "pages/scheduler";
import type { ActiveTime, TimeTuple } from "types/date";

export function getTimeRatio(date: Dayjs) {
  const todayStart = date.startOf("date");
  const diff = date.unix() - todayStart.unix();
  return diff / (24 * 60 * 60);
}

export const getTime = (data: TimeTuple) =>
  dayjs().set("hour", data[0]).set("minute", data[1]).set("second", data[2]);

export const getActiveTimePosition = (data: ActiveTime) => {
  const start = getTimeRatio(getTime(data.start));
  const end = getTimeRatio(getTime(data.end));
  return { start, end };
};

export const getActiveTimePositions = (data: TimeSchedulerType) =>
  data.activeTimes.map((e) => getActiveTimePosition(e));

export const getActiveTimeWidth = (data: ActiveTime, width: number) => {
  const totalWidth = width * 24;
  const { start, end } = getActiveTimePosition(data);
  const diff = end - start;
  return totalWidth * diff;
};

export const getActiveTimeStart = (data: ActiveTime, width: number) => {
  const totalWidth = width * 24;
  const { start } = getActiveTimePosition(data);
  return totalWidth * start;
};

export const getActiveTimeEnd = (data: ActiveTime, width: number) => {
  const totalWidth = width * 24;
  const { end } = getActiveTimePosition(data);
  return totalWidth * end;
};
