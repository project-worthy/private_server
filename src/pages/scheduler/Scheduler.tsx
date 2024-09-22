import { useState } from "react";

import { Box } from "components/layouts";
import { FilterInput } from "components/muiCustom";

import { TimeLine } from "./components";

import type { TimeSchedulerType } from "./types";

const dummyData: TimeSchedulerType[] = [
  {
    name: "디바이스 1",
    macAddress: "00:00:00:00:00",
    activeTimes: [{ start: [0, 0, 0], end: [3, 0, 0] }],
    tags: [
      { label: "asd1", color: "#707070" },
      { label: "asd2", color: "#d1e3d6" },
      { label: "asd3", color: "#102020" },
    ],
  },
  {
    name: "디바이스 2",
    macAddress: "10:00:00:00:01",
    activeTimes: [{ start: [3, 30, 0], end: [6, 0, 0] }],
  },
  {
    name: "디바이스 3",
    macAddress: "20:00:00:00:02",
    activeTimes: [{ start: [2, 0, 0], end: [4, 0, 0] }],
  },
  {
    name: "디바이스 4",
    macAddress: "30:00:00:00:03",
    activeTimes: [{ start: [6, 0, 0], end: [7, 0, 0] }],
  },
];

const checkNameMatch = (data: TimeSchedulerType, value: string) =>
  data.name.includes(value);

const checkTagMatch = (data: TimeSchedulerType, value: string) =>
  data.tags?.some((tag) => tag.label.includes(value));

const checkMacAddressMatch = (data: TimeSchedulerType, value: string) =>
  data.macAddress.includes(value);

const search = (data: TimeSchedulerType[], value: string) => {
  const result = data.filter(
    (d) =>
      checkNameMatch(d, value) ||
      checkTagMatch(d, value) ||
      checkMacAddressMatch(d, value),
  );
  return result;
};

export default function Scheduler() {
  const [data, _] = useState<TimeSchedulerType[]>(dummyData);
  const [filterData, setFilterData] = useState<TimeSchedulerType[]>(data);

  const handleFilter = (value: string) => {
    setFilterData(search(dummyData, value));
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="w-full h-full fixed flex items-center justify-center top-0 pointer-events-none">
          <img className="opacity-20" src="/svgs/logo.svg"></img>
        </div>
        <Box className="h-16 w-full">
          <FilterInput onChange={(e) => handleFilter(e.target.value)} />
        </Box>
        <div className="flex-1">
          <TimeLine dataSource={filterData} />
        </div>
      </div>
    </>
  );
}
