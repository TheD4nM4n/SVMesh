import { Grid } from "@mui/material";
import type { ReactNode } from "react";

interface ContentGridProps {
  mainContent: ReactNode;
  sideContent?: ReactNode;
  mainSize?: number;
  sideSize?: number;
  spacing?: number;
  marginInline?: number;
}

export default function ContentGrid({
  mainContent,
  sideContent,
  mainSize = 8,
  sideSize = 4,
  spacing = 6,
}: ContentGridProps) {
  return (
    <Grid container spacing={{ xs: 3, md: spacing }}>
      <Grid size={{ xs: 12, md: mainSize }}>{mainContent}</Grid>
      {sideContent && (
        <Grid size={{ xs: 12, md: sideSize }} sx={{ mt: { xs: 3, md: 0 } }}>
          {sideContent}
        </Grid>
      )}
    </Grid>
  );
}
