package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record SessionChatResponse(
    @JsonProperty("sessionId") String sessionId,
    @JsonProperty("whiteName") String whiteName,
    @JsonProperty("blackName") String blackName,
    @JsonProperty("messages") List<ChatMessage> messages
) {}
