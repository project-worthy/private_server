import { SvgIcon } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ReactNode } from "react";

type IconProps = {
  children: ReactNode;
};

const ColoredIcon = styled(SvgIcon)(({ theme }) => ({
  color: theme.color.primary,
}));

export default function Icon(props: IconProps) {
  const { children } = props;
  return <ColoredIcon>{children}</ColoredIcon>;
}
