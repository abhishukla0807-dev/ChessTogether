import React from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onInterested?: (job: Job, e: React.MouseEvent) => void;
}

export default function JobCard({ job, onInterested }: JobCardProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/jobs/${job.id}`);
  };

  const handleInterestedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInterested) {
      onInterested(job, e);
    } else {
      router.push(`/jobs/${job.id}`);
    }
  };

  return (
    <Paper
      elevation={0}
      onClick={handleCardClick}
      sx={{
        p: { xs: 2.2, sm: 2.75 },
        borderRadius: "12px",
        cursor: "pointer",
        backgroundColor: dark ? "#212126" : "#ffffff",
        border: "1px solid",
        borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: dark
            ? "0 8px 24px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 154, 198, 0.25)"
            : "0 8px 24px -6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 154, 198, 0.25)",
        },
      }}
    >
      {/* ── Top Header: Job Title & Company + "I'm interested" Button ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.08rem", sm: "1.2rem" },
              letterSpacing: "-0.01em",
              color: dark ? "#f0f6fc" : "#1a1d21",
              lineHeight: 1.3,
              mb: 0.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {job.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <Icon icon="mdi:domain" width={16} height={16} />
            {job.company}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={handleInterestedClick}
          sx={{
            flexShrink: 0,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.86rem",
            px: 2,
            py: 0.7,
            borderRadius: "8px",
            boxShadow: "none",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
              boxShadow: "none",
            },
          }}
        >
          I&apos;m interested
        </Button>
      </Box>

      {/* ── Metadata Row: Location, India  •  Experience  •  Salary  •  Job Type  •  Work Mode ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          columnGap: 1.25,
          rowGap: 0.75,
          color: dark ? "#a0aec0" : "#4a5568",
          fontSize: { xs: "0.82rem", sm: "0.88rem" },
          fontWeight: 500,
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="mdi:map-marker-outline" width={16} height={16} />
          <span>{job.location}</span>
        </Box>

        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="mdi:briefcase-outline" width={16} height={16} />
          <span>{job.experience}</span>
        </Box>

        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: dark ? "#38bdf8" : "#0284c7", fontWeight: 600 }}>
          <Icon icon="mdi:cash" width={16} height={16} />
          <span>{job.salary}</span>
        </Box>

        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Icon icon="mdi:clock-time-four-outline" width={16} height={16} />
          <span>{job.jobType}</span>
        </Box>

        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Icon
            icon={
              job.workMode === "Remote"
                ? "mdi:home-variant-outline"
                : job.workMode === "Hybrid"
                ? "mdi:domain-switch"
                : "mdi:office-building-outline"
            }
            width={16}
            height={16}
          />
          <span>{job.workMode}</span>
        </Box>
      </Box>

      {/* ── Skills Chips ── */}
      {job.skills && job.skills.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.75,
            pt: 0.5,
          }}
        >
          {job.skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                fontSize: "0.76rem",
                fontWeight: 500,
                height: "24px",
                borderRadius: "6px",
                backgroundColor: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                color: dark ? "#cbd5e1" : "#475569",
                border: "1px solid",
                borderColor: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
              }}
            />
          ))}
          <Box sx={{ ml: "auto" }}>
            <Typography
              variant="caption"
              sx={{ color: dark ? "#64748b" : "#94a3b8", fontSize: "0.75rem" }}
            >
              {job.postedDate}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
