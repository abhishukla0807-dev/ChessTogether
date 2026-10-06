package org.chesskit.service;

import io.github.wolfraam.chessgame.ChessGame;

/**
 * Abstraction for chess move validation and notation resolution.
 * Open/Closed Principle: new notation formats can be supported by adding
 * new implementations without modifying existing code.
 */
public interface MoveValidationService {

    /**
     * Validate and resolve a move string against the current game state.
     *
     * @param game    the current chess game state
     * @param moveStr the move string in any supported notation
     * @return a validated move with resolved UCI and SAN notation
     * @throws IllegalArgumentException if the move is illegal or invalid
     */
    ValidatedMove validate(ChessGame game, String moveStr);

    /**
     * Immutable result of a successful move validation.
     *
     * @param uci the move in UCI notation (e.g., "e2e4")
     * @param san the move in SAN notation (e.g., "e4")
     */
    record ValidatedMove(String uci, String san) {}
}
