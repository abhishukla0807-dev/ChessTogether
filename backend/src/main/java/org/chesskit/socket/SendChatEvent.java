package org.chesskit.socket;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SendChatEvent(
    @JsonProperty("sessionId") String sessionId,
    @JsonProperty("sender") String sender,
    @JsonProperty("role") String role,
    @JsonProperty("text") String text
) {}
