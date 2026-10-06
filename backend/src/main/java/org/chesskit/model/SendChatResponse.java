package org.chesskit.model;

import java.util.List;

public record SendChatResponse(
    ChatMessage message,
    List<ChatMessage> messages
) {}
