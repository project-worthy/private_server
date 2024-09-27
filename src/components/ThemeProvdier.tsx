import { createContext } from "react";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { useBodyClass } from "hooks";

import type { ReactNode } from "react";

declare module "@mui/material/styles" {
  interface Theme {
    color: {
      danger: string;
      primary: string;
      secondary: string;
      highlight: string;
      background: string;
      blend: string;
    };
  }
  interface ThemeOptions {
    color?: {
      danger?: string;
      primary?: string;
      secondary?: string;
      highlight?: string;
      background?: string;
      blend?: string;
    };
  }
}

let theme = createTheme({
  color: {
    danger: "rgba(var(--))",
    primary: "rgba(var(--primary))",
    secondary: "rgba(var(--secondary))",
    highlight: "rgba(var(--highlight))",
    background: "rgba(var(--background))",
    blend: "rgba(var(--blend))",
  },
});

theme = createTheme(theme, {
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        clearIndicator: {
          color: theme.color.primary, // Change clear button color
          "&:hover": {
            color: theme.color.primary, // Change clear button color on hover
          },
        },
        popupIndicator: {
          display: "none",
        },
        root: {
          borderRadius: 0,
          border: "none",
          "& fieldset": {
            border: "none",
          },
        },
        paper: {
          backgroundColor: theme.color.background,
          color: theme.color.primary,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.color.background,
          color: theme.color.primary,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: theme.color.primary,
            caretColor: theme.color.primary,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: theme.color.background,
          backgroundColor: theme.color.highlight,
        },
        outlined: {
          color: theme.color.primary,
        },
        text: {
          color: theme.color.primary,
          "&:hover": {
            backgroundColor: theme.color.blend,
          },
        },
        root: {
          borderColor: theme.color.highlight,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: theme.color.primary,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: theme.color.primary,
          "&.Mui-selected": {
            color: theme.color.highlight,
            backgroundColor: theme.color.blend,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.color.background,
          color: theme.color.primary,
          borderRadius: "15px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
  },
});
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext<"dark" | "light">("light");

export default function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;
  const [light, dark] = useBodyClass("light");
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  )
    dark();
  else light();

  return (
    <ThemeContext.Provider value={"light"}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
