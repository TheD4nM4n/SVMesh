import { Outlet } from "react-router";
import { Suspense } from "react";
import HeaderMenu from "../components/HeaderMenu";
import { Stack, CircularProgress, Box } from "@mui/material";

export default function StandardLayout() {
  return (
    <>
      <Stack width={"100vw"} sx={{ minHeight: "100vh" }}>
        <HeaderMenu />
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="400px"
            >
              <CircularProgress />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </Stack>
    </>
  );
}
