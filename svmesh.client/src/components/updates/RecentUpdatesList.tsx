import { Box, Stack } from "@mui/material";
import { StyledText } from "../ui";
import UpdateCard from "./UpdateCard";
import type { UpdatePost } from "../../utils/markdown";

interface RecentUpdatesListProps {
  posts: UpdatePost[];
  maxPosts?: number;
  showFullContent?: boolean;
}

export default function RecentUpdatesList({
  posts,
  maxPosts = 3,
  showFullContent = false,
}: RecentUpdatesListProps) {
  const displayPosts = posts.slice(0, maxPosts);

  if (posts.length === 0) {
    return (
      <Box>
        <StyledText type="subheading" sx={{ mb: 2 }}>
          Recent Updates
        </StyledText>
        <StyledText
          type="body"
          sx={{ color: "text.secondary", fontStyle: "italic" }}
        >
          No updates available at this time.
        </StyledText>
      </Box>
    );
  }

  return (
    <Box>
      <StyledText type="subheading" sx={{ mb: 3 }}>
        Recent Updates
      </StyledText>
      <Stack spacing={2}>
        {displayPosts.map((post) => (
          <UpdateCard
            key={post.slug}
            post={post}
            showFullContent={showFullContent}
          />
        ))}
      </Stack>
    </Box>
  );
}
