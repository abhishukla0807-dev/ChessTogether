import { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useChessActions } from "@/hooks/useChessActions";
import { boardAtom } from "@/sections/analysis/states";
import { useRouter } from "next/router";

interface MoveEntry {
  color: "White" | "Black";
  move: string;
}

export default function MoveLogPanel() {
  const router = useRouter();
  const { playMove } = useChessActions(boardAtom);
  const [moves, setMoves] = useState<MoveEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Alternate between White and Black each turn
  const currentTurn: "White" | "Black" =
    moves.length % 2 === 0 ? "White" : "Black";

  // Auto-scroll ONLY move container (prevents whole window scrolling on mobile)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [moves]);

  const handleSubmit = useCallback(() => {
    const raw = inputValue.trim();
    if (!raw) return;

    // Attempt UCI-style move (e.g. "e2e4", "g1f3")
    if (raw.length >= 4) {
      const from = raw.slice(0, 2);
      const to = raw.slice(2, 4);
      const promotion = raw.length === 5 ? raw[4].toLowerCase() : undefined;
      playMove({ from, to, ...(promotion ? { promotion } : {}) });
    }

    // Always append to the log regardless (placeholder — backend validation later)
    setMoves((prev) => [...prev, { color: currentTurn, move: raw }]);
    setInputValue("");
    inputRef.current?.focus();
  }, [inputValue, currentTurn, playMove]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "secondary.main",
      }}
    >
      {/* ── Header ── */}
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
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "#1a1d21",
            letterSpacing: "0.02em",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Move Log:
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            title="Open Chat"
            onClick={() => router.push("/chat")}
            sx={{
              color: "#1a1d21",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
            }}
          >
            <Icon
              icon="streamline:chat-bubble-square-typing-solid"
              height={18}
            />
          </IconButton>

          <IconButton
            size="small"
            title="Close"
            onClick={() => console.log("Close panel coming soon")}
            sx={{
              color: "#1a1d21",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
            }}
          >
            <Icon icon="mdi:close" height={18} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Move History ── */}
      <Box
        ref={logContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2.5,
          py: 2,
          fontFamily:
            "'Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: "3px",
          },
        }}
      >
        {moves.length === 0 ? (
          <Typography
            sx={{
              fontFamily:
                "'Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace",
              color: "text.disabled",
              fontSize: "0.82rem",
              mt: 0.5,
              fontStyle: "italic",
            }}
          >
            No moves yet. Type a move below and press Enter.
          </Typography>
        ) : (
          moves.map((entry, i) => (
            <Typography
              key={i}
              sx={{
                fontFamily:
                  "'Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace",
                fontSize: "0.9rem",
                lineHeight: 2,
                letterSpacing: "0.02em",
                color: "text.primary",
              }}
            >
              <Box
                component="span"
                sx={{
                  color:
                    entry.color === "White" ? "primary.main" : "text.secondary",
                  fontWeight: 600,
                }}
              >
                {entry.color}
              </Box>
              {" >> "}
              {entry.move}
            </Typography>
          ))
        )}
      </Box>

      {/* ── CLI Input Area ── */}
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1.5px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            px: 1.5,
            py: 0.9,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            transition: "box-shadow 0.2s ease",
            "&:focus-within": {
              boxShadow: "0 0 0 3px rgba(59, 154, 198, 0.3)",
            },
            fontFamily:
              "'Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace",
          }}
        >
          {/* Turn prefix */}
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
            {currentTurn}&nbsp;{">> "}
          </Typography>

          {/* Text input */}
          <Box
            component="input"
            ref={inputRef}
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="e2e4"
            autoFocus
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
              "&::placeholder": {
                color: "text.disabled",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
