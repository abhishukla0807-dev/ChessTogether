package org.chesskit.controller;

import org.chesskit.model.ChatMessage;
import org.chesskit.model.ChatRequest;
import org.chesskit.model.LobbyResponse;
import org.chesskit.model.SendChatResponse;
import org.chesskit.service.GlobalChatService;
import org.chesskit.service.SessionQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for global lobby chat operations.
 *
 * <p>ISP: Depends on the narrow {@link GlobalChatService} and {@link SessionQueryService}
 * — not the full GameService or ChatService interfaces.
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GlobalChatService globalChatService;
    private final SessionQueryService sessionQueryService;

    public ChatController(GlobalChatService globalChatService, SessionQueryService sessionQueryService) {
        this.globalChatService = globalChatService;
        this.sessionQueryService = sessionQueryService;
    }

    @GetMapping
    public ResponseEntity<LobbyResponse> getLobbyChat() {
        return ResponseEntity.ok(new LobbyResponse(
                globalChatService.getGlobalMessages(),
                sessionQueryService.getActiveSessions()));
    }

    @PostMapping
    public ResponseEntity<?> sendLobbyChat(@RequestBody ChatRequest request) {
        if (request == null || request.text() == null || request.text().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message text is required"));
        }

        String text = request.text().trim();
        if (text.length() > 1000) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is too long (max 1000 characters)"));
        }

        String sender = (request.sender() != null && !request.sender().isBlank()) ? request.sender().trim() : "Player";
        String role = (request.role() != null && !request.role().isBlank()) ? request.role() : "spectator";

        ChatMessage message = globalChatService.addGlobalMessage(sender, role, text, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SendChatResponse(
                message,
                globalChatService.getGlobalMessages()));
    }
}
