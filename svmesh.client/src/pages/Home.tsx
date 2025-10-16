import { Typography, Stack } from "@mui/material";
import HeaderMenu from "../components/HeaderMenu";

export default function Home() {
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h2" color="primary" component="h1" gutterBottom>
          Susquehanna Valley Meshtastic
        </Typography>
        <Typography variant="body1" color="secondary">
          This is a placeholder homepage.
        </Typography>
      </Stack>
    </>
  );
}
