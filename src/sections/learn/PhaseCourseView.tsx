import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  CourseSubTopic,
  CourseChapter,
  CoursePhase,
} from "@/types/learn";

export type { CourseSubTopic, CourseChapter, CoursePhase };

interface PhaseCourseViewProps {
  courseTitle: string;
  phases: CoursePhase[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

function formatPhaseTitle(phaseNum: string, title: string) {
  const p = phaseNum.replace(/PHASE/i, "Phase");
  const t = title
    .split(" ")
    .map((w) => {
      if (w === "&" || w === "·") return w;
      if (w.toUpperCase() === "API") return "API";
      if (w.toUpperCase() === "DEVOPS") return "DevOps";
      if (w.toUpperCase() === "CI/CD") return "CI/CD";
      if (w.toUpperCase() === "IAC") return "IaC";
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
  return `${p} · ${t}`;
}

export default function PhaseCourseView({
  courseTitle,
  phases,
  sidebarOpen,
  setSidebarOpen,
}: PhaseCourseViewProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const C = {
    card: dark ? "#19191c" : "#ffffff",
    sidebarBg: dark ? "#19191c" : "#ffffff",
    headerBg: dark ? "#19191c" : "#ffffff",
    headerText: dark ? "#ffffff" : "#1a1d21",
    border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    divider: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    textPrimary: dark ? "#e2e8f0" : "#1a1d21",
    textBody: dark ? "#94a3b8" : "#4a5568",
    textMuted: dark ? "#94a3b8" : "#64748b",
    chapterText: dark ? "#cbd5e1" : "#334155",
    subtopicText: dark ? "#94a3b8" : "#64748b",
    cardSurface: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    tagBg: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    hoverBg: dark ? "rgba(59,154,198,0.12)" : "rgba(59,154,198,0.08)",
    activeBg: dark ? "rgba(59,154,198,0.18)" : "rgba(59,154,198,0.12)",
    pillBorder: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
    prevBtn: dark ? "#94a3b8" : "#4a5568",
    prevBorder: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
    scrollThumb: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
    takeawayBg: dark ? "rgba(59,154,198,0.07)" : "rgba(59,154,198,0.06)",
  };

  const scrollbar = {
    "&::-webkit-scrollbar": { width: "5px", height: "5px" },
    "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: C.scrollThumb,
      borderRadius: "4px",
    },
  };

  const [selectedLoc, setSelectedLoc] = useState<string>("roadmap");
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    [phases[0]?.id || "phase-1"]: true,
  });
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    [phases[0]?.chapters[0]?.id || "01"]: true,
  });

  const togglePhase = (id: string) =>
    setExpandedPhases((p) => ({ ...p, [id]: !p[id] }));
  const toggleChapter = (id: string) =>
    setExpandedChapters((p) => ({ ...p, [id]: !p[id] }));

  const activeDetails = useMemo(() => {
    if (selectedLoc === "roadmap") return null;
    const [phaseId, chId, subId] = selectedLoc.split(":");
    const phase = phases.find((p) => p.id === phaseId);
    if (!phase) return null;
    const chapter = phase.chapters.find((c) => c.id === chId);
    if (!chapter) return null;
    const subtopic = chapter.subtopics.find((s) => s.id === subId);
    if (!subtopic) return null;
    const subtopicIndex = chapter.subtopics.findIndex((s) => s.id === subId);
    return { phase, chapter, subtopic, subtopicIndex };
  }, [selectedLoc, phases]);

  const flatNav = useMemo(() => {
    const list: {
      type: "roadmap" | "topic";
      locationKey: string;
      label: string;
      phase?: CoursePhase;
      chapter?: CourseChapter;
      subtopic?: CourseSubTopic;
    }[] = [
      { type: "roadmap", locationKey: "roadmap", label: "Roadmap Overview" },
    ];
    phases.forEach((phase) => {
      phase.chapters.forEach((ch) => {
        ch.subtopics.forEach((sub) => {
          list.push({
            type: "topic",
            locationKey: `${phase.id}:${ch.id}:${sub.id}`,
            label: sub.title,
            phase,
            chapter: ch,
            subtopic: sub,
          });
        });
      });
    });
    return list;
  }, [phases]);

  const currentIdx = flatNav.findIndex((i) => i.locationKey === selectedLoc);
  const prevItem = currentIdx > 0 ? flatNav[currentIdx - 1] : null;
  const nextItem = currentIdx < flatNav.length - 1 ? flatNav[currentIdx + 1] : null;

  const navigateTo = (key: string) => {
    setSelectedLoc(key);
    if (key !== "roadmap") {
      const [phaseId, chId] = key.split(":");
      setExpandedPhases((p) => ({ ...p, [phaseId]: true }));
      setExpandedChapters((p) => ({ ...p, [chId]: true }));
      if (isMobile) setSidebarOpen(false);
    }
    if (typeof window !== "undefined") {
      document.getElementById("course-reader-panel")?.scrollTo({ top: 0 });
    }
  };

  const totalChapters = useMemo(
    () => phases.reduce((acc, p) => acc + p.chapters.length, 0),
    [phases]
  );
  const totalLessons = useMemo(
    () =>
      phases.reduce(
        (acc, p) =>
          acc + p.chapters.reduce((cAcc, c) => cAcc + c.subtopics.length, 0),
        0
      ),
    [phases]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        flex: 1,
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── 3-TIER SIDEBAR ── */}
      <Box
        sx={{
          width: { xs: "100%", md: 320 },
          minWidth: { md: 320 },
          maxWidth: { md: 320 },
          borderRight: { md: `1px solid ${C.border}` },
          borderBottom: { xs: `1px solid ${C.border}`, md: "none" },
          backgroundColor: C.sidebarBg,
          overflowY: "auto",
          flexShrink: 0,
          position: { xs: "absolute", md: "relative" },
          top: { xs: 0, md: "auto" },
          left: { xs: 0, md: "auto" },
          height: "100%",
          zIndex: { xs: 10, md: "auto" },
          display: sidebarOpen ? "flex" : "none",
          boxShadow: { xs: "4px 0 16px rgba(0,0,0,0.3)", md: "none" },
          p: 1.5,
          flexDirection: "column",
          gap: 0.25,
          ...scrollbar,
        }}
      >
        {/* Course Title & Progress Header */}
        <Box sx={{ px: 1.5, pt: 1, pb: 1.75, borderBottom: `1px solid ${C.divider}`, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.25 }}>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: dark ? "#ffffff" : "#1a1d21",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              {courseTitle}
            </Typography>
            <Tooltip title="Hide sidebar">
              <IconButton
                size="small"
                onClick={() => setSidebarOpen(false)}
                sx={{
                  color: dark ? "#94a3b8" : "#64748b",
                  p: 0.5,
                  borderRadius: "6px",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: C.hoverBg,
                    color: "primary.main",
                  },
                }}
              >
                <Icon icon="mdi:chevron-left-box-outline" width={19} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: dark ? "#94a3b8" : "#64748b",
              fontFamily: "'Inter', sans-serif",
              mt: 0.35,
              mb: 1.25,
            }}
          >
            0/{totalChapters} completed
          </Typography>
          <Box
            sx={{
              height: 3,
              width: "100%",
              backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              borderRadius: 1.5,
              overflow: "hidden",
            }}
          >
            <Box sx={{ height: "100%", width: "0%", backgroundColor: "primary.main" }} />
          </Box>
        </Box>

        {/* ROADMAP OVERVIEW ITEM */}
        <Box
          onClick={() => navigateTo("roadmap")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.5,
            py: 0.9,
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: selectedLoc === "roadmap" ? C.activeBg : "transparent",
            borderLeft: selectedLoc === "roadmap" ? "3px solid" : "3px solid transparent",
            borderLeftColor: selectedLoc === "roadmap" ? "primary.main" : "transparent",
            transition: "all 0.12s ease",
            "&:hover": {
              backgroundColor: C.hoverBg,
              "& .MuiTypography-root": { color: "primary.main" },
              "& .iconify": { color: "primary.main" },
            },
          }}
        >
          <Icon
            icon="mdi:map-marker-path"
            width={17}
            color={selectedLoc === "roadmap" ? theme.palette.primary.main : dark ? "#94a3b8" : "#64748b"}
          />
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: selectedLoc === "roadmap" ? 700 : 600,
              color: selectedLoc === "roadmap" ? "primary.main" : C.textPrimary,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Roadmap Overview
          </Typography>
        </Box>

        {/* PHASES LIST */}
        {phases.map((phase) => {
          const isPhaseExpanded = expandedPhases[phase.id];
          return (
            <Box key={phase.id} sx={{ mt: 0.75 }}>
              {/* Phase Header Accordion Toggle */}
              <Box
                onClick={() => togglePhase(phase.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor: isPhaseExpanded
                    ? dark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: C.hoverBg,
                    "& .MuiTypography-root": { color: "primary.main" },
                    "& .iconify": { color: "primary.main" },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    color: isPhaseExpanded ? "primary.main" : dark ? "#cbd5e1" : "#475569",
                    letterSpacing: "0.01em",
                  }}
                >
                  {formatPhaseTitle(phase.phaseNum, phase.title)}
                </Typography>
                <Icon
                  icon={isPhaseExpanded ? "mdi:chevron-down" : "mdi:chevron-right"}
                  width={15}
                  color={isPhaseExpanded ? theme.palette.primary.main : dark ? "#64748b" : "#94a3b8"}
                />
              </Box>

              {/* Chapters in this Phase */}
              <Collapse in={isPhaseExpanded} timeout="auto">
                <Box sx={{ pl: 0.75, mt: 0.25, display: "flex", flexDirection: "column", gap: 0.2 }}>
                  {phase.chapters.map((chapter) => {
                    const isChapterExpanded = expandedChapters[chapter.id];
                    const isAnySubSelected = chapter.subtopics.some(
                      (s) => selectedLoc === `${phase.id}:${chapter.id}:${s.id}`
                    );

                    return (
                      <Box key={chapter.id}>
                        {/* Chapter Row */}
                        <Box
                          onClick={() => toggleChapter(chapter.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 1.25,
                            py: 0.7,
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: isAnySubSelected ? C.activeBg : "transparent",
                            borderLeft: isAnySubSelected ? "3px solid" : "3px solid transparent",
                            borderLeftColor: isAnySubSelected ? "primary.main" : "transparent",
                            "&:hover": {
                              backgroundColor: C.hoverBg,
                              "& .MuiTypography-root": { color: "primary.main" },
                              "& .iconify": { color: "primary.main" },
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                fontFamily: "'Fira Code', monospace",
                                fontWeight: 700,
                                color: isAnySubSelected ? "primary.main" : dark ? "#94a3b8" : "#64748b",
                                flexShrink: 0,
                              }}
                            >
                              {chapter.num}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.82rem",
                                fontWeight: isAnySubSelected ? 700 : 500,
                                color: isAnySubSelected ? "primary.main" : C.chapterText,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {chapter.title}
                            </Typography>
                          </Box>
                          <Icon
                            icon={isChapterExpanded ? "mdi:chevron-down" : "mdi:chevron-right"}
                            width={14}
                            color={dark ? "#64748b" : "#94a3b8"}
                          />
                        </Box>

                        {/* Subtopics / Lessons */}
                        <Collapse in={isChapterExpanded} timeout="auto">
                          <Box
                            sx={{
                              pl: 2.25,
                              pr: 0.5,
                              py: 0.25,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.15,
                            }}
                          >
                            {chapter.subtopics.map((subtopic) => {
                              const isSubSelected = selectedLoc === `${phase.id}:${chapter.id}:${subtopic.id}`;
                              return (
                                <Box
                                  key={subtopic.id}
                                  onClick={() => navigateTo(`${phase.id}:${chapter.id}:${subtopic.id}`)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 1,
                                    py: 0.55,
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    backgroundColor: isSubSelected ? C.activeBg : "transparent",
                                    borderLeft: isSubSelected ? "2.5px solid" : "2.5px solid transparent",
                                    borderLeftColor: isSubSelected ? "primary.main" : "transparent",
                                    "&:hover": {
                                      backgroundColor: C.hoverBg,
                                      "& .MuiTypography-root": { color: "primary.main" },
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 4,
                                      height: 4,
                                      borderRadius: "50%",
                                      backgroundColor: isSubSelected ? "primary.main" : dark ? "#4b5563" : "#cbd5e1",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: "0.78rem",
                                      fontWeight: isSubSelected ? 700 : 400,
                                      color: isSubSelected ? "primary.main" : C.subtopicText,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    {subtopic.title}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* ── RIGHT READER PANEL ── */}
      <Box
        id="course-reader-panel"
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100%",
          p: { xs: 1.5, sm: 3 },
          pb: { xs: 8, sm: 5 },
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.card,
          ...scrollbar,
        }}
      >
        {/* When sidebar is hidden: show quick reopen button & current topic indicator */}
        {!sidebarOpen && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              mb: 2,
              pb: 1.25,
              borderBottom: `1px solid ${C.divider}`,
            }}
          >
            <Button
              size="small"
              onClick={() => setSidebarOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.78rem",
                px: 1.5,
                py: 0.45,
                borderRadius: "6px",
                border: `1px solid ${C.border}`,
                color: dark ? "#e2e8f0" : "#334155",
                backgroundColor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                minWidth: 0,
                transition: "all 0.15s ease",
                "&:hover": {
                  backgroundColor: C.hoverBg,
                  color: "primary.main",
                  borderColor: "primary.main",
                },
              }}
              startIcon={<Icon icon="mdi:page-layout-sidebar-left" width={16} />}
            >
              Show Sidebar
            </Button>
            {activeDetails && (
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontFamily: "'Fira Code', monospace",
                  fontWeight: 600,
                  color: "primary.main",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activeDetails.chapter.num} › {activeDetails.subtopic.title}
              </Typography>
            )}
          </Box>
        )}

        {/* ROADMAP VIEW */}
        {selectedLoc === "roadmap" && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: C.textPrimary,
                letterSpacing: "-0.01em",
                mb: 0.4,
              }}
            >
              {courseTitle} Roadmap
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: C.textMuted, mb: 2.5 }}>
              Master {phases.length} foundational and advanced phases across {totalChapters} production-grade chapters and {totalLessons} topics.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              {phases.map((phase) => (
                <Box
                  key={phase.id}
                  sx={{
                    backgroundColor: C.cardSurface,
                    border: `1px solid ${C.border}`,
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontFamily: "'Fira Code', monospace",
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      {phase.phaseNum}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: C.textMuted, fontWeight: 600 }}>
                      {phase.chapters.length} Chapters ·{" "}
                      {phase.chapters.reduce((sum, c) => sum + c.subtopics.length, 0)} Topics
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: C.textPrimary, mb: 0.4 }}>
                    {phase.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: C.textBody, mb: 1.25 }}>
                    {phase.description}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {phase.chapters.map((ch) => (
                      <Box
                        key={ch.id}
                        onClick={() => navigateTo(`${phase.id}:${ch.id}:${ch.subtopics[0].id}`)}
                        sx={{
                          px: 1.2,
                          py: 0.45,
                          borderRadius: "4px",
                          border: `1px solid ${C.pillBorder}`,
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: C.hoverBg,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.74rem",
                            fontFamily: "'Fira Code', monospace",
                            color: C.textBody,
                          }}
                        >
                          {ch.num} {ch.title}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${C.divider}` }}>
              <Button
                variant="contained"
                onClick={() =>
                  navigateTo(
                    `${phases[0]?.id}:${phases[0]?.chapters[0]?.id}:${phases[0]?.chapters[0]?.subtopics[0]?.id}`
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  backgroundColor: "primary.main",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(59,154,198,0.3)",
                  "&:hover": {
                    backgroundColor: "#2e88b2",
                    boxShadow: "0 2px 12px rgba(59,154,198,0.5)",
                  },
                }}
              >
                Start Learning: {phases[0]?.chapters[0]?.num} {phases[0]?.chapters[0]?.title} →
              </Button>
            </Box>
          </Box>
        )}

        {/* LESSON VIEW — ByteByteGo Typography & Layout */}
        {activeDetails && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
              maxWidth: 900,
              mx: "auto",
              width: "100%",
            }}
          >
            {/* Big Green Chapter Number */}
            <Typography
              sx={{
                fontSize: { xs: "2.75rem", sm: "3.25rem", md: "3.5rem" },
                fontWeight: 800,
                color: "#00b875",
                lineHeight: 1,
                mb: 0.5,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {activeDetails.chapter.num}
            </Typography>

            {/* Main Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.15rem", md: "2.35rem" },
                fontWeight: 800,
                color: dark ? "#f9fafb" : "#111827",
                letterSpacing: "-0.025em",
                lineHeight: 1.25,
                mb: 1.5,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {activeDetails.subtopic.title}
            </Typography>

            {/* Metadata Row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#00b875",
                  fontFamily: "'Inter', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {activeDetails.chapter.title}
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: dark ? "#4b5563" : "#cbd5e1" }} />
              <Typography sx={{ fontSize: "0.82rem", color: dark ? "#9ca3af" : "#64748b", fontFamily: "'Inter', sans-serif" }}>
                Topic {activeDetails.subtopicIndex + 1} of {activeDetails.chapter.subtopics.length}
                {activeDetails.subtopic.readTime &&
                  activeDetails.subtopic.readTime !== "—" &&
                  ` · ${activeDetails.subtopic.readTime}`}
              </Typography>
            </Box>

            {/* Lead / Summary */}
            {activeDetails.subtopic.summary && (
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  color: dark ? "#d1d5db" : "#374151",
                  fontWeight: 400,
                  mb: 3.5,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {activeDetails.subtopic.summary}
              </Typography>
            )}

            {/* Content Sections */}
            {activeDetails.subtopic.sections && activeDetails.subtopic.sections.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                {activeDetails.subtopic.sections.map((section, idx) => (
                  <Box key={idx} sx={{ mb: 1 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "1.35rem", sm: "1.55rem" },
                        fontWeight: 700,
                        color: dark ? "#f9fafb" : "#111827",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.3,
                        mt: 2,
                        mb: 1.75,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {section.heading}
                    </Typography>
                    {section.bullets && section.bullets.length > 0 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, pl: 0.5 }}>
                        {section.bullets.map((bullet, bIdx) => (
                          <Box key={bIdx} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                            <Typography
                              sx={{
                                color: "#00b875",
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                lineHeight: 1.6,
                                flexShrink: 0,
                              }}
                            >
                              •
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                color: dark ? "#9ca3af" : "#4b5563",
                                lineHeight: 1.75,
                                fontWeight: 400,
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {bullet}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    {section.code && (
                      <Box
                        component="pre"
                        sx={{
                          m: 0,
                          mt: 2,
                          p: 2,
                          borderRadius: "8px",
                          backgroundColor: dark ? "#16181a" : "#f8fafc",
                          border: `1px solid ${C.border}`,
                          fontFamily: "'Fira Code', monospace",
                          fontSize: "0.85rem",
                          color: dark ? "#38bdf8" : "#0284c7",
                          overflowX: "auto",
                          lineHeight: 1.55,
                        }}
                      >
                        {section.code}
                      </Box>
                    )}
                  </Box>
                ))}

                {activeDetails.subtopic.keyTakeaway && (
                  <Box
                    sx={{
                      backgroundColor: dark ? "rgba(0,184,117,0.08)" : "rgba(0,184,117,0.06)",
                      borderLeft: "4px solid #00b875",
                      borderRadius: "0 8px 8px 0",
                      p: { xs: 2, sm: 2.5 },
                      mt: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        color: "#00b875",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        mb: 0.75,
                      }}
                    >
                      KEY TAKEAWAY
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.98rem",
                        color: dark ? "#f3f4f6" : "#111827",
                        fontWeight: 500,
                        lineHeight: 1.65,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {activeDetails.subtopic.keyTakeaway}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                  px: 3,
                  border: `1px dashed ${C.border}`,
                  borderRadius: "8px",
                  backgroundColor: C.cardSurface,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 400,
                    color: C.textMuted,
                    fontStyle: "italic",
                    textAlign: "center",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Topic: &ldquo;{activeDetails.subtopic.title}&rdquo;
                  <br />
                  Content will be filled later.
                </Typography>
              </Box>
            )}

            {/* Bottom Navigation with slim premium styling */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: 2.5,
                mt: { xs: 4, sm: 5 },
                mb: { xs: 3, sm: 4 },
                borderTop: `1px solid ${C.divider}`,
                gap: 1.5,
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              {prevItem ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigateTo(prevItem.locationKey)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    letterSpacing: "-0.01em",
                    px: 2,
                    py: 0.6,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                    color: dark ? "#cbd5e1" : "#475569",
                    backgroundColor: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    fontFamily: "'Inter', sans-serif",
                    maxWidth: { xs: "100%", sm: "none" },
                    transition: "all 0.15s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      color: "primary.main",
                      backgroundColor: C.hoverBg,
                    },
                  }}
                >
                  ← {prevItem.label}
                </Button>
              ) : (
                <Box />
              )}

              {nextItem && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigateTo(nextItem.locationKey)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.84rem",
                    letterSpacing: "-0.01em",
                    px: 2.25,
                    py: 0.6,
                    borderRadius: "8px",
                    backgroundColor: "#00b875",
                    color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    maxWidth: { xs: "100%", sm: "none" },
                    boxShadow: "0 2px 8px rgba(0, 184, 117, 0.28)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: "#00a368",
                      boxShadow: "0 4px 12px rgba(0, 184, 117, 0.4)",
                    },
                  }}
                >
                  {nextItem.label} →
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
