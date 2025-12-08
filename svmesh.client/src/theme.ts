import { createTheme } from "@mui/material/styles";

// Extend the theme to include custom colors
declare module "@mui/material/styles" {
  interface Palette {
    cream: Palette["primary"];
  }

  interface PaletteOptions {
    cream?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "SF Pro Display",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 500,
      letterSpacing: "-0.015em",
    },
    h6: {
      fontWeight: 500,
      letterSpacing: "-0.015em",
    },
    body1: {
      fontWeight: 400,
      letterSpacing: "-0.01em",
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      letterSpacing: "-0.01em",
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      letterSpacing: "-0.01em",
      textTransform: "none",
    },
  },
  palette: {
    mode: "light", // Changed from dark to light
    background: {
      default: "#f6eedf", // Main background color
      paper: "#faf6f0", // Card/paper background color
    },
    primary: {
      main: "#183F41",
    },
    secondary: {
      main: "#3E6347",
    },
  },
});
