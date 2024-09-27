import { createContext, useEffect, useState } from "react";

import useFetch from "hooks/useFetch";
import { getUnix } from "utils/date";

import type { TimeSchedulerType } from "../types";
import type { ReactNode } from "react";
import type { ActiveTime } from "types/date";

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

type ScheduleDataProviderProps = {
  children: ReactNode;
};

type ScheduleDataContextType = {
  data: TimeSchedulerType[];
  add: (key: string, activeTime: ActiveTime) => void;
  change: (key: string, index: number, activeTime: Partial<ActiveTime>) => void;
  filter: (value: string) => void;
};

const isNameMatch = (data: TimeSchedulerType, value: string) =>
  data.name.includes(value);

const isTagMatch = (data: TimeSchedulerType, value: string) =>
  data.tags?.some((tag) => tag.label.includes(value));

const isMacMatch = (data: TimeSchedulerType, value: string) =>
  data.macAddress.includes(value);

const search = (data: TimeSchedulerType[], value: string) => {
  const result = data.filter(
    (d) =>
      isNameMatch(d, value) || isTagMatch(d, value) || isMacMatch(d, value),
  );
  return result;
};

export const ScheduleDataContext = createContext<ScheduleDataContextType>(
  {} as ScheduleDataContextType,
);

export default function ScheduleDataProvider(props: ScheduleDataProviderProps) {
  const [data] = useFetch("", dummyData);
  const [filterData, setFilterData] = useState<TimeSchedulerType[]>(data);
  const { children } = props;

  const addSchedule = (key: string, activeTime: ActiveTime) => {
    const keyIndex = data.findIndex((e) => e.key === key);
    data[keyIndex].activeTimes.push(activeTime);
  };

  const fileterSchedule = (value: string) => {
    setFilterData(search(data, value));
  };

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

  const providerValue = {
    data: filterData,
    add: addSchedule,
    change: changeSchedule,
    filter: fileterSchedule,
  };

  return (
    <ScheduleDataContext.Provider value={providerValue}>
      {children}
    </ScheduleDataContext.Provider>
  );
}
