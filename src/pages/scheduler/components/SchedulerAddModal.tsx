import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Button, TimePicker } from "components/muiCustom";

import type { DialogProps } from "@mui/material";

type SchedeulerAddModalProp = {
  startNum?: number;
  onClose: () => void;
} & DialogProps;

export default function SchedeulerAddModal(props: SchedeulerAddModalProp) {
  const { startNum, onClose, ...dialogProps } = props;
  return (
    <Dialog {...dialogProps} onClose={onClose} maxWidth={false}>
      <DialogTitle>새 스케줄러 추가</DialogTitle>
      <DialogContent>
        <div className="flex gap-x-3 items-center">
          <TimePicker hourType="12" hour={startNum} />
          <span className="text-[32px]">~</span>

          <TimePicker hourType="12" />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
