import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid2 as Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { CustomPieces, Piece } from "react-chessboard/dist/chessboard/types";
import { useAtomValue } from "jotai";
import { pieceSetAtom } from "@/components/board/states";
import { useRouter } from "next/router";
import { getSocket } from "@/lib/socket";
import { playMoveSound, playCaptureSound, playIllegalMoveSound } from "@/lib/sounds";

const PIECE_CODES: Piece[] = [
  "wP", "wB", "wN", "wR", "wQ", "wK",
  "bP", "bB", "bN", "bR", "bQ", "bK",
];

// ── types ──────────────────────────────────────────────────────────────

interface SessionState {
  id: string;
  whiteName: string;
  blackName: string;
  moves: string[];
  turn: "white" | "black";
  createdAt: number;
}

interface MoveEntry {
  player: "white" | "black";
  name: string;
  move: string;
  san: string;
}

interface Props {
  sessionId: string;
  playerRole: "white" | "black";
}

// ── helpers ─────────────────────────────────────────────────────────────

function buildBoardFromMoves(moves: string[]): Chess {
  const chess = new Chess();
  for (const m of moves) {
    if (!m) continue;
    try {
      if (m.length >= 4) {
        const from = m.slice(0, 2);
        const to = m.slice(2, 4);
        const promotion = m.length === 5 ? m[4] : undefined;
        const res = chess.move({ from, to, promotion });
        if (!res) chess.move(m);
      } else {
        chess.move(m);
      }
    } catch {
      try {
        chess.move(m);
      } catch {
        // Ignore unparseable move
      }
    }
  }
  return chess;
}

function movesToLog(
  moves: string[],
  whiteName: string,
  blackName: string
): MoveEntry[] {
  const chess = new Chess();
  const entries: MoveEntry[] = [];

  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    if (!m) continue;
    const player: "white" | "black" = i % 2 === 0 ? "white" : "black";
    try {
      let result: any = null;
      if (m.length >= 4) {
        const from = m.slice(0, 2);
        const to = m.slice(2, 4);
        const promotion = m.length === 5 ? m[4] : undefined;
        result = chess.move({ from, to, promotion });
      }
      if (!result) {
        result = chess.move(m);
      }
      entries.push({
        player,
        name: player === "white" ? whiteName : blackName,
        move: m,
        san: result?.san ?? m,
      });
    } catch {
      entries.push({
        player,
        name: player === "white" ? whiteName : blackName,
        move: m,
        san: m,
      });
    }
  }

  return entries;
}

// ── component ────────────────────────────────────────────────────────────

