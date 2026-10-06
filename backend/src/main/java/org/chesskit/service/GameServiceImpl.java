package org.chesskit.service;

import io.github.wolfraam.chessgame.ChessGame;
import io.github.wolfraam.chessgame.notation.NotationType;
import io.github.wolfraam.chessgame.result.ChessGameResultType;
import org.chesskit.config.CacheConfig;
import org.chesskit.model.ChatMessage;
import org.chesskit.model.GameSession;
import org.chesskit.model.SessionSummary;
import org.chesskit.service.repository.SessionRepository;
import org.chesskit.service.util.IdGenerator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Game orchestration service — handles session creation, move submission, and session queries.
 *
 * <p>SOLID Compliance:
 * <ul>
 *   <li><b>SRP</b>: Only orchestrates game logic. Storage is delegated to {@link SessionRepository},
 *       ID generation to {@link IdGenerator}, move validation to {@link MoveValidationService},
 *       and chat to {@link SessionChatService}.</li>
 *   <li><b>OCP</b>: New move notations can be supported by swapping {@link MoveValidationService}
 *       implementation without modifying this class.</li>
 *   <li><b>DIP</b>: All dependencies are injected as interfaces.</li>
 * </ul>
 *
 * <p>Caching Notes:
 * <ul>
 *   <li>{@code getActiveSessions} returns immutable snapshots via {@link List#copyOf}
 *       to ensure cached references cannot be mutated by callers.</li>
 *   <li>There are intentionally NO internal self-invocations (via {@code this.}) of cached
 *       methods, ensuring Spring AOP proxy interception correctly handles cache hits and evictions.</li>
 * </ul>
 */
@Service
public class GameServiceImpl implements GameService, SessionQueryService {

    private final SessionRepository sessionRepository;
    private final IdGenerator idGenerator;
    private final MoveValidationService moveValidationService;
    private final SessionChatService sessionChatService;

    public GameServiceImpl(SessionRepository sessionRepository,
                           IdGenerator idGenerator,
                           MoveValidationService moveValidationService,
                           SessionChatService sessionChatService) {
        this.sessionRepository = sessionRepository;
        this.idGenerator = idGenerator;
        this.moveValidationService = moveValidationService;
        this.sessionChatService = sessionChatService;
    }

    // ────────────────── GameService ──────────────────

    @Override
    @CacheEvict(value = CacheConfig.ACTIVE_SESSIONS_CACHE, allEntries = true)
    public GameSession createSession(String whiteName, String blackName) {
        String id = idGenerator.generate();
        GameSession session = new GameSession(id, whiteName.trim(), blackName.trim());

        ChatMessage initialMessage = new ChatMessage(
                idGenerator.generate(),
                "System",
                "system",
                "Match created! " + whiteName.trim() + " (White) vs " + blackName.trim() + " (Black). Good luck! ♟️",
                System.currentTimeMillis()
        );
        session.getMessages().add(initialMessage);
        sessionRepository.save(session);
        return session;
    }

    @Override
    public synchronized MoveResult submitMove(String sessionId, String player, String moveStr, long clientSentAt) {
        GameSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        String expectedTurn = (session.getMoves().size() % 2 == 0) ? "white" : "black";
        if (!expectedTurn.equalsIgnoreCase(player)) {
            throw new IllegalStateException("Not your turn");
        }

        long serverNow = System.currentTimeMillis();

        // ── Lag-compensated clock deduction ──────────────────────────────────
        // applyClockForMove deducts (elapsed - oneWayLag) from the moving player's
        // clock, adds the per-move increment, and returns true if they flagged.
        boolean timedOut = session.applyClockForMove(
                clientSentAt > 0 ? clientSentAt : serverNow, serverNow);

        ChatMessage gameOverMsg = null;
        if (timedOut) {
            String loserName = "white".equalsIgnoreCase(player) ? session.getWhiteName() : session.getBlackName();
            String winnerName = "white".equalsIgnoreCase(player) ? session.getBlackName() : session.getWhiteName();
            gameOverMsg = sessionChatService.addMessageToSession(sessionId, "System", "system",
                    "⏰ " + loserName + " ran out of time! " + winnerName + " wins on time!", null);
            return new MoveResult(session, null, gameOverMsg, true);
        }

        // Replay existing moves to reconstruct game state
        ChessGame game = new ChessGame();
        for (String m : session.getMoves()) {
            try {
                game.playMove(NotationType.UCI, m);
            } catch (Exception e) {
                try {
                    game.playMove(NotationType.SAN, m);
                } catch (Exception ignored) {}
            }
        }

        // Validate and resolve the new move (delegated — OCP)
        MoveValidationService.ValidatedMove validated = moveValidationService.validate(game, moveStr);
        game.playMove(NotationType.UCI, validated.uci());
        session.getMoves().add(validated.uci());

        // Check for game-over conditions (checkmate / draw)
        String playerName = "white".equalsIgnoreCase(player) ? session.getWhiteName() : session.getBlackName();
        ChessGameResultType resultType = game.getGameResultType();
        if (resultType == ChessGameResultType.WHITE_WINS || resultType == ChessGameResultType.BLACK_WINS) {
            gameOverMsg = sessionChatService.addMessageToSession(sessionId, "System", "system",
                    "🏆 Checkmate! " + playerName + " wins the game!", null);
        } else if (resultType == ChessGameResultType.DRAW) {
            gameOverMsg = sessionChatService.addMessageToSession(sessionId, "System", "system",
                    "🤝 Game ended in a draw!", null);
        }

        return new MoveResult(session, null, gameOverMsg, false);
    }

    // ────────────────── SessionQueryService ──────────────────

    @Override
    public java.util.Optional<GameSession> getSession(String id) {
        return sessionRepository.findById(id);
    }

    @Override
    @Cacheable(value = CacheConfig.ACTIVE_SESSIONS_CACHE)
    public List<SessionSummary> getActiveSessions() {
        return List.copyOf(sessionRepository.findAll().stream()
                .map(s -> new SessionSummary(
                        s.getId(),
                        s.getWhiteName(),
                        s.getBlackName(),
                        s.getMoves().size(),
                        s.getCreatedAt()
                ))
                .toList());
    }
}
