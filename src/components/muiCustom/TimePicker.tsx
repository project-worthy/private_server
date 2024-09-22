import { useState } from "react";

import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";

import InputNumber from "./InputNumber";

export default function TimePicker() {
  const [amPm, setAmPm] = useState("AM");
  const [hourType, setHourType] = useState("12");

  return (
    <div className="flex flex-col items-center px-4 py-2">
      <dl className="w-full flex justify-between items-center">
        <dt>Enter Time</dt>
        <dd>
          <ToggleButtonGroup
            value={hourType}
            size="small"
            exclusive
            onChange={(_, h) => setHourType(h)}
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="left aligned">
              12
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered">
              24
            </ToggleButton>
          </ToggleButtonGroup>
        </dd>
      </dl>

      <div className="flex items-center gap-x-2">
        <ToggleButtonGroup
          size="large"
          orientation="vertical"
          exclusive
          onChange={(_, period) => {
            if (period !== null) {
              setAmPm(period);
            }
          }}
          value={amPm}
        >
          <ToggleButton value={"AM"}>AM</ToggleButton>
          <ToggleButton value={"PM"}>PM</ToggleButton>
        </ToggleButtonGroup>

        <InputNumber />
        <span className="text-[64px]">:</span>
        <InputNumber />
      </div>
      <div className="self-end">
        <Button variant="contained">확인</Button>
      </div>
    </div>
  );
}
