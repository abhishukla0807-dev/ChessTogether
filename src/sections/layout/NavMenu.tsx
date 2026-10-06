import NavLink from "@/components/NavLink";
import { Icon } from "@iconify/react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const MenuOptions = [
  { text: "Play", href: "/play" },
  { text: "Learn", href: "/learn" },
  { text: "Exams", href: "/exams" },
  { text: "Jobs", href: "/jobs" },
  { text: "Chat", href: "/chat" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NavMenu({ open, onClose }: Props) {
  const router = useRouter();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        "& .MuiDrawer-paper": {
          width: 260,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#19191c" : "#ffffff",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#e8eaed" : "#1a1d21",
          borderRight: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.01em",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#ffffff" : "#1a1d21",
          }}
        >
          ByteMate
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "inherit" }}>
          <Icon icon="mdi:close" />
        </IconButton>
      </Box>

      {/* Menu List — Clean aligned links in exact order (Play, Learn, Jobs, Chat) without icons */}
      <Box sx={{ p: 1.5 }}>
        <List disablePadding>
          {MenuOptions.map(({ text, href }) => {
            const isActive =
              router.pathname === href ||
              (href === "/play" && router.pathname === "/") ||
              (href !== "/play" && router.pathname.startsWith(href));
            return (
              <ListItem key={text} disablePadding sx={{ mb: 0.75 }}>
                <NavLink href={href}>
                  <ListItemButton
                    onClick={onClose}
                    sx={{
                      borderRadius: "10px",
                      px: 2.5,
                      py: 1.25,
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: isActive
                        ? (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(59, 154, 198, 0.18)"
                              : "rgba(59, 154, 198, 0.12)"
                        : "transparent",
                      color: isActive
                        ? "primary.main"
                        : (theme) =>
                            theme.palette.mode === "dark"
                              ? "#e2e8f0"
                              : "#334155",
                      borderLeft: "3px solid",
                      borderColor: isActive ? "primary.main" : "transparent",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(59, 154, 198, 0.12)"
                            : "rgba(59, 154, 198, 0.08)",
                        color: "primary.main",
                      },
                    }}
                  >
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "1.05rem",
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: "-0.01em",
                      }}
                    />
                  </ListItemButton>
                </NavLink>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}