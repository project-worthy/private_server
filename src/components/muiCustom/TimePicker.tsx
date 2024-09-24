import { useState } from "react";

import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";

import InputNumber from "./InputNumber";

export type TimePickerProps = {
  hour?: number;
  minute?: number;
  hourType: "12" | "24";
  period?: "AM" | "PM";
  size?: "small" | "medium" | "large";
};

export default function TimePicker(props: TimePickerProps) {
  const { period, hour, minute, hourType, size: _size } = props;
  const [amPm, setAmPm] = useState(period ?? "AM");

  const sizeConfig = {
    small: 16,
    medium: 32,
    large: 64,
  };
  const size = sizeConfig[_size ?? "medium"];

  return (
    <div className="flex flex-col items-center px-4 py-2">
      <div className="flex items-center gap-x-2">
        {hourType === "12" && (
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

        <InputNumber defaultValue={hour} min={0} max={24} />
        <span style={{ fontSize: size }}>:</span>
        <InputNumber defaultValue={minute} min={0} max={60} />
      </div>
    </div>
  );
}
