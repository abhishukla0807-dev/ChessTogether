package org.chesskit.socket;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * WebSocket event payload for a player submitting a move.
 *
 * <h3>Lag Compensation Field:</h3>
 * {@code clientSentAt} is stamped by the client at the exact moment it emits
 * this event (i.e., {@code Date.now()} in JS). The server uses the difference
 * {@code serverReceivedAt - clientSentAt} to estimate one-way network lag and
 * credit that time back to the player's clock, preventing unfair time loss due
 * to network jitter.
 *
 * <p>If the client is old / omits the field, it defaults to 0, and no lag
 * credit is applied (safe fallback).</p>
 */
public record PlayMoveEvent(
    @JsonProperty("sessionId")    String sessionId,
    @JsonProperty("move")         String move,
    @JsonProperty("player")       String player,
    /** epoch-ms when the client emitted this event — used for lag compensation */
    @JsonProperty("clientSentAt") long clientSentAt
) {
    /** Backwards-compatible canonical form if clientSentAt is missing from payload. */
    public PlayMoveEvent(String sessionId, String move, String player) {
        this(sessionId, move, player, 0L);
    }
}
