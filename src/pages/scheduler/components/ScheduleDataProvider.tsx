import { createContext, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import useFetch from "hooks/useFetch";
import { getUnix, isActiveTimeIntersect } from "utils/date";

import type { TimeSchedulerType } from "../types";
import type { ReactNode } from "react";
import type { ActiveTime, ActiveTimeRange } from "utils/date";

const dummyData: TimeSchedulerType[] = [
  {
    name: "디바이스 1",
    key: "1",
    macAddress: "00:00:00:00:00",
    activeTimes: [
      { key: "a", start: getUnix([0, 0, 0]), end: getUnix([3, 0, 0]) },
    ],
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
      { key: "a", start: getUnix([3, 30, 0]), end: getUnix([6, 0, 0]) },
      { key: "b", start: getUnix([7, 34, 0]), end: getUnix([11, 0, 0]) },
    ],
  },
  {
    name: "디바이스 3",
    key: "3",
    macAddress: "20:00:00:00:02",
    activeTimes: [
      { key: "a", start: getUnix([5, 30, 0]), end: getUnix([6, 0, 0]) },
      { key: "b", start: getUnix([7, 30, 0]), end: getUnix([11, 0, 0]) },
    ],
  },
  {
    name: "디바이스 4",
    key: "4",
    macAddress: "30:00:00:00:03",
    activeTimes: [
      { key: "a", start: getUnix([6, 0, 0]), end: getUnix([7, 0, 0]) },
    ],
  },
];

type ScheduleDataProviderProps = {
  children: ReactNode;
};

type ScheduleDataContextType = {
  data: TimeSchedulerType[];
  add: (key: string, activeTime: ActiveTimeRange) => string | null;
  change: (key: string, index: string, activeTime: Partial<ActiveTime>) => void;
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

  const addSchedule = (key: string, activeTime: ActiveTimeRange) => {
    const keyIndex = data.findIndex((e) => e.key === key);
    if (isActiveTimeIntersect(activeTime, data[keyIndex].activeTimes))
      return null;
    const newDatakey = uuidv4();
    const newData: ActiveTime = {
      ...activeTime,
      key: newDatakey,
    };
    data[keyIndex].activeTimes.push(newData);
    return newDatakey;
  };

  const fileterSchedule = (value: string) => {
    setFilterData(search(data, value));
  };

  const changeSchedule = (
    key: string,
    scheduleKey: string,
    activeTime: Partial<ActiveTimeRange>,
  ) => {
    const keyIndex = data.findIndex((e) => e.key === key);
    const scheduleIndex = data[keyIndex].activeTimes.findIndex(
      (e) => e.key === scheduleKey,
    );

    if (!activeTime) return;
    if (keyIndex < 0) return;

    const curActiveTimes = data[keyIndex].activeTimes;
    curActiveTimes[scheduleIndex] = {
      ...curActiveTimes[scheduleIndex],
      ...activeTime,
    };

    if (isActiveTimeIntersect(curActiveTimes[scheduleIndex], curActiveTimes))
      return null;
    setFilterData([...data]);
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
