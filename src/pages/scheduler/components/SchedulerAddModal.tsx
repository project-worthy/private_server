import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Button, TimePicker } from "components/muiCustom";
import { getUnix } from "utils/date";

import type { DialogProps } from "@mui/material";
import type { TimeTuple } from "utils/date";

type SchedeulerAddModalProp = {
  startNum?: TimeTuple;
  endNum?: TimeTuple;
  onOk?: (startTime: number, endTime: number) => void;
} & DialogProps;

export default function SchedeulerAddModal(props: SchedeulerAddModalProp) {
  const { startNum, onClose, onOk, ...dialogProps } = props;
  const timeTuple = startNum ?? [0, 0, 0];

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  return (
    <Dialog {...dialogProps} onClose={onClose} maxWidth={false}>
      <DialogTitle>새 스케줄러 추가</DialogTitle>
      <DialogContent>
        <div className="flex gap-x-3 items-center">
          <TimePicker
            hourType="12"
            hour={timeTuple[0]}
            minute={timeTuple[1]}
            onChange={(hour, minute) => {
              setStartTime(getUnix([hour, minute, 0]));
            }}
          />
          <span className="text-[32px]">~</span>

          <TimePicker
            hourType="12"
            hour={timeTuple[0]}
            minute={timeTuple[1] + 10}
            onChange={(hour, minute) => {
              setEndTime(getUnix([hour, minute, 0]));
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => onOk?.(startTime, endTime)}
          disableElevation
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
