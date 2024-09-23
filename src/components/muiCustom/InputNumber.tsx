import { useRef, useState } from "react";

import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ChangeEvent, MouseEvent } from "react";

export const OutlinedInput = styled(InputBase)(({ theme }) => ({
  fontSize: 64,
  backgroundColor: theme.color.blend,
  borderRadius: 5,
  "& .MuiInputBase-input": {
    textAlign: "right",
    color: theme.color.primary,
    width: "2ch",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  },
  "&.Mui-focused": {
    outlineWidth: 2,
    outlineColor: theme.color.highlight,
    outlineStyle: "solid",
    borderRadius: 3,
  },
}));

export type InputNumberProps = {
  defaultValue?: number;
};

const get2Digit = (num?: number) => (num ?? 0).toString().padStart(2, "0");

export default function InputNumber(props: InputNumberProps) {
  const { defaultValue } = props;
  const [onFocus, setOnFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>();

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
        <OutlinedInput
          onChange={handleInputChange}
          defaultValue={get2Digit(defaultValue)}
          onFocus={() => inputRef.current?.select()}
          inputRef={inputRef}
        />
        <IconButton style={{ visibility: onFocus ? "visible" : "hidden" }}>
          <ArrowDropDownIcon />
        </IconButton>
      </div>
    </>
  );
}
