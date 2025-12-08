import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  fontWeight: 500,
  borderBottom: `1px solid transparent`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.dark,
    borderBottomColor: theme.palette.primary.main,
    textDecoration: "none",
  },
}));

export default StyledLink;
