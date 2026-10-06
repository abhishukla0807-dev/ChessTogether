package org.chesskit.service;

import org.chesskit.config.CacheConfig;
import org.chesskit.model.ChatMessage;
import org.chesskit.model.GameSession;
import org.chesskit.service.repository.SessionRepository;
import org.chesskit.service.util.IdGenerator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Standalone chat service implementation — handles both session-level and global lobby chat.
 *
 * <p>SOLID Compliance:
 * <ul>
 *   <li><b>SRP</b>: Only manages chat messages — no game logic.</li>
 *   <li><b>ISP</b>: Implements {@link SessionChatService} and {@link GlobalChatService} separately,
 *       so consumers can depend on only the interface they need.</li>
 *   <li><b>DIP</b>: Depends on {@link SessionRepository} and {@link IdGenerator} abstractions.</li>
 * </ul>
 *
 * <p>Caching Notes:
 * <ul>
 *   <li>{@code getGlobalMessages} returns immutable snapshots via {@link List#copyOf}
 *       to ensure cached references cannot be mutated by callers.</li>
 *   <li>There are intentionally NO internal self-invocations (via {@code this.}) of cached
 *       methods, ensuring Spring AOP proxy interception correctly handles cache hits and evictions.</li>
 * </ul>
 */
@Service
public class ChatServiceImpl implements SessionChatService, GlobalChatService {

    private final SessionRepository sessionRepository;
    private final IdGenerator idGenerator;
    private final List<ChatMessage> globalChatMessages = Collections.synchronizedList(new ArrayList<>());

    public ChatServiceImpl(SessionRepository sessionRepository, IdGenerator idGenerator) {
        this.sessionRepository = sessionRepository;
        this.idGenerator = idGenerator;
    }

    // ────────────────── SessionChatService ──────────────────

    @Override
    public ChatMessage addMessageToSession(String sessionId, String sender, String role, String text, String customId) {
        GameSession session = sessionRepository.findById(sessionId).orElse(null);
        if (session == null) return null;

        String id = (customId != null && !customId.isBlank()) ? customId : idGenerator.generate();
        long now = System.currentTimeMillis();

        synchronized (session.getMessages()) {
            for (ChatMessage m : session.getMessages()) {
                if (m.id().equals(id) || (m.sender().equals(sender) && m.text().equals(text) && Math.abs(m.timestamp() - now) < 1500)) {
                    return m;
                }
            }

            ChatMessage message = new ChatMessage(id, sender, role, text, now);
            session.getMessages().add(message);

            while (session.getMessages().size() > 100) {
                session.getMessages().remove(0);
            }
            return message;
        }
    }

    // ────────────────── GlobalChatService ──────────────────

    @Override
    @CacheEvict(value = CacheConfig.GLOBAL_CHAT_CACHE, allEntries = true)
    public ChatMessage addGlobalMessage(String sender, String role, String text, String customId) {
        String id = (customId != null && !customId.isBlank()) ? customId : idGenerator.generate();
        long now = System.currentTimeMillis();

        synchronized (globalChatMessages) {
            for (ChatMessage m : globalChatMessages) {
                if (m.id().equals(id) || (m.sender().equals(sender) && m.text().equals(text) && Math.abs(m.timestamp() - now) < 1500)) {
                    return m;
                }
            }

            ChatMessage message = new ChatMessage(id, sender, role, text, now);
            globalChatMessages.add(message);

            while (globalChatMessages.size() > 150) {
                globalChatMessages.remove(0);
            }
            return message;
        }
    }

    @Override
    @Cacheable(value = CacheConfig.GLOBAL_CHAT_CACHE)
    public List<ChatMessage> getGlobalMessages() {
        synchronized (globalChatMessages) {
            return List.copyOf(globalChatMessages);
        }
    }
}
