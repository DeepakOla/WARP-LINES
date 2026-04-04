/**
 * Win Condition Checker
 * Determines if game is over and who won
 */

import { GameState, getPiecesByColor, getOpponentColor } from '../types/gameState';
import { PieceColor } from '../types/piece';
import { hasLegalMoves } from './MoveValidator';

export type WinReason =
  | 'CAPTURED_ALL'      // Captured all opponent pieces
  | 'BLOCKED_ALL'       // Opponent has no legal moves
  | 'RESIGNATION'       // Opponent resigned
  | 'TIMEOUT';          // Opponent ran out of time (if timed game)

export interface WinResult {
  winner: PieceColor;
  reason: WinReason;
}

/**
 * Checks if game has been won
 */
export function checkWinCondition(state: GameState): WinResult | null {
  const { config } = state;

  // Check if opponent has any pieces left
  const opponent = getOpponentColor(state.currentPlayer);
  const opponentPieces = getPiecesByColor(state, opponent);

  if (opponentPieces.length === 0 && config.captureAllToWin) {
    return {
      winner: state.currentPlayer,
      reason: 'CAPTURED_ALL',
    };
  }

  // Check if opponent has any legal moves
  if (!hasLegalMoves(state) && config.blockAllToWin) {
    // Opponent is blocked - previous player wins
    return {
      winner: opponent, // The player who just moved wins
      reason: 'BLOCKED_ALL',
    };
  }

  return null; // Game continues
}

/**
 * Updates game state with winner
 */
export function setWinner(state: GameState, winner: PieceColor, reason: WinReason): GameState {
  return {
    ...state,
    winner,
    status: 'finished',
  };
}

/**
 * Checks for draw conditions (stalemate)
 */
export function checkDrawCondition(state: GameState): boolean {
  // Draw if same position repeats 3 times (not implemented yet - requires position hashing)
  // Draw if 50 moves without capture or promotion (not implemented yet)

  // For now, no draw conditions
  return false;
}

/**
 * Gets game result summary
 */
export function getGameResult(state: GameState): {
  winner: PieceColor | null;
  isDraw: boolean;
  isOngoing: boolean;
  totalMoves: number;
  capturedPieces: number;
} {
  return {
    winner: state.winner,
    isDraw: false, // No draw conditions yet
    isOngoing: state.status === 'playing',
    totalMoves: state.moveHistory.length,
    capturedPieces: state.capturedPieces.length,
  };
}
