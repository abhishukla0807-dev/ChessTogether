package org.chesskit.service.repository;

import org.chesskit.model.GameSession;

import java.util.Collection;
import java.util.Optional;

/**
 * Abstraction for game session persistence.
 * High-level services depend on this interface (Dependency Inversion Principle),
 * making the storage mechanism swappable (e.g., in-memory → Redis → DB).
 */
public interface SessionRepository {

    /**
     * Persist a session, keyed by its ID.
     */
    void save(GameSession session);

    /**
     * Find a session by ID.
     */
    Optional<GameSession> findById(String id);

    /**
     * Return all stored sessions.
     */
    Collection<GameSession> findAll();
}
