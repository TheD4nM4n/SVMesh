import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";

interface StyledTextProps extends Omit<TypographyProps, "children"> {
  children: React.ReactNode;
  type?: "heading" | "subheading" | "body" | "body-large";
}

const textStyles = {
  heading: {
    variant: "h4" as const,
    color: "primary" as const,
    sx: {
      fontWeight: "600",
      letterSpacing: "-0.75px",
      mb: { xs: 2, md: 2.5 },
      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
    },
  },
  subheading: {
    variant: "h6" as const,
    color: "primary" as const,
    sx: {
      fontWeight: "500",
      letterSpacing: "-0.5px",
      mb: { xs: 1, md: 1.5 },
      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
    },
  },
  body: {
    variant: "body1" as const,
    sx: {
      color: "text.primary",
      lineHeight: 1.6,
      fontSize: { xs: "0.9rem", md: "0.95rem" },
      fontWeight: "400",
    },
  },
  "body-large": {
    variant: "body1" as const,
    sx: {
      color: "text.primary",
      lineHeight: 1.6,
      fontSize: { xs: "1rem", md: "1.05rem" },
      fontWeight: "400",
      opacity: 0.9,
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
