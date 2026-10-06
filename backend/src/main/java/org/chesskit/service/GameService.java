package org.chesskit.service;

import org.chesskit.model.GameSession;

/**
 * Contract for game session creation and move execution (mutations only).
 * Read-only queries are in {@link SessionQueryService} (Interface Segregation Principle).
 */
public interface GameService {

    /** Create a new chess session. */
    GameSession createSession(String whiteName, String blackName);

    /**
     * Submit and validate a chess move with lag-compensation support.
     *
     * @param clientSentAt epoch-ms the client stamped when emitting the move event;
     *                     used to credit one-way network lag back to the player's clock.
     *                     Pass 0 to skip compensation (REST fallback).
     * @throws java.util.NoSuchElementException if the session does not exist
     * @throws IllegalStateException            if it is not the player's turn
     * @throws IllegalArgumentException         if the move is illegal
     */
    MoveResult submitMove(String sessionId, String player, String moveStr, long clientSentAt);

    /** Convenience overload for REST callers (no lag compensation). */
    default MoveResult submitMove(String sessionId, String player, String moveStr) {
        return submitMove(sessionId, player, moveStr, 0L);
    }

    /**
     * Immutable result of a successful move submission.
     *
     * @param flagged true if the moving player ran out of time this move (timeout loss)
     */
    record MoveResult(GameSession session,
                      org.chesskit.model.ChatMessage moveMessage,
                      org.chesskit.model.ChatMessage gameOverMessage,
                      boolean flagged) {}
}
