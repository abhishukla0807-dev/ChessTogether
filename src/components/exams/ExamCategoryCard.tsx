import { Box, Typography, useTheme } from "@mui/material";

interface ExamCategoryCardProps {
  name: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function ExamCategoryCard({
  name,
  count,
  isSelected,
  onClick,
}: ExamCategoryCardProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1.6,
        py: 0.65,
        borderRadius: "20px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.85,
        backgroundColor: isSelected
          ? dark
            ? "rgba(59, 154, 198, 0.16)"
            : "rgba(59, 154, 198, 0.12)"
          : dark
            ? "rgba(255, 255, 255, 0.04)"
            : "#ffffff",
        border: "1px solid",
        borderColor: isSelected
          ? "primary.main"
          : dark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.08)",
        color: isSelected ? "primary.main" : dark ? "#94a3b8" : "#475569",
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          borderColor: isSelected
            ? "primary.main"
            : dark
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)",
          color: isSelected ? "primary.main" : dark ? "#f1f5f9" : "#0f172a",
          backgroundColor: isSelected
            ? dark
              ? "rgba(59, 154, 198, 0.22)"
              : "rgba(59, 154, 198, 0.16)"
            : dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: "0.82rem",
          fontWeight: isSelected ? 700 : 500,
          color: "inherit",
          lineHeight: 1,
        }}
      >
        {name}
      </Typography>

      <Typography
        component="span"
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          px: 0.65,
          py: 0.2,
          borderRadius: "8px",
          backgroundColor: isSelected
            ? "primary.main"
            : dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(0, 0, 0, 0.06)",
          color: isSelected ? "#ffffff" : dark ? "#cbd5e1" : "#64748b",
          lineHeight: 1,
        }}
      >
        {count}
      </Typography>
    </Box>
  );
}
