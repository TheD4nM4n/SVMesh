import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";

interface StyledTextProps extends Omit<TypographyProps, "children"> {
  children: React.ReactNode;
  type?: "heading" | "subheading" | "body" | "body-large";
}

const textStyles = {
  heading: {
    variant: "h3" as const,
    color: "primary" as const,
    sx: {
      fontWeight: "bold",
      letterSpacing: "-0.5px",
      mb: 3,
    },
  },
  subheading: {
    variant: "h5" as const,
    color: "primary" as const,
    sx: {
      fontWeight: "600",
      letterSpacing: "-0.25px",
      mb: 2,
    },
  },
  body: {
    variant: "body1" as const,
    sx: {
      color: "text.primary",
      lineHeight: 1.7,
    },
  },
  "body-large": {
    variant: "body1" as const,
    sx: {
      color: "text.primary",
      lineHeight: 1.7,
      fontSize: "1.1rem",
    },
  },
};

export default function StyledText({
  children,
  type = "body",
  sx,
  ...props
}: StyledTextProps) {
  const style = textStyles[type];

  return (
    <Typography {...style} {...props} sx={{ ...style.sx, ...sx }}>
      {children}
    </Typography>
  );
}
