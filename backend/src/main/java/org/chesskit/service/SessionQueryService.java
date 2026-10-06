package org.chesskit.service;

import org.chesskit.model.GameSession;
import org.chesskit.model.SessionSummary;

import java.util.List;
import java.util.Optional;

/**
 * Read-only contract for querying game sessions.
 * Interface Segregation Principle: consumers that only need session lookup
 * (e.g., ChatController, ChatSocketHandler) depend on this narrow interface
 * instead of the full {@link GameService}.
 */
public interface SessionQueryService {

    /**
     * Retrieve a session by its ID.
     */
    Optional<GameSession> getSession(String id);

    /**
     * List all active sessions as lightweight summaries.
     */
    List<SessionSummary> getActiveSessions();
}
