import { Box, CircularProgress } from "@mui/material";
import { useUpdates } from "../hooks/useUpdates";
import { RecentUpdatesList } from "./updates";
import { StyledText } from "./ui";

export default function RecentUpdates() {
  const { posts, loading, error } = useUpdates();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <StyledText type="subheading" sx={{ mb: 2 }}>
          Recent Updates
        </StyledText>
        <StyledText type="body" sx={{ color: "error.main" }}>
          Error loading updates: {error}
        </StyledText>
      </Box>
    );
  }

  return (
    <Box>
      <RecentUpdatesList posts={posts} maxPosts={3} />
    </Box>
  );
}
