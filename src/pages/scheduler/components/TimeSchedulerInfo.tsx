import { useState } from "react";

import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { Tags, Button, IconButton, Popover } from "components/muiCustom";

import type { TimeSchedulerType } from "../types";
import type { MouseEvent } from "react";

type TimeSchedulerInfoProp = {
  data: TimeSchedulerType;
};

export default function TimeSchedulerInfo(props: TimeSchedulerInfoProp) {
  const { data } = props;

  const [openAnchorEl, setOpenAnchorEl] = useState<HTMLButtonElement>();

  const isOpen = Boolean(openAnchorEl);
  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) =>
    setOpenAnchorEl(e.currentTarget);
  const handlePopoverClose = () => setOpenAnchorEl(undefined);

  return (
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
        >
          <div className="flex flex-col w-[30lvw] min-w-[300px]">
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
  );
}
//{/* <div className="absolute left-0 top-auto w-1/4 border-b borber-b-black pb-1 z-10"> */}
