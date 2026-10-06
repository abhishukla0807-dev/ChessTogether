package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChatMessage(
    @JsonProperty("id") String id,
    @JsonProperty("sender") String sender,
    @JsonProperty("role") String role,
    @JsonProperty("text") String text,
    @JsonProperty("timestamp") long timestamp
) {}
