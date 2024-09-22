import { Input } from "@mui/base";
import { Sort as SortIcon } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";

import cs from "utils/className";

import Icon from "./Icon";

import type { InputBaseProps } from "@mui/material";

export type FilterInputProps = {
  children?: React.ReactNode;
  fullSize?: boolean;
} & InputBaseProps;

export const CustomInput = styled(Input)(({ theme }) => ({
  borderWidth: 2,
  caretColor: theme.color.primary,
  color: theme.color.primary,
  "&.Mui-checked": {
    color: theme.color.highlight,
  },
  "&.base--focused": {
    borderColor: theme.color.highlight,
  },
  "&.MuiOutlinedInput-root": {
    borderRadius: "50vh",
  },
  "& .base-Input-input": {
    backgroundColor: theme.color.background,
  },
}));

export default function FilterInput(props: FilterInputProps) {
  const { fullSize, onChange } = props;
  const rootCS =
    "w-full flex gap-x-2 h-8 text-xs rounded-full items-center px-4 border";
  return (
    <CustomInput
      onChange={onChange}
      slotProps={{
        root: {
          className: cs.join(rootCS, fullSize ? "w-full" : ""),
        },
        input: {
          className: "w-full h-full px-2 outline-none bg-primary",
        },
      }}
      placeholder={"이름이나 태그 등을 입력해주세요"}
      startAdornment={
        <InputAdornment position="start">
          <Icon>
            <SortIcon />
          </Icon>
        </InputAdornment>
      }
    ></CustomInput>
  );
}
