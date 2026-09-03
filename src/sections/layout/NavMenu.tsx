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
  { text: "Learn", href: "/learn" },
  { text: "Play", href: "/play" },
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

      {/* Menu List */}
      <Box sx={{ p: 1.5 }}>
        <List disablePadding>
          {MenuOptions.map(({ text, href }) => {
            const isActive =
              router.pathname === href ||
              (href === "/play" && router.pathname === "/");
            return (
              <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
                <NavLink href={href}>
                  <ListItemButton
                    onClick={onClose}
                    sx={{
                      borderRadius: "8px",
                      px: 2,
                      py: 1.2,
                      backgroundColor: isActive
                        ? "rgba(59, 154, 198, 0.15)"
                        : "transparent",
                      color: isActive ? "primary.main" : "inherit",
                      "&:hover": {
                        backgroundColor: "rgba(59, 154, 198, 0.12)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "1rem",
                        fontWeight: isActive ? 700 : 500,
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