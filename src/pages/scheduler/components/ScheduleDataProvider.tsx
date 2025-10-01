import { createContext, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import useFetch from "hooks/useFetch";
import {
  getUnix,
  isActiveTimeIntersect,
  isActiveTimeIntersectAll,
} from "utils/date";

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
  change: (
    key: string,
    index: string,
    activeTime: Partial<ActiveTime>,
  ) => boolean;
  filter: (value: string) => void;
  delete: (key: string, scheduleKey: string) => void;
  deviceAdd: (device: TimeSchedulerType) => void;
  deviceDelete: (key: string) => void;
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
    const newDatakey = uuidv4();
    const newData: ActiveTime = {
      ...activeTime,
      key: newDatakey,
    };
    if (isActiveTimeIntersectAll(newData, data[keyIndex].activeTimes))
      return null;
    data[keyIndex].activeTimes.push(newData);
    setFilterData([...data]);
    return newDatakey;
  };

  const fileterSchedule = (value: string) => {
    setFilterData(search(data, value));
  };

  const deleteSchedule = (key: string, scheduleKey: string) => {
    const keyIndex = data.findIndex((e) => e.key === key);
    const scheduleIndex = data[keyIndex].activeTimes.findIndex(
      (e) => e.key === scheduleKey,
    );
    if (keyIndex < 0) return false;
    data[keyIndex].activeTimes.splice(scheduleIndex, 1);
    setFilterData([...data]);
  };

  const deleteDeivce = (key: string) => {
    const keyIndex = data.findIndex((e) => e.key === key);
    if (keyIndex < 0) return false;
    data.splice(keyIndex, 1);
    setFilterData([...data]);
  };

  const addDevice = (device: TimeSchedulerType) => {};

  const changeSchedule = (
    key: string,
    scheduleKey: string,
    activeTime: Partial<ActiveTimeRange>,
  ) => {
    const keyIndex = data.findIndex((e) => e.key === key);
    const scheduleIndex = data[keyIndex].activeTimes.findIndex(
      (e) => e.key === scheduleKey,
    );

    if (!activeTime) return false;
    if (keyIndex < 0) return false;

    const curActiveTimes = data[keyIndex].activeTimes;
    const newData = {
      ...curActiveTimes[scheduleIndex],
      ...activeTime,
    };

    if (
      data[keyIndex].activeTimes.some((e, i) => {
        if (i !== scheduleIndex) return isActiveTimeIntersect(newData, e);
        return false;
      })
    )
      return false;
    curActiveTimes[scheduleIndex] = newData;
    setFilterData([...data]);
    return true;
  };

  const providerValue = {
    data: filterData,
    add: addSchedule,
    change: changeSchedule,
    filter: fileterSchedule,
    delete: deleteSchedule,
    deviceAdd: addDevice,
    deviceDelete: deleteDeivce,
  };

  return (
    <ScheduleDataContext.Provider value={providerValue}>
      {children}
    </ScheduleDataContext.Provider>
  );
}
