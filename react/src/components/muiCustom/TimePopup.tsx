import { useState } from "react";

import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";

import { TimeTuple } from "utils/date";

import { TimePicker } from ".";

export type TimePickerProps = {
  hour?: number;
  minute?: number;
  hourType: "12" | "24";
  period?: "AM" | "PM";
  onOk?: (time: TimeTuple) => void;
};
export default function TimePopup(props: TimePickerProps) {
  const { onOk, ...timePickerProp } = props;
  const [hourType, setHourType] = useState<TimePickerProps["hourType"]>("12");
  const [time, setTime] = useState<TimeTuple>([0, 0, 0]);

  return (
    <div className="flex flex-col items-center px-4 py-2 ">
      <dl className="w-full flex justify-between items-center">
        <dt className="text-primary">Enter Time</dt>
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
        <TimePicker
          {...timePickerProp}
          hourType={hourType}
          onChange={(hour, minute) => {
            setTime([hour, minute, 0]);
          }}
        />
      </div>
      <div className="self-end">
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            onOk?.(time);
          }}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
