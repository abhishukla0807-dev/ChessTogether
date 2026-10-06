import { Box, LinearProgress, Paper, Typography, linearProgressClasses, useTheme } from "@mui/material";
import { LINEAR_PROGRESS_BAR_COLOR } from "@/constants";
import { ExamProgress } from "@/types/exam";
import { useRouter } from "next/router";

interface ExamProgressCardProps {
  examId: string;
  examName: string;
  progress: ExamProgress;
}

export default function ExamProgressCard({ examId, examName, progress }: ExamProgressCardProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();

  const totalSections = 6;
  const visitedPercent = Math.round((progress.sectionsVisited.length / totalSections) * 100);

  const lastAccessed = new Date(progress.lastAccessedAt);
  const timeAgo = getTimeAgo(lastAccessed);

  return (
    <Paper
      elevation={0}
      onClick={() => router.push(`/exams/${examId}`)}
      sx={{
        p: 2.2,
        borderRadius: "12px",
        cursor: "pointer",
        backgroundColor: dark ? "#212126" : "#ffffff",
        border: "1px solid",
        borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-1px)",
          boxShadow: dark
            ? "0 4px 16px -4px rgba(0, 0, 0, 0.5)"
            : "0 4px 16px -4px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: dark ? "#f0f6fc" : "#1a1d21",
          }}
        >
          {examName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: dark ? "#64748b" : "#94a3b8",
            fontSize: "0.75rem",
          }}
        >
          {timeAgo}
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: dark ? "#94a3b8" : "#64748b", fontSize: "0.78rem" }}>
            Sections explored
          </Typography>
          <Typography variant="caption" sx={{ color: dark ? "#cbd5e1" : "#475569", fontWeight: 600, fontSize: "0.78rem" }}>
            {visitedPercent}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={visitedPercent}
          sx={{
            borderRadius: "5px",
            height: "5px",
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: LINEAR_PROGRESS_BAR_COLOR,
            },
          }}
        />
      </Box>

      {/* Stats row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: dark ? "#94a3b8" : "#64748b",
          fontSize: "0.78rem",
          fontWeight: 500,
        }}
      >
        <span>{progress.questionsAttempted} questions attempted</span>
        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>
        <span>{progress.mockTestsTaken} mock tests</span>
      </Box>
    </Paper>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
