import { Grid } from "@mui/material";
import type { ReactNode } from "react";

interface ContentGridProps {
  mainContent: ReactNode;
  sideContent?: ReactNode;
  mainSize?: number;
  sideSize?: number;
  spacing?: number;
}

export default function ContentGrid({
  mainContent,
  sideContent,
  mainSize = 8,
  sideSize = 4,
  spacing = 2,
}: ContentGridProps) {
  return (
    <Grid container spacing={spacing}>
      <Grid size={{ xs: 12, md: mainSize }}>{mainContent}</Grid>
      {sideContent && (
        <Grid size={{ xs: 12, md: sideSize }}>{sideContent}</Grid>
      )}
    </Grid>
  );
}
