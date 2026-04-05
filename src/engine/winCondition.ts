import type { GameState, Player } from '../types/game';
import { DRAW_MOVE_LIMIT } from '../config/gameConfig';
import { countValidMoves } from './gameState';

export type WinResult = { winner: Player } | { draw: true } | null;

/**
 * Check if the game has ended (win or draw).
 * Returns a WinResult or null if the game should continue.
 *
 * Win conditions:
 * 1. A player has no pieces left → opponent wins.
 * 2. A player has no valid moves → opponent wins.
 *
 * Draw conditions:
 * 1. No captures in the last DRAW_MOVE_LIMIT moves.
 * 2. Only kings remain for both players (not yet implemented — future).
 */
export function checkWinCondition(state: GameState): WinResult {
  const p1Pieces = state.pieces.filter(p => p.owner === 'player1');
  const p2Pieces = state.pieces.filter(p => p.owner === 'player2');

  // A player has no pieces
  if (p1Pieces.length === 0) return { winner: 'player2' };
  if (p2Pieces.length === 0) return { winner: 'player1' };

  // Current player has no valid moves
  if (state.validMoves.length === 0) {
    const opponent: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';
    return { winner: opponent };
  }

  return null;
}

/**
 * Check draw conditions.
 */
export function checkDrawCondition(state: GameState): boolean {
  if (state.movesSinceCapture >= DRAW_MOVE_LIMIT) return true;
  return false;
}

/**
 * Evaluate the full end-state of the game after a move is applied.
 * Returns WinResult or null.
 */
export function evaluateGameEnd(state: GameState): WinResult {
  if (checkDrawCondition(state)) return { draw: true };
  return checkWinCondition(state);
}
