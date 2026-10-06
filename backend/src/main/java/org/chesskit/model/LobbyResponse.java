package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record LobbyResponse(
    @JsonProperty("messages") List<ChatMessage> messages,
    @JsonProperty("activeSessions") List<SessionSummary> activeSessions
) {}
