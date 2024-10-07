import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ButtonProps } from "@mui/material";

export const CustomButton = styled(MuiButton)(({ theme }) => ({
  // color: theme.color.primary,
}));

export default function Button(props: ButtonProps) {
  return <CustomButton {...props} />;
}
