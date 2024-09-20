import { Input } from "@mui/base";
import SortIcon from "@mui/icons-material/Sort";
import { InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";

import cs from "utils/className";

export type FilterInputProps = {
  children?: React.ReactNode;
  fullWidth?: boolean;
};
export const CustomInput = styled(Input)(({ theme }) => ({
  "&.Mui-checked": {
    color: theme.color.highlight,
  },
  "&.base--focused": {
    borderColor: theme.color.highlight,
  },
  "&.MuiOutlinedInput-root": {
    borderRadius: "50vh",
  },
}));

export default function FilterInput(props: FilterInputProps) {
  const { fullWidth } = props;
  const rootCS =
    "w-full flex gap-x-2 h-8 text-xs rounded-full items-center px-4 border";
  return (
    <CustomInput
      slotProps={{
        root: {
          className: cs.join(rootCS, fullWidth ? "w-full" : ""),
        },
        input: {
          className: "w-full h-full px-2 outline-none",
        },
      }}
      fullWidth={true}
      placeholder={"이름이나 태그 등을 입력해주세요"}
      startAdornment={
        <InputAdornment position="start">
          <SortIcon />
        </InputAdornment>
      }
    ></CustomInput>
  );
}
