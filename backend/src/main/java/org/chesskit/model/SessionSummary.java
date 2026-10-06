package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SessionSummary(
    @JsonProperty("id") String id,
    @JsonProperty("whiteName") String whiteName,
    @JsonProperty("blackName") String blackName,
    @JsonProperty("movesCount") int movesCount,
    @JsonProperty("createdAt") long createdAt
) {}
