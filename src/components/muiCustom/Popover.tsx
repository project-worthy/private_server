import { useState } from "react";

import { Popover as MuiPopover } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { PopoverProps } from "@mui/material";

const ColoredPopover = styled(MuiPopover)(({ theme }) => ({
  // "& .MuiPaper-root": {
  //   backgroundColor: theme.color.background,
  // },
}));
export default function Popover(props: PopoverProps) {
  const { children } = props;

  return <ColoredPopover {...props}>{children}</ColoredPopover>;
}
