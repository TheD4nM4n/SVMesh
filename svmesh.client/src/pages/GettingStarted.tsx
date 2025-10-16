import { Typography, Stack } from "@mui/material";

export default function GettingStarted() {
  return (
    <Stack spacing={2}>
      <Typography variant="h2" color="primary" component="h1" gutterBottom>
        Getting Started
      </Typography>
      <Typography variant="body1" color="secondary">
        This is a placeholder getting started.
      </Typography>
    </Stack>
  );
}
