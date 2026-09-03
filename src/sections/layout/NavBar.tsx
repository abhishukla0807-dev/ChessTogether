import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import NavMenu from "./NavMenu";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import NavLink from "@/components/NavLink";
import { styled } from "@mui/material/styles";

interface Props {
  darkMode: boolean;
  switchDarkMode: () => void;
}

// Styled component to make the link look like a button
const StyledIconButtonLink = styled("a")({
  color: "inherit",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
  },
});

export default function NavBar({ darkMode, switchDarkMode }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  const isLearnActive = router.pathname === "/learn";
  const isPlayActive = router.pathname === "/play" || router.pathname === "/";
  const isChatActive = router.pathname === "/chat";

  return (
    <Box component="header" sx={{ width: "100%", flexShrink: 0 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: darkMode ? "#19191c" : "#ffffff",
          color: darkMode ? "#ffffff" : "#1a1d21",
          boxShadow: darkMode
            ? "0 1px 3px rgba(0, 0, 0, 0.5)"
            : "0 1px 3px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid",
          borderColor: darkMode
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.08)",
        }}
        enableColorOnDark
      >
        <Toolbar variant="dense" sx={{ px: { xs: 1.5, sm: 3 } }}>
          {/* Main Sidebar Drawer Menu Button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: "min(0.5vw, 0.6rem)", padding: 1, my: 1 }}
            onClick={() => setDrawerOpen(true)}
          >
            <Icon icon="mdi:menu" />
          </IconButton>

          {/* Logo / Brand Name */}
          <NavLink href="/">
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: { xs: "1.05rem", sm: "1.25rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: darkMode ? "#ffffff" : "#1a1d21",
                cursor: "pointer",
                mr: 3.5,
              }}
            >
              ByteMate
            </Typography>
          </NavLink>

          {/* Direct Navigation Links: Learn, Play, Chat */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <NavLink href="/learn">
              <Typography
                sx={{
                  fontSize: "0.92rem",
                  fontWeight: isLearnActive ? 700 : 500,
                  color: isLearnActive
                    ? "primary.main"
                    : darkMode
                    ? "#cbd5e0"
                    : "#4a5568",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Learn
              </Typography>
            </NavLink>

            <NavLink href="/play">
              <Typography
                sx={{
                  fontSize: "0.92rem",
                  fontWeight: isPlayActive ? 700 : 500,
                  color: isPlayActive
                    ? "primary.main"
                    : darkMode
                    ? "#cbd5e0"
                    : "#4a5568",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Play
              </Typography>
            </NavLink>

            <NavLink href="/chat">
              <Typography
                sx={{
                  fontSize: "0.92rem",
                  fontWeight: isChatActive ? 700 : 500,
                  color: isChatActive
                    ? "primary.main"
                    : darkMode
                    ? "#cbd5e0"
                    : "#4a5568",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Chat
              </Typography>
            </NavLink>
          </Box>

          {/* Spacer pushing right buttons to far right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* GitHub Link */}
          <StyledIconButtonLink
            href="https://github.com/abhishukla0807-dev"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ml: 1 }}
          >
            <IconButton color="inherit" component="span">
              <Icon icon="mdi:github" />
            </IconButton>
          </StyledIconButtonLink>

          {/* Light / Dark Mode Toggle */}
          <IconButton
            sx={{ ml: 0.5 }}
            onClick={switchDarkMode}
            color="inherit"
            edge="end"
          >
            {darkMode ? (
              <Icon icon="mdi:brightness-7" />
            ) : (
              <Icon icon="mdi:brightness-4" />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <NavMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
