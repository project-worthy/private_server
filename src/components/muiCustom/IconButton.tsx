import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { IconButtonProps } from "@mui/material";

const ColoredIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.color.primary,
}));

export default function Icon(props: IconButtonProps) {
  const { children } = props;
  return <ColoredIconButton {...props}>{children}</ColoredIconButton>;
}
