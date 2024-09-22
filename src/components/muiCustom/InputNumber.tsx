import { useState } from "react";

import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ChangeEvent, MouseEvent } from "react";

export const OutlinedInput = styled(InputBase)(({ theme }) => ({
  width: "2ch",
  fontSize: 64,
  backgroundColor: theme.color.blend,
  borderRadius: 5,
  "&.Mui-focused": {
    outlineWidth: 2,
    outlineColor: theme.color.highlight,
    outlineStyle: "solid",
    borderRadius: 3,
  },
}));

export default function InputNumber() {
  const [onFocus, setOnFocus] = useState(false);
  const [value, setValue] = useState(0);

  const handleFocus = () => setOnFocus(true);
  const handleBlur = () => setOnFocus(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let replaced = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    replaced = replaced.slice(0, 2);
    e.target.value = replaced;
  };

  const handleNumberIncrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        className="flex flex-col items-center"
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <IconButton
          style={{ visibility: onFocus ? "visible" : "hidden" }}
          onMouseDown={handleNumberIncrease}
        >
          <ArrowDropUpIcon />
        </IconButton>
        <OutlinedInput onChange={handleInputChange} />
        <IconButton style={{ visibility: onFocus ? "visible" : "hidden" }}>
          <ArrowDropDownIcon />
        </IconButton>
      </div>
    </>
  );
}
