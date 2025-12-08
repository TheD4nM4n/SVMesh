import { Box, Typography } from "@mui/material";

const styles = {
  boxContainerStyle: {
    backgroundColor: "background.paper",
    borderRadius: "4px",
    padding: 1,
  },
  uploadButton: {
    border: "2px dashed lightgrey",
    borderRadius: "8px",
    width: "100%",
    padding: 4,
    textTransform: "none",
  },
};

export default function RecentUpdates() {
  return (
    <Box sx={styles.boxContainerStyle}>
      <Typography variant="h6" gutterBottom>
        Recent Updates
      </Typography>
      <Typography variant="body2" color="textSecondary">
        No recent updates available.
      </Typography>
    </Box>
  );
}
