import { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface ExamSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ExamSearch({
  value,
  onChange,
  placeholder = "Search exams, subjects, or topics...",
}: ExamSearchProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: / or Ctrl+K to focus, Esc to blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isEditing =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (
        (e.key === "/" ||
          ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        !isEditing
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && activeEl === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Box
      onClick={() => inputRef.current?.focus()}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: dark ? "#212127" : "#ffffff",
        borderRadius: "12px",
        px: 1.75,
        py: 0.85,
        border: "1px solid",
        borderColor: isFocused
          ? "primary.main"
          : dark
            ? "rgba(255, 255, 255, 0.09)"
            : "rgba(0, 0, 0, 0.09)",
        boxShadow: isFocused
          ? dark
            ? "0 6px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(59, 154, 198, 0.25)"
            : "0 6px 20px -2px rgba(59, 154, 198, 0.15), 0 0 0 2px rgba(59, 154, 198, 0.15)"
          : dark
            ? "0 2px 8px rgba(0, 0, 0, 0.25)"
            : "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        gap: 1.25,
        cursor: "text",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: isFocused ? "primary.main" : dark ? "#64748b" : "#94a3b8",
          transition: "color 0.15s ease",
          flexShrink: 0,
        }}
      >
        <Icon icon="mdi:magnify" width={20} height={20} />
      </Box>

      <InputBase
        inputRef={inputRef}
        fullWidth
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          fontSize: { xs: "0.92rem", sm: "0.96rem" },
          color: dark ? "#ffffff" : "#0f172a",
          "& input::placeholder": {
            color: dark ? "#64748b" : "#94a3b8",
            opacity: 1,
          },
        }}
      />

      {value ? (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
            inputRef.current?.focus();
          }}
          sx={{
            p: 0.5,
            color: dark ? "#94a3b8" : "#64748b",
            "&:hover": { color: dark ? "#ffffff" : "#0f172a" },
          }}
        >
          <Icon icon="mdi:close" width={18} height={18} />
        </IconButton>
      ) : (
        <Box
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            alignItems: "center",
            px: 0.85,
            py: 0.25,
            borderRadius: "6px",
            backgroundColor: dark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.04)",
            border: "1px solid",
            borderColor: dark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: dark ? "#64748b" : "#94a3b8",
              lineHeight: 1,
            }}
          >
            ⌘K
          </Typography>
        </Box>
      )}
    </Box>
  );
}
