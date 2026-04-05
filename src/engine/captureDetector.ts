import type { Board, Piece, Move } from '../types/game';
import { getValidMoves } from './moveValidator';

/**
 * Given a move (from → to), returns the captured piece if the move
 * is a capture (i.e., the capturedPieceId is set on the move object).
 * This is a thin helper for use during move application.
 */
export function detectCapture(move: Move, pieces: Piece[]): Piece | null {
  if (!move.capturedPieceId) return null;
  return pieces.find(p => p.id === move.capturedPieceId) ?? null;
}

/**
 * After landing on toNodeId, find all available follow-up captures
 * from that node (for chain captures / mandatory multi-jump).
 * The pieces list should reflect the state AFTER the first capture
 * (i.e., with the captured piece already removed and the piece moved).
 */
export function getChainCaptures(
  board: Board,
  pieces: Piece[],
  pieceId: string
): Move[] {
  const piece = pieces.find(p => p.id === pieceId);
  if (!piece) return [];

  const moves = getValidMoves(board, piece, pieces);
  return moves.filter(m => m.capturedPieceId !== undefined);
}
