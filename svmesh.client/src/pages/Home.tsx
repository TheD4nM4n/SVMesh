import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import RecentUpdates from "../components/RecentUpdates";
import MarkdownContent from "../components/MarkdownContent";
import {
  HeroSection,
  PageSection,
  ContentGrid,
  StyledText,
} from "../components/ui";
import { parsePageMarkdown, type ParsedPage } from "../utils/pageMarkdown";
import { useUpdates } from "../hooks/useUpdates";

// Import assets dynamically based on markdown
import susquehannaValley from "../assets/susquehanna-valley.jpg";
import meshtasticPowered from "../assets/meshtastic-powered.png";

const assetMap: Record<string, string> = {
  "susquehanna-valley.jpg": susquehannaValley,
  "meshtastic-powered.png": meshtasticPowered,
};

export default function Home() {
  const [pageData, setPageData] = useState<ParsedPage | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { posts, loading: updatesLoading, error: updatesError } = useUpdates();

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        const data = await parsePageMarkdown("home");
        setPageData(data);
      } catch (error) {
        console.error("Failed to load home page content:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadPageContent();
  }, []);

  // Show loading until both page content and updates are ready
  if (pageLoading || updatesLoading) {
    return (
      <PageSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      </PageSection>
    );
  }

  if (!pageData) {
    return (
      <PageSection>
        <StyledText type="body">Failed to load page content.</StyledText>
      </PageSection>
    );
  }

  const { metadata, content } = pageData;

  return (
    <>
      <HeroSection
        backgroundImage={
          metadata.heroImage ? assetMap[metadata.heroImage] : susquehannaValley
        }
        title={metadata.title || "We mesh well together."}
        subtitle={metadata.subtitle || ""}
        textAlign="left"
        rightImage={
          metadata.rightImage ? assetMap[metadata.rightImage] : undefined
        }
        rightImageAlt={metadata.rightImageAlt || ""}
        attributionUrl={metadata.attributionUrl || ""}
      />

      <PageSection>
        <ContentGrid
          mainContent={
            <>
              <MarkdownContent content={content} />
            </>
          }
          sideContent={<RecentUpdates posts={posts} error={updatesError} />}
        />
      </PageSection>
    </>
  );
}
