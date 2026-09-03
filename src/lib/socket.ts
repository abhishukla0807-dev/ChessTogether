import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let initPromise: Promise<void> | null = null;

async function ensureServerInit() {
  if (!initPromise) {
    initPromise = fetch("/api/socket")
      .then(() => {})
      .catch((e) => console.error("Socket server init ping error:", e));
  }
  return initPromise;
}

export async function getSocket(): Promise<Socket> {
  if (socket && socket.connected) {
    return socket;
  }

  // Ping API endpoint once to ensure Socket.io is attached to Next.js HTTP server
  await ensureServerInit();

  if (!socket) {
    socket = io({
      path: "/api/socket_io",
      addTrailingSlash: false,
      transports: ["websocket", "polling"], // Direct WebSocket first for ultra-low <5ms latency
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 5000,
      forceNew: false,
    });
  }

  return socket;
}

// Auto-warm the connection immediately in client browser
if (typeof window !== "undefined") {
  setTimeout(() => {
    getSocket().catch(() => {});
  }, 100);
}