export default function MultiplayerGame({ sessionId, playerRole }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMovesCountRef = useRef<number>(-1);

  // Save active session for instant "Go back" from Chat
  useEffect(() => {
    if (sessionId && playerRole) {
      try {
        localStorage.setItem(
          "activeChessSession",
          JSON.stringify({ sessionId, role: playerRole })
        );
      } catch (e) {
        console.error("Failed to save active session:", e);
      }
    }
  }, [sessionId, playerRole]);

  // ── Reliable window resize / fullscreen observer ──────────────────
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("fullscreenchange", handleResize);
    window.addEventListener("webkitfullscreenchange", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fullscreenchange", handleResize);
      window.removeEventListener("webkitfullscreenchange", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // ── Piece set (guaranteed fallback to 'maestro') ───────────────────
  const pieceSetAtomVal = useAtomValue(pieceSetAtom);
  const activePieceSet = pieceSetAtomVal || "maestro";

  const customPieces = useMemo<CustomPieces>(
    () =>
      PIECE_CODES.reduce<CustomPieces>((acc, piece) => {
        acc[piece] = ({ squareWidth }) => (
          <div
            style={{
              width: squareWidth || "100%",
              height: squareWidth || "100%",
              backgroundImage: `url(/piece/${activePieceSet}/${piece}.svg)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              pointerEvents: "none",
            }}
          />
        );
        return acc;
      }, {}),
    [activePieceSet]
  );

  // ── Board size (fits comfortably within viewport without page scrolling) ──
  const boardSize = useMemo(() => {
    const w = windowDimensions.width;
    const h = windowDimensions.height;
    if (w < 900) {
      return Math.max(220, Math.min(w - 24, h - 220));
    }
    // On desktop:
    // Vertical budget: Total viewport height (h) minus NavBar (~50px), player labels (~80px), margins (~40px)
    const maxFromHeight = h - 170;
    // Horizontal budget: viewport width (w) minus CLI panel (310px), gap (16px), margins/padding (~48px)
    const maxFromWidth = w - 310 - 16 - 48;
    return Math.max(260, Math.min(maxFromWidth, maxFromHeight, 560));
  }, [windowDimensions]);

  // ── Socket.io WebSocket Connection (Instant Real-time Sync) ───────
  useEffect(() => {
    let activeSocket: any = null;

    const setupSocket = async () => {
      activeSocket = await getSocket();
      activeSocket.emit("join-session", sessionId);

      activeSocket.on("session-updated", (updatedSession: SessionState) => {
        setSession(updatedSession);
        setFetchError("");
      });
    };

    setupSocket();

    return () => {
      if (activeSocket) {
        activeSocket.off("session-updated");
      }
    };
  }, [sessionId]);

  // ── Background Poll fallback ─────────────────────────────────────────
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) {
        if (res.status === 404) setFetchError("Session not found.");
        return;
      }
      const data: SessionState = await res.json();
      setSession(data);
      setFetchError("");
    } catch {
      setFetchError("Connection error. Retrying…");
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 2500);
    return () => clearInterval(interval);
  }, [fetchSession]);

  // ── Board state from moves ──────────────────────────────────────────
  const chess = useMemo(
    () => buildBoardFromMoves(session?.moves ?? []),
    [session?.moves]
  );

  const moveLog = useMemo(
    () =>
      session
        ? movesToLog(
            session.moves,
            session.whiteName,
            session.blackName
          )
        : [],
    [session]
  );

  // Play move sounds (capture vs normal move) whenever moves count increases
  useEffect(() => {
    if (session?.moves) {
      const currentCount = session.moves.length;
      if (prevMovesCountRef.current >= 0 && currentCount > prevMovesCountRef.current) {
        try {
          const lastEntry = moveLog[moveLog.length - 1];
          if (lastEntry?.san?.includes("x")) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
        } catch (e) {
          console.error("Audio playback error:", e);
        }
      }
      prevMovesCountRef.current = currentCount;
    }
  }, [session?.moves, moveLog]);

  // ── Submit a move ───────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const raw = inputValue.trim();
    if (!raw || !session) return;

    // Guard: it must be this player's turn
    if (session.turn !== playerRole) {
      setSubmitError("It's not your turn yet.");
      playIllegalMoveSound();
      return;
    }

    // Local pre-validation for 0ms instant response
    const testChess = buildBoardFromMoves(session.moves);
    let moveResult = null;
    if (raw.length >= 4) {
      moveResult = testChess.move({
        from: raw.slice(0, 2),
        to: raw.slice(2, 4),
        promotion: raw.length === 5 ? raw[4].toLowerCase() : undefined,
      });
    }
    if (!moveResult) {
      try {
        moveResult = testChess.move(raw);
      } catch {
        moveResult = null;
      }
    }

    if (!moveResult) {
      setSubmitError(`Invalid move: "${raw}"`);
      playIllegalMoveSound();
      return;
    }

    const parsedMove =
      moveResult.from + moveResult.to + (moveResult.promotion ?? "");
    const nextTurn = session.turn === "white" ? "black" : "white";

    // ── Instant 0ms Optimistic UI Update ──
    setSession((prev) =>
      prev
        ? {
            ...prev,
            moves: [...prev.moves, parsedMove],
            turn: nextTurn,
          }
        : prev
    );
    setInputValue("");
    setSubmitting(true);
    setSubmitError("");
    inputRef.current?.focus();

    // ── Instant WebSocket Emit (<10ms) ──
    getSocket().then((sock) => {
      if (sock) {
        sock.emit("play-move", {
          sessionId,
          move: parsedMove,
          player: playerRole,
        });
      }
    });

    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move: parsedMove, player: playerRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Invalid move.");
        playIllegalMoveSound();
        fetchSession(); // Rollback to server truth
      } else {
        setSession(data as SessionState);
      }
    } catch {
      // Fallback silently if offline (WebSocket or polling will recover)
    } finally {
      setSubmitting(false);
      inputRef.current?.focus();
    }
  }, [inputValue, session, sessionId, playerRole, fetchSession]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  // ── Loading state ───────────────────────────────────────────────────
  if (!session && !fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ color: "#7a8592" }}>
          Connecting to session…
        </Typography>
      </Box>
    );
  }

  if (fetchError && !session) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Typography sx={{ color: "salmon" }}>{fetchError}</Typography>
      </Box>
    );
  }

  if (!session) return null;

  const isMyTurn = session.turn === playerRole;
  const opponentName =
    playerRole === "white" ? session.blackName : session.whiteName;
  const isGameOver = chess.isGameOver();

  const turnPrefix =
    session.turn === "white"
      ? `${session.whiteName} >> `
      : `${session.blackName} >> `;

  return (
    <Grid
      container
      gap={2}
      justifyContent="center"
      alignItems="flex-start"
      sx={{ mt: 1, maxWidth: "100%", overflowX: "hidden" }}
    >
      {/* ── Chess Board ── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Black player label */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#222",
              border: "2px solid #555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "#e8eaed",
            }}
          >
            B
          </Box>
          <Typography
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: "#b0b8c1",
            }}
          >
            {session.blackName}
            {playerRole === "black" && (
              <Chip
                label="You"
                size="small"
                sx={{ ml: 1, fontSize: "0.7rem", height: 18 }}
                color="primary"
              />
            )}
          </Typography>
        </Box>

        {/* Board */}
        <Box
          sx={{
            borderRadius: "6px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
            overflow: "hidden",
            width: boardSize,
            height: boardSize,
          }}
        >
          <Chessboard
            id="MultiplayerBoard"
            position={chess.fen()}
            boardWidth={boardSize}
            boardOrientation={playerRole === "black" ? "black" : "white"}
            isDraggablePiece={() => false}
            arePiecesDraggable={false}
            customPieces={customPieces}
            animationDuration={200}
            customBoardStyle={{
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          />
        </Box>

        {/* White player label */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#f5f5f5",
              border: "2px solid #aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "#111",
            }}
          >
            W
          </Box>
          <Typography
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: "#e8eaed",
            }}
          >
            {session.whiteName}
            {playerRole === "white" && (
              <Chip
                label="You"
                size="small"
                sx={{ ml: 1, fontSize: "0.7rem", height: 18 }}
                color="primary"
              />
            )}
          </Typography>
        </Box>
      </Box>

      {/* ── Right Panel — Move Log + CLI ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { xs: "auto", md: boardSize + 80 },
          maxHeight: { xs: "auto", md: boardSize + 80 },
          width: { xs: "100%", md: 310 },
          maxWidth: { xs: "100%", md: 310 },
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          backgroundColor: "secondary.main",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            backgroundColor: "#cdd6e0",
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#1a1d21",
              }}
            >
              Move Log:
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#4a5568" }}>
              Session: <code style={{ fontSize: "0.7rem" }}>{sessionId}</code>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* Turn indicator */}
            <Chip
              label={
                isGameOver
                  ? "Game Over"
                  : isMyTurn
                  ? "Your turn"
                  : `Waiting for ${opponentName}…`
              }
              size="small"
              sx={{
                fontSize: "0.7rem",
                backgroundColor: isGameOver
                  ? "#555"
                  : isMyTurn
                  ? "rgba(59,154,198,0.2)"
                  : "rgba(255,255,255,0.07)",
                color: isGameOver
                  ? "#aaa"
                  : isMyTurn
                  ? "primary.main"
                  : "#7a8592",
                border: isMyTurn && !isGameOver ? "1px solid" : "none",
                borderColor: "primary.main",
              }}
            />
            <Tooltip title="Match Chat">
              <IconButton
                size="small"
                onClick={() =>
                  router.push(
                    `/chat?session=${sessionId}&role=${playerRole}`
                  )
                }
                sx={{ color: "#1a1d21" }}
              >
                <Icon
                  icon="streamline:chat-bubble-square-typing-solid"
                  height={16}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Move history */}
        <Box
          ref={logContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2.5,
            py: 2,
            maxHeight: { xs: "260px", lg: "unset" },
            fontFamily:
              "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "3px",
            },
          }}
        >
          {moveLog.length === 0 ? (
            <Typography
              sx={{
                fontFamily: "inherit",
                color: "text.disabled",
                fontSize: "0.82rem",
                fontStyle: "italic",
              }}
            >
              No moves yet. {isMyTurn ? "You go first!" : `Waiting for ${opponentName}…`}
            </Typography>
          ) : (
            moveLog.map((entry, i) => (
              <Typography
                key={i}
                sx={{
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  lineHeight: 2,
                  color: "text.primary",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color:
                      entry.player === "white"
                        ? "primary.main"
                        : "text.secondary",
                    fontWeight: 700,
                  }}
                >
                  {entry.name}
                </Box>
                {" >> "}
                {entry.san}
              </Typography>
            ))
          )}

          {isGameOver && (
            <>
              <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />
              <Typography
                sx={{
                  fontFamily: "inherit",
                  color: "primary.main",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                🏁{" "}
                {chess.isCheckmate()
                  ? `Checkmate! ${session.turn === "white" ? session.blackName : session.whiteName} wins.`
                  : chess.isDraw()
                  ? "It's a draw!"
                  : "Game over."}
              </Typography>
            </>
          )}
        </Box>

        {/* CLI input */}
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 2,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          {/* Connection status */}
          {fetchError && (
            <Typography
              sx={{ fontSize: "0.72rem", color: "salmon", mb: 0.75 }}
            >
              ⚠ {fetchError}
            </Typography>
          )}

          {submitError && (
            <Typography
              sx={{ fontSize: "0.72rem", color: "salmon", mb: 0.75 }}
            >
              ✗ {submitError}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1.5px solid",
              borderColor:
                isGameOver || !isMyTurn
                  ? "rgba(255,255,255,0.1)"
                  : "primary.main",
              borderRadius: "6px",
              px: 1.5,
              py: 0.9,
              backgroundColor: "rgba(0,0,0,0.2)",
              transition: "box-shadow 0.2s",
              "&:focus-within": {
                boxShadow:
                  isMyTurn && !isGameOver
                    ? "0 0 0 3px rgba(59,154,198,0.3)"
                    : "none",
              },
              fontFamily:
                "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
              opacity: isGameOver || !isMyTurn ? 0.5 : 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "inherit",
                fontSize: "0.875rem",
                color: "primary.main",
                fontWeight: 700,
                whiteSpace: "nowrap",
                userSelect: "none",
                mr: 0.5,
              }}
            >
              {turnPrefix}
            </Typography>

            <Box
              component="input"
              ref={inputRef}
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                isGameOver
                  ? "Game over"
                  : isMyTurn
                  ? "e2e4"
                  : "Waiting…"
              }
              disabled={!isMyTurn || isGameOver || submitting}
              autoFocus={isMyTurn}
              spellCheck={false}
              autoComplete="off"
              sx={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "text.primary",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                caretColor: "primary.main",
                "&::placeholder": { color: "text.disabled" },
                "&:disabled": { cursor: "not-allowed" },
              }}
            />

            {submitting && (
              <CircularProgress size={14} sx={{ ml: 1, color: "primary.main" }} />
            )}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
