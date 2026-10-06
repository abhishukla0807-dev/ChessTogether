import type { NextApiRequest, NextApiResponse } from "next";
import {
  sessionStore,
  globalChatMessages,
  addGlobalMessage,
} from "@/lib/sessionStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // ── GET: Get lobby messages and active sessions ──
  if (req.method === "GET") {
    const activeSessions = Array.from(sessionStore.values()).map((s) => ({
      id: s.id,
      whiteName: s.whiteName,
      blackName: s.blackName,
      movesCount: s.moves.length,
      createdAt: s.createdAt,
    }));

    return res.status(200).json({
      messages: globalChatMessages,
      activeSessions,
    });
  }

  // ── POST: Send a message in lobby ──
  if (req.method === "POST") {
    const { sender, role, text } = req.body as {
      sender?: string;
      role?: "white" | "black" | "spectator" | "system";
      text?: string;
    };

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 500) {
      return res
        .status(400)
        .json({ error: "Message is too long (max 500 characters)" });
    }

    const senderName = sender?.trim() || "Player";
    const userRole = role ?? "spectator";

    const message = addGlobalMessage(senderName, userRole, trimmedText);

    return res.status(201).json({
      message,
      messages: globalChatMessages,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
