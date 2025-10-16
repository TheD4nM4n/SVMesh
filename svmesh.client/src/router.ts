import { createBrowserRouter } from "react-router";
import Home from "./pages/Home.tsx";
import StandardLayout from "./layouts/StandardLayout.tsx";
import GettingStarted from "./pages/GettingStarted.tsx";

export const router = createBrowserRouter([
  {
    Component: StandardLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/getting-started",
        Component: GettingStarted,
      },
    ],
  },
]);
