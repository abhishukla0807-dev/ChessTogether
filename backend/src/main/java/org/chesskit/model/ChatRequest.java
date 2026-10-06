package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChatRequest(
    @JsonProperty("sender") String sender,
    @JsonProperty("role") String role,
    @JsonProperty("text") String text
) {}
