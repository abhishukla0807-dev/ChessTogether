import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

interface SessionInfo {
  id: string;
  whiteName: string;
  blackName: string;
  moves: string[];
  turn: "white" | "black";
}

interface Props {
  sessionId: string;
}

export default function JoinLobby({ sessionId }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) {
          setError(
            res.status === 404
              ? "Session not found or expired."
              : "Failed to load session."
          );
          return;
        }
        const data: SessionInfo = await res.json();
        setSession(data);
      } catch {
        setError("Network error.");
      }
    };
    load();
  }, [sessionId]);

  const handleJoin = () => {
    setJoining(true);
    router.push(`/play?session=${sessionId}&role=black&joined=1`);
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
            Game Invitation
          </Typography>
        </Box>

        {/* ── Card Body ── */}
        <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
          {!session && !error && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 3,
                gap: 1.5,
              }}
            >
              <CircularProgress size={18} color="primary" />
              <Typography sx={{ color: "#8b949e", fontSize: "0.85rem" }}>
                Loading game…
              </Typography>
            </Box>
          )}

          {error && (
            <Typography
              sx={{
                color: "salmon",
                fontSize: "0.85rem",
                textAlign: "center",
                py: 2,
              }}
            >
              {error}
            </Typography>
          )}

          {session && (
            <>
              {/* Match info row */}
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  p: 2,
                  mb: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", color: "#8b949e" }}>
                    Opponent (White):
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#e8eaed" }}
                  >
                    {session.whiteName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", color: "#8b949e" }}>
                    You (Black):
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "primary.main",
                    }}
                  >
                    {session.blackName}
                  </Typography>
                </Box>
              </Box>

              <Button
                id="join-game-btn"
                fullWidth
                variant="contained"
                onClick={handleJoin}
                disabled={joining}
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
                {joining ? "Joining…" : "Join Game"}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
