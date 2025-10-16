import React from "react";
import { Outlet } from "react-router";
import HeaderMenu from "../components/HeaderMenu";
import { Stack } from "@mui/material";

export default function StandardLayout() {
  return (
    <>
      <Stack width={"100vw"} sx={{ minHeight: '100vh' }}>
        <HeaderMenu />
        <Outlet />
      </Stack>
    </>
  );
}
