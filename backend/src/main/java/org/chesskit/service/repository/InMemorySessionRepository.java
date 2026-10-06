package org.chesskit.service.repository;

import org.chesskit.model.GameSession;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory implementation of {@link SessionRepository}.
 * Single Responsibility: only manages the storage map — no business logic.
 */
@Repository
public class InMemorySessionRepository implements SessionRepository {

    private final ConcurrentHashMap<String, GameSession> store = new ConcurrentHashMap<>();

    @Override
    public void save(GameSession session) {
        store.put(session.getId(), session);
    }

    @Override
    public Optional<GameSession> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Collection<GameSession> findAll() {
        return store.values();
    }
}
