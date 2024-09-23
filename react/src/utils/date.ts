import type { Dayjs } from "dayjs";
export function getTimeRatio(date: Dayjs) {
  const todayStart = date.startOf("date");
  const diff = date.unix() - todayStart.unix();
  return diff / (24 * 60 * 60);
}
