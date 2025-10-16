import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark", // or 'light'
    background: {
      default: "#ffffff", // Main background color
      paper: "#F5ECDC", // Card/paper background color
    },
    primary: {
      main: "#183F41",
    },
    secondary: {
      main: "#3E6347",
    },
  },
});
