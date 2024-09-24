import { KeyboardEvent, useRef, useState } from "react";

import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ChangeEvent, MouseEvent } from "react";

export const OutlinedInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: theme.color.blend,
  borderRadius: 5,
  "& .MuiInputBase-input": {
    textAlign: "right",
    color: theme.color.primary,
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    "&::selection": {
      color: "transperant",
    },
    "&::focus": {
      color: theme.color.highlight,
    },
  },
  "&.Mui-focused": {
    outlineWidth: 2,
    outlineColor: theme.color.highlight,
    outlineStyle: "solid",
    borderRadius: 3,
    "& .MuiInputBase-input": {
      color: theme.color.highlight,
    },
  },
}));

export type InputNumberProps = {
  defaultValue?: number;
  totalDigit?: number;
  max?: number;
  min?: number;
  isInteger?: boolean;
  isFloat?: boolean;
  size?: "small" | "medium" | "large";
};

export default function InputNumber(props: InputNumberProps) {
  const {
    defaultValue,
    totalDigit: _totalDigit,
    max: _max,
    min: _min,
    isInteger: _isInteger,
    size: _size,
  } = props;

  const [onFocus, setOnFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>();

  const max = _max ?? Infinity;
  const min = _min ?? 0;
  const isInteger = _isInteger ?? false;
  const defaultDigit = isInteger ? 3 : 2;
  const totalDigit = _totalDigit ?? defaultDigit;

  const sizeConfig = {
    small: 16,
    medium: 32,
    large: 64,
  };

  const size = sizeConfig[_size ?? "medium"];

  const handleFocus = () => setOnFocus(true);
  const handleBlur = () => setOnFocus(false);

  const get2Digit = (num?: number | string) => {
    if (typeof num === "string") return num.padStart(totalDigit, "0");
    return (num ?? 0).toString().padStart(totalDigit, "0");
  };

  const handleInputChange = () => {
    const currentValue = inputRef.current?.value ?? "";
    let replaced = currentValue
      .replace(/[^0-9.-]/g, "")
      .replace(/(\..*)\./g, "$1");
    replaced = replaced.slice(replaced.length - 2, replaced.length);

    let currentNum = Number.parseInt(replaced);
    if (currentNum > max) currentNum = max;
    if (currentNum < min) currentNum = min;

    if (inputRef.current) inputRef.current.value = get2Digit(currentNum);
  };

  const handleNumberIncrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentNum = Number.parseInt(inputRef.current?.value ?? "0");
    if (inputRef.current) inputRef.current.value = (currentNum + 1).toString();
    handleInputChange();
  };

  const handleNumberDecrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentNum = Number.parseInt(inputRef.current?.value ?? "0");
    if (inputRef.current) inputRef.current.value = (currentNum - 1).toString();
    handleInputChange();
  };

  const handleFocusInput = () => {
    setTimeout(() => {
      const input = inputRef.current;
      if (input)
        input.setSelectionRange(input.value.length, input.value.length);
    }, 50);
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
          inputRef={inputRef}
          defaultValue={get2Digit(defaultValue)}
          onFocus={handleFocusInput}
          onKeyUp={handleInputChange}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: size,
              width: `${totalDigit}ch`,
            },
          }}
        />
        <IconButton
          style={{ visibility: onFocus ? "visible" : "hidden" }}
          onMouseDown={handleNumberDecrease}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </div>
    </>
  );
}
