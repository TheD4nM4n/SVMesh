import { Box } from "@mui/material";
import { useUpdates } from "../hooks/useUpdates";
import { RecentUpdatesList } from "./updates";
import { StyledText } from "./ui";
import type { UpdatePost } from "../utils/markdown";

interface RecentUpdatesProps {
  posts?: UpdatePost[];
  error?: string | null;
}

export default function RecentUpdates({
  posts: propsPosts,
  error: propsError,
}: RecentUpdatesProps = {}) {
  // If posts and error are provided as props, use them (for Home page)
  // Otherwise, use the hook for standalone usage
  const hookData = useUpdates();

  const posts = propsPosts ?? hookData.posts;
  const error = propsError ?? hookData.error;
  const loading = propsPosts === undefined ? hookData.loading : false;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        {/* This will only show for standalone usage, not on Home page */}
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
