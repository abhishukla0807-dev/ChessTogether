import type { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import type { Server as NetServer } from "http";
import type { Socket as NetSocket } from "net";
import {
  sessionStore,
  addMessageToSession,
  addGlobalMessage,
} from "@/lib/sessionStore";
import { Chess } from "chess.js";

interface SocketServer extends NetServer {
  io?: ServerIO;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketHandler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket?.server?.io) {
    res.end();
    return;
  }

  const io = new ServerIO(res.socket.server as any, {
    path: "/api/socket_io",
    addTrailingSlash: false,
    transports: ["websocket", "polling"],
    pingInterval: 8000,
    pingTimeout: 4000,
    perMessageDeflate: false, // Disables compression overhead for ultra-fast microsecond packet delivery
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    // ── Join a match session room ──
    socket.on("join-session", (sessionId: string) => {
      if (sessionId) {
        socket.join(`session:${sessionId}`);
        const session = sessionStore.get(sessionId);
        if (session) {
          const turn = session.moves.length % 2 === 0 ? "white" : "black";
          socket.emit("session-updated", { ...session, turn });
        }
      }
    });

    // ── Join global lobby ──
    socket.on("join-lobby", () => {
      socket.join("lobby");
    });

    // ── Play move event (ultra-fast sub-5ms broadcast) ──
    socket.on(
      "play-move",
      ({
        sessionId,
        move,
        player,
      }: {
        sessionId: string;
        move: string;
        player: "white" | "black";
      }) => {
        const session = sessionStore.get(sessionId);
        if (!session) return;

        const expectedTurn =
          session.moves.length % 2 === 0 ? "white" : "black";
        if (player !== expectedTurn) return;

        try {
          const chess = new Chess();
          for (const m of session.moves) {
            chess.move({
              from: m.slice(0, 2),
              to: m.slice(2, 4),
              promotion: m.length === 5 ? m[4] : undefined,
            });
          }

          let parsed: string | null = null;
          let moveSan: string | null = null;
          if (move.length >= 4) {
            const result = chess.move({
              from: move.slice(0, 2),
              to: move.slice(2, 4),
              promotion: move.length === 5 ? move[4].toLowerCase() : undefined,
            });
            if (result) {
              parsed = result.from + result.to + (result.promotion ?? "");
              moveSan = result.san;
            }
          }

          if (!parsed) {
            const result = chess.move(move);
            if (result) {
              parsed = result.from + result.to + (result.promotion ?? "");
              moveSan = result.san;
            }
          }

          if (!parsed) return;

          session.moves.push(parsed);

          const playerName =
            player === "white" ? session.whiteName : session.blackName;

          const sysMsg = addMessageToSession(
            session.id,
            "System",
            "system",
            `${playerName} (${player === "white" ? "White" : "Black"}) played ${moveSan || parsed}`
          );

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

          sessionStore.set(sessionId, session);

          const nextTurn =
            session.moves.length % 2 === 0 ? "white" : "black";

          // Broadcast to everyone in this session room instantly
          io.to(`session:${sessionId}`).emit("session-updated", {
            ...session,
            turn: nextTurn,
          });

          if (sysMsg) {
            io.to(`session:${sessionId}`).emit("new-chat-message", sysMsg);
          }
        } catch (e) {
          console.error("Socket move error:", e);
        }
      }
    );

    // ── Instant Match Chat ──
    socket.on(
      "send-chat",
      ({
        sessionId,
        sender,
        role,
        text,
      }: {
        sessionId: string;
        sender: string;
        role: "white" | "black" | "spectator" | "system";
        text: string;
      }) => {
        if (!text || !text.trim()) return;
        const msg = addMessageToSession(
          sessionId,
          sender || "Player",
          role || "spectator",
          text.trim()
        );
        if (msg) {
          io.to(`session:${sessionId}`).emit("new-chat-message", msg);
        }
      }
    );

    // ── Instant Lobby Chat ──
    socket.on(
      "send-lobby-chat",
      ({
        sender,
        role,
        text,
      }: {
        sender: string;
        role: "white" | "black" | "spectator" | "system";
        text: string;
      }) => {
        if (!text || !text.trim()) return;
        const msg = addGlobalMessage(
          sender || "Player",
          role || "spectator",
          text.trim()
        );
        io.to("lobby").emit("new-lobby-message", msg);
      }
    );
  });

  res.end();
}
