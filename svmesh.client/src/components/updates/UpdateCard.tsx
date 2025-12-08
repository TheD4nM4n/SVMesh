import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { StyledText } from "../ui";
import type { UpdatePost } from "../../utils/markdown";

interface UpdateCardProps {
  post: UpdatePost;
  showFullContent?: boolean;
}

export default function UpdateCard({
  post,
  showFullContent = false,
}: UpdateCardProps) {
  const [expanded, setExpanded] = useState(showFullContent);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      sx={{
        mb: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <StyledText type="subheading" sx={{ mb: 1 }}>
            {post.metadata.title}
          </StyledText>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={formatDate(post.metadata.date)}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
            {post.metadata.tag && (
              <Chip
                label={post.metadata.tag}
                size="small"
                color="primary"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
          </Box>
        </Box>

        <Box>
          <StyledText type="body" sx={{ color: "text.secondary", mb: 1 }}>
            {post.metadata.summary}
          </StyledText>

          {!showFullContent && (
            <Box
              sx={{ display: "flex", alignItems: "center", mt: 1, ml: -0.75 }}
            >
              <IconButton
                onClick={() => setExpanded(!expanded)}
                size="small"
                sx={{
                  color: "primary.main",
                  p: 0,
                  "&:hover": { backgroundColor: "rgba(24, 63, 65, 0.1)" },
                }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <StyledText
                type="body"
                sx={{
                  fontSize: "0.85rem",
                  color: "primary.main",
                  ml: 0.5,
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Read more"}
              </StyledText>
            </Box>
          )}

          <Collapse in={expanded || showFullContent} timeout="auto">
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: expanded && !showFullContent ? "1px solid" : "none",
                borderColor: "divider",
                "& h1": {
                  color: "primary.main",
                  fontWeight: "bold",
                  mt: 1,
                  mb: 0.5,
                  fontSize: "1.15rem",
                  lineHeight: 1.3,
                },
                "& h2": {
                  color: "primary.main",
                  fontWeight: "bold",
                  mt: 1,
                  mb: 0.5,
                  fontSize: "1.05rem",
                  lineHeight: 1.3,
                },
                "& h3": {
                  color: "primary.main",
                  fontWeight: "bold",
                  mt: 1,
                  mb: 0.5,
                  fontSize: "0.95rem",
                  lineHeight: 1.3,
                },
                "& p": {
                  mb: 1.5,
                  lineHeight: 1.6,
                },
                "& ul, & ol": {
                  pl: 2,
                  mb: 1.5,
                },
              }}
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
}
