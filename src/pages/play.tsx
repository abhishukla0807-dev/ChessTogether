import { PageTitle } from "@/components/pageTitle";
import { useRouter } from "next/router";
import SessionSetup from "@/sections/play/sessionSetup";
import MultiplayerGame from "@/sections/play/multiplayerGame";
import JoinLobby from "@/sections/play/joinLobby";

export default function Play() {
  const router = useRouter();
  const {
    session: sessionId,
    role,
    joined,
  } = router.query as {
    session?: string;
    role?: string;
    joined?: string;
  };

  const playerRole = role === "black" ? "black" : "white";

  // ── Opponent opens shared link → show Join lobby first ──────────────
  if (sessionId && role === "black" && joined !== "1") {
    return (
      <>
        <PageTitle title="ByteMate — Join Game" />
        <JoinLobby sessionId={sessionId} />
      </>
    );
  }

  // ── After joining (or White starting) → show the game ───────────────
  if (sessionId && role && joined === "1") {
    return (
      <>
        <PageTitle title="ByteMate — Multiplayer Game" />
        <MultiplayerGame
          sessionId={sessionId}
          playerRole={playerRole as "white" | "black"}
        />
      </>
    );
  }

  // ── White player starts game via "Start as White" → also show game ──
  if (sessionId && role === "white") {
    return (
      <>
        <PageTitle title="ByteMate — Multiplayer Game" />
        <MultiplayerGame sessionId={sessionId} playerRole="white" />
      </>
    );
  }

  // ── No session → session creation screen ────────────────────────────
  return (
    <>
      <PageTitle title="ByteMate — Create a Game" />
      <SessionSetup />
    </>
  );
}
