import type { NextApiRequest, NextApiResponse } from "next";
import { sessionStore, addMessageToSession } from "@/lib/sessionStore";
import { Chess } from "chess.js";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const session = sessionStore.get(id);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  if (!session.messages) {
    session.messages = [];
  }

  // ── GET — return current session state ──────────────────────────────
  if (req.method === "GET") {
    // Compute whose turn it is from the move count
    const turn: "white" | "black" =
      session.moves.length % 2 === 0 ? "white" : "black";
    return res.status(200).json({ ...session, turn });
  }

  // ── POST — submit a move ─────────────────────────────────────────────
  if (req.method === "POST") {
    const { move, player } = req.body as {
      move?: string;
      player?: "white" | "black";
    };

    if (!move || !player) {
      return res.status(400).json({ error: "move and player are required" });
    }

    const expectedTurn: "white" | "black" =
      session.moves.length % 2 === 0 ? "white" : "black";

    if (player !== expectedTurn) {
      return res.status(409).json({ error: "Not your turn" });
    }

    // Validate the move using chess.js
    try {
      const chess = new Chess();
      for (const m of session.moves) {
        chess.move({
          from: m.slice(0, 2),
          to: m.slice(2, 4),
          promotion: m.length === 5 ? m[4] : undefined,
        });
      }

      // Try to parse as UCI move
      let parsed: string | null = null;
      let moveSan: string | null = null;
      if (move.length >= 4) {
        const result = chess.move({
          from: move.slice(0, 2),
          to: move.slice(2, 4),
          promotion: move.length === 5 ? move[4].toLowerCase() : undefined,
        });
        if (result) {
          // Store as UCI
          parsed = result.from + result.to + (result.promotion ?? "");
          moveSan = result.san;
        }
      }

      // If UCI didn't work, try SAN
      if (!parsed) {
        const result = chess.move(move);
        if (result) {
          parsed = result.from + result.to + (result.promotion ?? "");
          moveSan = result.san;
        }
      }

      if (!parsed) {
        return res.status(400).json({ error: "Illegal or invalid move" });
      }

      session.moves.push(parsed);

      const playerName =
        player === "white" ? session.whiteName : session.blackName;

      // Add system message to chat log
      addMessageToSession(
        session.id,
        "System",
        "system",
        `${playerName} (${player === "white" ? "White" : "Black"}) played ${moveSan || parsed}`
      );

      // Check if game over
      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          addMessageToSession(
            session.id,
            "System",
            "system",
            `🏆 Checkmate! ${playerName} wins the game!`
          );
        } else if (chess.isDraw()) {
          addMessageToSession(
            session.id,
            "System",
            "system",
            `🤝 Game ended in a draw!`
          );
        }
      }

      sessionStore.set(id, session);

      const turn: "white" | "black" =
        session.moves.length % 2 === 0 ? "white" : "black";
      return res.status(200).json({ ...session, turn });
    } catch {
      return res.status(400).json({ error: "Illegal move" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
