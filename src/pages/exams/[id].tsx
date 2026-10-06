import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Chip, Paper, Typography, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import { PageTitle } from "@/components/pageTitle";
import ExamTabs from "@/components/exams/ExamTabs";
import ExamSectionCard from "@/components/exams/ExamSectionCard";
import examsData from "@/data/examsData";
import { useExamStorage } from "@/hooks/useExamStorage";
import { ExamSectionName } from "@/types/exam";
import NavLink from "@/components/NavLink";

const EXAM_META: Record<
  string,
  {
    icon: string;
    gradient: string;
    orgShort: string;
    shortEligibility: string;
    shortPattern: string;
  }
> = {
  "gate-cs": {
    icon: "mdi:school-outline",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    orgShort: "IISc Bangalore & IITs",
    shortEligibility: "B.E. / B.Tech / MCA / M.Sc (Final year eligible)",
    shortPattern: "Online CBT • 65 Qs • 100 Marks • 3 Hours",
  },
  "isro-sc": {
    icon: "mdi:rocket-launch-outline",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    orgShort: "ISRO Centres (VSSC, URSC, SAC)",
    shortEligibility: "B.E. / B.Tech in CS/IT (Min 65% / 6.84 CGPA, ≤28 yrs)",
    shortPattern: "Written Test • 80 Qs • 320 Marks • 90 Mins",
  },
  "barc-cs": {
    icon: "mdi:atom",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    orgShort: "Bhabha Atomic Research Centre",
    shortEligibility: "B.E. / B.Tech in CS with min 60% (≤26 yrs)",
    shortPattern: "GATE CS Cutoff / Online Exam + Technical Interview",
  },
  "sebi-it": {
    icon: "mdi:chart-timeline-variant-shimmer",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    orgShort: "Securities & Exchange Board of India",
    shortEligibility: "B.E. / B.Tech in CS/IT or MCA / M.Tech (≤30 yrs)",
    shortPattern: "Phase I (Screening) • Phase II (IT Paper) • Interview",
  },
  "drdo-cs": {
    icon: "mdi:shield-check-outline",
    gradient: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    orgShort: "RAC / Ministry of Defence",
    shortEligibility: "B.E. / B.Tech in CS/IT with First Class + Valid GATE",
    shortPattern: "Valid GATE Score Screening + Personal Interview (85:15)",
  },
  "nic-sas": {
    icon: "mdi:laptop-code",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #4f46e5 100%)",
    orgShort: "National Informatics Centre (MeitY)",
    shortEligibility: "B.E. / B.Tech / MCA / M.Sc in CS/IT (≤30 yrs)",
    shortPattern: "OMR/CBT • 120 Qs (65% Tech, 35% Generic) • 3 Hours",
  },
  "nielit-sa": {
    icon: "mdi:certificate-outline",
    gradient: "linear-gradient(135deg, #a855f7 0%, #c026d3 100%)",
    orgShort: "MeitY / Govt of India",
    shortEligibility: "B.E. / B.Tech in CS/IT or MCA with 60% (≤30 yrs)",
    shortPattern: "Written Exam (120 Qs) + Interview for Scientist B",
  },
  "bel-pe": {
    icon: "mdi:broadcast",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0284c7 100%)",
    orgShort: "Bharat Electronics Limited",
    shortEligibility: "B.E. / B.Tech in CS/IT with First Class (≤25 yrs)",
    shortPattern: "CBT Written Test (85%) + Interview (15%)",
  },
};

