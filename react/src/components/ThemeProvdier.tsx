import { createContext } from "react";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import type { childrenProps } from "types/default";

declare module "@mui/material/styles" {
  interface Theme {
    color: {
      danger: string;
      primary: string;
      secondary: string;
      highlight: string;
      blend: string;
    };
  }
  interface ThemeOptions {
    color?: {
      danger?: string;
      primary?: string;
      secondary?: string;
      highlight?: string;
      blend?: string;
    };
  }
}

const theme = createTheme({
  color: {
    danger: "rgba(var(--))",
    primary: "rgba(var(--primary))",
    secondary: "rgba(var(--secondary))",
    highlight: "rgba(var(--highlight))",
    blend: "rgba(var(--blend))",
  },
});

export const ThemeContext = createContext<"dark" | "light">("light");

export default function ThemeProvider({ children }: childrenProps) {
  return (
    <ThemeContext.Provider value={"light"}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
