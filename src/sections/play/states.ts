// Minimal state for the multiplayer play section.
// Engine-related atoms (Stockfish, ELO, AI play) have been removed.
// Session state is managed server-side via /api/sessions.
import { Chess } from "chess.js";
import { atom } from "jotai";

export const playBoardAtom = atom(new Chess());
