import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";

import dayjs from "dayjs";

import { getTimeRatio } from "utils/date";

export type TimeArr = [number, number, number];

export type TimeSchedulerType = {
  name: string;
  macAddress: string;
  activeTimes: { start: TimeArr; end: TimeArr }[];
};

const getTimes = (data: TimeArr) =>
  dayjs().set("hour", data[0]).set("minute", data[1]).set("second", data[2]);

const getPosition = (data: TimeSchedulerType["activeTimes"][number]) => {
  const start = getTimeRatio(getTimes(data.start));
  const end = getTimeRatio(getTimes(data.end));
  return { start, end };
};

const getPositions = (data: TimeSchedulerType) =>
  data.activeTimes.map((e) => getPosition(e));

type TimeSchedulerProp = {
  data: TimeSchedulerType;
};

export default function TimeScheduler(props: TimeSchedulerProp) {
  const { data } = props;
  console.log(getPositions(data));
  return (
    <>
      <div className="absolute flex items-center justify-between left-0 top-auto w-1/4 bg-background px-2 z-10">
        <dl>
          <dt>{data.name}</dt>
          <dd>{data.macAddress}</dd>
        </dl>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </div>
      <div className="h-[inherit] relative" style={{ width: 300 }}>
        {data.activeTimes.map((data, i) => (
          <>
            <span className="absolute left-0">
              {getTimes(data.start).format("HH:mm")}
            </span>
            <span className="absolute right-0">
              {getTimes(data.start).format("HH:mm")}
            </span>
            <p
              className="absolute h-0.5 rounded-lg bg-primary top-1/2 -translate-y-1/2 w-full"
              key={"line" + i}
            ></p>
          </>
        ))}
      </div>
    </>
  );
}
