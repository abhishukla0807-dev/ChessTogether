package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MoveRequest(
    @JsonProperty("move") String move,
    @JsonProperty("player") String player,
    @JsonProperty("clientSentAt") Long clientSentAt
) {
    public MoveRequest(String move, String player) {
        this(move, player, 0L);
    }
}
