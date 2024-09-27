import { useState } from "react";

import dayjs from "dayjs";

import { Box } from "components/layouts";
import { FilterInput } from "components/muiCustom";
import { ActiveTime, TimeTuple } from "types/date";
import { getUnix } from "utils/date";

import { TimeLine } from "./components";

import type { TimeSchedulerType } from "./types";

const dummyData: TimeSchedulerType[] = [
  {
    name: "디바이스 1",
    key: "1",
    macAddress: "00:00:00:00:00",
    activeTimes: [{ start: getUnix([0, 0, 0]), end: getUnix([3, 0, 0]) }],
    tags: [
      { label: "asd1", color: "#707070" },
      { label: "asd2", color: "#d1e3d6" },
      { label: "asd3", color: "#102020" },
    ],
  },
  {
    name: "디바이스 2",
    key: "2",
    macAddress: "10:00:00:00:01",
    activeTimes: [
      { start: getUnix([3, 30, 0]), end: getUnix([6, 0, 0]) },
      { start: getUnix([7, 34, 0]), end: getUnix([11, 0, 0]) },
    ],
  },
  {
    name: "디바이스 3",
    key: "3",
    macAddress: "20:00:00:00:02",
    activeTimes: [
      { start: getUnix([5, 30, 0]), end: getUnix([6, 0, 0]) },
      { start: getUnix([7, 30, 0]), end: getUnix([11, 0, 0]) },
    ],
  },
  {
    name: "디바이스 4",
    key: "4",
    macAddress: "30:00:00:00:03",
    activeTimes: [{ start: getUnix([6, 0, 0]), end: getUnix([7, 0, 0]) }],
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

// function nonOverlapRanges = (arr:ActiveTime[]) => {
//   arr.forEach(e => {
//
//   })
// }

// function checkOverlap(existingRanges: ActiveTime[], newRange: ActiveTime) {
//   // Sort existing ranges by their start value
//   existingRanges.sort((a, b) => getTime(a.start). - b.start);
//
//   for (const [start, end] of existingRanges) {
//     // Check for overlap
//     if (newRange[0] <= end && newRange[1] >= start) {
//       return true; // Overlap found
//     }
//   }
//   return false; // No overlap
// }

export default function Scheduler() {
  const [data, _] = useState<TimeSchedulerType[]>(dummyData);
  const [filterData, setFilterData] = useState<TimeSchedulerType[]>(data);

  const handleFilter = (value: string) => {
    setFilterData(search(dummyData, value));
  };
  // console.log(
  //   findNonOverlappingRanges(data[1].activeTimes, [
  //     dayjs().startOf("date").unix(),
  //     dayjs().endOf("date").unix(),
  //   ]),
  // );

  const addSchedule = (key: string, activeTime: ActiveTime) => {};

  const changeSchedule = (
    key: string,
    index: number,
    activeTime: Partial<ActiveTime>,
  ) => {
    const keyIndex = data.findIndex((e) => e.key === key);

    if (!activeTime) return;
    if (keyIndex < 0) return;

    const curActiveTimes = data[keyIndex].activeTimes;
    curActiveTimes[index] = {
      ...curActiveTimes[index],
      ...activeTime,
    };
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
