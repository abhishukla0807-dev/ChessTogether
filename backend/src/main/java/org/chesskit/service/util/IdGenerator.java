package org.chesskit.service.util;

/**
 * Abstraction for generating unique identifiers.
 * Enables swapping strategies (UUID, Snowflake, etc.) without touching consumers.
 */
public interface IdGenerator {

    /**
     * Generate a unique identifier string.
     */
    String generate();
}
