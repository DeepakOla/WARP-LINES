/**
 * Promotion Handler
 * Handles piece promotion to King when reaching opponent's back rank
 */

import { GameState } from '../types/gameState';
import { Piece, isPromotionRow, promotePiece } from '../types/piece';
import { Move } from '../types/move';

/**
 * Checks if a move results in promotion
 */
export function checkPromotion(state: GameState, piece: Piece, toRow: number): boolean {
  if (!state.config.enableKings) {
    return false; // Promotion disabled
  }

  if (piece.type === 'KING') {
    return false; // Already a king
  }

  return isPromotionRow(toRow, piece.color, state.boardSize);
}

/**
 * Promotes piece if it reached promotion row
 */
export function handlePromotion(state: GameState, pieceId: string): GameState {
  const piece = state.pieces.get(pieceId);
  if (!piece) {
    return state;
  }

  const { row } = piece.position;

  if (checkPromotion(state, piece, row)) {
    const promotedPiece = promotePiece(piece);
    const newPieces = new Map(state.pieces);
    newPieces.set(pieceId, promotedPiece);

    return {
      ...state,
      pieces: newPieces,
    };
  }

  return state;
}

/**
 * Marks a move as resulting in promotion
 */
export function markPromotionMove(state: GameState, move: Move): Move {
  const piece = state.pieces.get(move.pieceId);
  if (!piece) {
    return move;
  }

  if (checkPromotion(state, piece, move.to.row)) {
    return {
      ...move,
      isPromotion: true,
    };
  }

  return move;
}
