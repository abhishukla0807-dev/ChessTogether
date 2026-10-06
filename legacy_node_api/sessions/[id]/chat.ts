import type { NextApiRequest, NextApiResponse } from "next";
import { sessionStore, addMessageToSession } from "@/lib/sessionStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const session = sessionStore.get(id);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  // Ensure messages array exists
  if (!session.messages) {
    session.messages = [];
  }

  // ── GET: Get messages for session ──
  if (req.method === "GET") {
    return res.status(200).json({
      sessionId: session.id,
      whiteName: session.whiteName,
      blackName: session.blackName,
      messages: session.messages,
    });
  }

  // ── POST: Send a message in session ──
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

    const userRole = role ?? "spectator";
    const senderName =
      sender?.trim() ||
      (userRole === "white"
        ? session.whiteName
        : userRole === "black"
        ? session.blackName
        : "Guest");

    const message = addMessageToSession(
      session.id,
      senderName,
      userRole,
      trimmedText
    );

    return res.status(201).json({
      message,
      messages: session.messages,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
