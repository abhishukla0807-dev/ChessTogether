// In-memory session store — shared across all API route invocations
// (Next.js reuses the module singleton in dev/prod)
// Sessions are lost on server restart; replace with Redis/DB for persistence.

export interface ChatMessage {
  id: string;
  sender: string;
  role: "white" | "black" | "spectator" | "system";
  text: string;
  timestamp: number;
}

export interface GameSession {
  id: string;
  whiteName: string;
  blackName: string;
  moves: string[]; // UCI notation e.g. ["e2e4", "e7e5", "g1f3"]
  messages: ChatMessage[];
  createdAt: number;
}

// Global singleton map
declare global {
  // eslint-disable-next-line no-var
  var __sessionStore: Map<string, GameSession> | undefined;
  // eslint-disable-next-line no-var
  var __globalChat: ChatMessage[] | undefined;
}

// Persist across Next.js hot-reloads in dev
export const sessionStore: Map<string, GameSession> =
  globalThis.__sessionStore ??
  (globalThis.__sessionStore = new Map<string, GameSession>());

export const globalChatMessages: ChatMessage[] =
  globalThis.__globalChat ?? (globalThis.__globalChat = []);

export function createSession(
  whiteName: string,
  blackName: string
): GameSession {
  // Generate a short unique ID
  const id = generateId();
  const session: GameSession = {
    id,
    whiteName,
    blackName,
    moves: [],
    messages: [
      {
        id: generateId(),
        sender: "System",
        role: "system",
        text: `Match created! ${whiteName} (White) vs ${blackName} (Black). Good luck! ♟️`,
        timestamp: Date.now(),
      },
    ],
    createdAt: Date.now(),
  };
  return session;
}

export function addMessageToSession(
  sessionId: string,
  sender: string,
  role: "white" | "black" | "spectator" | "system",
  text: string,
  customId?: string
): ChatMessage | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;

  if (!session.messages) {
    session.messages = [];
  }

  const id = customId || generateId();

  // Deduplicate if already added recently
  const existing = session.messages.find(
    (m) =>
      m.id === id ||
      (m.sender === sender &&
        m.text === text &&
        Math.abs(m.timestamp - Date.now()) < 1500)
  );
  if (existing) {
    return existing;
  }

  const message: ChatMessage = {
    id,
    sender,
    role,
    text,
    timestamp: Date.now(),
  };

  session.messages.push(message);
  // Keep last 100 messages per session
  if (session.messages.length > 100) {
    session.messages.shift();
  }

  return message;
}

export function addGlobalMessage(
  sender: string,
  role: "white" | "black" | "spectator" | "system",
  text: string,
  customId?: string
): ChatMessage {
  const id = customId || generateId();

  // Deduplicate
  const existing = globalChatMessages.find(
    (m) =>
      m.id === id ||
      (m.sender === sender &&
        m.text === text &&
        Math.abs(m.timestamp - Date.now()) < 1500)
  );
  if (existing) {
    return existing;
  }

  const message: ChatMessage = {
    id,
    sender,
    role,
    text,
    timestamp: Date.now(),
  };

  globalChatMessages.push(message);
  if (globalChatMessages.length > 150) {
    globalChatMessages.shift();
  }

  return message;
}

function generateId(): string {
  // 8-char alphanumeric ID
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
