import { useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
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
import { PageTitle } from "@/components/pageTitle";
import LearnExploreCards from "@/sections/learn/LearnExploreCards";
import {
  CoursePhase,
  CourseChapter,
  CourseSubTopic,
  RoadmapStage,
} from "@/types/learn";
import { loadAllLearnContent } from "@/lib/learnContentLoader";
import PhaseCourseView from "@/sections/learn/PhaseCourseView";
import { useRouter } from "next/router";

interface LearnPageProps {
  backendPhases?: CoursePhase[];
  devopsPhases?: CoursePhase[];
  chessStages?: RoadmapStage[];
  chessChapters?: CourseChapter[];
}

export const getStaticProps: GetStaticProps<LearnPageProps> = async () => {
  const { backendPhases, devopsPhases, chessStages, chessChapters } =
    loadAllLearnContent();

  return {
    props: {
      backendPhases,
      devopsPhases,
      chessStages,
      chessChapters,
    },
  };
};

export default function LearnPage({
  backendPhases = [],
  devopsPhases = [],
  chessStages = [],
  chessChapters = [],
}: LearnPageProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();

  // ── Track selection: "backend", "chess", "devops", or null (All Fields cards view) ──
  const trackQuery = router.query.track as string | undefined;
  const [activeTrack, setActiveTrack] = useState<"backend" | "chess" | "devops" | null>(
    () => {
      if (trackQuery === "chess") return "chess";
      if (trackQuery === "backend") return "backend";
      if (trackQuery === "devops") return "devops";
      return null;
    }
  );

  useEffect(() => {
    if (trackQuery === "chess") setActiveTrack("chess");
    else if (trackQuery === "backend") setActiveTrack("backend");
    else if (trackQuery === "devops") setActiveTrack("devops");
    else if (!trackQuery) setActiveTrack(null);
  }, [trackQuery]);

  const handleTrackChange = (track: "backend" | "chess" | "devops" | null) => {
    setActiveTrack(track);
    if (track) {
      router.replace({ pathname: "/learn", query: { track } }, undefined, {
        shallow: true,
      });
    } else {
      router.replace({ pathname: "/learn" }, undefined, {
        shallow: true,
      });
    }
  };

  // ── Color tokens (matching home page sidebar and Play/Chat theme) ─────
  const C = {
    card:         dark ? "#19191c"                : "#ffffff",
    sidebarBg:    dark ? "#19191c"                : "#ffffff",
    headerBg:     dark ? "#19191c"                : "#ffffff",
    headerText:   dark ? "#ffffff"                : "#1a1d21",
    border:       dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    divider:      dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    textPrimary:  dark ? "#e2e8f0"                : "#1a1d21",
    textBody:     dark ? "#94a3b8"                : "#4a5568",
    textMuted:    dark ? "#94a3b8"                : "#64748b",
    chapterText:  dark ? "#cbd5e1"                : "#334155",
    subtopicText: dark ? "#94a3b8"                : "#64748b",
    cardSurface:  dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    tagBg:        dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    hoverBg:      dark ? "rgba(59,154,198,0.12)"  : "rgba(59,154,198,0.08)",
    activeBg:     dark ? "rgba(59,154,198,0.18)"  : "rgba(59,154,198,0.12)",
    pillBorder:   dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
    prevBtn:      dark ? "#94a3b8"                : "#4a5568",
    prevBorder:   dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
    scrollThumb:  dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
    takeawayBg:   dark ? "rgba(59,154,198,0.07)"  : "rgba(59,154,198,0.06)",
  };

  const scrollbar = {
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: C.scrollThumb,
      borderRadius: "2px",
    },
  };

  // ── Sidebar hide/show toggle ──────────────────────────────────────────
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // ══════════════════════════════════════════════════════════════════════
  // CHESS TRACK STATE & LOGIC
  // ══════════════════════════════════════════════════════════════════════
  const [selectedChessLoc, setSelectedChessLoc] = useState<string>("roadmap");
  const [expandedChessChapters, setExpandedChessChapters] = useState<
    Record<string, boolean>
  >({ "01": true });

  const toggleChessChapter = (id: string) =>
    setExpandedChessChapters((p) => ({ ...p, [id]: !p[id] }));

  const activeChessDetails = useMemo(() => {
    if (selectedChessLoc === "roadmap") return null;
    const [chapterId, subtopicId] = selectedChessLoc.split(":");
    const chapter = chessChapters.find((c) => c.id === chapterId);
    if (!chapter) return null;
    const subtopic = chapter.subtopics.find((s) => s.id === subtopicId);
    if (!subtopic) return null;
    const subtopicIndex = chapter.subtopics.findIndex((s) => s.id === subtopicId);
    return { chapter, subtopic, subtopicIndex };
  }, [selectedChessLoc, chessChapters]);

  const flatChessNav = useMemo(() => {
    const list: {
      type: "roadmap" | "topic";
      locationKey: string;
      label: string;
      chapter?: CourseChapter;
      subtopic?: CourseSubTopic;
    }[] = [
      { type: "roadmap", locationKey: "roadmap", label: "Roadmap Overview" },
    ];
    chessChapters.forEach((ch) =>
      ch.subtopics.forEach((sub) =>
        list.push({
          type: "topic",
          locationKey: `${ch.id}:${sub.id}`,
          label: sub.title,
          chapter: ch,
          subtopic: sub,
        })
      )
    );
    return list;
  }, [chessChapters]);

  const chessCurrentIdx = flatChessNav.findIndex(
    (i) => i.locationKey === selectedChessLoc
  );
  const prevChessItem =
    chessCurrentIdx > 0 ? flatChessNav[chessCurrentIdx - 1] : null;
  const nextChessItem =
    chessCurrentIdx < flatChessNav.length - 1
      ? flatChessNav[chessCurrentIdx + 1]
      : null;

  const navigateToChess = (key: string) => {
    setSelectedChessLoc(key);
    if (key !== "roadmap") {
      const [chId] = key.split(":");
      setExpandedChessChapters((p) => ({ ...p, [chId]: true }));
      // Auto-close sidebar on mobile when a lesson is selected
      if (isMobile) setSidebarOpen(false);
    }
    if (typeof window !== "undefined") {
      document.getElementById("chess-reader-panel")?.scrollTo({ top: 0 });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        "& *:not([class*='Fira'])": {
          fontFamily: `inherit`,
        },
      }}
    >
      <PageTitle
        title={
          activeTrack === "backend"
            ? "ByteMate — Learn Backend Engineering"
            : activeTrack === "chess"
            ? "ByteMate — Learn Chess Basics"
            : "ByteMate — Learn Engineering & Chess"
        }
      />

      {/* ── Full-Page Clean Container (Borderless, Edge-to-Edge) ── */}
      <Box
        sx={{
          backgroundColor: dark ? "#111113" : "#f8fafc",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        {/* ── Sleek Reader Top Bar (Rendered ONLY when inside a course) ── */}
        {activeTrack !== null && (
          <Box
            sx={{
              px: { xs: 1.5, sm: 2.5 },
              py: 0.9,
              backgroundColor: dark ? "#16171a" : "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              gap: 1,
              borderBottom: `1px solid ${C.divider}`,
            }}
          >
            {/* Left: Sidebar toggle + All Fields button + Course Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.25 } }}>
              {/* Sidebar toggle button (accessible on all screen sizes) */}
              <Tooltip title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>
                <IconButton
                  size="small"
                  onClick={() => setSidebarOpen((v) => !v)}
                  sx={{
                    color: sidebarOpen ? (dark ? "#e2e8f0" : "#374151") : "primary.main",
                    p: 0.6,
                    borderRadius: "6px",
                    border: `1px solid ${sidebarOpen ? C.border : "rgba(59, 154, 198, 0.4)"}`,
                    backgroundColor: sidebarOpen
                      ? dark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)"
                      : C.activeBg,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: C.hoverBg,
                      color: "primary.main",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Icon
                    icon={sidebarOpen ? "mdi:page-layout-sidebar-left" : "mdi:dock-left"}
                    width={19}
                  />
                </IconButton>
              </Tooltip>

              {/* "All Fields" Button */}
              <Button
                size="small"
                onClick={() => handleTrackChange(null)}
                startIcon={<Icon icon="mdi:arrow-left" width={16} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  px: 1.25,
                  py: 0.4,
                  borderRadius: "6px",
                  color: dark ? "#d1d5db" : "#374151",
                  border: `1px solid ${C.border}`,
                  backgroundColor: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": {
                    backgroundColor: C.hoverBg,
                    color: "primary.main",
                    borderColor: "primary.main",
                  },
                }}
              >
                All Fields
              </Button>

              <Typography
                component="div"
                sx={{
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  color: dark ? "#ffffff" : "#1a1d21",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                  }}
                />
                {activeTrack === "backend"
                  ? "Backend Engineering"
                  : activeTrack === "devops"
                  ? "DevOps & Cloud Engineering"
                  : "Chess Basics & Strategy"}
              </Typography>
            </Box>

            {/* Right: lesson count */}
            <Typography
              sx={{
                fontSize: "0.76rem",
                fontWeight: 600,
                color: dark ? "#9ca3af" : "#64748b",
                fontFamily: "'Inter', sans-serif",
                display: { xs: "none", sm: "block" },
                whiteSpace: "nowrap",
              }}
            >
              {activeTrack === "backend"
                ? "5 Phases · 31 Chapters · 162 Lessons"
                : activeTrack === "devops"
                ? "10 Phases · 25 Chapters · 200+ Topics"
                : "4 Stages · 14 Chapters · 60 Lessons"}
            </Typography>
          </Box>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ALL FIELDS CARDS VIEW (When activeTrack is null)
        ════════════════════════════════════════════════════════════════ */}
        {activeTrack === null && (
          <LearnExploreCards onSelectTrack={(track) => handleTrackChange(track)} />
        )}

        {/* ════════════════════════════════════════════════════════════════
            TRACK 1: BACKEND ENGINEERING
        ════════════════════════════════════════════════════════════════ */}
        {activeTrack === "backend" && (
          <PhaseCourseView
            courseTitle="Backend Engineering"
            phases={backendPhases}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════
            TRACK 3: DEVOPS & CLOUD ENGINEERING
        ════════════════════════════════════════════════════════════════ */}
        {activeTrack === "devops" && (
          <PhaseCourseView
            courseTitle="DevOps & Cloud Engineering"
            phases={devopsPhases}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════
            TRACK 2: CHESS BASICS (PRESERVED)
        ════════════════════════════════════════════════════════════════ */}
        {activeTrack === "chess" && (
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
            {/* ── CHESS SIDEBAR ── */}
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
                // Hideable on all devices
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
                    Chess Basics & Strategy
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
                  0/14 completed
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
                  <Box
                    sx={{
                      height: "100%",
                      width: "14%",
                      backgroundColor: "primary.main",
                      borderRadius: 1.5,
                    }}
                  />
                </Box>
              </Box>

              {/* ROADMAP Button */}
              <Box
                onClick={() => navigateToChess("roadmap")}
                sx={{
                  px: 1.75,
                  py: 0.95,
                  mb: 0.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  borderLeft: "3px solid",
                  borderColor: selectedChessLoc === "roadmap" ? "primary.main" : "transparent",
                  backgroundColor:
                    selectedChessLoc === "roadmap"
                      ? C.activeBg
                      : "transparent",
                  color:
                    selectedChessLoc === "roadmap"
                      ? "primary.main"
                      : dark
                      ? "#e2e8f0"
                      : "#334155",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: C.hoverBg,
                    color: "primary.main",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.88rem",
                    fontWeight: selectedChessLoc === "roadmap" ? 700 : 500,
                    color: "inherit",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Overview & Roadmap
                </Typography>
                <Icon
                  icon="mdi:chevron-right"
                  width={18}
                  style={{
                    color: selectedChessLoc === "roadmap" ? "inherit" : dark ? "#64748b" : "#94a3b8",
                  }}
                />
              </Box>

              <Box sx={{ height: "1px", backgroundColor: C.divider, mb: 0.5 }} />

              {chessChapters.map((chapter) => {
                const isExpanded = Boolean(expandedChessChapters[chapter.id]);
                const isChActive = selectedChessLoc.startsWith(`${chapter.id}:`);
                return (
                  <Box key={chapter.id} sx={{ mb: 0.5 }}>
                    <Box
                      onClick={() => toggleChessChapter(chapter.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        px: 1.5,
                        py: 0.85,
                        borderRadius: "8px",
                        cursor: "pointer",
                        borderLeft: "3px solid",
                        borderColor: isChActive ? "primary.main" : "transparent",
                        backgroundColor: isChActive ? C.activeBg : "transparent",
                        color: isChActive ? "primary.main" : dark ? "#e2e8f0" : "#334155",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          backgroundColor: C.hoverBg,
                          color: "primary.main",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: isChActive ? "primary.main" : dark ? "#94a3b8" : "#64748b",
                            fontFamily: "'Inter', sans-serif",
                            flexShrink: 0,
                          }}
                        >
                          {chapter.num}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: isChActive ? 700 : 500,
                            color: "inherit",
                            fontFamily: "'Inter', sans-serif",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chapter.title}
                        </Typography>
                      </Box>
                      <Icon
                        icon="mdi:chevron-right"
                        width={16}
                        style={{
                          color: isChActive ? "primary.main" : dark ? "#64748b" : "#94a3b8",
                          transform: isExpanded ? "rotate(90deg)" : "none",
                          transition: "transform 0.15s ease",
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          ml: 1.5,
                          pl: 1,
                          borderLeft: `1px solid ${C.divider}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.2,
                          my: 0.2,
                        }}
                      >
                        {chapter.subtopics.map((sub) => {
                          const key = `${chapter.id}:${sub.id}`;
                          const isActive = selectedChessLoc === key;
                          return (
                            <Box
                              key={sub.id}
                              onClick={() => navigateToChess(key)}
                              sx={{
                                px: 1.25,
                                py: 0.6,
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderLeft: "2px solid",
                                borderColor: isActive ? "primary.main" : "transparent",
                                backgroundColor: isActive
                                  ? C.activeBg
                                  : "transparent",
                                color: isActive
                                  ? "primary.main"
                                  : dark
                                  ? "#94a3b8"
                                  : "#64748b",
                                transition: "all 0.15s ease",
                                "&:hover": {
                                  backgroundColor: C.hoverBg,
                                  color: "primary.main",
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.82rem",
                                  fontWeight: isActive ? 700 : 400,
                                  color: "inherit",
                                  lineHeight: 1.35,
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                {sub.title}
                              </Typography>
                              {isActive && (
                                <Icon
                                  icon="mdi:chevron-right"
                                  width={14}
                                  style={{ color: "inherit", flexShrink: 0 }}
                                />
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Box>

            {/* ── CHESS READER PANEL ── */}
            <Box
              id="chess-reader-panel"
              sx={{
                flex: 1,
                overflowY: "auto",
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
                  {activeChessDetails && (
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
                      {activeChessDetails.chapter.num} › {activeChessDetails.subtopic.title}
                    </Typography>
                  )}
                </Box>
              )}

              {/* CHESS ROADMAP VIEW */}
              {selectedChessLoc === "roadmap" && (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: C.textPrimary,
                      letterSpacing: "-0.01em",
                      mb: 0.4,
                    }}
                  >
                    Chess Mastery Roadmap
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: C.textMuted, mb: 2.5 }}
                  >
                    14 chapters from absolute beginner to tournament-ready player.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      flex: 1,
                    }}
                  >
                    {chessStages.map((stage) => (
                      <Box
                        key={stage.stageNum}
                        sx={{
                          backgroundColor: C.cardSurface,
                          border: `1px solid ${C.border}`,
                          borderRadius: "8px",
                          p: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.6,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontFamily: "'Fira Code', monospace",
                              fontWeight: 700,
                              color: "primary.main",
                            }}
                          >
                            {stage.stageNum}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              color: C.textMuted,
                              fontWeight: 600,
                            }}
                          >
                            {stage.chapterIds.length} chapters
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: C.textPrimary,
                            mb: 0.4,
                          }}
                        >
                          {stage.stageTitle}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            color: C.textBody,
                            mb: 1.25,
                          }}
                        >
                          {stage.description}
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
                        >
                          {stage.chapterIds.map((chId) => {
                            const chObj = chessChapters.find(
                              (c) => c.id === chId
                            );
                            if (!chObj) return null;
                            return (
                              <Box
                                key={chId}
                                onClick={() =>
                                  navigateToChess(
                                    `${chObj.id}:${chObj.subtopics[0].id}`
                                  )
                                }
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
                                    fontSize: "0.72rem",
                                    fontFamily: "'Fira Code', monospace",
                                    color: C.textBody,
                                  }}
                                >
                                  {chObj.num} {chObj.title}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      mt: 2.5,
                      pt: 2,
                      borderTop: `1px solid ${C.divider}`,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigateToChess("01:board-coordinates")}
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
                      Start Learning: 01 Chess Basics →
                    </Button>
                  </Box>
                </Box>
              )}

              {/* CHESS LESSON VIEW — ByteByteGo Typography & Layout */}
              {activeChessDetails && (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100%", maxWidth: 900, mx: "auto", width: "100%" }}>
                  {/* Big Green Chapter Number from ByteByteGo */}
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
                    {activeChessDetails.chapter.num}
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
                    {activeChessDetails.subtopic.title}
                  </Typography>

                  {/* Metadata Row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 3,
                      flexWrap: "wrap",
                    }}
                  >
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
                      {activeChessDetails.chapter.title}
                    </Typography>
                    <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: dark ? "#4b5563" : "#cbd5e1" }} />
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        color: dark ? "#9ca3af" : "#64748b",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Lesson {activeChessDetails.subtopicIndex + 1} of {activeChessDetails.chapter.subtopics.length}
                      {activeChessDetails.subtopic.readTime &&
                        activeChessDetails.subtopic.readTime !== "—" &&
                        ` · ${activeChessDetails.subtopic.readTime}`}
                    </Typography>
                  </Box>

                  {/* Lead / Summary Paragraph */}
                  {activeChessDetails.subtopic.summary && (
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
                      {activeChessDetails.subtopic.summary}
                    </Typography>
                  )}

                  {/* Content area: Render lesson sections */}
                  {activeChessDetails.subtopic.sections &&
                  activeChessDetails.subtopic.sections.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        flex: 1,
                      }}
                    >
                      {activeChessDetails.subtopic.sections.map((section, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          {/* Section Heading */}
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
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.25,
                                pl: 0.5,
                              }}
                            >
                              {section.bullets.map((bullet, bIdx) => (
                                <Box
                                  key={bIdx}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.25,
                                  }}
                                >
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
                        </Box>
                      ))}

                      {activeChessDetails.subtopic.keyTakeaway && (
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
                            {activeChessDetails.subtopic.keyTakeaway}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : null}

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
                    {prevChessItem ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigateToChess(prevChessItem.locationKey)
                        }
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
                        ← {prevChessItem.label}
                      </Button>
                    ) : (
                      <Box />
                    )}

                    {nextChessItem && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigateToChess(nextChessItem.locationKey)
                        }
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
                          boxShadow: "0 2px 8px rgba(0, 184, 117, 0.28)",
                          maxWidth: { xs: "100%", sm: "none" },
                          transition: "all 0.15s ease",
                          "&:hover": {
                            backgroundColor: "#00a368",
                            boxShadow: "0 4px 14px rgba(0, 184, 117, 0.4)",
                          },
                        }}
                      >
                        {nextChessItem.label} →
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
