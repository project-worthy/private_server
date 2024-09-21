import { useState } from "react";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Popover } from "@mui/material";

import dayjs from "dayjs";

import { Tags, Button } from "components/muiCustom";
import { getTimeRatio } from "utils/date";

import type { TagType } from "components/muiCustom";
import type { MouseEvent } from "react";

export type TimeArr = [number, number, number];

export type TimeSchedulerType = {
  name: string;
  macAddress: string;
  activeTimes: { start: TimeArr; end: TimeArr }[];
  tags?: TagType[];
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

const getTimeWidth = (
  data: TimeSchedulerType["activeTimes"][number],
  width: number,
) => {
  const totalWidth = width * 24;
  const { start, end } = getPosition(data);
  const diff = end - start;
  return totalWidth * diff;
};

const getTimeStart = (
  data: TimeSchedulerType["activeTimes"][number],
  width: number,
) => {
  const totalWidth = width * 24;
  const { start } = getPosition(data);
  return totalWidth * start;
};

type TimeSchedulerProp = {
  data: TimeSchedulerType;
  timeWidth?: number;
};

export default function TimeScheduler(props: TimeSchedulerProp) {
  const { data, timeWidth } = props;
  const [openElement, setOpenElement] = useState<HTMLButtonElement>();
  const [hoverAnchorEl, setHoverAnchorEl] = useState<HTMLElement>();
  const [hoverData, setHoverData] = useState<TimeArr>([0, 0, 0]);

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) =>
    setOpenElement(e.currentTarget);
  const handlePopoverClose = () => setOpenElement(undefined);

  const isOpen = () => Boolean(openElement);

  const handleHoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    value: TimeArr,
  ) => {
    setHoverAnchorEl(event.currentTarget);
    setHoverData(value);
  };

  const handleHoverClose = () => {
    setHoverAnchorEl(undefined);
  };

  const isHoverOpen = () => Boolean(hoverAnchorEl);

  return (
    <>
      <div className="absolute left-0 top-auto w-1/4 border-b borber-b-black pb-1  z-10">
        <div className="flex items-center justify-between bg-background px-2">
          <dl>
            <dt>{data.name}</dt>
            <dd>{data.macAddress}</dd>
          </dl>
          <IconButton onClick={handleButtonClick}>
            <MoreHorizIcon />
          </IconButton>
          <Popover
            open={isOpen()}
            onClose={handlePopoverClose}
            anchorEl={openElement}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <div className="flex flex-col w-[30lvw] min-w-[300px]">
              <Button startIcon={<EditIcon />}>수정</Button>
              <Button startIcon={<DeleteIcon />}>삭제</Button>
              <div>
                <Tags data={data.tags} />
              </div>
              <Button></Button>
            </div>
          </Popover>
        </div>
      </div>

      {data.activeTimes.map((d, i) => (
        <div
          className="h-[inherit] relative mb-2"
          style={{
            width: getTimeWidth(d, 64),
            left: getTimeStart(d, 64),
          }}
          key={`activeTime-${data.name}-${i}`}
        >
          <div
            className="absolute h-0.5 rounded-lg bg-highlight top-1/2 -translate-y-1/2 w-full"
            key={"line" + i}
          >
            <div
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-lg hover:bg-highlight transition-colors"
              onMouseEnter={(e) => handleHoverOpen(e, d.start)}
              onMouseLeave={handleHoverClose}
            ></div>
            <div
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-lg hover:bg-highlight transition-colors"
              onMouseEnter={(e) => handleHoverOpen(e, d.end)}
              onMouseLeave={handleHoverClose}
            ></div>
            <Popover
              sx={{ pointerEvents: "none" }}
              open={isHoverOpen()}
              onClose={handleHoverClose}
              anchorEl={hoverAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <span className="p-2">{getTimes(hoverData).format("HH:mm")}</span>
            </Popover>
          </div>
        </div>
      ))}
    </>
  );
}
