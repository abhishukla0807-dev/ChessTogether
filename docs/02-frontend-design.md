# 02 — Frontend Design & UI Architecture

## 1. Overview & Technology Stack

The ByteMate frontend is built with **Next.js 16 (Turbopack)** and **React 19**, designed for high responsiveness, zero-delay chess interactions, and static site generation for education pathways.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 16 Frontend                           │
├──────────────────────┬─────────────────────────┬───────────────────────┤
│   Rendering Layer    │     State & Audio       │     Chess Engine      │
├──────────────────────┼─────────────────────────┼───────────────────────┤
│ • Next.js SSG / CSR  │ • Jotai State Atoms     │ • react-chessboard    │
│ • Material UI (v6)   │ • Web Audio API Pipeline│ • chess.js (v1.2.0)   │
│ • Emotion CSS-in-JS  │ • Socket.IO Client      │ • Custom SVG sets     │
│ • Iconify Icons      │ • Local Storage Sync    │ • Custom square highlights
└──────────────────────┴─────────────────────────┴───────────────────────┘
```

---

## 2. 0ms Optimistic UI & Move Execution Architecture

To deliver an instant, lag-free user experience, the client implements **Optimistic UI Updates**. When a player moves a piece, the board does not wait for a server round-trip:

```
[User Drags & Drops Piece]
         │
         ▼
[1. Local chess.js Validation] ────► Invalid? ──► [Snap Back + Error Sound]
         │ Valid
         ▼
[2. Instant Audio Playback] (Move or Capture sound via Web Audio buffer)
         │
         ▼
[3. Optimistic React State Update] (setSession updates moves & flips turn in 0ms)
         │
         ├─────────────────────────────────────────┐
         ▼                                         ▼
[4. Async WebSocket Emit]                 [5. Async REST Sync]
(Netty-SocketIO <10ms broadcast)         (POST /api/sessions/{id})
```

### Key Implementation in `MultiplayerGame.tsx`:
```typescript
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
getSocket().then((sock) => {
  if (sock) {
    sock.emit("play-move", {
      sessionId,
      move: parsedMove,
      player: playerRole,
    });
  }
});

// 3. Background REST sync with rollback on failure
fetch(`/api/sessions/${sessionId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ move: parsedMove, player: playerRole }),
}).then(async (res) => {
  if (!res.ok) fetchSession(); // Rollback to server truth
});
```

---

## 3. Drag & Drop and Click-to-Move Mechanics

The chess interface supports both **drag-and-drop** and accessible **click-to-move** gestures:

### Drag & Drop (`react-chessboard`):
- `arePiecesDraggable`: Enabled only when it is the local player's active turn and the game is not over.
- `isDraggablePiece`: Restricts dragging to pieces matching the player's assigned color (`w` or `b`).
- `onPieceDrop`: Invoked when a piece is dropped onto a square, automatically triggering move validation and auto-promotion to Queen (`q`) when a pawn reaches the back rank.

### Click-to-Move (`onSquareClick`):
1. **Selection**: Clicking an owned piece selects it and computes all legal destination squares using `chess.moves({ square, verbose: true })`.
2. **Visual Indicators**:
   - Empty legal squares display a subtle translucent dot marker: `radial-gradient(circle, rgba(59, 154, 198, 0.6) 26%, transparent 28%)`.
   - Enemy pieces on legal squares display a red capture ring: `radial-gradient(circle, transparent 60%, rgba(239, 68, 68, 0.6) 61%)`.
3. **Execution**: Clicking a valid highlighted destination square triggers the exact same `executeMove` pipeline.

---

## 4. Responsive Viewport Auto-Scaling

A major design requirement was ensuring the chessboard and both player nameplates remain **100% visible simultaneously** on all device viewports (from small mobile screens like iPhone SE to large 4K monitors) without triggering vertical page scrolling.

### Viewport Budget Calculation:
```typescript
const boardSize = useMemo(() => {
  const w = windowDimensions.width;
  const h = windowDimensions.height;

  // Vertical non-board overhead:
  // Top Navbar (~54px) + Top Player Bar (~44px) + Bottom Player Bar (~44px) + Margins (~30px)
  const verticalOverhead = 172;
  const horizontalOverhead = w < 600 ? 24 : 48;

  const maxFromHeight = h - verticalOverhead;
  const maxFromWidth = w - horizontalOverhead;

  const size = Math.floor(Math.min(maxFromWidth, maxFromHeight));
  return Math.max(220, Math.min(size, 580));
}, [windowDimensions]);
```

---

## 5. Markdown-Driven Learn System (SSG)

The Learn module serves **640+ interactive lessons** across Backend Engineering, DevOps, and Chess. To ensure maintainability and fast page loads, lesson content is stored entirely in Git-friendly Markdown files with YAML frontmatter.

### Directory Structure:
```
content/learn/
├── backend/
│   ├── phases.json                # Phase & Chapter hierarchy
│   └── phase-1/
│       └── 01/
│           ├── client-and-server.md
│           └── request-flow.md
├── devops/
│   ├── phases.json
│   └── phase-1/
│       └── 01/
│           └── git-fundamentals.md
└── chess/
    ├── roadmap.json
    └── 01/
        ├── board-coordinates.md
        └── chess-pieces.md
```

### Build-Time Transformation (`src/lib/learnContentLoader.ts`):
```
[Raw .md Files with YAML Frontmatter]
                 │
                 ▼  (gray-matter build-time parsing)
[Normalized CoursePhase / Chapter / SubTopic Data]
                 │
                 ▼  (Next.js getStaticProps)
[Pre-rendered Static HTML Pages (0ms Runtime File I/O)]
```

Each Markdown file defines metadata in YAML frontmatter, and structured sections in Markdown headings (`## `) with bullet points and optional code blocks.

---

## 6. Web Audio API Sound Pipeline

Sound effects for moves, captures, and errors utilize the browser's native `AudioContext` with pre-decoded buffer caching:

```typescript
// Caching decoded AudioBuffers in memory to eliminate sound latency
const soundsCache = new Map<string, AudioBuffer>();

export const play = async (sound: "move" | "capture" | "illegalMove") => {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();

  let audioBuffer = soundsCache.get(soundUrls[sound]);
  if (!audioBuffer) {
    const res = await fetch(soundUrls[sound]);
    audioBuffer = await audioContext.decodeAudioData(await res.arrayBuffer());
    soundsCache.set(soundUrls[sound], audioBuffer);
  }

  const audioSrc = audioContext.createBufferSource();
  audioSrc.buffer = audioBuffer;
  audioSrc.connect(audioContext.destination);
  audioSrc.start();
};
```
