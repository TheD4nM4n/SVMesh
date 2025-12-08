import { Box } from "@mui/material";
import StyledText from "./StyledText";

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  height?: string;
  overlay?: boolean;
  textAlign?: "left" | "center" | "right";
}

export default function HeroSection({
  backgroundImage,
  title,
  subtitle,
  height = "50vh",
  overlay = true,
  textAlign = "left",
}: HeroSectionProps) {
  const justifyContent = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  }[textAlign];

  return (
    <Box
      sx={{
        height,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent,
        position: "relative",
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
          px: 4,
          maxWidth: "800px",
          textAlign,
        }}
      >
        <StyledText
          variant="h2"
          component="h1"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {title}
        </StyledText>
        <StyledText
          variant="h6"
          sx={{
            color: "white",
          }}
        >
          {subtitle}
        </StyledText>
      </Box>
    </Box>
  );
}
