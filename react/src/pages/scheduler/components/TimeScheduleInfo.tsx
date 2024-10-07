import { useContext, useState } from "react";

import {
  MoreHoriz as MoreHorizIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Popover } from "@mui/material";

import { Tags, Button, IconButton } from "components/muiCustom";

import { ScheduleDataContext } from "./ScheduleDataProvider";
import SchedeulerAddModal from "./SchedulerAddModal";

import type { TimeSchedulerType } from "../types";
import type { MouseEvent } from "react";

type TimeSchedulerInfoProp = {
  data: TimeSchedulerType;
};

export default function TimeSchedulerInfo(props: TimeSchedulerInfoProp) {
  const schedule = useContext(ScheduleDataContext);
  const { data } = props;

  const [scheduleAddOpen, setScheduleAddOpen] = useState(false);
  const [openAnchorEl, setOpenAnchorEl] = useState<HTMLButtonElement>();

  const isOpen = Boolean(openAnchorEl);

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) =>
    setOpenAnchorEl(e.currentTarget);

  const handlePopoverClose = () => setOpenAnchorEl(undefined);

  const handleOpenScheduleModal = () => {
    setScheduleAddOpen(true);
    handlePopoverClose();
  };

  const handleOkScheduleModal = (start: number, end: number) => {
    schedule.add(data.key, { start, end });
    setScheduleAddOpen(false);
  };

  const handleCloseScheduleModal = () => setScheduleAddOpen(false);

  const handleCreateScheduleModal = () => {};

  return (
    <>
      <div className="left-0 top-auto w-full border-b borber-b-black pb-1 mb-1 z-10">
        <div className="flex items-center justify-between bg-background px-2">
          <dl className="text-primary">
            <dt>{data.name}</dt>
            <dd>{data.macAddress}</dd>
          </dl>
          <IconButton onClick={handleButtonClick}>
            <MoreHorizIcon />
          </IconButton>
          <Popover
            open={isOpen}
            onClose={handlePopoverClose}
            anchorEl={openAnchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div className="flex flex-col w-[lvw] min-w-[300px] max-w-[500px]">
              <Button
                variant="text"
                startIcon={<EditIcon />}
                onClick={handleOpenScheduleModal}
              >
                스케줄 추가
              </Button>
              <Button variant="text" startIcon={<EditIcon />}>
                수정
              </Button>
              <Button variant="text" startIcon={<DeleteIcon />}>
                삭제
              </Button>
              <div>
                <Tags data={data.tags} />
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <SchedeulerAddModal
        open={scheduleAddOpen}
        onClose={handleCloseScheduleModal}
        onOk={handleOkScheduleModal}
      />
    </>
  );
}
