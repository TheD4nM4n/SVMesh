import { Grid, Typography, Box } from "@mui/material";
import { ReactNode } from "react";

interface PageSectionProps {
  title?: string;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  spacing?: "compact" | "normal" | "large";
}

const spacingMap = {
  compact: { px: 4, py: 3 },
  normal: { px: 4, py: 6 },
  large: { px: 4, py: 8 },
};

export default function PageSection({
  title,
  children,
  maxWidth = "lg",
  spacing = "normal",
}: PageSectionProps) {
  return (
    <Box sx={spacingMap[spacing]}>
      <Box
        sx={{
          maxWidth: maxWidth
            ? `theme.breakpoints.values.${maxWidth}px`
            : "none",
          mx: "auto",
        }}
      >
        {title && (
          <Typography
            variant="h3"
            color="primary"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              letterSpacing: "-0.5px",
              mb: 3,
            }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
}
