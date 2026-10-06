import { Box, Chip, Paper, Typography, useTheme } from "@mui/material";

interface ExamSectionCardProps {
  title: string;
  items: { id: string; label: string; sublabel?: string }[];
  emptyMessage?: string;
  onItemClick?: (id: string) => void;
}

export default function ExamSectionCard({
  title,
  items,
  emptyMessage = "No items available yet.",
  onItemClick,
}: ExamSectionCardProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: "12px",
        backgroundColor: dark ? "#212126" : "#ffffff",
        border: "1px solid",
        borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1rem",
          color: dark ? "#f0f6fc" : "#1a1d21",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {items.length === 0 ? (
        <Typography
          sx={{
            color: dark ? "#64748b" : "#94a3b8",
            fontSize: "0.88rem",
            fontStyle: "italic",
          }}
        >
          {emptyMessage}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {items.map((item) => (
            <Box
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "8px",
                backgroundColor: dark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                border: "1px solid",
                borderColor: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                cursor: onItemClick ? "pointer" : "default",
                transition: "all 0.15s ease",
                ...(onItemClick && {
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: dark
                      ? "rgba(59, 154, 198, 0.08)"
                      : "rgba(59, 154, 198, 0.04)",
                  },
                }),
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  color: dark ? "#e2e8f0" : "#334155",
                }}
              >
                {item.label}
              </Typography>
              {item.sublabel && (
                <Chip
                  label={item.sublabel}
                  size="small"
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    height: "22px",
                    borderRadius: "6px",
                    backgroundColor: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                    color: dark ? "#94a3b8" : "#64748b",
                    border: "1px solid",
                    borderColor: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
