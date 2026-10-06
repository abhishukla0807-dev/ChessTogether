import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { CustomPieces, Piece } from "react-chessboard/dist/chessboard/types";
import { useAtomValue } from "jotai";
import { pieceSetAtom } from "@/components/board/states";
import { useRouter } from "next/router";
import { getSocket } from "@/lib/socket";
import {
  playMoveSound,
  playCaptureSound,
  playIllegalMoveSound,
} from "@/lib/sounds";

const PIECE_CODES: Piece[] = [
  "wP", "wB", "wN", "wR", "wQ", "wK",
  "bP", "bB", "bN", "bR", "bQ", "bK",
];

// ── Types ──────────────────────────────────────────────────────────────

interface SessionState {
  id: string;
  whiteName: string;
  blackName: string;
  moves: string[];
  turn: "white" | "black";
  createdAt: number;
  // ── Server-authoritative chess clocks (added for lag compensation) ──
  whiteTimeMs: number;   // remaining ms on White's clock
  blackTimeMs: number;   // remaining ms on Black's clock
  lastMoveAt: number;    // server epoch-ms of last move (for live countdown)
  flagged: boolean;      // true if a player has run out of time
  activePlayerTimeMs: number; // live remaining time for the player to move
}

interface Props {
  sessionId: string;
  playerRole: "white" | "black";
}

// ── Helpers ────────────────────────────────────────────────────────────

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

