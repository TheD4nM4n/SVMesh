import { Box, Link } from "@mui/material";
import StyledText from "./StyledText";

interface SimpleHeroProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  height?: string;
  overlay?: boolean;
  attributionUrl?: string;
  backgroundPosition?: string;
}

export default function SimpleHero({
  backgroundImage,
  title,
  subtitle,
  height = "25vh",
  overlay = true,
  attributionUrl = "https://creativecommons.org/",
  backgroundPosition = "center",
}: SimpleHeroProps) {
  return (
    <Box
      sx={{
        height: { xs: "20vh", md: height },
        minHeight: { xs: "150px", md: "200px" },
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        px: { xs: 2, md: 0 },
        ...(overlay && {
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          },
        }),
      }}
    >
      <Box
        sx={{
          zIndex: 2,
          textAlign: "center",
          px: { xs: 2, md: 4 },
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <StyledText
          variant="h1"
          component="h1"
          sx={{
            color: "white",
            fontWeight: "600",
            letterSpacing: "-1px",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            lineHeight: { xs: 1.1, md: 1.2 },
            mb: subtitle ? { xs: 1, md: 2 } : 0,
          }}
        >
          {title}
        </StyledText>
        {subtitle && (
          <StyledText
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.75)",
              fontWeight: "400",
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </StyledText>
        )}
      </Box>

      {/* Image Attribution */}
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          right: 12,
          zIndex: 2,
        }}
      >
        <Link
          href={attributionUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.7rem",
            textDecoration: "none",
            "&:hover": {
              color: "rgba(255, 255, 255, 0.9)",
              textDecoration: "underline",
            },
          }}
        >
          Image Credit
        </Link>
      </Box>
    </Box>
  );
}