export default function ExamDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const exam = examsData.find((e) => e.id === id);

  const { isExamSaved, toggleSaveExam, recordSectionVisit, getProgress } =
    useExamStorage();

  const [activeSection, setActiveSection] =
    useState<ExamSectionName>("Syllabus");

  // Record section visit when changing tabs
  useEffect(() => {
    if (exam) {
      recordSectionVisit(exam.id, activeSection);
    }
  }, [exam, activeSection, recordSectionVisit]);

  if (!id || !exam) {
    return (
      <>
        <PageTitle title="ByteMate — Exam Not Found" />
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: dark ? "#94a3b8" : "#64748b",
          }}
        >
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 600, mb: 1 }}>
            Exam not found
          </Typography>
          <NavLink href="/exams">
            <Button
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Back to Exams
            </Button>
          </NavLink>
        </Box>
      </>
    );
  }

  const saved = isExamSaved(exam.id);
  const progress = getProgress(exam.id);
  const meta = EXAM_META[exam.id] || {
    icon: "mdi:school-outline",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    orgShort: exam.conductedBy,
    shortEligibility: exam.eligibility,
    shortPattern: exam.pattern,
  };

  return (
    <>
      <PageTitle title={`ByteMate — ${exam.name} Exam Preparation`} />

      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          px: { xs: 1.5, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: dark ? "#19191c" : "#f0f2f5",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1140px" }}>
          {/* ── Back Navigation ── */}
          <Box sx={{ mb: 2 }}>
            <NavLink href="/exams">
              <Button
                size="small"
                startIcon={<Icon icon="mdi:arrow-left" />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  color: dark ? "#94a3b8" : "#64748b",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Back to Exams
              </Button>
            </NavLink>
          </Box>

          {/* ── Premium Exam Header Card ── */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              backgroundColor: dark ? "#202026" : "#ffffff",
              border: "1px solid",
              borderColor: dark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(59, 154, 198, 0.2)",
              backgroundImage: dark
                ? "radial-gradient(ellipse at 0% 0%, rgba(59, 154, 198, 0.12) 0%, transparent 60%)"
                : "radial-gradient(ellipse at 0% 0%, rgba(59, 154, 198, 0.05) 0%, transparent 60%)",
              boxShadow: dark
                ? "0 16px 36px -8px rgba(0, 0, 0, 0.5)"
                : "0 10px 30px -8px rgba(59, 154, 198, 0.1), 0 2px 8px rgba(0, 0, 0, 0.03)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            {/* Top Gradient Accent Line */}
            <Box
              sx={{
                height: "3.5px",
                background: meta.gradient,
                width: "100%",
              }}
            />

            <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              {/* Top Row: Avatar + Title/Desc + Action Button */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2.5,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  {/* Brand Avatar */}
                  <Box
                    sx={{
                      width: { xs: 48, sm: 54 },
                      height: { xs: 48, sm: 54 },
                      borderRadius: "13px",
                      background: meta.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      flexShrink: 0,
                      boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Icon icon={meta.icon} width={28} height={28} />
                  </Box>

                  {/* Title, Category & Subtitle */}
                  <Box sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        mb: 0.4,
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1,
                          py: 0.25,
                          borderRadius: "6px",
                          backgroundColor: dark
                            ? "rgba(59, 154, 198, 0.14)"
                            : "rgba(59, 154, 198, 0.1)",
                          border: "1px solid",
                          borderColor: dark
                            ? "rgba(59, 154, 198, 0.28)"
                            : "rgba(59, 154, 198, 0.22)",
                          color: "primary.main",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {exam.category}
                      </Box>

                      {progress && progress.sectionsVisited.length > 0 && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.4,
                            px: 1,
                            py: 0.25,
                            borderRadius: "6px",
                            backgroundColor: dark
                              ? "rgba(16, 185, 129, 0.12)"
                              : "rgba(16, 185, 129, 0.09)",
                            border: "1px solid",
                            borderColor: dark
                              ? "rgba(16, 185, 129, 0.28)"
                              : "rgba(16, 185, 129, 0.22)",
                            color: dark ? "#34d399" : "#059669",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          <Icon
                            icon="mdi:check-circle"
                            width={13}
                            height={13}
                          />
                          <span>
                            {progress.sectionsVisited.length}/6 Explored
                          </span>
                        </Box>
                      )}
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.45rem", sm: "1.85rem" },
                        letterSpacing: "-0.025em",
                        color: dark ? "#ffffff" : "#0f172a",
                        lineHeight: 1.25,
                      }}
                    >
                      {exam.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.85rem", sm: "0.92rem" },
                        color: dark ? "#94a3b8" : "#64748b",
                        mt: 0.3,
                      }}
                    >
                      {exam.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Save Exam Action Button */}
                <Button
                  variant={saved ? "outlined" : "contained"}
                  startIcon={
                    <Icon
                      icon={saved ? "mdi:bookmark" : "mdi:bookmark-outline"}
                      width={18}
                      height={18}
                    />
                  }
                  onClick={() => toggleSaveExam(exam.id)}
                  sx={{
                    flexShrink: 0,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.86rem",
                    px: 2.25,
                    py: 0.75,
                    borderRadius: "24px",
                    boxShadow: "none",
                    ...(saved
                      ? {
                          borderColor: "primary.main",
                          color: "primary.main",
                          backgroundColor: dark
                            ? "rgba(59, 154, 198, 0.12)"
                            : "rgba(59, 154, 198, 0.08)",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: dark
                              ? "rgba(59, 154, 198, 0.18)"
                              : "rgba(59, 154, 198, 0.14)",
                          },
                        }
                      : {
                          backgroundColor: "primary.main",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                            boxShadow: "none",
                          },
                        }),
                  }}
                >
                  {saved ? "Saved" : "Save Exam"}
                </Button>
              </Box>

              {/* ── Key Highlights / Metric Specs (Less Content, Ultra High Signal) ── */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {/* 1. Eligibility */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "11px",
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: dark
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      backgroundColor: dark
                        ? "rgba(59, 154, 198, 0.12)"
                        : "rgba(59, 154, 198, 0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon="mdi:school-outline" width={18} height={18} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: dark ? "#94a3b8" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        mb: 0.4,
                      }}
                    >
                      Eligibility
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: dark ? "#f1f5f9" : "#1e293b",
                        lineHeight: 1.35,
                      }}
                    >
                      {meta.shortEligibility || exam.eligibility}
                    </Typography>
                  </Box>
                </Box>

                {/* 2. Exam Pattern */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "11px",
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: dark
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      backgroundColor: dark
                        ? "rgba(245, 158, 11, 0.12)"
                        : "rgba(245, 158, 11, 0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f59e0b",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon="mdi:clock-outline" width={18} height={18} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: dark ? "#94a3b8" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        mb: 0.4,
                      }}
                    >
                      Exam Pattern
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: dark ? "#f1f5f9" : "#1e293b",
                        lineHeight: 1.35,
                      }}
                    >
                      {meta.shortPattern || exam.pattern}
                    </Typography>
                  </Box>
                </Box>

                {/* 3. Conducted By */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "11px",
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: dark
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      backgroundColor: dark
                        ? "rgba(139, 92, 246, 0.12)"
                        : "rgba(139, 92, 246, 0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8b5cf6",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon="mdi:domain" width={18} height={18} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: dark ? "#94a3b8" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        mb: 0.4,
                      }}
                    >
                      Conducted By
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: dark ? "#f1f5f9" : "#1e293b",
                        lineHeight: 1.35,
                      }}
                    >
                      {meta.orgShort || exam.conductedBy}
                    </Typography>
                  </Box>
                </Box>

                {/* 4. Frequency */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "11px",
                    backgroundColor: dark
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: dark
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      backgroundColor: dark
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(16, 185, 129, 0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      icon="mdi:calendar-check-outline"
                      width={18}
                      height={18}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: dark ? "#94a3b8" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        mb: 0.4,
                      }}
                    >
                      Frequency
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: dark ? "#f1f5f9" : "#1e293b",
                        lineHeight: 1.35,
                      }}
                    >
                      {exam.frequency}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* ── Section Tabs ── */}
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: dark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)",
              mb: 2.5,
            }}
          >
            <ExamTabs
              sections={exam.sections}
              activeSection={activeSection}
              onChange={setActiveSection}
            />
          </Box>

          {/* ── Section Content ── */}
          <Box sx={{ mb: 4 }}>
            {activeSection === "Syllabus" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {exam.subjects.map((subject) => (
                  <ExamSectionCard
                    key={subject.id}
                    title={subject.name}
                    items={subject.topics.map((topic, i) => ({
                      id: `${subject.id}-${i}`,
                      label: topic,
                      sublabel: subject.weightage
                        ? i === 0
                          ? subject.weightage
                          : undefined
                        : undefined,
                    }))}
                  />
                ))}
              </Box>
            )}

            {activeSection === "Subjects" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {exam.subjects.map((subject) => (
                  <Paper
                    key={subject.id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      backgroundColor: dark ? "#212126" : "#ffffff",
                      border: "1px solid",
                      borderColor: dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: dark ? "#f0f6fc" : "#1a1d21",
                        mb: 0.5,
                      }}
                    >
                      {subject.name}
                    </Typography>
                    {subject.weightage && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "0.78rem",
                          display: "block",
                          mb: 1.5,
                        }}
                      >
                        {subject.weightage}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                      }}
                    >
                      {subject.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          sx={{
                            fontSize: "0.76rem",
                            fontWeight: 500,
                            height: "24px",
                            borderRadius: "6px",
                            backgroundColor: dark
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.04)",
                            color: dark ? "#cbd5e1" : "#475569",
                            border: "1px solid",
                            borderColor: dark
                              ? "rgba(255, 255, 255, 0.06)"
                              : "rgba(0, 0, 0, 0.06)",
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {activeSection === "Previous Year Papers" && (
              <ExamSectionCard
                title="Previous Year Papers"
                items={exam.papers.map((paper) => ({
                  id: paper.id,
                  label: paper.title,
                  sublabel: paper.subject || String(paper.year),
                }))}
                emptyMessage="Previous year papers will be added soon."
              />
            )}

            {activeSection === "Practice Questions" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {exam.questions.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      backgroundColor: dark ? "#212126" : "#ffffff",
                      border: "1px solid",
                      borderColor: dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: dark ? "#64748b" : "#94a3b8",
                        fontSize: "0.88rem",
                        fontStyle: "italic",
                      }}
                    >
                      Practice questions will be added soon.
                    </Typography>
                  </Paper>
                ) : (
                  exam.questions.map((q, idx) => (
                    <QuestionCard
                      key={q.id}
                      index={idx + 1}
                      question={q.question}
                      options={q.options}
                      correctAnswer={q.correctAnswer}
                      explanation={q.explanation}
                      subject={q.subject}
                      dark={dark}
                    />
                  ))
                )}
              </Box>
            )}

            {activeSection === "Mock Tests" && (
              <ExamSectionCard
                title="Mock Tests"
                items={exam.mockTests.map((mt) => ({
                  id: mt.id,
                  label: mt.title,
                  sublabel: `${mt.totalQuestions}Q · ${mt.duration}`,
                }))}
                emptyMessage="Mock tests will be added soon."
              />
            )}

            {activeSection === "Study Material" && (
              <ExamSectionCard
                title="Study Material"
                items={exam.studyMaterials.map((sm) => ({
                  id: sm.id,
                  label: sm.title,
                  sublabel: sm.type.charAt(0).toUpperCase() + sm.type.slice(1),
                }))}
                emptyMessage="Study materials will be added soon."
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

/* ── Inline Question Card component ── */

function QuestionCard({
  index,
  question,
  options,
  correctAnswer,
  explanation,
  subject,
  dark,
}: {
  index: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subject?: string;
  dark: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.82rem",
            color: dark ? "#94a3b8" : "#64748b",
          }}
        >
          Question {index}
        </Typography>
        {subject && (
          <Chip
            label={subject}
            size="small"
            sx={{
              fontSize: "0.72rem",
              fontWeight: 500,
              height: "22px",
              borderRadius: "6px",
              backgroundColor: dark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
              color: dark ? "#94a3b8" : "#64748b",
            }}
          />
        )}
      </Box>

      <Typography
        sx={{
          fontSize: "0.92rem",
          fontWeight: 500,
          color: dark ? "#e2e8f0" : "#1e293b",
          mb: 2,
          lineHeight: 1.5,
        }}
      >
        {question}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2 }}>
        {options.map((option, i) => {
          const isCorrect = showAnswer && i === correctAnswer;
          const isWrong = showAnswer && selected === i && i !== correctAnswer;
          const isSelected = selected === i;

          return (
            <Box
              key={i}
              onClick={() => {
                if (!showAnswer) setSelected(i);
              }}
              sx={{
                p: 1.25,
                borderRadius: "8px",
                cursor: showAnswer ? "default" : "pointer",
                border: "1px solid",
                borderColor: isCorrect
                  ? "#22c55e"
                  : isWrong
                    ? "#ef4444"
                    : isSelected
                      ? "primary.main"
                      : dark
                        ? "rgba(255, 255, 255, 0.06)"
                        : "rgba(0, 0, 0, 0.06)",
                backgroundColor: isCorrect
                  ? dark
                    ? "rgba(34, 197, 94, 0.12)"
                    : "rgba(34, 197, 94, 0.08)"
                  : isWrong
                    ? dark
                      ? "rgba(239, 68, 68, 0.12)"
                      : "rgba(239, 68, 68, 0.08)"
                    : isSelected
                      ? dark
                        ? "rgba(59, 154, 198, 0.12)"
                        : "rgba(59, 154, 198, 0.06)"
                      : dark
                        ? "rgba(255, 255, 255, 0.02)"
                        : "rgba(0, 0, 0, 0.01)",
                transition: "all 0.15s ease",
                ...(!showAnswer && {
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
                  fontSize: "0.86rem",
                  fontWeight: isSelected || isCorrect ? 600 : 400,
                  color: isCorrect
                    ? "#22c55e"
                    : isWrong
                      ? "#ef4444"
                      : dark
                        ? "#e2e8f0"
                        : "#334155",
                }}
              >
                {String.fromCharCode(65 + i)}. {option}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          disabled={selected === null || showAnswer}
          onClick={() => setShowAnswer(true)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.82rem",
            px: 2,
            py: 0.5,
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
          Check Answer
        </Button>
        {showAnswer && (
          <Button
            size="small"
            onClick={() => {
              setSelected(null);
              setShowAnswer(false);
            }}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: dark ? "#94a3b8" : "#64748b",
            }}
          >
            Reset
          </Button>
        )}
      </Box>

      {showAnswer && explanation && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: "8px",
            backgroundColor: dark
              ? "rgba(59, 154, 198, 0.08)"
              : "rgba(59, 154, 198, 0.04)",
            border: "1px solid",
            borderColor: dark
              ? "rgba(59, 154, 198, 0.2)"
              : "rgba(59, 154, 198, 0.12)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.84rem",
              color: dark ? "#cbd5e1" : "#334155",
              lineHeight: 1.5,
            }}
          >
            <strong>Explanation:</strong> {explanation}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