function formatClock(ms: number | undefined): string {
  if (ms === undefined || isNaN(ms)) return "05:00";
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (totalSeconds < 10 && safeMs > 0) {
    const tenths = Math.floor((safeMs % 1000) / 100);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// ── Component ──────────────────────────────────────────────────────────

export default function MultiplayerGame({ sessionId, playerRole }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const [session, setSession] = useState<SessionState | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [gameOverDismissed, setGameOverDismissed] = useState(false);

  const prevMovesCountRef = useRef<number>(-1);

  // Save active session for quick return from other tabs
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

  // ── Responsive window observer ────────────────────────────────────────
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Piece set ─────────────────────────────────────────────────────────
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
            }}
          />
        );
        return acc;
      }, {}),
    [activePieceSet]
  );

  // ── Responsive Board Size (Guarantees both player names are always visible) ──
  const boardSize = useMemo(() => {
    const w = windowDimensions.width;
    const h = windowDimensions.height;

    // Overhead budget:
    // NavBar (~54px) + Top Player Bar (~44px) + Bottom Player Bar (~44px) + Spacing/Paddings (~30px)
    const verticalOverhead = 172;
    const horizontalOverhead = w < 600 ? 24 : 48;

    const maxFromHeight = h - verticalOverhead;
    const maxFromWidth = w - horizontalOverhead;

    const size = Math.floor(Math.min(maxFromWidth, maxFromHeight));
    return Math.max(220, Math.min(size, 580));
  }, [windowDimensions]);

  // ── Socket.io WebSocket Connection (Instant Real-time Sync) ───────────
  useEffect(() => {
    let activeSocket: any = null;

    const setupSocket = async () => {
      activeSocket = await getSocket();
      activeSocket.emit("join-session", sessionId);

      activeSocket.on("session-updated", (updatedSession: SessionState) => {
        setSession(updatedSession);
        setFetchError("");
      });

      // ── Timeout / Flag event: a player ran out of time ──
      activeSocket.on("game-flagged", (flaggedSession: SessionState) => {
        setSession({ ...flaggedSession, flagged: true });
      });
    };

    setupSocket();

    return () => {
      if (activeSocket) {
        activeSocket.off("session-updated");
        activeSocket.off("game-flagged");
      }
    };
  }, [sessionId]);

  // ── Background Poll Fallback ──────────────────────────────────────────
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

  // ── Board State from Moves ────────────────────────────────────────────
  const chess = useMemo(
    () => buildBoardFromMoves(session?.moves ?? []),
    [session?.moves]
  );

  const isMyTurn = session ? session.turn === playerRole : false;
  const isGameOver = chess.isGameOver() || Boolean(session?.flagged);

  // ── Live Chess Clock (Synchronized with Server Lag Compensation) ──────
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (!session || isGameOver) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 200);
    return () => clearInterval(timer);
  }, [session, isGameOver]);

  const { whiteRemainingMs, blackRemainingMs } = useMemo(() => {
    const defaultMs = 5 * 60 * 1000;
    if (!session) return { whiteRemainingMs: defaultMs, blackRemainingMs: defaultMs };

    const rawWhite = session.whiteTimeMs ?? defaultMs;
    const rawBlack = session.blackTimeMs ?? defaultMs;
    const lastMove = session.lastMoveAt || session.createdAt || now;

    if (isGameOver) {
      return { whiteRemainingMs: rawWhite, blackRemainingMs: rawBlack };
    }

    const elapsed = Math.max(0, now - lastMove);
    if (session.turn === "white") {
      return {
        whiteRemainingMs: Math.max(0, rawWhite - elapsed),
        blackRemainingMs: rawBlack,
      };
    } else {
      return {
        whiteRemainingMs: rawWhite,
        blackRemainingMs: Math.max(0, rawBlack - elapsed),
      };
    }
  }, [session, now, isGameOver]);

  // Audio feedback when opponent makes a move
  useEffect(() => {
    if (session?.moves) {
      const currentCount = session.moves.length;
      if (prevMovesCountRef.current >= 0 && currentCount > prevMovesCountRef.current) {
        const lastMoveStr = session.moves[session.moves.length - 1];
        const tempGame = buildBoardFromMoves(session.moves.slice(0, -1));
        try {
          const moveRes = tempGame.move(lastMoveStr);
          if (moveRes?.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
        } catch {
          playMoveSound();
        }
      }
      prevMovesCountRef.current = currentCount;
    }
  }, [session?.moves]);

  // ── Execute Move Instantly (Optimistic UI + WebSocket + REST) ─────────
  const executeMove = useCallback(
    (source: Square, target: Square): boolean => {
      if (!session || !isMyTurn || isGameOver) return false;

      const testGame = buildBoardFromMoves(session.moves);

      // Check if it's a pawn promotion
      const pieceOnSource = testGame.get(source);
      const isPromotion =
        pieceOnSource?.type === "p" &&
        ((pieceOnSource.color === "w" && target[1] === "8") ||
          (pieceOnSource.color === "b" && target[1] === "1"));

      let moveResult: any = null;
      try {
        moveResult = testGame.move({
          from: source,
          to: target,
          promotion: isPromotion ? "q" : undefined,
        });
      } catch {
        moveResult = null;
      }

      if (!moveResult) {
        playIllegalMoveSound();
        return false;
      }

      // Valid move!
      const parsedMove =
        moveResult.from + moveResult.to + (moveResult.promotion ?? "");
      const nextTurn = session.turn === "white" ? "black" : "white";

      // Instant sound
      if (moveResult.captured) {
        playCaptureSound();
      } else {
        playMoveSound();
      }

      // Clear selection
      setSelectedSquare(null);

      // 1. Instant 0ms Optimistic UI Update
      setSession((prev) =>
        prev
          ? {
              ...prev,
              moves: [...prev.moves, parsedMove],
              turn: nextTurn,
            }
          : prev
      );

      // 2. Instant WebSocket Broadcast (<10ms)
      // clientSentAt is stamped HERE (before the async socket call)
      // so the server can measure one-way latency and credit it back to our clock.
      const clientSentAt = Date.now();
      getSocket().then((sock) => {
        if (sock) {
          sock.emit("play-move", {
            sessionId,
            move: parsedMove,
            player: playerRole,
            clientSentAt,   // ← lag compensation timestamp
          });
        }
      });

      // 3. Background REST sync
      fetch(`/api/sessions/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move: parsedMove, player: playerRole, clientSentAt }),
      }).then(async (res) => {
        if (!res.ok) {
          fetchSession(); // Rollback if server rejected
        }
      }).catch(() => {
        // WebSocket or polling will sync
      });

      return true;
    },
    [session, isMyTurn, isGameOver, sessionId, playerRole, fetchSession]
  );

  // ── Drag and Drop Handler ─────────────────────────────────────────────
  const onPieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square, piece: Piece): boolean => {
      if (!isMyTurn || isGameOver) {
        playIllegalMoveSound();
        return false;
      }

      const pieceColor = piece.startsWith("w") ? "white" : "black";
      if (pieceColor !== playerRole) {
        playIllegalMoveSound();
        return false;
      }

      return executeMove(sourceSquare, targetSquare);
    },
    [isMyTurn, isGameOver, playerRole, executeMove]
  );

  // ── Click-to-Move Handler (Touch / Click accessibility) ────────────────
  const onSquareClick = useCallback(
    (square: Square) => {
      if (!isMyTurn || isGameOver) return;

      const pieceOnSquare = chess.get(square);
      const isOwnPiece =
        pieceOnSquare &&
        pieceOnSquare.color === (playerRole === "white" ? "w" : "b");

      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          return;
        }

        if (isOwnPiece) {
          setSelectedSquare(square);
          return;
        }

        const success = executeMove(selectedSquare, square);
        if (!success) {
          setSelectedSquare(null);
        }
      } else {
        if (isOwnPiece) {
          setSelectedSquare(square);
        }
      }
    },
    [isMyTurn, isGameOver, chess, playerRole, selectedSquare, executeMove]
  );

  // ── Square Highlights (Last Move, Selected Piece, Legal Moves, Check) ──
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // 1. Highlight last move (from & to squares)
    if (session?.moves && session.moves.length > 0) {
      const lastMove = session.moves[session.moves.length - 1];
      if (lastMove.length >= 4) {
        const from = lastMove.slice(0, 2);
        const to = lastMove.slice(2, 4);
        styles[from] = {
          backgroundColor: dark
            ? "rgba(59, 154, 198, 0.25)"
            : "rgba(59, 154, 198, 0.2)",
        };
        styles[to] = {
          backgroundColor: dark
            ? "rgba(59, 154, 198, 0.35)"
            : "rgba(59, 154, 198, 0.3)",
        };
      }
    }

    // 2. Highlight King in check
    if (chess.inCheck()) {
      const turnColor = chess.turn();
      const board = chess.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.type === "k" && p.color === turnColor) {
            const file = String.fromCharCode(97 + c);
            const rank = (8 - r).toString();
            const kingSquare = `${file}${rank}`;
            styles[kingSquare] = {
              background:
                "radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.35) 60%, transparent 75%)",
              borderRadius: "50%",
            };
          }
        }
      }
    }

    // 3. Highlight selected piece square and its legal destination squares
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(59, 154, 198, 0.45)",
        boxShadow: "inset 0 0 8px rgba(59, 154, 198, 0.8)",
      };

      try {
        const legalMoves = chess.moves({
          square: selectedSquare,
          verbose: true,
        });

        for (const m of legalMoves) {
          const target = m.to;
          const isCapture = Boolean(m.captured);
          styles[target] = isCapture
            ? {
                background:
                  "radial-gradient(circle, transparent 60%, rgba(239, 68, 68, 0.6) 61%)",
                borderRadius: "50%",
              }
            : {
                background:
                  "radial-gradient(circle, rgba(59, 154, 198, 0.6) 26%, transparent 28%)",
              };
        }
      } catch {
        // Ignore
      }
    }

    return styles;
  }, [session?.moves, chess, selectedSquare, dark]);

  // ── Copy Link Action ──────────────────────────────────────────────────
  const copyShareLink = () => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${base}/play?session=${sessionId}&role=${
      playerRole === "white" ? "black" : "white"
    }&joined=1`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
  };

  // ── Loading & Error States ────────────────────────────────────────────
  if (!session && !fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          flex: 1,
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ color: "text.secondary" }}>
          Connecting to match…
        </Typography>
      </Box>
    );
  }

  if (fetchError && !session) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          flex: 1,
          gap: 2,
        }}
      >
        <Typography sx={{ color: "error.main", fontWeight: 600 }}>
          {fetchError}
        </Typography>
        <Button variant="outlined" onClick={() => router.push("/play")}>
          Back to Play
        </Button>
      </Box>
    );
  }

  if (!session) return null;

  const currentBoardOrientation = boardFlipped
    ? playerRole === "black"
      ? "white"
      : "black"
    : playerRole === "black"
    ? "black"
    : "white";

  const topPlayerRole = currentBoardOrientation === "white" ? "black" : "white";
  const bottomPlayerRole = currentBoardOrientation === "white" ? "white" : "black";

  const topPlayerName =
    topPlayerRole === "white" ? session.whiteName : session.blackName;
  const bottomPlayerName =
    bottomPlayerRole === "white" ? session.whiteName : session.blackName;

  const isTopPlayerTurn = session.turn === topPlayerRole;
  const isBottomPlayerTurn = session.turn === bottomPlayerRole;

  const topPlayerTimeMs = topPlayerRole === "white" ? whiteRemainingMs : blackRemainingMs;
  const bottomPlayerTimeMs = bottomPlayerRole === "white" ? whiteRemainingMs : blackRemainingMs;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        py: { xs: 0.5, sm: 1 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* ── Centered Chess Arena (Board + Both Player Bars) ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: boardSize,
          maxWidth: "100%",
        }}
      >
        {/* ── Top Player Bar ── */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 0.5, sm: 1 },
            py: 0.5,
            mb: 0.5,
            borderRadius: "6px",
            backgroundColor: isTopPlayerTurn
              ? dark ? "rgba(59,154,198,0.12)" : "rgba(59,154,198,0.08)"
              : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: topPlayerRole === "black" ? "#1e2022" : "#f1f3f5",
                border: `2px solid ${topPlayerRole === "black" ? "#4a4d52" : "#cbd5e1"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.72rem",
                color: topPlayerRole === "black" ? "#f8fafc" : "#111827",
                flexShrink: 0,
              }}
            >
              {topPlayerRole === "black" ? "B" : "W"}
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "0.92rem" },
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              {topPlayerName}
              {topPlayerRole === playerRole && (
                <Chip
                  label="You"
                  size="small"
                  color="primary"
                  sx={{ height: 18, fontSize: "0.68rem", fontWeight: 700 }}
                />
              )}
            </Typography>
          </Box>

          {/* Top Player Status, Clock & Quick Utilities */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
            {/* Top Player Clock Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
                fontWeight: 700,
                fontSize: { xs: "0.82rem", sm: "0.88rem" },
                letterSpacing: "0.5px",
                backgroundColor: isTopPlayerTurn
                  ? topPlayerTimeMs < 30000
                    ? "rgba(239, 68, 68, 0.2)"
                    : dark
                    ? "rgba(59, 154, 198, 0.2)"
                    : "rgba(59, 154, 198, 0.12)"
                  : dark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.05)",
                color:
                  topPlayerTimeMs < 30000 && isTopPlayerTurn
                    ? "#ef4444"
                    : isTopPlayerTurn
                    ? "primary.main"
                    : "text.secondary",
                border: "1px solid",
                borderColor: isTopPlayerTurn
                  ? topPlayerTimeMs < 30000
                    ? "rgba(239, 68, 68, 0.5)"
                    : "primary.main"
                  : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              <Icon icon="mdi:clock-outline" width={14} />
              {formatClock(topPlayerTimeMs)}
            </Box>

            {isTopPlayerTurn && !isGameOver && (
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mr: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                Thinking…
              </Typography>
            )}

            <Tooltip title="Copy invite link">
              <IconButton
                size="small"
                onClick={copyShareLink}
                sx={{
                  p: 0.5,
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Icon icon="mdi:content-copy" width={16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Flip board view">
              <IconButton
                size="small"
                onClick={() => setBoardFlipped((v) => !v)}
                sx={{
                  p: 0.5,
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Icon icon="mdi:rotate-3d-variant" width={16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Match Chat">
              <IconButton
                size="small"
                onClick={() =>
                  router.push(`/chat?session=${sessionId}&role=${playerRole}`)
                }
                sx={{
                  p: 0.5,
                  color: "primary.main",
                  "&:hover": { backgroundColor: "rgba(59,154,198,0.15)" },
                }}
              >
                <Icon icon="streamline:chat-bubble-square-typing-solid" width={15} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Interactive Chessboard with Drag & Drop ── */}
        <Box
          sx={{
            borderRadius: "8px",
            boxShadow: dark
              ? "0 4px 24px rgba(0,0,0,0.6)"
              : "0 4px 20px rgba(0,0,0,0.14)",
            overflow: "hidden",
            width: boardSize,
            height: boardSize,
            backgroundColor: dark ? "#1f2024" : "#e2e8f0",
            flexShrink: 0,
          }}
        >
          <Chessboard
            id="MultiplayerBoard"
            position={chess.fen()}
            boardWidth={boardSize}
            boardOrientation={currentBoardOrientation}
            arePiecesDraggable={isMyTurn && !isGameOver}
            isDraggablePiece={({ piece }) =>
              isMyTurn &&
              !isGameOver &&
              (playerRole === "white"
                ? piece.startsWith("w")
                : piece.startsWith("b"))
            }
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            customPieces={customPieces}
            animationDuration={150}
            customBoardStyle={{
              borderRadius: "6px",
            }}
          />
        </Box>

        {/* ── Bottom Player Bar ── */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 0.5, sm: 1 },
            py: 0.5,
            mt: 0.5,
            borderRadius: "6px",
            backgroundColor: isBottomPlayerTurn
              ? dark ? "rgba(59,154,198,0.12)" : "rgba(59,154,198,0.08)"
              : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: bottomPlayerRole === "black" ? "#1e2022" : "#f1f3f5",
                border: `2px solid ${bottomPlayerRole === "black" ? "#4a4d52" : "#cbd5e1"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.72rem",
                color: bottomPlayerRole === "black" ? "#f8fafc" : "#111827",
                flexShrink: 0,
              }}
            >
              {bottomPlayerRole === "black" ? "B" : "W"}
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "0.92rem" },
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              {bottomPlayerName}
              {bottomPlayerRole === playerRole && (
                <Chip
                  label="You"
                  size="small"
                  color="primary"
                  sx={{ height: 18, fontSize: "0.68rem", fontWeight: 700 }}
                />
              )}
            </Typography>
          </Box>

          {/* Bottom Player Turn Badge & Clock */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
            {/* Bottom Player Clock Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
                fontWeight: 700,
                fontSize: { xs: "0.82rem", sm: "0.88rem" },
                letterSpacing: "0.5px",
                backgroundColor: isBottomPlayerTurn
                  ? bottomPlayerTimeMs < 30000
                    ? "rgba(239, 68, 68, 0.2)"
                    : dark
                    ? "rgba(59, 154, 198, 0.2)"
                    : "rgba(59, 154, 198, 0.12)"
                  : dark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.05)",
                color:
                  bottomPlayerTimeMs < 30000 && isBottomPlayerTurn
                    ? "#ef4444"
                    : isBottomPlayerTurn
                    ? "primary.main"
                    : "text.secondary",
                border: "1px solid",
                borderColor: isBottomPlayerTurn
                  ? bottomPlayerTimeMs < 30000
                    ? "rgba(239, 68, 68, 0.5)"
                    : "primary.main"
                  : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              <Icon icon="mdi:clock-outline" width={14} />
              {formatClock(bottomPlayerTimeMs)}
            </Box>

            {isBottomPlayerTurn && !isGameOver ? (
              <Chip
                label={bottomPlayerRole === playerRole ? "Your turn" : "Thinking…"}
                size="small"
                color={bottomPlayerRole === playerRole ? "primary" : "default"}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  height: 22,
                }}
              />
            ) : isGameOver ? (
              <Chip
                label="Game Over"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  height: 22,
                }}
              />
            ) : null}
          </Box>
        </Box>
      </Box>

      {/* ── Game Over Dialog / Modal ── */}
      <Dialog
        open={isGameOver && !gameOverDismissed}
        onClose={() => setGameOverDismissed(true)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1.5,
            minWidth: 300,
            textAlign: "center",
            backgroundColor: dark ? "#19191c" : "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.25rem", pb: 1 }}>
          🏁 Game Over
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "1rem", color: "text.primary", mb: 1 }}>
            {chess.isCheckmate()
              ? `Checkmate! ${
                  session.turn === "white" ? session.blackName : session.whiteName
                } wins!`
              : session.flagged
              ? `⏰ Time Out! ${
                  session.turn === "white" ? session.blackName : session.whiteName
                } wins on time!`
              : chess.isDraw()
              ? "The game ended in a draw!"
              : "The game has concluded."}
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
            Total moves played: {session.moves.length}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setGameOverDismissed(true)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Review Board
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/play")}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Play New Match
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Copy link snackbar ── */}
      <Snackbar
        open={copiedLink}
        autoHideDuration={2000}
        onClose={() => setCopiedLink(false)}
        message="Match invite link copied to clipboard! 📋"
      />
    </Box>
  );
}
