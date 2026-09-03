import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

export default function SessionSetup() {
  const router = useRouter();
  const [whiteName, setWhiteName] = useState("");
  const [blackName, setBlackName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!whiteName.trim() || !blackName.trim()) {
      setError("Please enter both player names.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whiteName: whiteName.trim(),
          blackName: blackName.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const data = await res.json();
      const id: string = data.id;
      setSessionId(id);

      const base =
        typeof window !== "undefined" ? window.location.origin : "";
      const link = `${base}/play?session=${id}&role=black`;
      setShareLink(link);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartAsWhite = () => {
    router.push(`/play?session=${sessionId}&role=white`);
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#19191c",
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2.5,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
        }}
      >
        {/* ── Clean Header (No Logo) ── */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            backgroundColor: "#cdd6e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              color: "#1a1d21",
              letterSpacing: "-0.01em",
            }}
          >
            Create a Game
          </Typography>

          {shareLink && (
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setShareLink("");
                setSessionId("");
              }}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: "#4a5568",
                fontSize: "0.76rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { backgroundColor: "transparent", color: "#111" },
              }}
            >
              Reset
            </Button>
          )}
        </Box>

        {/* ── Card Body ── */}
        <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
          {!shareLink ? (
            <>
              {/* White player input */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#8b949e",
                    mb: 0.5,
                  }}
                >
                  White Player
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Your Name"
                  value={whiteName}
                  onChange={(e) => setWhiteName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  autoComplete="off"
                  inputProps={{ maxLength: 30 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& input": {
                      color: "#e8eaed",
                    },
                  }}
                />
              </Box>

              {/* Black player input */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#8b949e",
                    mb: 0.5,
                  }}
                >
                  Black Player
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Opponent's Name"
                  value={blackName}
                  onChange={(e) => setBlackName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  autoComplete="off"
                  inputProps={{ maxLength: 30 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& input": {
                      color: "#e8eaed",
                    },
                  }}
                />
              </Box>

              {error && (
                <Typography
                  sx={{
                    color: "salmon",
                    fontSize: "0.8rem",
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  {error}
                </Typography>
              )}

              <Button
                id="create-session-btn"
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={handleCreate}
                sx={{
                  py: 1.1,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "primary.main",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(59, 154, 198, 0.3)",
                  "&:hover": {
                    backgroundColor: "#2e88b2",
                    boxShadow: "0 2px 12px rgba(59, 154, 198, 0.5)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Create Session"
                )}
              </Button>
            </>
          ) : (
            /* ── Clean Post-Creation Share View ── */
            <>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#a0aec0",
                  mb: 1,
                }}
              >
                Share with {blackName} (Black):
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={shareLink}
                  inputProps={{
                    readOnly: true,
                    style: {
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "0.78rem",
                      color: "#e2e8f0",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                          <IconButton
                            size="small"
                            onClick={handleCopy}
                            sx={{
                              color: copied ? "primary.main" : "#8b949e",
                              "&:hover": { color: "#fff" },
                            }}
                          >
                            <Icon
                              icon={copied ? "mdi:check" : "mdi:content-copy"}
                              height={16}
                            />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Box>

              <Button
                id="start-as-white-btn"
                fullWidth
                variant="contained"
                onClick={handleStartAsWhite}
                sx={{
                  py: 1.1,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "primary.main",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(59, 154, 198, 0.3)",
                  "&:hover": {
                    backgroundColor: "#2e88b2",
                    boxShadow: "0 2px 12px rgba(59, 154, 198, 0.5)",
                  },
                }}
              >
                Start Game as White
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
