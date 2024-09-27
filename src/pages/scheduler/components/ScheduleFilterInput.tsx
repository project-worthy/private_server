import { useContext } from "react";

import { FilterInput } from "components/muiCustom";

import { ScheduleDataContext } from "./ScheduleDataProvider";

export default function ScheduleFilterInput() {
  const schedule = useContext(ScheduleDataContext);

  return <FilterInput onChange={(e) => schedule.filter(e.target.value)} />;
}
