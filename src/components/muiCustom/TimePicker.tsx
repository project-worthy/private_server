import { useState } from "react";

import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";

import InputNumber from "./InputNumber";

export type TimePickerProps = {
  hour: number;
  minute: number;
  hourType: "12" | "24";
  period?: "AM" | "PM";
};
export default function TimePicker(props: TimePickerProps) {
  const { period, hour, minute } = props;
  const [amPm, setAmPm] = useState(period);
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
            <ToggleButton value="12" aria-label="left aligned">
              12
            </ToggleButton>
            <ToggleButton value="24" aria-label="centered">
              24
            </ToggleButton>
          </ToggleButtonGroup>
        </dd>
      </dl>

      <div className="flex items-center gap-x-2">
        {amPm && (
          <ToggleButtonGroup
            size="large"
            orientation="vertical"
            exclusive
            onChange={(_, p) => {
              if (p !== null) {
                setAmPm(p);
              }
            }}
            value={amPm}
          >
            <ToggleButton value={"AM"}>AM</ToggleButton>
            <ToggleButton value={"PM"}>PM</ToggleButton>
          </ToggleButtonGroup>
        )}

        <InputNumber defaultValue={hour} />
        <span className="text-[64px]">:</span>
        <InputNumber defaultValue={minute} />
      </div>
      <div className="self-end">
        <Button variant="contained">확인</Button>
      </div>
    </div>
  );
}
