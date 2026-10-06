import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { PageTitle } from "@/components/pageTitle";
import JobCard from "@/components/JobCard";
import jobsData from "@/data/jobs.json";
import { Job, JobField } from "@/types/job";
import { useRouter } from "next/router";
import { submitLeadToGoogleSheet } from "@/lib/sheets";

const ALL_FIELDS: JobField[] = [
  "Software Development",
  "Backend Development",
  "Frontend Development",
  "Full Stack Development",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Cloud & DevOps",
  "UI/UX Design",
  "Product Management",
  "Other Fields",
];


const TAB_OPTIONS = [
  { label: "All Jobs", value: "all" },
  { label: "Internships", value: "internship" },
  { label: "Fresher Jobs", value: "fresher" },
  { label: "Part-time", value: "part-time" },
  { label: "Remote", value: "remote" },
] as const;

const POPULAR_SEARCHES = [
  "React",
  "Java",
  "Python",
  "Full Stack",
  "Swiggy",
  "Razorpay",
  "Fresher",
  "Remote",
  "Bengaluru",
];

export default function JobsPage() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ── Filter States ──
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Keyboard shortcut listener (/ or Ctrl+K to search, Esc to blur)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isEditing =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        !isEditing
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && activeEl === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // ── "I'm interested" Modal State ──
  const [interestedJob, setInterestedJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");

  const handleInterested = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setInterestedJob(job);
    setApplied(false);
    setApplicantName("");
    setApplicantEmail("");
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applicantName.trim() && applicantEmail.trim()) {
      setApplied(true);
      submitLeadToGoogleSheet({
        name: applicantName.trim(),
        email: applicantEmail.trim(),
        jobId: interestedJob?.id,
        jobTitle: interestedJob?.title,
        company: interestedJob?.company,
        salary: interestedJob?.salary,
      });
    }
  };

  // ── Available Locations Extracted from Data ──
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    jobsData.forEach((j) => {
      const city = j.location.split(",")[0].trim();
      locSet.add(city);
    });
    return Array.from(locSet).sort();
  }, []);

  // ── Filtered Jobs Logic ──
  const filteredJobs = useMemo(() => {
    return (jobsData as Job[]).filter((job) => {
      // 1. Search Query filter (matches title, company, skills, or description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkill = job.skills.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesLocation) {
          return false;
        }
      }

      // 2. Tab Filter
      if (activeTab === "internship" && job.jobType !== "Internship") return false;
      if (activeTab === "fresher" && job.experience !== "Fresher") return false;
      if (activeTab === "part-time" && job.jobType !== "Part-time") return false;
      if (activeTab === "remote" && job.workMode !== "Remote") return false;

      // 3. Dropdown Filters
      if (selectedField !== "all" && job.field !== selectedField) return false;
      if (selectedJobType !== "all" && job.jobType !== selectedJobType) return false;
      if (selectedExperience !== "all" && job.experience !== selectedExperience) return false;
      if (selectedWorkMode !== "all" && job.workMode !== selectedWorkMode) return false;
      if (selectedLocation !== "all" && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    activeTab,
    selectedField,
    selectedJobType,
    selectedExperience,
    selectedWorkMode,
    selectedLocation,
  ]);

  const hasActiveFilters =
    searchQuery !== "" ||
    activeTab !== "all" ||
    selectedField !== "all" ||
    selectedJobType !== "all" ||
    selectedExperience !== "all" ||
    selectedWorkMode !== "all" ||
    selectedLocation !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSelectedField("all");
    setSelectedJobType("all");
    setSelectedExperience("all");
    setSelectedWorkMode("all");
    setSelectedLocation("all");
  };

  return (
    <>
      <PageTitle title="ChessTogether Jobs — Top Tech Careers & Internships in India" />

      {/* Main Scrollable Viewport — Background exactly matching Play Page */}
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
          {/* ── Page Header / Hero ── */}
          <Box sx={{ mb: 3.5, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Live badge — Centered in the middle with zero emoji, symbols or icons */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                backgroundColor: dark ? "rgba(59, 154, 198, 0.12)" : "rgba(59, 154, 198, 0.08)",
                border: "1px solid",
                borderColor: dark ? "rgba(59, 154, 198, 0.28)" : "rgba(59, 154, 198, 0.22)",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                mb: 1.75,
              }}
            >
              <Typography component="span" sx={{ fontSize: "0.82rem", fontWeight: 700, color: "primary.main" }}>
                India Tech Careers
              </Typography>
              <Box sx={{ width: "1px", height: "12px", backgroundColor: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)" }} />
              <Typography component="span" sx={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "#94a3b8" : "#64748b" }}>
                {jobsData.length} Verified Roles
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.75rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.18,
                color: dark ? "#ffffff" : "#0f172a",
                mb: 1.25,
              }}
            >
              Find Your Next{" "}
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
                Tech Role in India
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: dark ? "#94a3b8" : "#475569",
                fontSize: { xs: "0.98rem", sm: "1.08rem" },
                lineHeight: 1.6,
                maxWidth: "740px",
                mx: "auto",
                mb: 2.2,
              }}
            >
              Curated software engineering, AI, design, and product roles at India&apos;s leading tech startups and high-growth innovators.
            </Typography>

            {/* Value Props Pill Row — Clean typography, zero icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: { xs: 1, sm: 1.25 },
              }}
            >
              {[
                "Top Startups & Unicorns",
                "Transparent INR CTC",
                "Zero Ghost Jobs",
                "Direct Portal Applications",
              ].map((label) => (
                <Box
                  key={label}
                  sx={{
                    px: 1.4,
                    py: 0.45,
                    borderRadius: "8px",
                    backgroundColor: dark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                    border: "1px solid",
                    borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)",
                    color: dark ? "#cbd5e1" : "#475569",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  <span>{label}</span>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Search Bar Experience ── */}
          <Box sx={{ mb: 3.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: dark ? "#212126" : "#ffffff",
                borderRadius: "12px",
                p: { xs: 0.75, sm: 0.85 },
                pl: { xs: 1.5, sm: 2 },
                border: "1.5px solid",
                borderColor: isSearchFocused
                  ? "primary.main"
                  : dark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.12)",
                boxShadow: isSearchFocused
                  ? dark
                    ? "0 8px 32px -4px rgba(0, 0, 0, 0.7), 0 0 0 3px rgba(59, 154, 198, 0.25)"
                    : "0 8px 30px -4px rgba(59, 154, 198, 0.2), 0 0 0 3px rgba(59, 154, 198, 0.15)"
                  : dark
                  ? "0 4px 20px -2px rgba(0, 0, 0, 0.4)"
                  : "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <InputBase
                inputRef={searchInputRef}
                fullWidth
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, or skills (e.g. Java, React, Swiggy, Python)..."
                sx={{
                  fontSize: { xs: "0.94rem", sm: "1rem" },
                  color: dark ? "#ffffff" : "#0f172a",
                  "& input::placeholder": {
                    color: dark ? "#64748b" : "#94a3b8",
                    opacity: 1,
                  },
                }}
              />

              {/* Clear button if text entered */}
              {searchQuery && (
                <Button
                  size="small"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  sx={{
                    mr: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    color: dark ? "#94a3b8" : "#64748b",
                    "&:hover": { color: dark ? "#ffffff" : "#1a1d21" },
                  }}
                >
                  Clear
                </Button>
              )}

              {/* Search Action Button */}
              <Button
                variant="contained"
                onClick={() => searchInputRef.current?.focus()}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  px: 2.75,
                  py: 0.75,
                  borderRadius: "8px",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Find Jobs
              </Button>
            </Box>

            {/* ── Trending / Popular Searches ── */}
            <Box
              sx={{
                mt: 1.5,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.85,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: dark ? "#94a3b8" : "#64748b",
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  mr: 0.5,
                }}
              >
                Popular:
              </Typography>

              {POPULAR_SEARCHES.map((term) => {
                const isTagActive = searchQuery.toLowerCase() === term.toLowerCase();
                return (
                  <Box
                    key={term}
                    onClick={() => {
                      if (isTagActive) {
                        setSearchQuery("");
                      } else {
                        setSearchQuery(term);
                        searchInputRef.current?.focus();
                      }
                    }}
                    sx={{
                      cursor: "pointer",
                      px: 1.3,
                      py: 0.35,
                      borderRadius: "16px",
                      fontSize: "0.78rem",
                      fontWeight: isTagActive ? 700 : 500,
                      backgroundColor: isTagActive
                        ? dark ? "rgba(59, 154, 198, 0.22)" : "rgba(59, 154, 198, 0.14)"
                        : dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                      border: "1px solid",
                      borderColor: isTagActive
                        ? "primary.main"
                        : dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                      color: isTagActive ? "primary.main" : dark ? "#cbd5e1" : "#475569",
                      transition: "all 0.15s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      "&:hover": {
                        borderColor: "primary.main",
                        color: "primary.main",
                        backgroundColor: dark ? "rgba(59, 154, 198, 0.12)" : "rgba(59, 154, 198, 0.08)",
                      },
                    }}
                  >
                    <span>{term}</span>
                  </Box>
                );
              })}
            </Box>

            {/* Active Search Result Feedback */}
            {searchQuery.trim() && (
              <Box
                sx={{
                  mt: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "8px",
                  backgroundColor: dark ? "rgba(59, 154, 198, 0.1)" : "rgba(59, 154, 198, 0.08)",
                  border: "1px solid",
                  borderColor: dark ? "rgba(59, 154, 198, 0.2)" : "rgba(59, 154, 198, 0.15)",
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.85rem", color: dark ? "#cbd5e1" : "#334155" }}>
                  Found <strong>{filteredJobs.length}</strong> matching {filteredJobs.length === 1 ? "role" : "roles"} for &ldquo;<strong>{searchQuery}</strong>&rdquo;
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
                  Clear search
                </Button>
              </Box>
            )}
          </Box>

          {/* ── Browse Jobs by Field ── */}
          <Box sx={{ mb: 3.5 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                color: dark ? "#e2e8f0" : "#1e293b",
                mb: 1.5,
              }}
            >
              Browse Jobs by Field
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(6, 1fr)",
                },
                gap: 1.2,
              }}
            >
              {ALL_FIELDS.map((field) => {
                const isSelected = selectedField === field;
                const count = jobsData.filter((j) => j.field === field).length;

                return (
                  <Box
                    key={field}
                    onClick={() => {
                      setSelectedField(isSelected ? "all" : field);
                    }}
                    sx={{
                      p: 1.4,
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: "74px",
                      backgroundColor: isSelected
                        ? dark
                          ? "rgba(59, 154, 198, 0.18)"
                          : "rgba(59, 154, 198, 0.12)"
                        : dark
                        ? "#212126"
                        : "#ffffff",
                      border: "1px solid",
                      borderColor: isSelected
                        ? "primary.main"
                        : dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                      borderLeft: isSelected ? "3px solid" : undefined,
                      borderLeftColor: isSelected ? "primary.main" : undefined,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: dark ? "rgba(59, 154, 198, 0.1)" : "rgba(59, 154, 198, 0.06)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mb: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          px: 0.8,
                          py: 0.2,
                          borderRadius: "10px",
                          backgroundColor: isSelected
                            ? "primary.main"
                            : dark
                            ? "rgba(255, 255, 255, 0.06)"
                            : "rgba(0, 0, 0, 0.05)",
                          color: isSelected ? "#ffffff" : dark ? "#94a3b8" : "#64748b",
                        }}
                      >
                        {count}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.84rem",
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? "primary.main" : dark ? "#f1f5f9" : "#1e293b",
                        lineHeight: 1.25,
                      }}
                    >
                      {field}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Tabs for Quick Categories ── */}
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              mb: 2.5,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  minWidth: "auto",
                  px: { xs: 1.75, sm: 2.5 },
                  py: 1.2,
                  color: dark ? "#94a3b8" : "#64748b",
                  "&.Mui-selected": {
                    color: "primary.main",
                    fontWeight: 700,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                  height: "3px",
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              {TAB_OPTIONS.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Box>

          {/* ── Dropdown Filters Row ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 3,
            }}
          >
            {/* Field Filter */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: dark ? "#94a3b8" : "#64748b" }}>Field</InputLabel>
              <Select
                value={selectedField}
                label="Field"
                onChange={(e) => setSelectedField(e.target.value)}
                sx={{
                  backgroundColor: dark ? "#212126" : "#ffffff",
                  fontSize: "0.86rem",
                }}
              >
                <MenuItem value="all">All Fields</MenuItem>
                {ALL_FIELDS.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Job Type Filter */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ color: dark ? "#94a3b8" : "#64748b" }}>Job Type</InputLabel>
              <Select
                value={selectedJobType}
                label="Job Type"
                onChange={(e) => setSelectedJobType(e.target.value)}
                sx={{
                  backgroundColor: dark ? "#212126" : "#ffffff",
                  fontSize: "0.86rem",
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
              </Select>
            </FormControl>

            {/* Experience Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: dark ? "#94a3b8" : "#64748b" }}>Experience</InputLabel>
              <Select
                value={selectedExperience}
                label="Experience"
                onChange={(e) => setSelectedExperience(e.target.value)}
                sx={{
                  backgroundColor: dark ? "#212126" : "#ffffff",
                  fontSize: "0.86rem",
                }}
              >
                <MenuItem value="all">All Experience</MenuItem>
                <MenuItem value="Fresher">Fresher</MenuItem>
                <MenuItem value="0-1 years">0-1 years</MenuItem>
                <MenuItem value="1-3 years">1-3 years</MenuItem>
                <MenuItem value="3-5 years">3-5 years</MenuItem>
                <MenuItem value="5+ years">5+ years</MenuItem>
              </Select>
            </FormControl>

            {/* Work Mode Filter */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ color: dark ? "#94a3b8" : "#64748b" }}>Work Mode</InputLabel>
              <Select
                value={selectedWorkMode}
                label="Work Mode"
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                sx={{
                  backgroundColor: dark ? "#212126" : "#ffffff",
                  fontSize: "0.86rem",
                }}
              >
                <MenuItem value="all">All Modes</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
                <MenuItem value="On-site">On-site</MenuItem>
              </Select>
            </FormControl>

            {/* Location Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: dark ? "#94a3b8" : "#64748b" }}>Location</InputLabel>
              <Select
                value={selectedLocation}
                label="Location"
                onChange={(e) => setSelectedLocation(e.target.value)}
                sx={{
                  backgroundColor: dark ? "#212126" : "#ffffff",
                  fontSize: "0.86rem",
                }}
              >
                <MenuItem value="all">All Locations</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetFilters}
                startIcon={<Icon icon="mdi:filter-remove-outline" />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.84rem",
                  borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                  color: dark ? "#cbd5e1" : "#475569",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: "primary.main",
                  },
                }}
              >
                Reset Filters
              </Button>
            )}

            {/* Match Counter */}
            <Box sx={{ ml: "auto" }}>
              <Typography
                variant="body2"
                sx={{
                  color: dark ? "#94a3b8" : "#64748b",
                  fontWeight: 600,
                  fontSize: "0.86rem",
                }}
              >
                Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? "job" : "jobs"} in India
              </Typography>
            </Box>
          </Box>

          {/* ── Job Cards List ── */}
          {filteredJobs.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75, pb: 6 }}>
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onInterested={handleInterested} />
              ))}
            </Box>
          ) : (
            /* ── Empty State ── */
            <Box
              sx={{
                p: { xs: 4, sm: 6 },
                textAlign: "center",
                borderRadius: "12px",
                backgroundColor: dark ? "#212126" : "#ffffff",
                border: "1px dashed",
                borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                my: 4,
              }}
            >
              <Icon
                icon="mdi:briefcase-search-outline"
                width={56}
                height={56}
                color={dark ? "#64748b" : "#94a3b8"}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mt: 2,
                  mb: 0.5,
                  color: dark ? "#e2e8f0" : "#1e293b",
                }}
              >
                No jobs match your search criteria
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: dark ? "#94a3b8" : "#64748b",
                  mb: 3,
                  maxWidth: "420px",
                  mx: "auto",
                }}
              >
                Try loosening your filters, changing your search terms, or exploring other technical fields.
              </Typography>
              <Button
                variant="contained"
                onClick={handleResetFilters}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                }}
              >
                View All {jobsData.length} Jobs
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── "I'm interested" Modal Dialog ── */}
      <Dialog
        open={Boolean(interestedJob)}
        onClose={() => setInterestedJob(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            backgroundColor: dark ? "#212126" : "#ffffff",
            backgroundImage: "none",
            border: "1px solid",
            borderColor: dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            p: 1,
          },
        }}
      >
        <DialogTitle component="div" sx={{ pb: 1, pt: 2, px: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: dark ? "#ffffff" : "#1a1d21" }}>
                {applied ? "Application Submitted! 🎉" : "Express Interest"}
              </Typography>
              {interestedJob && (
                <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mt: 0.25 }}>
                  {interestedJob.title} • {interestedJob.company}
                </Typography>
              )}
            </Box>
            <IconButton size="small" onClick={() => setInterestedJob(null)}>
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          {applied ? (
            <Box sx={{ py: 2, textAlign: "center" }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Icon icon="mdi:check-circle" width={32} height={32} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Thank you, {applicantName}!
              </Typography>
              <Typography variant="body2" sx={{ color: dark ? "#94a3b8" : "#64748b", mb: 3 }}>
                Your interest has been recorded. We will connect you directly with the engineering talent team at{" "}
                <strong>{interestedJob?.company}</strong>.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  if (interestedJob?.applicationUrl) {
                    window.open(interestedJob.applicationUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                endIcon={<Icon icon="mdi:open-in-new" />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Visit Official Careers Portal
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleApplySubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.2, pt: 1 }}>
              <Typography variant="body2" sx={{ color: dark ? "#94a3b8" : "#64748b" }}>
                Submit your details to express quick interest in this role at <strong>{interestedJob?.company}</strong> in{" "}
                {interestedJob?.location}.
              </Typography>

              <TextField
                required
                fullWidth
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                size="small"
              />

              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                placeholder="e.g. rahul@example.com"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                size="small"
              />

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  backgroundColor: dark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  border: "1px solid",
                  borderColor: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" sx={{ color: dark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                  Compensation: <strong style={{ color: dark ? "#38bdf8" : "#0284c7" }}>{interestedJob?.salary}</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: dark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
                  Experience: <strong>{interestedJob?.experience}</strong>
                </Typography>
              </Box>

              <DialogActions sx={{ px: 0, pt: 1 }}>
                <Button
                  onClick={() => {
                    if (interestedJob) {
                      setInterestedJob(null);
                      router.push(`/jobs/${interestedJob.id}`);
                    }
                  }}
                  sx={{ textTransform: "none", color: dark ? "#94a3b8" : "#64748b" }}
                >
                  View Full Job Details
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!applicantName.trim() || !applicantEmail.trim()}
                  sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
                >
                  Submit Interest
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
