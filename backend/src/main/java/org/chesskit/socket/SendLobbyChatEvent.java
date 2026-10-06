package org.chesskit.socket;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SendLobbyChatEvent(
    @JsonProperty("sender") String sender,
    @JsonProperty("role") String role,
    @JsonProperty("text") String text
) {}
