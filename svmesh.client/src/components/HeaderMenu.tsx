import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import svmeshLogo from "../assets/svmesh.png";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const links = [
  { name: "Home", href: "/" },
  { name: "Getting Started", href: "/getting-started" },
  { name: "Best Practices", href: "/best-practices" },
  { name: "Hardware", href: "/hardware" },
  { name: "Resources", href: "/resources" },
];

const NavigationButton = styled(Button)(({ theme }) => ({
  fontWeight: 500,
  textTransform: "none",
  marginLeft: "16px",
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: "rgba(24, 63, 65, 0.1)",
    color: theme.palette.primary.dark,
  },
}));

export default function HeaderMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ width: "100%", backgroundColor: "#f6eedf", zIndex: 1300 }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
        <Link
          href="/"
          sx={{ textDecoration: "none", display: "flex", flex: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 2 }}>
            <img
              src={svmeshLogo}
              alt="SVMesh Logo"
              style={{
                height: isMobile ? "40px" : "56px",
                width: "auto",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="primary"
              component="div"
              sx={{
                fontWeight: "bold",
                letterSpacing: "-0.5px",
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              Susquehanna Valley Meshtastic
            </Typography>
          </Stack>
        </Link>

        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="end"
              color="primary"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ p: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: 1 }}
            >
              {links.map((link) => (
                <MenuItem key={link.name} onClick={handleClose}>
                  <Link
                    href={link.href}
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                      fontWeight: 500,
                      py: 1,
                      px: 2,
                      width: "100%",
                    }}
                  >
                    {link.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
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
        )}
      </Toolbar>
    </AppBar>
  );
}
