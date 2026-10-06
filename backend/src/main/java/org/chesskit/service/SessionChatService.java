package org.chesskit.service;

import org.chesskit.model.ChatMessage;

/**
 * Contract for session-scoped chat operations.
 * Interface Segregation: separated from global chat so consumers
 * that only need session chat don't depend on lobby methods.
 */
public interface SessionChatService {

    /**
     * Add a chat message to a specific game session.
     *
     * @return the created (or deduplicated) message, or null if the session doesn't exist
     */
    ChatMessage addMessageToSession(String sessionId, String sender, String role, String text, String customId);
}
