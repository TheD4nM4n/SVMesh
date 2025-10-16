import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import svmeshLogo from "../assets/svmesh.jpg";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const links = [
  { name: "Home", href: "/" },
  { name: "Getting Started", href: "/getting-started" },
  { name: "Hardware", href: "/hardware" },
  { name: "Resources", href: "/resources" },
  { name: "Best Practices", href: "/best-practices" },
  { name: "Support", href: "/support" },
];

const NavigationButton = styled(Button)(({ theme }) => ({
  fontWeight: 500,
  textTransform: "none",
  marginLeft: "16px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, .4)",
    color: theme.palette.primary.main,
  },
}));

export default function HeaderMenu() {
  return (
    <AppBar position="static" color="primary" sx={{ width: "100%" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <img
            src={svmeshLogo}
            alt="SVMesh Logo"
            style={{
              height: "56px",
              width: "auto",
              borderRadius: "4px",
            }}
          />
          <Typography
            variant="h6"
            color="primary"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            Susquehanna Valley Meshtastic
          </Typography>
        </Stack>
        <Box>
          {links.map((link) => (
            <NavigationButton
              key={link.name}
              color="secondary"
              href={link.href}
            >
              <Typography variant="button" color="inherit">
                {link.name}
              </Typography>
            </NavigationButton>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
