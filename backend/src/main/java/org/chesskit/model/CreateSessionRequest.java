package org.chesskit.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateSessionRequest(
    @JsonProperty("whiteName") String whiteName,
    @JsonProperty("blackName") String blackName
) {}
