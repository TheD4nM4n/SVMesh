import { Box, Grid, Link } from "@mui/material";
import StyledText from "./StyledText";

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  height?: string;
  overlay?: boolean;
  textAlign?: "left" | "center" | "right";
  rightImage?: string;
  rightImageAlt?: string;
  attributionUrl?: string;
}

export default function HeroSection({
  backgroundImage,
  title,
  subtitle,
  height = "50vh",
  overlay = true,
  textAlign = "left",
  rightImage,
  rightImageAlt = "",
  attributionUrl = "https://creativecommons.org/",
}: HeroSectionProps) {
  return (
    <Box
      sx={{
        height: { xs: "40vh", md: height },
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        sx={{
          zIndex: 2,
          px: { xs: 2, md: 4 },
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
        }}
      >
        <Grid size={{ xs: 12, md: rightImage ? 8 : 12 }}>
          <Box sx={{ textAlign }}>
            <StyledText
              variant="h1"
              component="h1"
              sx={{
                color: "white",
                fontWeight: "600",
                letterSpacing: "-1px",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                lineHeight: { xs: 1.1, md: 1.2 },
                mb: { xs: 1.5, md: 2 },
              }}
            >
              {title}
            </StyledText>
            <StyledText
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "400",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" },
                lineHeight: 1.5,
                opacity: 0.95,
              }}
            >
              {subtitle}
            </StyledText>
          </Box>
        </Grid>
        {rightImage && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={rightImage}
                alt={rightImageAlt}
                sx={{
                  maxWidth: { xs: "60%", md: "100%" },
                  height: "auto",
                  maxHeight: { xs: "120px", md: "200px" },
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>

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
