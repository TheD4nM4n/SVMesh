import { createBrowserRouter } from "react-router";
import Home from "./pages/Home.tsx";
import StandardLayout from "./layouts/StandardLayout.tsx";
import GettingStarted from "./pages/GettingStarted.tsx";
import ErrorScreen from "./components/ErrorScreen.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StandardLayout,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "getting-started",
        Component: GettingStarted,
      },
    ],
  },
]);
