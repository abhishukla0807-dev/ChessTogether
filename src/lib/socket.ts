import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (socket && socket.connected) {
    return socket;
  }

  if (!socket) {
    let socketUrl: string;

    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL.trim().replace(/\/+$/, "");
    } else if (typeof window !== "undefined") {
      // In production or HTTPS environments (e.g. Railway, Vercel),
      // default to connecting through the reverse proxy on the current origin.
      // This prevents Mixed Content errors and works with unified domain reverse proxies.
      if (
        window.location.protocol === "https:" ||
        (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")
      ) {
        socketUrl = window.location.origin;
      } else {
        // Local development: connect directly to Netty Socket.IO on port 9092
        socketUrl = `http://${window.location.hostname}:9092`;
      }
    } else {
      socketUrl = "http://localhost:9092";
    }

    socketUrl = socketUrl.trim().replace(/\/+$/, "");

    const isSecure =
      socketUrl.startsWith("https:") ||
      socketUrl.startsWith("wss:") ||
      (typeof window !== "undefined" && window.location.protocol === "https:");

    socket = io(socketUrl, {
      path: "/api/socket_io",
      addTrailingSlash: false,
      transports: ["websocket", "polling"], // Direct WebSocket first for ultra-low <5ms latency
      secure: isSecure,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 5000,
      forceNew: false,
    });
  }

  if (!socket) {
    throw new Error("Failed to initialize Socket.IO client");
  }

  return socket;
}

// Auto-warm the connection immediately in client browser
if (typeof window !== "undefined") {
  setTimeout(() => {
    getSocket().catch(() => {});
  }, 100);
}
