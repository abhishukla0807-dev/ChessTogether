package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Core game session model.
 *
 * <h3>Clock / Lag-Compensation Design:</h3>
 * <ul>
 *   <li><b>whiteTimeMs / blackTimeMs</b>: Authoritative remaining clock for each player
 *       tracked <em>server-side</em>. Clients only render this; they never own the clock.</li>
 *   <li><b>lastMoveAt</b>: Server {@code System.currentTimeMillis()} of the most recent move.
 *       The active player's clock is wound down by {@code now - lastMoveAt} on every read.</li>
 *   <li><b>Lag Compensation</b>: When a move arrives the server records
 *       {@code clientSentAt} (echo'd from the client's emit timestamp). The drift
 *       {@code serverReceivedAt - clientSentAt} approximates one-way latency.
 *       We credit half that drift back to the moving player's clock so that network jitter
 *       does not punish them unfairly — identical to Lichess / Chess.com Fischer-clock logic.</li>
 * </ul>
 */
public class GameSession {

    /** Default time control: 5 minutes per player (Blitz). */
    public static final long DEFAULT_TIME_MS = 5 * 60 * 1000L;

    /** Increment added to a player's clock after each of their moves (10-second increment). */
    public static final long INCREMENT_MS = 10_000L;

    /** Maximum one-way lag credit given to a player (caps abuse). */
    private static final long MAX_LAG_CREDIT_MS = 2_000L;

    // ── Identity ──────────────────────────────────────────────────────────────
    private final String id;
    private final String whiteName;
    private final String blackName;
    private final List<String> moves;
    private final List<ChatMessage> messages;
    private final long createdAt;

    // ── Clock state ───────────────────────────────────────────────────────────
    /** Remaining milliseconds on White's clock (authoritative, server-owned). */
    private volatile long whiteTimeMs;

    /** Remaining milliseconds on Black's clock (authoritative, server-owned). */
    private volatile long blackTimeMs;

    /**
     * Server epoch-ms of the last committed move (or game creation for move 0).
     * Used to compute how much time the currently active player has consumed.
     */
    private volatile long lastMoveAt;

    /** Whether a time-based game-over has already been flagged. */
    private volatile boolean flagged;

    // ── Constructors ──────────────────────────────────────────────────────────

    public GameSession(String id, String whiteName, String blackName) {
        this(id, whiteName, blackName, new ArrayList<>(), new ArrayList<>(),
                System.currentTimeMillis(), DEFAULT_TIME_MS, DEFAULT_TIME_MS);
    }

    public GameSession(String id, String whiteName, String blackName,
                       List<String> moves, List<ChatMessage> messages, long createdAt) {
        this(id, whiteName, blackName, moves, messages, createdAt, DEFAULT_TIME_MS, DEFAULT_TIME_MS);
    }

    public GameSession(String id, String whiteName, String blackName,
                       List<String> moves, List<ChatMessage> messages, long createdAt,
                       long whiteTimeMs, long blackTimeMs) {
        this.id = id;
        this.whiteName = whiteName;
        this.blackName = blackName;
        this.moves = Collections.synchronizedList(new ArrayList<>(moves));
        this.messages = Collections.synchronizedList(new ArrayList<>(messages));
        this.createdAt = createdAt;
        this.whiteTimeMs = whiteTimeMs;
        this.blackTimeMs = blackTimeMs;
        this.lastMoveAt = createdAt;
    }

    // ── Core clock mutation (called by GameServiceImpl under sync) ────────────

    /**
     * Deducts elapsed time from the active player's clock, applies lag compensation,
     * adds the per-move increment, and advances {@code lastMoveAt}.
     *
     * @param clientSentAt  epoch-ms the client stamped when it emitted the move event.
     *                      Used to estimate one-way network lag (serverNow − clientSentAt).
     * @param serverNow     current server epoch-ms (injected for testability).
     * @return {@code true} if the moving player has run out of time (flagged).
     */
    public boolean applyClockForMove(long clientSentAt, long serverNow) {
        long elapsed = serverNow - lastMoveAt;

        // One-way lag estimate: how long the packet spent in flight.
        // We credit at most MAX_LAG_CREDIT_MS to prevent abuse.
        long oneWayLag = Math.min(Math.max(serverNow - clientSentAt, 0), MAX_LAG_CREDIT_MS);

        // Net time deducted: elapsed minus the lag credit
        long netDeduct = Math.max(elapsed - oneWayLag, 0);

        boolean isWhiteTurn = (moves.size() % 2 == 0); // before adding new move
        if (isWhiteTurn) {
            whiteTimeMs = Math.max(whiteTimeMs - netDeduct + INCREMENT_MS, 0);
            if (whiteTimeMs == 0) { flagged = true; return true; }
        } else {
            blackTimeMs = Math.max(blackTimeMs - netDeduct + INCREMENT_MS, 0);
            if (blackTimeMs == 0) { flagged = true; return true; }
        }

        lastMoveAt = serverNow;
        return false;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public String getId()         { return id; }
    public String getWhiteName()  { return whiteName; }
    public String getBlackName()  { return blackName; }
    public List<String> getMoves()         { return moves; }
    public List<ChatMessage> getMessages() { return messages; }
    public long getCreatedAt()    { return createdAt; }
    public long getWhiteTimeMs()  { return whiteTimeMs; }
    public long getBlackTimeMs()  { return blackTimeMs; }
    public long getLastMoveAt()   { return lastMoveAt; }
    public boolean isFlagged()    { return flagged; }

    @JsonProperty("turn")
    public String getTurn() {
        return (moves.size() % 2 == 0) ? "white" : "black";
    }

    /**
     * Live snapshot of the active player's remaining time accounting for time
     * already elapsed since the last move (for REST polling / Lobby display).
     */
    @JsonProperty("activePlayerTimeMs")
    public long getActivePlayerTimeMs() {
        long elapsed = System.currentTimeMillis() - lastMoveAt;
        boolean whiteToMove = "white".equals(getTurn());
        long raw = whiteToMove ? whiteTimeMs : blackTimeMs;
        return Math.max(raw - elapsed, 0);
    }
}
