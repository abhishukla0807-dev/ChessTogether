import React from "react";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { Exam } from "@/types/exam";

interface ExamCardProps {
  exam: Exam;
  isSaved?: boolean;
  onToggleSave?: (examId: string) => void;
}

const EXAM_META: Record<
  string,
  {
    icon: string;
    gradient: string;
    orgShort: string;
  }
> = {
  "gate-cs": {
    icon: "mdi:school-outline",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    orgShort: "IISc & IITs",
  },
  "isro-sc": {
    icon: "mdi:rocket-launch-outline",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    orgShort: "ISRO Centres",
  },
  "barc-cs": {
    icon: "mdi:atom",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    orgShort: "Bhabha Atomic Research",
  },
  "sebi-it": {
    icon: "mdi:chart-timeline-variant-shimmer",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    orgShort: "Securities & Exchange Board",
  },
  "drdo-cs": {
    icon: "mdi:shield-check-outline",
    gradient: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    orgShort: "RAC / Min of Defence",
  },
  "nic-sas": {
    icon: "mdi:laptop-code",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #4f46e5 100%)",
    orgShort: "National Informatics Centre",
  },
  "nielit-sa": {
    icon: "mdi:certificate-outline",
    gradient: "linear-gradient(135deg, #a855f7 0%, #c026d3 100%)",
    orgShort: "MeitY / Govt of India",
  },
  "bel-pe": {
    icon: "mdi:broadcast",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0284c7 100%)",
    orgShort: "Bharat Electronics Ltd",
  },
};

export default function ExamCard({
  exam,
  isSaved,
  onToggleSave,
}: ExamCardProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();

  const meta = EXAM_META[exam.id] || {
    icon: "mdi:book-open-page-variant-outline",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    orgShort: exam.conductedBy,
  };

  const handleCardClick = () => {
    router.push(`/exams/${exam.id}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave?.(exam.id);
  };

  return (
    <Paper
      elevation={0}
      onClick={handleCardClick}
      sx={{
        p: { xs: 2, sm: 2.25 },
        borderRadius: "14px",
        cursor: "pointer",
        backgroundColor: dark ? "#212127" : "#ffffff",
        border: "1px solid",
        borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1.75,
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-3px)",
          boxShadow: dark
            ? "0 12px 28px -6px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 154, 198, 0.3)"
            : "0 12px 28px -6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 154, 198, 0.3)",
          "& .explore-arrow": {
            transform: "translateX(4px)",
            color: "primary.main",
          },
          "& .exam-avatar": {
            transform: "scale(1.04)",
          },
        },
      }}
    >
      {/* ── Top Header: Brand Avatar + Name + Bookmark ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          {/* Avatar Icon */}
          <Box
            className="exam-avatar"
            sx={{
              width: 44,
              height: 44,
              borderRadius: "11px",
              background: meta.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.2s ease",
            }}
          >
            <Icon icon={meta.icon} width={22} height={22} />
          </Box>

          {/* Title and Org */}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.08rem" },
                letterSpacing: "-0.015em",
                color: dark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.28,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {exam.name}
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.8rem",
                color: dark ? "#94a3b8" : "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mt: 0.25,
              }}
            >
              {meta.orgShort}
            </Typography>
          </Box>
        </Box>

        {/* Bookmark Icon Button */}
        {onToggleSave && (
          <Tooltip
            title={isSaved ? "Saved" : "Save exam"}
            arrow
            placement="top"
          >
            <IconButton
              size="small"
              onClick={handleSaveClick}
              sx={{
                flexShrink: 0,
                p: 0.6,
                color: isSaved ? "primary.main" : dark ? "#64748b" : "#94a3b8",
                backgroundColor: isSaved
                  ? dark
                    ? "rgba(59, 154, 198, 0.12)"
                    : "rgba(59, 154, 198, 0.08)"
                  : "transparent",
                borderRadius: "8px",
                transition: "all 0.15s ease",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: dark
                    ? "rgba(59, 154, 198, 0.18)"
                    : "rgba(59, 154, 198, 0.12)",
                },
              }}
            >
              <Icon
                icon={isSaved ? "mdi:bookmark" : "mdi:bookmark-outline"}
                width={20}
                height={20}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ── Middle: Minimal Highlight Badges ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.85,
        }}
      >
        {/* Category Pill */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.1,
            py: 0.35,
            borderRadius: "6px",
            backgroundColor: dark
              ? "rgba(59, 154, 198, 0.1)"
              : "rgba(59, 154, 198, 0.08)",
            border: "1px solid",
            borderColor: dark
              ? "rgba(59, 154, 198, 0.2)"
              : "rgba(59, 154, 198, 0.16)",
            color: "primary.main",
            fontSize: "0.74rem",
            fontWeight: 600,
          }}
        >
          {exam.category}
        </Box>

        {/* Papers Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.35,
            borderRadius: "6px",
            backgroundColor: dark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.04)",
            border: "1px solid",
            borderColor: dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(0, 0, 0, 0.06)",
            color: dark ? "#cbd5e1" : "#475569",
            fontSize: "0.74rem",
            fontWeight: 500,
          }}
        >
          <Icon icon="mdi:file-document-outline" width={13} height={13} />
          <span>{exam.papers.length} PYQs</span>
        </Box>

        {/* Mocks Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.35,
            borderRadius: "6px",
            backgroundColor: dark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.04)",
            border: "1px solid",
            borderColor: dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(0, 0, 0, 0.06)",
            color: dark ? "#cbd5e1" : "#475569",
            fontSize: "0.74rem",
            fontWeight: 500,
          }}
        >
          <Icon
            icon="mdi:checkbox-marked-circle-outline"
            width={13}
            height={13}
          />
          <span>{exam.mockTests.length} Mocks</span>
        </Box>

        {/* Subjects count */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.35,
            borderRadius: "6px",
            backgroundColor: dark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.04)",
            border: "1px solid",
            borderColor: dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(0, 0, 0, 0.06)",
            color: dark ? "#94a3b8" : "#64748b",
            fontSize: "0.74rem",
            fontWeight: 500,
          }}
        >
          <span>{exam.subjects.length} Subjects</span>
        </Box>
      </Box>

      {/* ── Bottom Footer: Frequency + Explore Action ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 0.75,
          borderTop: "1px solid",
          borderColor: dark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            color: dark ? "#94a3b8" : "#64748b",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          <Icon icon="mdi:calendar-blank-outline" width={14} height={14} />
          <span>{exam.frequency}</span>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.4,
            color: "primary.main",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          <span>Explore</span>
          <Icon
            icon="mdi:arrow-right"
            className="explore-arrow"
            width={15}
            height={15}
            style={{ transition: "transform 0.18s ease" }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
