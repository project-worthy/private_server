import type { TagType } from "components/muiCustom";
import type { ActiveTime } from "types/date";

export type TimeSchedulerType = {
  name: string;
  key: string;
  macAddress: string;
  activeTimes: ActiveTime[];
  tags?: TagType[];
};
