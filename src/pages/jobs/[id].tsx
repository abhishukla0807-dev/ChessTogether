import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { PageTitle } from "@/components/pageTitle";
import JobCard from "@/components/JobCard";
import jobsData from "@/data/jobs.json";
import { Job } from "@/types/job";
import { submitLeadToGoogleSheet } from "@/lib/sheets";

export default function JobDetailsPage() {
  const router = useRouter();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { id } = router.query;

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const job = useMemo(() => {
    if (!id) return null;
    return (jobsData as Job[]).find((j) => j.id.toString() === id.toString()) || null;
  }, [id]);

  const similarJobs = useMemo(() => {
    if (!job) return [];
    return (jobsData as Job[])
      .filter((j) => j.id !== job.id && (j.field === job.field || j.location === job.location))
      .slice(0, 3);
  }, [job]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setApplied(true);
      submitLeadToGoogleSheet({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        jobId: job?.id,
        jobTitle: job?.title,
        company: job?.company,
        salary: job?.salary,
      });
    }
  };

  if (!job) {
    return (
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Job Not Found
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          The job listing you are looking for may have expired or does not exist.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/jobs")}
          startIcon={<Icon icon="mdi:arrow-left" />}
          sx={{ textTransform: "none" }}
        >
          Back to Jobs
        </Button>
      </Box>
    );
  }

  return (
    <>
      <PageTitle title={`${job.title} at ${job.company} — ChessTogether Jobs`} />

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
        <Box sx={{ width: "100%", maxWidth: "960px", pb: 6 }}>
          {/* ── Breadcrumb / Back ── */}
          <Box sx={{ mb: 2.5 }}>
            <Button
              onClick={() => router.push("/jobs")}
              startIcon={<Icon icon="mdi:arrow-left" />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: dark ? "#94a3b8" : "#64748b",
                px: 1,
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "transparent",
                },
              }}
            >
              Back to all jobs
            </Button>
          </Box>

          {/* ── Main Job Header Paper ── */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: "14px",
              backgroundColor: dark ? "#212126" : "#ffffff",
              border: "1px solid",
              borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2.5,
                mb: 2.5,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.5rem", sm: "1.9rem" },
                    letterSpacing: "-0.02em",
                    color: dark ? "#ffffff" : "#1a1d21",
                    mb: 0.5,
                  }}
                >
                  {job.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1.05rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Icon icon="mdi:domain" width={18} height={18} />
                    {job.company}
                  </Typography>

                  <Box component="span" sx={{ opacity: 0.4 }}>•</Box>

                  <Typography variant="body2" sx={{ color: dark ? "#94a3b8" : "#64748b" }}>
                    {job.field}
                  </Typography>

                  <Box component="span" sx={{ opacity: 0.4 }}>•</Box>

                  <Typography variant="body2" sx={{ color: dark ? "#64748b" : "#94a3b8" }}>
                    Posted {job.postedDate}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
                <Button
                  variant="outlined"
                  onClick={handleShare}
                  startIcon={<Icon icon={copied ? "mdi:check" : "mdi:share-variant-outline"} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                    color: copied ? "#22c55e" : dark ? "#cbd5e1" : "#475569",
                  }}
                >
                  {copied ? "Copied Link!" : "Share"}
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setApplyModalOpen(true)}
                  sx={{
                    flex: { xs: 1, sm: "none" },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    px: 3.5,
                    py: 1,
                    borderRadius: "8px",
                    boxShadow: "none",
                  }}
                >
                  I&apos;m interested
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

            {/* Metadata Pills Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(5, 1fr)" },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: dark ? "#64748b" : "#94a3b8", fontWeight: 600 }}>
                  LOCATION
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: dark ? "#e2e8f0" : "#1e293b", mt: 0.2 }}>
                  {job.location}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: dark ? "#64748b" : "#94a3b8", fontWeight: 600 }}>
                  EXPERIENCE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: dark ? "#e2e8f0" : "#1e293b", mt: 0.2 }}>
                  {job.experience}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: dark ? "#64748b" : "#94a3b8", fontWeight: 600 }}>
                  COMPENSATION
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: dark ? "#38bdf8" : "#0284c7", mt: 0.2 }}
                >
                  {job.salary}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: dark ? "#64748b" : "#94a3b8", fontWeight: 600 }}>
                  JOB TYPE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: dark ? "#e2e8f0" : "#1e293b", mt: 0.2 }}>
                  {job.jobType}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: dark ? "#64748b" : "#94a3b8", fontWeight: 600 }}>
                  WORK MODE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: dark ? "#e2e8f0" : "#1e293b", mt: 0.2 }}>
                  {job.workMode}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* ── Content Sections ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* About the Role */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "14px",
                backgroundColor: dark ? "#212126" : "#ffffff",
                border: "1px solid",
                borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: dark ? "#f1f5f9" : "#0f172a" }}>
                About the Role
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: dark ? "#cbd5e1" : "#334155",
                  lineHeight: 1.7,
                  fontSize: "0.96rem",
                }}
              >
                {job.description}
              </Typography>
            </Paper>

            {/* Key Responsibilities */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "14px",
                backgroundColor: dark ? "#212126" : "#ffffff",
                border: "1px solid",
                borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: dark ? "#f1f5f9" : "#0f172a" }}>
                Key Responsibilities
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 1.2 }}>
                {job.responsibilities.map((resp, i) => (
                  <Typography
                    component="li"
                    key={i}
                    variant="body1"
                    sx={{
                      color: dark ? "#cbd5e1" : "#334155",
                      lineHeight: 1.65,
                      fontSize: "0.94rem",
                    }}
                  >
                    {resp}
                  </Typography>
                ))}
              </Box>
            </Paper>

            {/* Requirements & Qualifications */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "14px",
                backgroundColor: dark ? "#212126" : "#ffffff",
                border: "1px solid",
                borderColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: dark ? "#f1f5f9" : "#0f172a" }}>
                Qualifications & Skills
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 1.2, mb: 3 }}>
                {job.requirements.map((req, i) => (
                  <Typography
                    component="li"
                    key={i}
                    variant="body1"
                    sx={{
                      color: dark ? "#cbd5e1" : "#334155",
                      lineHeight: 1.65,
                      fontSize: "0.94rem",
                    }}
                  >
                    {req}
                  </Typography>
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2, color: dark ? "#e2e8f0" : "#1e293b" }}>
                Technologies & Tools
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {job.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    sx={{
                      fontWeight: 600,
                      borderRadius: "6px",
                      backgroundColor: dark ? "rgba(59, 154, 198, 0.12)" : "rgba(59, 154, 198, 0.08)",
                      color: "primary.main",
                      border: "1px solid",
                      borderColor: dark ? "rgba(59, 154, 198, 0.25)" : "rgba(59, 154, 198, 0.2)",
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Bottom Apply Card Banner */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "14px",
                backgroundColor: dark ? "rgba(59, 154, 198, 0.1)" : "rgba(59, 154, 198, 0.06)",
                border: "1px solid",
                borderColor: dark ? "rgba(59, 154, 198, 0.25)" : "rgba(59, 154, 198, 0.2)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: dark ? "#ffffff" : "#1a1d21" }}>
                  Interested in joining {job.company}?
                </Typography>
                <Typography variant="body2" sx={{ color: dark ? "#94a3b8" : "#64748b", mt: 0.4 }}>
                  Express quick interest or apply directly through their official career portal.
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => setApplyModalOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  borderRadius: "8px",
                  boxShadow: "none",
                }}
              >
                I&apos;m interested
              </Button>
            </Paper>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: dark ? "#f1f5f9" : "#0f172a" }}>
                  Similar Roles You Might Like
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {similarJobs.map((simJob) => (
                    <JobCard
                      key={simJob.id}
                      job={simJob}
                      onInterested={() => router.push(`/jobs/${simJob.id}`)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Apply Modal ── */}
      <Dialog
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
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
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {applied ? "Application Received! 🚀" : `Express Interest in ${job.title}`}
          </Typography>
          <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mt: 0.25 }}>
            {job.company} • {job.location}
          </Typography>
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
                Best of luck, {name}!
              </Typography>
              <Typography variant="body2" sx={{ color: dark ? "#94a3b8" : "#64748b", mb: 3 }}>
                We have registered your interest for this position. You can also explore their official careers page.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => window.open(job.applicationUrl, "_blank", "noopener,noreferrer")}
                endIcon={<Icon icon="mdi:open-in-new" />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Open Official {job.company} Career Site
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleApplySubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.2, pt: 1 }}>
              <TextField
                required
                fullWidth
                label="Full Name"
                placeholder="e.g. Priyanshu Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
              />

              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                placeholder="e.g. priyanshu@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
              />

              <TextField
                fullWidth
                label="Phone Number (Optional)"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
              />

              <DialogActions sx={{ px: 0, pt: 1 }}>
                <Button onClick={() => setApplyModalOpen(false)} sx={{ textTransform: "none" }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!name.trim() || !email.trim()}
                  sx={{ textTransform: "none", fontWeight: 700, px: 3 }}
                >
                  Submit Application
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
