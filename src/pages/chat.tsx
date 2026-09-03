import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { PageTitle } from "@/components/pageTitle";
import { ChatMessage } from "@/lib/sessionStore";
import { getSocket } from "@/lib/socket";

export default function ChatPage() {
  const router = useRouter();
  const { session: querySessionId, role: queryRole } = router.query as {
    session?: string;
    role?: string;
  };

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    querySessionId || ""
  );
  const [userRole, setUserRole] = useState<"white" | "black" | "spectator">(
    queryRole === "black" ? "black" : "white"
  );
  const [activeGame, setActiveGame] = useState<{
    sessionId: string;
    role: "white" | "black";
  } | null>(null);

  const [senderName, setSenderName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionDetails, setSessionDetails] = useState<{
    id: string;
    whiteName: string;
    blackName: string;
  } | null>(null);

  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [showSessionInput, setShowSessionInput] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync query params and local active game
  useEffect(() => {
    try {
      const stored = localStorage.getItem("activeChessSession");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.sessionId) {
          setActiveGame(parsed);
          // If no session query param in URL, auto-select their active game chat
          if (!querySessionId) {
            setSelectedSessionId(parsed.sessionId);
            setUserRole(parsed.role || "white");
          }
        }
      }
    } catch (e) {
      console.error("Failed to read active session:", e);
    }

    if (querySessionId) {
      setSelectedSessionId(querySessionId);
    }
    if (queryRole === "black") {
      setUserRole("black");
    } else if (queryRole === "white") {
      setUserRole("white");
    }
  }, [querySessionId, queryRole]);

  // Scroll ONLY the message container
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages (Initial & background sync)
  const fetchMessages = useCallback(async () => {
    try {
      if (selectedSessionId) {
        const res = await fetch(`/api/sessions/${selectedSessionId}/chat`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setSessionDetails({
            id: data.sessionId,
            whiteName: data.whiteName,
            blackName: data.blackName,
          });
          if (!senderName) {
            setSenderName(
              userRole === "white"
                ? data.whiteName
                : userRole === "black"
                ? data.blackName
                : "Player"
            );
          }
        }
      } else {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setSessionDetails(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedSessionId, userRole, senderName]);

  // ── Socket.io WebSocket Connection for Real-time Instant Chat ────
  useEffect(() => {
    let activeSocket: any = null;

    const setupSocket = async () => {
      activeSocket = await getSocket();

      if (selectedSessionId) {
        activeSocket.emit("join-session", selectedSessionId);
      } else {
        activeSocket.emit("join-lobby");
      }

      activeSocket.on("new-chat-message", (newMsg: ChatMessage) => {
        setMessages((prev) => {
          const filtered = prev.filter(
            (m) =>
              !(
                m.id.startsWith("opt-") &&
                m.sender === newMsg.sender &&
                m.text === newMsg.text
              )
          );
          if (filtered.some((m) => m.id === newMsg.id)) return filtered;
          return [...filtered, newMsg];
        });
      });

      activeSocket.on("new-lobby-message", (newMsg: ChatMessage) => {
        if (!selectedSessionId) {
          setMessages((prev) => {
            const filtered = prev.filter(
              (m) =>
                !(
                  m.id.startsWith("opt-") &&
                  m.sender === newMsg.sender &&
                  m.text === newMsg.text
                )
            );
            if (filtered.some((m) => m.id === newMsg.id)) return filtered;
            return [...filtered, newMsg];
          });
        }
      });
    };

    setupSocket();

    return () => {
      if (activeSocket) {
        activeSocket.off("new-chat-message");
        activeSocket.off("new-lobby-message");
      }
    };
  }, [selectedSessionId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Send message (Instant 0ms Optimistic Dispatch + Socket.io primary)
  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || sending) return;

    setSending(true);
    setInputMessage("");

    const currentSender =
      senderName.trim() ||
      (sessionDetails
        ? userRole === "white"
          ? sessionDetails.whiteName
          : userRole === "black"
          ? sessionDetails.blackName
          : "Player"
        : "Player");

    // ── Instant 0ms Optimistic Message ──
    const optimisticMsg: ChatMessage = {
      id: `opt-${Date.now()}`,
      sender: currentSender,
      role: userRole,
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const sock = await getSocket();
      if (sock && sock.connected) {
        if (selectedSessionId) {
          sock.emit("send-chat", {
            sessionId: selectedSessionId,
            sender: currentSender,
            role: userRole,
            text,
          });
        } else {
          sock.emit("send-lobby-chat", {
            sender: currentSender,
            role: userRole,
            text,
          });
        }
      } else {
        // Fallback to HTTP POST only if socket is offline
        const endpoint = selectedSessionId
          ? `/api/sessions/${selectedSessionId}/chat`
          : "/api/chat";

        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: currentSender,
            role: userRole,
            text,
          }),
        });
        fetchMessages();
      }
    } catch (e) {
      console.error("Send error:", e);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSwitchSession = (id: string) => {
    const cleanId = id.trim();
    setSelectedSessionId(cleanId);
    setShowSessionInput(false);
    if (cleanId) {
      router.replace(`/chat?session=${cleanId}`);
    } else {
      router.replace("/chat");
    }
  };

  // Navigate back to the ongoing chess game
  const handleGoBackToGame = () => {
    const targetSessionId = selectedSessionId || activeGame?.sessionId;
    const targetRole =
      userRole === "spectator" ? activeGame?.role || "white" : userRole;

    if (targetSessionId) {
      router.push(`/play?session=${targetSessionId}&role=${targetRole}&joined=1`);
    } else {
      router.push("/play");
    }
  };

  const hasTargetGame = Boolean(selectedSessionId || activeGame?.sessionId);

  const subtitle = useMemo(() => {
    if (sessionDetails) {
      return `${sessionDetails.whiteName} vs ${sessionDetails.blackName}`;
    }
    if (selectedSessionId) {
      return `Session: ${selectedSessionId}`;
    }
    return "Global Chess Lobby";
  }, [sessionDetails, selectedSessionId]);

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: "auto",
        px: { xs: 1, sm: 2 },
        py: { xs: 1.5, sm: 3 },
      }}
    >
      <PageTitle title="ByteMate — Chat" />

      {/* ── Main Chat Box (Background exactly matching #19191c header) ── */}
      <Box
        sx={{
          backgroundColor: "#19191c",
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2.5,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          height: { xs: "calc(90vh - 80px)", sm: "calc(84vh - 70px)" },
          minHeight: 480,
          overflow: "hidden",
        }}
      >
        {/* ── Header Bar ── */}
        <Box
          sx={{
            px: 2.5,
            py: 1.25,
            backgroundColor: "#cdd6e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "#1a1d21",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Chat
            </Typography>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#4a5568",
                fontWeight: 600,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Action Buttons: "Go back" button matching Join button styling */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {hasTargetGame ? (
              <>
                <Button
                  id="go-back-btn"
                  variant="contained"
                  size="small"
                  onClick={handleGoBackToGame}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    px: 2,
                    py: 0.6,
                    borderRadius: "6px",
                    backgroundColor: "primary.main",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(59, 154, 198, 0.3)",
                    "&:hover": {
                      backgroundColor: "#2e88b2",
                      boxShadow: "0 2px 12px rgba(59, 154, 198, 0.5)",
                    },
                  }}
                >
                  Go back
                </Button>
                {selectedSessionId && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleSwitchSession("")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      color: "#2d3748",
                      fontSize: "0.78rem",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                    }}
                  >
                    Lobby
                  </Button>
                )}
              </>
            ) : (
              <Button
                id="join-match-chat-btn"
                variant="contained"
                size="small"
                onClick={() => setShowSessionInput((v) => !v)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  px: 2,
                  py: 0.6,
                  borderRadius: "6px",
                  backgroundColor: "primary.main",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(59, 154, 198, 0.3)",
                  "&:hover": {
                    backgroundColor: "#2e88b2",
                    boxShadow: "0 2px 12px rgba(59, 154, 198, 0.5)",
                  },
                }}
              >
                Join Match Chat
              </Button>
            )}
          </Box>
        </Box>

        {/* Optional Session Connect Input Dropdown */}
        {showSessionInput && !selectedSessionId && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              backgroundColor: "#141416",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <TextField
              size="small"
              placeholder="Enter Session ID (e.g. q671qx6r)"
              value={sessionIdInput}
              onChange={(e) => setSessionIdInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSwitchSession(sessionIdInput)
              }
              sx={{
                flex: 1,
                input: {
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "0.82rem",
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: "6px",
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleSwitchSession(sessionIdInput)}
              sx={{ textTransform: "none", fontWeight: 700, px: 2, borderRadius: "6px" }}
            >
              Connect
            </Button>
          </Box>
        )}

        {/* ── Messages List Stream (Background #19191c) ── */}
        <Box
          ref={messagesContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#19191c",
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "3px",
            },
          }}
        >
          {loading && messages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 1,
              }}
            >
              <CircularProgress size={18} color="primary" />
              <Typography sx={{ color: "#7a8592", fontSize: "0.82rem" }}>
                Connecting to chat…
              </Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                py: 4,
              }}
            >
              <Typography sx={{ color: "#8b949e", fontSize: "0.85rem" }}>
                No messages yet. Send a message to get started!
              </Typography>
            </Box>
          ) : (
            messages.map((msg) => {
              const isSystem = msg.role === "system";
              const isWhite = msg.role === "white";
              const isBlack = msg.role === "black";
              const time = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              if (isSystem) {
                return (
                  <Box
                    key={msg.id}
                    sx={{ display: "flex", justifyContent: "center", my: 0.25 }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#74c0e3",
                        fontFamily: "'Fira Code', monospace",
                        backgroundColor: "rgba(59, 154, 198, 0.08)",
                        px: 1.5,
                        py: 0.3,
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                );
              }

              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "88%",
                    alignSelf: isWhite
                      ? "flex-start"
                      : isBlack
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  {/* Avatar */}
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: isWhite
                        ? "#f0f0f0"
                        : isBlack
                        ? "#222"
                        : "#333",
                      border: "1.5px solid",
                      borderColor: isWhite ? "#3B9AC6" : "#555",
                      color: isWhite ? "#111" : "#fff",
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    {isWhite ? "W" : isBlack ? "B" : "G"}
                  </Box>

                  {/* Bubble */}
                  <Box
                    sx={{
                      backgroundColor: isWhite
                        ? "rgba(59, 154, 198, 0.1)"
                        : isBlack
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.04)",
                      border: "1px solid",
                      borderColor: isWhite
                        ? "rgba(59, 154, 198, 0.25)"
                        : isBlack
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      px: 1.5,
                      py: 0.75,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 0.2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.74rem",
                          color: isWhite ? "primary.main" : "#cdd6e0",
                        }}
                      >
                        {msg.sender}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.65rem", color: "#6b7280" }}
                      >
                        {time}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#f0f6fc",
                        lineHeight: 1.35,
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* ── Input Bar ── */}
        <Box
          sx={{
            p: 1.25,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "#19191c",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            inputRef={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedSessionId
                ? `Message opponent (${userRole === "white" ? "as White" : "as Black"})…`
                : "Type a message in lobby…"
            }
            autoComplete="off"
            inputProps={{ maxLength: 500 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                fontSize: "0.85rem",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.15)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 2px rgba(59, 154, 198, 0.25)",
                },
              },
              "& input": {
                color: "#e8eaed",
              },
              "& input::placeholder": {
                color: "#8b949e",
                opacity: 1,
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={sending || !inputMessage.trim()}
            sx={{
              minWidth: "44px",
              px: 1.75,
              py: 0.8,
              borderRadius: "8px",
              fontWeight: 700,
              backgroundColor: "primary.main",
              color: "#fff",
              "&.Mui-disabled": {
                backgroundColor: "rgba(59, 154, 198, 0.25)",
                color: "rgba(255, 255, 255, 0.4)",
              },
              "&:hover": {
                backgroundColor: "#2e88b2",
              },
            }}
          >
            {sending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Icon icon="mdi:send" width={18} />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
