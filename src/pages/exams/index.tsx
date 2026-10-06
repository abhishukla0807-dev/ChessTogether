import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PageTitle } from "@/components/pageTitle";
import ExamCard from "@/components/exams/ExamCard";
import ExamCategoryCard from "@/components/exams/ExamCategoryCard";
import ExamSearch from "@/components/exams/ExamSearch";
import ExamProgressCard from "@/components/exams/ExamProgressCard";
import examsData, { EXAM_CATEGORIES } from "@/data/examsData";
import { useExamStorage } from "@/hooks/useExamStorage";

const MY_EXAMS_TABS = [
  { label: "Continue Preparation", value: "continue" },
  { label: "Saved Exams", value: "saved" },
  { label: "Attempt History", value: "history" },
  { label: "Performance", value: "performance" },
] as const;

export default function ExamsPage() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [myExamsTab, setMyExamsTab] = useState<string>("continue");

  const {
    savedExams,
    isExamSaved,
    toggleSaveExam,
    progressMap,
    recentExamIds,
  } = useExamStorage();

  // ── Filtered Exams ──
  const filteredExams = useMemo(() => {
    return examsData.filter((exam) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = exam.name.toLowerCase().includes(q);
        const matchesDesc = exam.description.toLowerCase().includes(q);
        const matchesCategory = exam.category.toLowerCase().includes(q);
        const matchesAgency = exam.conductedBy.toLowerCase().includes(q);
        const matchesSubject = exam.subjects.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.topics.some((t) => t.toLowerCase().includes(q))
        );
        if (
          !matchesName &&
          !matchesDesc &&
          !matchesCategory &&
          !matchesAgency &&
          !matchesSubject
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && exam.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // ── My Exams data ──
  const recentExams = recentExamIds
    .map((id) => examsData.find((e) => e.id === id))
    .filter(Boolean);

  const savedExamsList = savedExams
    .sort((a, b) => b.savedAt - a.savedAt)
    .map((s) => examsData.find((e) => e.id === s.examId))
    .filter(Boolean);

  return (
    <>
      <PageTitle title="ByteMate — CS/IT Exam Preparation" />

      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          px: { xs: 1.5, sm: 3, md: 4 },
          py: { xs: 2.5, sm: 3.5 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: dark ? "#19191c" : "#f0f2f5",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1040px" }}>
          {/* ── Minimal Clean Hero ── */}
          <Box
            sx={{
              mb: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Minimal Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.75,
                py: 0.4,
                borderRadius: "20px",
                backgroundColor: dark
                  ? "rgba(59, 154, 198, 0.1)"
                  : "rgba(59, 154, 198, 0.08)",
                border: "1px solid",
                borderColor: dark
                  ? "rgba(59, 154, 198, 0.25)"
                  : "rgba(59, 154, 198, 0.2)",
                mb: 1.5,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                CS/IT Preparation
              </Typography>
              <Box
                sx={{
                  width: "1px",
                  height: "11px",
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.2)",
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: dark ? "#94a3b8" : "#64748b",
                }}
              >
                {examsData.length} Exams
              </Typography>
            </Box>

            {/* Clean Title */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.5rem" },
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: dark ? "#ffffff" : "#0f172a",
                mb: 1,
              }}
            >
              Prepare for Your{" "}
              <Box
                component="span"
                sx={{
                  background: dark
                    ? "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)"
                    : "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline",
                }}
              >
                CS/IT Exams
              </Box>
            </Typography>

            {/* Short 1-line Description */}
            <Typography
              variant="body2"
              sx={{
                color: dark ? "#94a3b8" : "#64748b",
                fontSize: { xs: "0.92rem", sm: "1rem" },
                lineHeight: 1.5,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Syllabi, past year papers, and mock tests for premier Computer
              Science & PSU exams.
            </Typography>
          </Box>

          {/* ── Minimal Search Bar ── */}
          <Box sx={{ mb: 2 }}>
            <ExamSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by exam name, agency, subject, or topic..."
            />
          </Box>

          {/* ── Category Filter Pills ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0.85,
              mb: 3,
            }}
          >
            <ExamCategoryCard
              name="All Exams"
              count={examsData.length}
              isSelected={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            />
            {EXAM_CATEGORIES.map((category) => {
              const count = examsData.filter(
                (e) => e.category === category
              ).length;
              return (
                <ExamCategoryCard
                  key={category}
                  name={category}
                  count={count}
                  isSelected={selectedCategory === category}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? "all" : category
                    )
                  }
                />
              );
            })}
          </Box>

          {/* Search result feedback */}
          {searchQuery.trim() && (
            <Box
              sx={{
                mb: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 0.75,
                borderRadius: "8px",
                backgroundColor: dark
                  ? "rgba(59, 154, 198, 0.08)"
                  : "rgba(59, 154, 198, 0.06)",
                border: "1px solid",
                borderColor: dark
                  ? "rgba(59, 154, 198, 0.18)"
                  : "rgba(59, 154, 198, 0.14)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.84rem",
                  color: dark ? "#cbd5e1" : "#334155",
                }}
              >
                Found <strong>{filteredExams.length}</strong> matching{" "}
                {filteredExams.length === 1 ? "exam" : "exams"} for &ldquo;
                <strong>{searchQuery}</strong>&rdquo;
              </Typography>
              <Button
                size="small"
                onClick={() => setSearchQuery("")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  p: 0,
                  minWidth: "auto",
                  color: "primary.main",
                }}
              >
                Clear
              </Button>
            </Box>
          )}

          {/* ── Exam Cards Section ── */}
          <Box sx={{ mb: 4.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.75,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.96rem",
                  color: dark ? "#e2e8f0" : "#1e293b",
                  letterSpacing: "-0.01em",
                }}
              >
                {selectedCategory !== "all"
                  ? `${selectedCategory} Exams`
                  : "All Exams"}
              </Typography>
              <Typography
                sx={{
                  color: dark ? "#94a3b8" : "#64748b",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                }}
              >
                Showing {filteredExams.length}{" "}
                {filteredExams.length === 1 ? "exam" : "exams"}
              </Typography>
            </Box>

            {filteredExams.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  color: dark ? "#64748b" : "#94a3b8",
                  borderRadius: "12px",
                  backgroundColor: dark ? "#212127" : "#ffffff",
                  border: "1px solid",
                  borderColor: dark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.06)",
                }}
              >
                <Typography sx={{ fontSize: "1rem", fontWeight: 600, mb: 0.5 }}>
                  No exams found
                </Typography>
                <Typography sx={{ fontSize: "0.84rem" }}>
                  Try adjusting your search query or stream filter.
                </Typography>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  sx={{
                    mt: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.84rem",
                    color: "primary.main",
                  }}
                >
                  Reset Filters
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 1.5,
                }}
              >
                {filteredExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    isSaved={isExamSaved(exam.id)}
                    onToggleSave={toggleSaveExam}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* ── My Exams Section ── */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.96rem",
                color: dark ? "#e2e8f0" : "#1e293b",
                mb: 1.5,
                letterSpacing: "-0.01em",
              }}
            >
              My Preparation
            </Typography>

            <Box
              sx={{
                borderBottom: "1px solid",
                borderColor: dark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.08)",
                mb: 2.2,
              }}
            >
              <Tabs
                value={myExamsTab}
                onChange={(_, val) => setMyExamsTab(val)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  minHeight: "38px",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.86rem",
                    minWidth: "auto",
                    minHeight: "38px",
                    px: { xs: 1.5, sm: 2 },
                    py: 0.8,
                    color: dark ? "#94a3b8" : "#64748b",
                    "&.Mui-selected": {
                      color: "primary.main",
                      fontWeight: 700,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                    height: "2.5px",
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                {MY_EXAMS_TABS.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Box>

            {/* Tab Content */}
            {myExamsTab === "continue" && (
              <Box>
                {recentExams.length === 0 ? (
                  <EmptyState
                    dark={dark}
                    message="No preparation history yet"
                    submessage="Select any exam above to start studying and track your progress here."
                  />
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                      gap: 1.5,
                    }}
                  >
                    {recentExams.map((exam) => (
                      <ExamProgressCard
                        key={exam!.id}
                        examId={exam!.id}
                        examName={exam!.name}
                        progress={progressMap[exam!.id]}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {myExamsTab === "saved" && (
              <Box>
                {savedExamsList.length === 0 ? (
                  <EmptyState
                    dark={dark}
                    message="No saved exams yet"
                    submessage="Click the bookmark icon on any exam card to save it for quick access."
                  />
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                      gap: 1.5,
                    }}
                  >
                    {savedExamsList.map((exam) => (
                      <ExamCard
                        key={exam!.id}
                        exam={exam!}
                        isSaved={true}
                        onToggleSave={toggleSaveExam}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {myExamsTab === "history" && (
              <EmptyState
                dark={dark}
                message="No attempt history yet"
                submessage="Your practice question and mock test attempts will appear here."
              />
            )}

            {myExamsTab === "performance" && (
              <EmptyState
                dark={dark}
                message="No performance analytics yet"
                submessage="Complete practice questions and mock tests to unlock your accuracy analytics."
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function EmptyState({
  dark,
  message,
  submessage,
}: {
  dark: boolean;
  message: string;
  submessage: string;
}) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 3.5,
        px: 2,
        borderRadius: "12px",
        backgroundColor: dark ? "#212127" : "#ffffff",
        border: "1px solid",
        borderColor: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: dark ? "#94a3b8" : "#64748b",
          mb: 0.4,
        }}
      >
        {message}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.8rem",
          color: dark ? "#64748b" : "#94a3b8",
        }}
      >
        {submessage}
      </Typography>
    </Box>
  );
}
