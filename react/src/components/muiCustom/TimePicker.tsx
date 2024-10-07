import { useEffect, useState } from "react";

import { ToggleButtonGroup, ToggleButton } from "@mui/material";

import InputNumber from "./InputNumber";

export type TimePickerProps = {
  hour?: number;
  minute?: number;
  hourType: "12" | "24";
  period?: "AM" | "PM";
  size?: "small" | "medium" | "large";
  onChange?: (hour: number, minute: number) => void;
};

export default function TimePicker(props: TimePickerProps) {
  const { period, hour, minute, hourType, onChange, size: _size } = props;
  const [amPm, setAmPm] = useState(period ?? "AM");
  const [hourValue, setHourValue] = useState(hour ?? 0);
  const [minuteValue, setMinuteValue] = useState(minute ?? 0);

  const sizeConfig = {
    small: 16,
    medium: 32,
    large: 64,
  };
  const size = sizeConfig[_size ?? "medium"];

  useEffect(() => {
    if (amPm === "PM") onChange?.(hourValue + 12, minuteValue);
    else onChange?.(hourValue, minuteValue);
  }, [amPm, hourValue, minuteValue]);

  return (
    <div className="flex flex-col items-center px-4 py-2">
      <div className="flex items-center gap-x-2">
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
          style={{ visibility: hourType === "12" ? "visible" : "hidden" }}
        >
          <ToggleButton value={"AM"}>AM</ToggleButton>
          <ToggleButton value={"PM"}>PM</ToggleButton>
        </ToggleButtonGroup>

        <InputNumber
          defaultValue={hour}
          min={0}
          max={hourType === "12" ? 12 : 24}
          onChange={(v) => setHourValue(v)}
        />
        <span style={{ fontSize: size }}>:</span>
        <InputNumber
          defaultValue={minute}
          min={0}
          max={60}
          onChange={(v) => setMinuteValue(v)}
        />
      </div>
    </div>
  );
}
