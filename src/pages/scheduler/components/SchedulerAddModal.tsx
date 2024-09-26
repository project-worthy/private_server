import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Button, TimePicker } from "components/muiCustom";

import type { DialogProps } from "@mui/material";
import type { TimeTuple } from "types/date";

type SchedeulerAddModalProp = {
  startNum?: TimeTuple;
  endNum?: TimeTuple;
  onClose: () => void;
} & DialogProps;

export default function SchedeulerAddModal(props: SchedeulerAddModalProp) {
  const { startNum, onClose, ...dialogProps } = props;
  const timeTuple = startNum ?? [0, 0, 0];
  return (
    <Dialog {...dialogProps} onClose={onClose} maxWidth={false}>
      <DialogTitle>새 스케줄러 추가</DialogTitle>
      <DialogContent>
        <div className="flex gap-x-3 items-center">
          <TimePicker hourType="12" hour={timeTuple[0]} minute={timeTuple[1]} />
          <span className="text-[32px]">~</span>

          <TimePicker
            hourType="12"
            hour={timeTuple[0]}
            minute={timeTuple[1] + 10}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose} disableElevation>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
