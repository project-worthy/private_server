import { Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.color.highlight,
  "&.Mui-checked": {
    color: theme.color.highlight,
  },
}));
