package org.chesskit.service;

import org.chesskit.model.ChatMessage;

import java.util.List;

/**
 * Contract for global lobby chat operations.
 * Interface Segregation: separated from session chat so consumers
 * that only need lobby chat don't depend on session methods.
 */
public interface GlobalChatService {

    /**
     * Add a chat message to the global lobby.
     *
     * @return the created (or deduplicated) message
     */
    ChatMessage addGlobalMessage(String sender, String role, String text, String customId);

    /**
     * Retrieve all global lobby messages.
     */
    List<ChatMessage> getGlobalMessages();
}
