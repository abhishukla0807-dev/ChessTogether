package org.chesskit.socket.handler;

import com.corundumstudio.socketio.SocketIOServer;
import org.chesskit.model.ChatMessage;
import org.chesskit.service.GlobalChatService;
import org.chesskit.service.SessionChatService;
import org.chesskit.socket.SendChatEvent;
import org.chesskit.socket.SendLobbyChatEvent;
import org.chesskit.socket.SocketEventHandler;
import org.springframework.stereotype.Component;

/**
 * Handles chat-related socket events: session chat, lobby chat, and lobby joining.
 * Single Responsibility: only chat socket events — no game logic, no server lifecycle.
 */
@Component
public class ChatSocketHandler implements SocketEventHandler {

    private final SessionChatService sessionChatService;
    private final GlobalChatService globalChatService;

    public ChatSocketHandler(SessionChatService sessionChatService, GlobalChatService globalChatService) {
        this.sessionChatService = sessionChatService;
        this.globalChatService = globalChatService;
    }

    @Override
    public void register(SocketIOServer server) {
        // ── Join Global Lobby ──
        server.addEventListener("join-lobby", Void.class, (client, data, ackSender) -> {
            client.joinRoom("lobby");
        });

        // ── Match Chat Event ──
        server.addEventListener("send-chat", SendChatEvent.class, (client, event, ackSender) -> {
            if (event == null || event.sessionId() == null || event.text() == null || event.text().isBlank()) {
                return;
            }

            String sender = (event.sender() != null && !event.sender().isBlank()) ? event.sender() : "Player";
            String role = (event.role() != null && !event.role().isBlank()) ? event.role() : "spectator";

            ChatMessage message = sessionChatService.addMessageToSession(
                    event.sessionId(),
                    sender,
                    role,
                    event.text().trim(),
                    null
            );

            if (message != null) {
                server.getRoomOperations("session:" + event.sessionId()).sendEvent("new-chat-message", message);
            }
        });

        // ── Lobby Chat Event ──
        server.addEventListener("send-lobby-chat", SendLobbyChatEvent.class, (client, event, ackSender) -> {
            if (event == null || event.text() == null || event.text().isBlank()) {
                return;
            }

            String sender = (event.sender() != null && !event.sender().isBlank()) ? event.sender() : "Player";
            String role = (event.role() != null && !event.role().isBlank()) ? event.role() : "spectator";

            ChatMessage message = globalChatService.addGlobalMessage(
                    sender,
                    role,
                    event.text().trim(),
                    null
            );

            if (message != null) {
                server.getRoomOperations("lobby").sendEvent("new-lobby-message", message);
            }
        });
    }
}
