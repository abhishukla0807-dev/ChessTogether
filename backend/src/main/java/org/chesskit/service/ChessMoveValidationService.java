package org.chesskit.service;

import io.github.wolfraam.chessgame.ChessGame;
import io.github.wolfraam.chessgame.move.Move;
import io.github.wolfraam.chessgame.notation.NotationType;
import org.springframework.stereotype.Component;

/**
 * Validates chess moves by attempting UCI notation first, then falling back to SAN.
 * Single Responsibility: only handles move parsing and legality — no game state mutation.
 *
 * <p>Open/Closed: to support additional notations (e.g., LAN), create a new
 * {@link MoveValidationService} implementation without modifying this class.
 */
@Component
public class ChessMoveValidationService implements MoveValidationService {

    @Override
    public ValidatedMove validate(ChessGame game, String moveStr) {
        // Try UCI first
        ValidatedMove result = tryNotation(game, moveStr.trim().toLowerCase(), NotationType.UCI);
        if (result != null) {
            return result;
        }

        // Fallback to SAN
        result = tryNotation(game, moveStr.trim(), NotationType.SAN);
        if (result != null) {
            return result;
        }

        throw new IllegalArgumentException("Illegal or invalid move");
    }

    private ValidatedMove tryNotation(ChessGame game, String moveStr, NotationType notation) {
        try {
            Move move = game.getMove(notation, moveStr);
            if (move != null && game.isLegalMove(move)) {
                String uci = game.getNotation(NotationType.UCI, move);
                String san = game.getNotation(NotationType.SAN, move);
                return new ValidatedMove(uci, san);
            }
        } catch (Exception ignored) {
            // Notation parsing failed — caller will try next format or throw
        }
        return null;
    }
}
