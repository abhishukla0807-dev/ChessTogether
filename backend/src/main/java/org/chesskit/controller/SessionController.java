package org.chesskit.controller;

import org.chesskit.model.*;
import org.chesskit.service.GameService;
import org.chesskit.service.SessionChatService;
import org.chesskit.service.SessionQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for game session operations.
 *
 * <p>
 * ISP: Depends on the narrow {@link SessionQueryService} for reads and
 * {@link GameService} for mutations — not a single bloated interface.
 * Exception handling is delegated to {@link GlobalExceptionHandler} (SRP).
 */
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final GameService gameService;
    private final SessionQueryService sessionQueryService;
    private final SessionChatService sessionChatService;

    public SessionController(GameService gameService,
                             SessionQueryService sessionQueryService,
                             SessionChatService sessionChatService) {
        this.gameService = gameService;
        this.sessionQueryService = sessionQueryService;
        this.sessionChatService = sessionChatService;
    }

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody CreateSessionRequest request) {
        if (request == null || request.whiteName() == null || request.blackName() == null
                || request.whiteName().isBlank() || request.blackName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "whiteName and blackName are required"));
        }

        GameSession session = gameService.createSession(request.whiteName(), request.blackName());
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSession(@PathVariable String id) {
        return sessionQueryService.getSession(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Session not found")));
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> submitMove(@PathVariable String id, @RequestBody MoveRequest request) {
        if (request == null || request.move() == null || request.player() == null
                || request.move().isBlank() || request.player().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "move and player are required"));
        }

        // Exceptions are handled by GlobalExceptionHandler (SRP)
        long clientSentAt = request.clientSentAt() != null ? request.clientSentAt() : 0L;
        GameService.MoveResult result = gameService.submitMove(id, request.player(), request.move(), clientSentAt);
        return ResponseEntity.ok(result.session());
    }

    @GetMapping("/{id}/chat")
    public ResponseEntity<?> getSessionChat(@PathVariable String id) {
        return sessionQueryService.getSession(id)
                .<ResponseEntity<?>>map(session -> ResponseEntity.ok(new SessionChatResponse(
                        session.getId(),
                        session.getWhiteName(),
                        session.getBlackName(),
                        session.getMessages())))
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Session not found")));
    }

    @PostMapping("/{id}/chat")
    public ResponseEntity<?> sendSessionChat(@PathVariable String id, @RequestBody ChatRequest request) {
        var sessionOpt = sessionQueryService.getSession(id);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Session not found"));
        }

        if (request == null || request.text() == null || request.text().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message text is required"));
        }

        String text = request.text().trim();
        if (text.length() > 500) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is too long (max 500 characters)"));
        }

        GameSession session = sessionOpt.get();
        String role = (request.role() != null && !request.role().isBlank()) ? request.role() : "spectator";
        String sender = (request.sender() != null && !request.sender().isBlank())
                ? request.sender().trim()
                : switch (role.toLowerCase()) {
                    case "white" -> session.getWhiteName();
                    case "black" -> session.getBlackName();
                    default -> "Guest";
                };

        ChatMessage message = sessionChatService.addMessageToSession(id, sender, role, text, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SendChatResponse(message, session.getMessages()));
    }
}
