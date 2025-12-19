import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import StandardLayout from "./layouts/StandardLayout.tsx";
import ErrorScreen from "./components/ErrorScreen.tsx";

// Lazy load page components for code splitting
const Home = lazy(() => import("./pages/Home.tsx"));
const GettingStarted = lazy(() => import("./pages/GettingStarted.tsx"));
const ChannelSettings = lazy(() => import("./pages/ChannelSettings.tsx"));
const Maps = lazy(() => import("./pages/Maps.tsx"));

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
      {
        path: "channel-settings",
        Component: ChannelSettings,
      },
      {
        path: "maps",
        Component: Maps,
      },
    ],
  },
]);
