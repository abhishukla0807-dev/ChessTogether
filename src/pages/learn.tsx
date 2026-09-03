import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { PageTitle } from "@/components/pageTitle";
import {
  CHESS_CHAPTERS,
  CHESS_ROADMAP_STAGES,
  Chapter as ChessChapter,
  SubTopic as ChessSubTopic,
} from "@/data/learnChessData";
import {
  BACKEND_PHASES,
  BackendChapter,
  BackendPhase,
  BackendSubTopic,
} from "@/data/learnBackendData";
import { useRouter } from "next/router";

export default function LearnPage() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();

  // ── Track selection: "backend" (default) or "chess" ──────────────────
  const trackQuery = router.query.track as string | undefined;
  const [activeTrack, setActiveTrack] = useState<"backend" | "chess">(
    trackQuery === "chess" ? "chess" : "backend"
  );

  const handleTrackChange = (track: "backend" | "chess") => {
    setActiveTrack(track);
    router.replace({ pathname: "/learn", query: { track } }, undefined, {
      shallow: true,
    });
  };

  // ── Color tokens (consistent with Play/Chat design) ───────────────────
  const C = {
    card:         dark ? "#19191c"                : "#ffffff",
    sidebarBg:    dark ? "#111113"                : "#f8fafc",
    headerBg:     "#cdd6e0",
    headerText:   "#1a1d21",
    border:       dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)",
    divider:      dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
    textPrimary:  dark ? "#e8eaed"                : "#1a1d21",
    textBody:     dark ? "#a0aec0"                : "#4a5568",
    textMuted:    dark ? "#8b949e"                : "#6b7280",
    chapterText:  dark ? "#8b949e"                : "#374151",
    subtopicText: dark ? "#8b949e"                : "#6b7280",
    cardSurface:  dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    tagBg:        dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    hoverBg:      dark ? "rgba(59,154,198,0.07)"  : "rgba(59,154,198,0.06)",
    activeBg:     dark ? "rgba(59,154,198,0.12)"  : "rgba(59,154,198,0.10)",
    pillBorder:   dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
    prevBtn:      dark ? "#8b949e"                : "#4a5568",
    prevBorder:   dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
    scrollThumb:  dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.15)",
    takeawayBg:   dark ? "rgba(59,154,198,0.07)"  : "rgba(59,154,198,0.06)",
  };

  const scrollbar = {
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: C.scrollThumb,
      borderRadius: "2px",
    },
  };

  // ── Mobile sidebar toggle ─────────────────────────────────────────────
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  // ══════════════════════════════════════════════════════════════════════
  // BACKEND TRACK STATE & LOGIC
  // ══════════════════════════════════════════════════════════════════════
  const [selectedBackendLoc, setSelectedBackendLoc] = useState<string>("roadmap");
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    "phase-1": true,
  });
  const [expandedBackendChapters, setExpandedBackendChapters] = useState<
    Record<string, boolean>
  >({ "01": true });

  const togglePhase = (phaseId: string) =>
    setExpandedPhases((p) => ({ ...p, [phaseId]: !p[phaseId] }));

  const toggleBackendChapter = (chId: string) =>
    setExpandedBackendChapters((p) => ({ ...p, [chId]: !p[chId] }));

  const activeBackendDetails = useMemo(() => {
    if (selectedBackendLoc === "roadmap") return null;
    const [phaseId, chId, subId] = selectedBackendLoc.split(":");
    const phase = BACKEND_PHASES.find((p) => p.id === phaseId);
    if (!phase) return null;
    const chapter = phase.chapters.find((c) => c.id === chId);
    if (!chapter) return null;
    const subtopic = chapter.subtopics.find((s) => s.id === subId);
    if (!subtopic) return null;
    const subtopicIndex = chapter.subtopics.findIndex((s) => s.id === subId);
    return { phase, chapter, subtopic, subtopicIndex };
  }, [selectedBackendLoc]);

  const flatBackendNav = useMemo(() => {
    const list: {
      type: "roadmap" | "topic";
      locationKey: string;
      label: string;
      phase?: BackendPhase;
      chapter?: BackendChapter;
      subtopic?: BackendSubTopic;
    }[] = [
      { type: "roadmap", locationKey: "roadmap", label: "Roadmap Overview" },
    ];
    BACKEND_PHASES.forEach((phase) => {
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
  }, []);

  const backendCurrentIdx = flatBackendNav.findIndex(
    (i) => i.locationKey === selectedBackendLoc
  );
  const prevBackendItem =
    backendCurrentIdx > 0 ? flatBackendNav[backendCurrentIdx - 1] : null;
  const nextBackendItem =
    backendCurrentIdx < flatBackendNav.length - 1
      ? flatBackendNav[backendCurrentIdx + 1]
      : null;

  const navigateToBackend = (key: string) => {
    setSelectedBackendLoc(key);
    if (key !== "roadmap") {
      const [phaseId, chId] = key.split(":");
      setExpandedPhases((p) => ({ ...p, [phaseId]: true }));
      setExpandedBackendChapters((p) => ({ ...p, [chId]: true }));
      // Auto-close sidebar on mobile when a lesson is selected
      if (isMobile) setMobileSidebarOpen(false);
    }
    if (typeof window !== "undefined") {
      document.getElementById("backend-reader-panel")?.scrollTo({ top: 0 });
    }
  };

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
    const chapter = CHESS_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return null;
    const subtopic = chapter.subtopics.find((s) => s.id === subtopicId);
    if (!subtopic) return null;
    const subtopicIndex = chapter.subtopics.findIndex((s) => s.id === subtopicId);
    return { chapter, subtopic, subtopicIndex };
  }, [selectedChessLoc]);

  const flatChessNav = useMemo(() => {
    const list: {
      type: "roadmap" | "topic";
      locationKey: string;
      label: string;
      chapter?: ChessChapter;
      subtopic?: ChessSubTopic;
    }[] = [
      { type: "roadmap", locationKey: "roadmap", label: "Roadmap Overview" },
    ];
    CHESS_CHAPTERS.forEach((ch) =>
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
  }, []);

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
      if (isMobile) setMobileSidebarOpen(false);
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
        fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
        "& *:not([class*='Fira'])": {
          fontFamily: `inherit`,
        },
      }}
    >
      <PageTitle
        title={
          activeTrack === "backend"
            ? "ByteMate — Learn Backend Engineering"
            : "ByteMate — Learn Chess"
        }
      />

      {/* ── Outer Card (Locked 100% Full Screen Size) ── */}
      <Box
        sx={{
          backgroundColor: C.card,
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          boxShadow: dark
            ? "0 4px 20px rgba(0,0,0,0.6)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        {/* ── Top Header Bar with Track Switcher ── */}
        <Box
          sx={{
            px: 2,
            py: 1.2,
            backgroundColor: C.headerBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            gap: 1,
          }}
        >
          {/* Left: Mobile sidebar toggle + Track tabs */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* Sidebar toggle — mobile only */}
            <IconButton
              size="small"
              onClick={() => setMobileSidebarOpen((v) => !v)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: "#2d3748",
                mr: 0.5,
                p: 0.5,
                borderRadius: "6px",
                backgroundColor: mobileSidebarOpen
                  ? "rgba(0,0,0,0.10)"
                  : "transparent",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.10)" },
              }}
            >
              <Icon icon={mobileSidebarOpen ? "mdi:menu-open" : "mdi:menu"} width={20} />
            </IconButton>

            <Button
              size="small"
              onClick={() => handleTrackChange("backend")}
              sx={{
                textTransform: "none",
                fontWeight: activeTrack === "backend" ? 800 : 600,
                fontSize: { xs: "0.78rem", sm: "0.85rem" },
                px: { xs: 1, sm: 1.5 },
                py: 0.4,
                borderRadius: "6px",
                backgroundColor:
                  activeTrack === "backend" ? "#19191c" : "transparent",
                color: activeTrack === "backend" ? "#ffffff" : "#2d3748",
                "&:hover": {
                  backgroundColor:
                    activeTrack === "backend" ? "#19191c" : "rgba(0,0,0,0.08)",
                },
              }}
            >
              {isMobile ? "Backend" : "Backend Engineering"}
            </Button>

            <Button
              size="small"
              onClick={() => handleTrackChange("chess")}
              sx={{
                textTransform: "none",
                fontWeight: activeTrack === "chess" ? 800 : 600,
                fontSize: { xs: "0.78rem", sm: "0.85rem" },
                px: { xs: 1, sm: 1.5 },
                py: 0.4,
                borderRadius: "6px",
                backgroundColor:
                  activeTrack === "chess" ? "#19191c" : "transparent",
                color: activeTrack === "chess" ? "#ffffff" : "#2d3748",
                "&:hover": {
                  backgroundColor:
                    activeTrack === "chess" ? "#19191c" : "rgba(0,0,0,0.08)",
                },
              }}
            >
              Chess Basics
            </Button>
          </Box>

          {/* Right: lesson count — hidden on very small screens */}
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#4a5568",
              fontFamily: "'Fira Code', monospace",
              display: { xs: "none", sm: "block" },
              whiteSpace: "nowrap",
            }}
          >
            {activeTrack === "backend"
              ? "5 Phases · 31 Chapters · 162 Lessons"
              : "14 Chapters · 60 Lessons"}
          </Typography>
        </Box>

        {/* ════════════════════════════════════════════════════════════════
            TRACK 1: BACKEND ENGINEERING
        ════════════════════════════════════════════════════════════════ */}
        {activeTrack === "backend" && (
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
            {/* ── BACKEND 3-TIER SIDEBAR ── */}
            <Box
              sx={{
                // Desktop: fixed sidebar column
                // Mobile: absolute overlay when open, hidden when closed
                width: { xs: "100%", md: 320 },
                minWidth: { md: 320 },
                maxWidth: { md: 320 },
                borderRight: { md: `1px solid ${C.border}` },
                borderBottom: { xs: `1px solid ${C.border}`, md: "none" },
                backgroundColor: C.sidebarBg,
                overflowY: "auto",
                flexShrink: 0,
                // Mobile: full height overlay
                position: { xs: "absolute", md: "relative" },
                top: { xs: 0, md: "auto" },
                left: { xs: 0, md: "auto" },
                height: "100%",
                zIndex: { xs: 10, md: "auto" },
                // Show/hide on mobile
                display: { md: "flex" },
                ...(isMobile
                  ? {
                      display: mobileSidebarOpen ? "flex" : "none",
                    }
                  : {}),
                boxShadow: { xs: "4px 0 16px rgba(0,0,0,0.3)", md: "none" },
                p: 1.5,
                flexDirection: "column",
                gap: 0.25,
                ...scrollbar,
              }}
            >
              {/* ROADMAP Button */}
              <Box
                onClick={() => navigateToBackend("roadmap")}
                sx={{
                  px: 1.75,
                  py: 1,
                  mb: 0.5,
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor:
                    selectedBackendLoc === "roadmap"
                      ? "primary.main"
                      : C.border,
                  backgroundColor:
                    selectedBackendLoc === "roadmap" ? C.activeBg : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: C.hoverBg },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    color:
                      selectedBackendLoc === "roadmap"
                        ? "primary.main"
                        : C.textMuted,
                  }}
                >
                  ROADMAP
                </Typography>
                {selectedBackendLoc === "roadmap" && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                    }}
                  />
                )}
              </Box>

              <Box sx={{ height: "1px", backgroundColor: C.divider, mb: 0.5 }} />

              {/* 3-LEVEL ACCORDION: Phase ➔ Chapter ➔ Subtopics */}
              {BACKEND_PHASES.map((phase) => {
                const isPhaseExpanded = Boolean(expandedPhases[phase.id]);
                const isPhaseActive = selectedBackendLoc.startsWith(`${phase.id}:`);

                return (
                  <Box key={phase.id} sx={{ mb: 0.5 }}>
                    {/* LEVEL 1: Phase Header (Reduced weight, no emoji symbol) */}
                    <Box
                      onClick={() => togglePhase(phase.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        px: 1,
                        py: 0.65,
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: isPhaseActive
                          ? "rgba(59, 154, 198, 0.05)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: dark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          fontWeight: isPhaseActive ? 700 : 600,
                          color: isPhaseActive ? "primary.main" : C.textPrimary,
                          letterSpacing: "0.01em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {phase.phaseNum} · {phase.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: C.textMuted,
                          fontFamily: "'Fira Code', monospace",
                          flexShrink: 0,
                          ml: 0.5,
                        }}
                      >
                        {isPhaseExpanded ? "[-]" : "[+]"}
                      </Typography>
                    </Box>

                    {/* LEVEL 2 & 3: Chapters and Subtopics */}
                    <Collapse in={isPhaseExpanded} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          ml: 1.5,
                          pl: 1,
                          borderLeft: `1px solid ${C.divider}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.15,
                          mt: 0.3,
                        }}
                      >
                        {phase.chapters.map((chapter) => {
                          const isChExpanded = Boolean(
                            expandedBackendChapters[chapter.id]
                          );
                          const isChActive = selectedBackendLoc.includes(
                            `:${chapter.id}:`
                          );

                          return (
                            <Box key={chapter.id}>
                              {/* Chapter Header (No emoji symbol, clean like Chess) */}
                              <Box
                                onClick={() => toggleBackendChapter(chapter.id)}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                  px: 1,
                                  py: 0.6,
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: dark
                                      ? "rgba(255,255,255,0.03)"
                                      : "rgba(0,0,0,0.02)",
                                  },
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: isChActive ? 700 : 600,
                                    color: isChActive
                                      ? C.textPrimary
                                      : C.chapterText,
                                    fontFamily: "'Fira Code', monospace",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {chapter.num}&nbsp;&nbsp;{chapter.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    color: C.textMuted,
                                    fontFamily: "'Fira Code', monospace",
                                    flexShrink: 0,
                                    ml: 0.5,
                                  }}
                                >
                                  {isChExpanded ? "[-]" : "[+]"}
                                </Typography>
                              </Box>

                              {/* LEVEL 3: Subtopics / Lessons */}
                              <Collapse
                                in={isChExpanded}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box
                                  sx={{
                                    ml: 1.8,
                                    pl: 1.2,
                                    borderLeft: `1px solid ${C.divider}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.1,
                                    my: 0.2,
                                  }}
                                >
                                  {chapter.subtopics.map((sub) => {
                                    const key = `${phase.id}:${chapter.id}:${sub.id}`;
                                    const isActive = selectedBackendLoc === key;
                                    return (
                                      <Box
                                        key={sub.id}
                                        onClick={() => navigateToBackend(key)}
                                        sx={{
                                          px: 0.8,
                                          py: 0.5,
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          backgroundColor: isActive
                                            ? C.activeBg
                                            : "transparent",
                                          "&:hover": {
                                            backgroundColor: C.hoverBg,
                                          },
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "0.76rem",
                                            fontWeight: isActive ? 700 : 400,
                                            color: isActive
                                              ? "primary.main"
                                              : C.subtopicText,
                                            lineHeight: 1.3,
                                          }}
                                        >
                                          {sub.title}
                                        </Typography>
                                        {isActive && (
                                          <Box
                                            sx={{
                                              width: 5,
                                              height: 5,
                                              borderRadius: "50%",
                                              backgroundColor: "primary.main",
                                              flexShrink: 0,
                                              ml: 0.5,
                                            }}
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
                    </Collapse>
                  </Box>
                );
              })}
            </Box>

            {/* ── BACKEND RIGHT READER PANEL ── */}
            <Box
              id="backend-reader-panel"
              sx={{
                flex: 1,
                overflowY: "auto",
                height: "100%",
                // On mobile, when sidebar is open it overlays — content stays underneath
                p: { xs: 1.5, sm: 3 },
                pb: { xs: 8, sm: 3 },
                display: "flex",
                flexDirection: "column",
                backgroundColor: C.card,
                ...scrollbar,
              }}
            >
              {/* Mobile: show current lesson breadcrumb + "back to topics" button when sidebar hidden */}
              {isMobile && !mobileSidebarOpen && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                    pb: 1,
                    borderBottom: `1px solid ${C.divider}`,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => setMobileSidebarOpen(true)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: "6px",
                      border: `1px solid ${C.border}`,
                      color: C.textMuted,
                      backgroundColor: "transparent",
                      minWidth: 0,
                      "&:hover": { backgroundColor: C.hoverBg },
                    }}
                    startIcon={<Icon icon="mdi:arrow-left" width={14} />}
                  >
                    Topics
                  </Button>
                  {activeBackendDetails && (
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontFamily: "'Fira Code', monospace",
                        fontWeight: 700,
                        color: "primary.main",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {activeBackendDetails.chapter.num} › {activeBackendDetails.subtopic.title}
                    </Typography>
                  )}
                </Box>
              )}

              {/* BACKEND ROADMAP VIEW */}
              {selectedBackendLoc === "roadmap" && (
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
                    Backend Engineering Mastery Roadmap
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: C.textMuted, mb: 2.5 }}
                  >
                    Master 5 foundational and advanced phases across 31 production-grade chapters.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      flex: 1,
                    }}
                  >
                    {BACKEND_PHASES.map((phase) => (
                      <Box
                        key={phase.id}
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
                            {phase.phaseNum}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              color: C.textMuted,
                              fontWeight: 600,
                            }}
                          >
                            {phase.chapters.length} Chapters ·{" "}
                            {phase.chapters.reduce(
                              (sum, c) => sum + c.subtopics.length,
                              0
                            )}{" "}
                            Lessons
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
                          {phase.title}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.78rem", color: C.textBody, mb: 1.25 }}
                        >
                          {phase.description}
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                          {phase.chapters.map((ch) => (
                            <Box
                              key={ch.id}
                              onClick={() =>
                                navigateToBackend(
                                  `${phase.id}:${ch.id}:${ch.subtopics[0].id}`
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
                                {ch.num} {ch.title}
                              </Typography>
                            </Box>
                          ))}
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
                      onClick={() =>
                        navigateToBackend(
                          "phase-1:01:client-and-server"
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
                      Start Learning: 01 Backend Systems →
                    </Button>
                  </Box>
                </Box>
              )}

              {/* BACKEND LESSON VIEW (Empty Canvas as requested) */}
              {activeBackendDetails && (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Breadcrumb */}
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontFamily: "'Fira Code', monospace",
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 0.5,
                    }}
                  >
                    {activeBackendDetails.chapter.num}{" "}
                    {activeBackendDetails.chapter.title.toUpperCase()} ›{" "}
                    {activeBackendDetails.subtopic.title.toUpperCase()}
                  </Typography>

                  {/* Title and metadata */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.05rem", sm: "1.2rem" },
                        fontWeight: 800,
                        color: C.textPrimary,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {activeBackendDetails.subtopic.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontFamily: "'Fira Code', monospace",
                        color: C.textMuted,
                        backgroundColor: C.tagBg,
                        border: `1px solid ${C.border}`,
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Lesson {activeBackendDetails.subtopicIndex + 1} /{" "}
                      {activeBackendDetails.chapter.subtopics.length}
                      {activeBackendDetails.subtopic.readTime &&
                        activeBackendDetails.subtopic.readTime !== "—" &&
                        ` · ${activeBackendDetails.subtopic.readTime}`}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: C.divider,
                      mb: 2.5,
                    }}
                  />

                  {/* Content area: Render lesson sections if present, else show empty placeholder */}
                  {activeBackendDetails.subtopic.sections &&
                  activeBackendDetails.subtopic.sections.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                        flex: 1,
                      }}
                    >
                      {activeBackendDetails.subtopic.sections.map((section, idx) => (
                        <Box key={idx}>
                          <Typography
                            sx={{
                              fontSize: "0.88rem",
                              fontWeight: 700,
                              color: C.textPrimary,
                              mb: 1,
                            }}
                          >
                            {section.heading}
                          </Typography>
                          {section.bullets && section.bullets.length > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.9,
                                pl: 0.5,
                              }}
                            >
                              {section.bullets.map((bullet, bIdx) => (
                                <Box
                                  key={bIdx}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: "primary.main",
                                      fontSize: "0.8rem",
                                      fontWeight: 800,
                                      lineHeight: 1.6,
                                      flexShrink: 0,
                                    }}
                                  >
                                    •
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.85rem",
                                      color: C.textBody,
                                      lineHeight: 1.6,
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
                                mt: 1.2,
                                p: 1.5,
                                borderRadius: "6px",
                                backgroundColor: dark ? "#111113" : "#f8fafc",
                                border: `1px solid ${C.border}`,
                                fontFamily: "'Fira Code', monospace",
                                fontSize: "0.8rem",
                                color: dark ? "#38bdf8" : "#0284c7",
                                overflowX: "auto",
                                lineHeight: 1.5,
                              }}
                            >
                              {section.code}
                            </Box>
                          )}
                        </Box>
                      ))}

                      {activeBackendDetails.subtopic.keyTakeaway && (
                        <Box
                          sx={{
                            backgroundColor: C.takeawayBg,
                            borderLeft: "3px solid",
                            borderColor: "primary.main",
                            borderRadius: "0 6px 6px 0",
                            p: 1.75,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.68rem",
                              fontFamily: "'Fira Code', monospace",
                              fontWeight: 700,
                              color: "primary.main",
                              mb: 0.5,
                              letterSpacing: "0.06em",
                            }}
                          >
                            KEY TAKEAWAY
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.83rem",
                              color: C.textPrimary,
                              fontWeight: 500,
                              lineHeight: 1.55,
                            }}
                          >
                            {activeBackendDetails.subtopic.keyTakeaway}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    /* Content area: Empty placeholder ready for user to fill */
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
                          fontSize: "0.85rem",
                          fontWeight: 400,
                          color: C.textMuted,
                          fontStyle: "italic",
                          textAlign: "center",
                        }}
                      >
                        Topic: &ldquo;{activeBackendDetails.subtopic.title}&rdquo;
                        <br />
                        Content will be filled later.
                      </Typography>
                    </Box>
                  )}

                  {/* Bottom Navigation */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pt: 2.5,
                      mt: { xs: 2.5, sm: 3 },
                      mb: { xs: 2, sm: 0 },
                      borderTop: `1px solid ${C.divider}`,
                      gap: 1,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                    }}
                  >
                    {prevBackendItem ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigateToBackend(prevBackendItem.locationKey)
                        }
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                          px: { xs: 1.5, sm: 2 },
                          py: 0.8,
                          borderRadius: "8px",
                          borderColor: C.prevBorder,
                          color: C.prevBtn,
                          maxWidth: { xs: "48%", sm: "none" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: C.hoverBg,
                            color: C.textPrimary,
                          },
                        }}
                      >
                        ← {prevBackendItem.label}
                      </Button>
                    ) : (
                      <Box />
                    )}

                    {nextBackendItem && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigateToBackend(nextBackendItem.locationKey)
                        }
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                          px: { xs: 2, sm: 2.5 },
                          py: 0.8,
                          borderRadius: "8px",
                          backgroundColor: "primary.main",
                          color: "#fff",
                          maxWidth: { xs: "48%", sm: "none" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 8px rgba(59,154,198,0.3)",
                          "&:hover": {
                            backgroundColor: "#2e88b2",
                            boxShadow: "0 2px 12px rgba(59,154,198,0.5)",
                          },
                        }}
                      >
                        {nextBackendItem.label} →
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
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
                display: { md: "flex" },
                ...(isMobile
                  ? {
                      display: mobileSidebarOpen ? "flex" : "none",
                    }
                  : {}),
                boxShadow: { xs: "4px 0 16px rgba(0,0,0,0.3)", md: "none" },
                p: 1.5,
                flexDirection: "column",
                gap: 0.25,
                ...scrollbar,
              }}
            >
              {/* ROADMAP */}
              <Box
                onClick={() => navigateToChess("roadmap")}
                sx={{
                  px: 1.75,
                  py: 1,
                  mb: 0.5,
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor:
                    selectedChessLoc === "roadmap" ? "primary.main" : C.border,
                  backgroundColor:
                    selectedChessLoc === "roadmap" ? C.activeBg : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": { backgroundColor: C.hoverBg },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    color:
                      selectedChessLoc === "roadmap"
                        ? "primary.main"
                        : C.textMuted,
                  }}
                >
                  ROADMAP
                </Typography>
                {selectedChessLoc === "roadmap" && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                    }}
                  />
                )}
              </Box>

              <Box sx={{ height: "1px", backgroundColor: C.divider, mb: 0.5 }} />

              {CHESS_CHAPTERS.map((chapter) => {
                const isExpanded = Boolean(expandedChessChapters[chapter.id]);
                const isChActive = selectedChessLoc.startsWith(`${chapter.id}:`);
                return (
                  <Box key={chapter.id}>
                    <Box
                      onClick={() => toggleChessChapter(chapter.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        px: 1.25,
                        py: 0.8,
                        borderRadius: "6px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: dark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: isChActive ? 700 : 600,
                          color: isChActive ? C.textPrimary : C.chapterText,
                          fontFamily: "'Fira Code', monospace",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chapter.num}&nbsp;&nbsp;{chapter.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: C.textMuted,
                          fontFamily: "'Fira Code', monospace",
                          flexShrink: 0,
                          ml: 0.5,
                        }}
                      >
                        {isExpanded ? "[-]" : "[+]"}
                      </Typography>
                    </Box>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          ml: 2,
                          pl: 1.5,
                          borderLeft: `1px solid ${C.divider}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.1,
                          mb: 0.5,
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
                                px: 1,
                                py: 0.55,
                                borderRadius: "4px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: isActive
                                  ? C.activeBg
                                  : "transparent",
                                "&:hover": { backgroundColor: C.hoverBg },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.76rem",
                                  fontWeight: isActive ? 700 : 400,
                                  color: isActive
                                    ? "primary.main"
                                    : C.subtopicText,
                                  lineHeight: 1.3,
                                }}
                              >
                                {sub.title}
                              </Typography>
                              {isActive && (
                                <Box
                                  sx={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    backgroundColor: "primary.main",
                                    flexShrink: 0,
                                    ml: 0.5,
                                  }}
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
                pb: { xs: 8, sm: 3 },
                display: "flex",
                flexDirection: "column",
                backgroundColor: C.card,
                ...scrollbar,
              }}
            >
              {/* Mobile: back button when sidebar hidden */}
              {isMobile && !mobileSidebarOpen && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                    pb: 1,
                    borderBottom: `1px solid ${C.divider}`,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => setMobileSidebarOpen(true)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: "6px",
                      border: `1px solid ${C.border}`,
                      color: C.textMuted,
                      backgroundColor: "transparent",
                      minWidth: 0,
                      "&:hover": { backgroundColor: C.hoverBg },
                    }}
                    startIcon={<Icon icon="mdi:arrow-left" width={14} />}
                  >
                    Topics
                  </Button>
                  {activeChessDetails && (
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontFamily: "'Fira Code', monospace",
                        fontWeight: 700,
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
                    {CHESS_ROADMAP_STAGES.map((stage) => (
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
                            const chObj = CHESS_CHAPTERS.find(
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

              {/* CHESS LESSON VIEW */}
              {activeChessDetails && (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontFamily: "'Fira Code', monospace",
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 0.5,
                    }}
                  >
                    {activeChessDetails.chapter.num}{" "}
                    {activeChessDetails.chapter.title.toUpperCase()} ›{" "}
                    {activeChessDetails.subtopic.title.toUpperCase()}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.05rem", sm: "1.2rem" },
                        fontWeight: 800,
                        color: C.textPrimary,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {activeChessDetails.subtopic.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontFamily: "'Fira Code', monospace",
                        color: C.textMuted,
                        backgroundColor: C.tagBg,
                        border: `1px solid ${C.border}`,
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Lesson {activeChessDetails.subtopicIndex + 1} /{" "}
                      {activeChessDetails.chapter.subtopics.length} ·{" "}
                      {activeChessDetails.subtopic.readTime}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: C.divider,
                      mb: 2.5,
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                      flex: 1,
                    }}
                  >
                    {activeChessDetails.subtopic.sections.map((section, idx) => (
                      <Box key={idx}>
                        <Typography
                          sx={{
                            fontSize: "0.88rem",
                            fontWeight: 700,
                            color: C.textPrimary,
                            mb: 1,
                          }}
                        >
                          {section.heading}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.9,
                            pl: 0.5,
                          }}
                        >
                          {section.bullets.map((bullet, bIdx) => (
                            <Box
                              key={bIdx}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "primary.main",
                                  fontSize: "0.8rem",
                                  fontWeight: 800,
                                  lineHeight: 1.6,
                                  flexShrink: 0,
                                }}
                              >
                                •
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.85rem",
                                  color: C.textBody,
                                  lineHeight: 1.6,
                                }}
                              >
                                {bullet}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ))}

                    <Box
                      sx={{
                        backgroundColor: C.takeawayBg,
                        borderLeft: "3px solid",
                        borderColor: "primary.main",
                        borderRadius: "0 6px 6px 0",
                        p: 1.75,
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.68rem",
                          fontFamily: "'Fira Code', monospace",
                          fontWeight: 700,
                          color: "primary.main",
                          mb: 0.5,
                          letterSpacing: "0.06em",
                        }}
                      >
                        KEY TAKEAWAY
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.83rem",
                          color: C.textPrimary,
                          fontWeight: 500,
                          lineHeight: 1.55,
                        }}
                      >
                        {activeChessDetails.subtopic.keyTakeaway}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bottom Navigation */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pt: 2.5,
                      mt: { xs: 2.5, sm: 3 },
                      mb: { xs: 2, sm: 0 },
                      borderTop: `1px solid ${C.divider}`,
                      gap: 1,
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
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                          px: { xs: 1.5, sm: 2 },
                          py: 0.8,
                          borderRadius: "8px",
                          borderColor: C.prevBorder,
                          color: C.prevBtn,
                          maxWidth: { xs: "48%", sm: "none" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: C.hoverBg,
                            color: C.textPrimary,
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
                          fontWeight: 700,
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                          px: { xs: 2, sm: 2.5 },
                          py: 0.8,
                          borderRadius: "8px",
                          backgroundColor: "primary.main",
                          color: "#fff",
                          maxWidth: { xs: "48%", sm: "none" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 8px rgba(59,154,198,0.3)",
                          "&:hover": {
                            backgroundColor: "#2e88b2",
                            boxShadow: "0 2px 12px rgba(59,154,198,0.5)",
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
