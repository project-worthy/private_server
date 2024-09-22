import { ButtonGroup, Divider, Button } from "@mui/material";

import InputNumber from "./InputNumber";

export default function TimePicker() {
  return (
    <div className="flex flex-col items-center px-4 py-1">
      <dl className="flex justify-between items-center gap-x-2">
        <dt>Enter Time</dt>
        <dl></dl>
      </dl>
      <Divider />
      <div className="flex items-center gap-x-2">
        <ButtonGroup size="large" orientation="vertical">
          <Button>AM</Button>
          <Button>PM</Button>
        </ButtonGroup>

        <InputNumber />
        <span className="text-[64px]">:</span>
        <InputNumber />
      </div>
    </div>
  );
}
