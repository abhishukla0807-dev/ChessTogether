package org.chesskit.socket.handler;

import com.corundumstudio.socketio.SocketIOServer;
import org.chesskit.service.GameService;
import org.chesskit.service.SessionQueryService;
import org.chesskit.socket.PlayMoveEvent;
import org.chesskit.socket.SocketEventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Handles game-related socket events: session joining and move submission.
 * Single Responsibility: only game socket events — no chat, no server lifecycle.
 */
@Component
public class GameSocketHandler implements SocketEventHandler {

    private static final Logger log = LoggerFactory.getLogger(GameSocketHandler.class);

    private final GameService gameService;
    private final SessionQueryService sessionQueryService;

    public GameSocketHandler(GameService gameService, SessionQueryService sessionQueryService) {
        this.gameService = gameService;
        this.sessionQueryService = sessionQueryService;
    }

    @Override
    public void register(SocketIOServer server) {
        // ── Join Match Session Room ──
        server.addEventListener("join-session", String.class, (client, sessionId, ackSender) -> {
            if (sessionId != null && !sessionId.isBlank()) {
                client.joinRoom("session:" + sessionId);
                sessionQueryService.getSession(sessionId).ifPresent(session -> {
                    client.sendEvent("session-updated", session);
                });
            }
        });

        // ── Play Move Event ──
        server.addEventListener("play-move", PlayMoveEvent.class, (client, event, ackSender) -> {
            if (event == null || event.sessionId() == null || event.move() == null || event.player() == null) {
                return;
            }

            try {
                GameService.MoveResult result = gameService.submitMove(
                        event.sessionId(),
                        event.player(),
                        event.move(),
                        event.clientSentAt()   // ← lag-compensation timestamp
                );

                server.getRoomOperations("session:" + event.sessionId()).sendEvent("session-updated", result.session());

                if (result.flagged()) {
                    // Player ran out of time — notify clients to freeze the board
                    server.getRoomOperations("session:" + event.sessionId()).sendEvent("game-flagged", result.session());
                }

                if (result.gameOverMessage() != null) {
                    server.getRoomOperations("session:" + event.sessionId()).sendEvent("new-chat-message", result.gameOverMessage());
                }
            } catch (Exception e) {
                log.warn("Socket move error: {}", e.getMessage());
            }
        });
    }
}
