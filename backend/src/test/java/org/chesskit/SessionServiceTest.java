package org.chesskit;

import org.chesskit.model.ChatMessage;
import org.chesskit.model.GameSession;
import org.chesskit.service.*;
import org.chesskit.service.repository.InMemorySessionRepository;
import org.chesskit.service.repository.SessionRepository;
import org.chesskit.service.util.SecureRandomIdGenerator;
import org.chesskit.service.util.IdGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the SOLID-refactored service layer.
 * Tests compose real implementations to verify end-to-end behavior
 * while each component remains independently testable.
 */
class SessionServiceTest {

    private GameServiceImpl gameService;
    private ChatServiceImpl chatService;
    private SessionRepository sessionRepository;

    @BeforeEach
    void setUp() {
        sessionRepository = new InMemorySessionRepository();
        IdGenerator idGenerator = new SecureRandomIdGenerator();
        MoveValidationService moveValidator = new ChessMoveValidationService();

        // ChatServiceImpl depends on SessionRepository + IdGenerator
        chatService = new ChatServiceImpl(sessionRepository, idGenerator);

        // GameServiceImpl depends on all abstractions
        gameService = new GameServiceImpl(sessionRepository, idGenerator, moveValidator, chatService);
    }

    // ────────────────── GameService Tests ──────────────────

    @Test
    void testCreateSession() {
        GameSession session = gameService.createSession("Magnus", "Hikaru");
        assertNotNull(session);
        assertEquals(8, session.getId().length());
        assertEquals("Magnus", session.getWhiteName());
        assertEquals("Hikaru", session.getBlackName());
        assertEquals("white", session.getTurn());
        assertEquals(0, session.getMoves().size());
        assertEquals(1, session.getMessages().size());
        assertTrue(session.getMessages().getFirst().text().contains("Match created!"));
    }

    @Test
    void testSessionPersistedToRepository() {
        GameSession session = gameService.createSession("Alice", "Bob");
        assertTrue(sessionRepository.findById(session.getId()).isPresent());
    }

    @Test
    void testSubmitMoveValid() {
        GameSession session = gameService.createSession("Alice", "Bob");

        GameService.MoveResult r1 = gameService.submitMove(session.getId(), "white", "e2e4");
        assertEquals("black", r1.session().getTurn());
        assertEquals(1, r1.session().getMoves().size());
        assertEquals("e2e4", r1.session().getMoves().getFirst());
        assertNull(r1.moveMessage());

        GameService.MoveResult r2 = gameService.submitMove(session.getId(), "black", "e7e5");
        assertEquals("white", r2.session().getTurn());
        assertEquals(2, r2.session().getMoves().size());
        assertEquals("e7e5", r2.session().getMoves().get(1));
    }

    @Test
    void testSubmitMoveOutOfTurn() {
        GameSession session = gameService.createSession("Alice", "Bob");
        gameService.submitMove(session.getId(), "white", "e2e4");

        // White tries to play again
        assertThrows(IllegalStateException.class, () ->
                gameService.submitMove(session.getId(), "white", "d2d4")
        );
    }

    @Test
    void testSubmitMoveIllegal() {
        GameSession session = gameService.createSession("Alice", "Bob");

        assertThrows(IllegalArgumentException.class, () ->
                gameService.submitMove(session.getId(), "white", "e2e5") // illegal pawn jump
        );
    }

    @Test
    void testCheckmateDetection() {
        GameSession session = gameService.createSession("WhiteMaster", "BlackMaster");

        // Scholar's Mate
        gameService.submitMove(session.getId(), "white", "e2e4");
        gameService.submitMove(session.getId(), "black", "e7e5");
        gameService.submitMove(session.getId(), "white", "d1h5");
        gameService.submitMove(session.getId(), "black", "b8c6");
        gameService.submitMove(session.getId(), "white", "f1c4");
        gameService.submitMove(session.getId(), "black", "g8f6");

        // 4. Qxf7#
        GameService.MoveResult mateResult = gameService.submitMove(session.getId(), "white", "h5f7");
        assertNotNull(mateResult.gameOverMessage());
        assertTrue(mateResult.gameOverMessage().text().contains("🏆 Checkmate! WhiteMaster wins the game!"));
    }

    // ────────────────── ChatService Tests ──────────────────

    @Test
    void testAddMessageAndDeduplication() {
        GameSession session = gameService.createSession("Player1", "Player2");

        ChatMessage m1 = chatService.addMessageToSession(session.getId(), "Player1", "white", "Good luck!", "msg-1");
        assertNotNull(m1);
        assertEquals("Good luck!", m1.text());

        // Duplicate with same ID
        ChatMessage m2 = chatService.addMessageToSession(session.getId(), "Player1", "white", "Good luck!", "msg-1");
        assertEquals(m1.id(), m2.id());

        // Global chat
        ChatMessage g1 = chatService.addGlobalMessage("Player1", "spectator", "Hello lobby", null);
        assertNotNull(g1);
        assertEquals(1, chatService.getGlobalMessages().size());
    }

    // ────────────────── MoveValidationService Tests ──────────────────

    @Test
    void testMoveValidationServiceIndependently() {
        MoveValidationService validator = new ChessMoveValidationService();
        io.github.wolfraam.chessgame.ChessGame game = new io.github.wolfraam.chessgame.ChessGame();

        // Valid UCI move
        MoveValidationService.ValidatedMove result = validator.validate(game, "e2e4");
        assertNotNull(result);
        assertEquals("e2e4", result.uci());
        assertNotNull(result.san());

        // Invalid move
        assertThrows(IllegalArgumentException.class, () ->
                validator.validate(game, "e2e5") // illegal
        );
    }

    // ────────────────── SessionQueryService Tests ──────────────────

    @Test
    void testGetSessionViaQueryService() {
        GameSession session = gameService.createSession("A", "B");
        assertTrue(gameService.getSession(session.getId()).isPresent());
        assertFalse(gameService.getSession("nonexistent").isPresent());
    }

    @Test
    void testGetActiveSessions() {
        gameService.createSession("A", "B");
        gameService.createSession("C", "D");
        assertEquals(2, gameService.getActiveSessions().size());
    }
}
