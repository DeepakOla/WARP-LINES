/**
 * Win and draw condition detection for The Sovereign Warp
 */

import { GameState, WinCondition, PlayerId } from '../types/game';
import { hasValidMoves } from './moveValidator';
import { getPlayerPieces } from './boardGenerator';

/**
 * Check if there's a winner or draw
 */
export function checkWinCondition(gameState: GameState): WinCondition {
  const { board, players } = gameState;

  // Check if either player has no pieces left
  const player1Pieces = getPlayerPieces(board, 'player1');
  const player2Pieces = getPlayerPieces(board, 'player2');

  if (player1Pieces.length === 0) {
    return {
      hasWinner: true,
      winner: 'player2',
      isDraw: false,
      reason: 'Player 1 has no pieces remaining',
    };
  }

  if (player2Pieces.length === 0) {
    return {
      hasWinner: true,
      winner: 'player1',
      isDraw: false,
      reason: 'Player 2 has no pieces remaining',
    };
  }

  // Check if either player has no valid moves (stalemate)
  const player1HasMoves = hasValidMoves(gameState, 'player1');
  const player2HasMoves = hasValidMoves(gameState, 'player2');

  if (!player1HasMoves && !player2HasMoves) {
    // Both players have no moves - draw
    return {
      hasWinner: false,
      isDraw: true,
      reason: 'Both players have no valid moves',
    };
  }

  if (!player1HasMoves) {
    // Player 1 can't move but has pieces - Player 2 wins
    return {
      hasWinner: true,
      winner: 'player2',
      isDraw: false,
      reason: 'Player 1 has no valid moves',
    };
  }

  if (!player2HasMoves) {
    // Player 2 can't move but has pieces - Player 1 wins
    return {
      hasWinner: true,
      winner: 'player1',
      isDraw: false,
      reason: 'Player 2 has no valid moves',
    };
  }

  // Check for repetition draw (same position 3 times)
  const repetitionCheck = checkRepetitionDraw(gameState);
  if (repetitionCheck.isDraw) {
    return repetitionCheck;
  }

  // Check for 50-move rule equivalent (100 moves without capture)
  const moveRule = check50MoveRule(gameState);
  if (moveRule.isDraw) {
    return moveRule;
  }

  // No winner or draw condition met
  return {
    hasWinner: false,
    isDraw: false,
    reason: 'Game continues',
  };
}

/**
 * Check for draw by repetition (same position 3 times)
 */
function checkRepetitionDraw(gameState: GameState): WinCondition {
  const { moveHistory } = gameState;

  if (moveHistory.length < 8) {
    // Need at least 8 moves for 3-fold repetition
    return {
      hasWinner: false,
      isDraw: false,
      reason: 'Not enough moves for repetition',
    };
  }

  // Simplified check - in a full implementation, would hash board states
  // For now, we'll skip this check and implement it later
  return {
    hasWinner: false,
    isDraw: false,
    reason: 'No repetition detected',
  };
}

/**
 * Check 50-move rule (draw if 50 moves without capture)
 */
function check50MoveRule(gameState: GameState): WinCondition {
  const { moveHistory } = gameState;

  if (moveHistory.length < 100) {
    return {
      hasWinner: false,
      isDraw: false,
      reason: 'Not enough moves',
    };
  }

  // Check last 100 moves (50 per player) for captures
  const last100Moves = moveHistory.slice(-100);
  const hasCapture = last100Moves.some((move) => move.capturedPiece !== undefined);

  if (!hasCapture) {
    return {
      hasWinner: false,
      isDraw: true,
      reason: '50 moves without capture',
    };
  }

  return {
    hasWinner: false,
    isDraw: false,
    reason: 'Recent captures exist',
  };
}

/**
 * Check if game should end
 */
export function shouldEndGame(gameState: GameState): boolean {
  const condition = checkWinCondition(gameState);
  return condition.hasWinner || condition.isDraw;
}

/**
 * Get the winner if there is one
 */
export function getWinner(gameState: GameState): PlayerId | null {
  const condition = checkWinCondition(gameState);
  return condition.winner || null;
}

/**
 * Check if game is a draw
 */
export function isDraw(gameState: GameState): boolean {
  const condition = checkWinCondition(gameState);
  return condition.isDraw;
}

/**
 * Calculate game score for a player (for AI evaluation)
 */
export function calculateScore(gameState: GameState, playerId: PlayerId): number {
  const { board, players } = gameState;

  const player = players.find((p) => p.id === playerId);
  const opponent = players.find((p) => p.id !== playerId);

  if (!player || !opponent) return 0;

  const playerPieces = getPlayerPieces(board, playerId);
  const opponentPieces = getPlayerPieces(
    board,
    playerId === 'player1' ? 'player2' : 'player1'
  );

  // Calculate score based on:
  // 1. Piece count advantage
  // 2. Captured pieces
  // 3. Board position

  let score = 0;

  // Piece count (10 points per piece)
  score += playerPieces.length * 10;
  score -= opponentPieces.length * 10;

  // Captured pieces (5 points per capture)
  score += player.capturedPieces * 5;
  score -= opponent.capturedPieces * 5;

  // Position advantage (pieces closer to opponent's side)
  const boardRows = board.length;
  playerPieces.forEach((piece) => {
    const rowAdvantage = playerId === 'player1' ? piece.position.row : boardRows - 1 - piece.position.row;
    score += rowAdvantage * 2;
  });

  return score;
}

/**
 * Check if a player is in a winning position
 */
export function isWinningPosition(gameState: GameState, playerId: PlayerId): boolean {
  const condition = checkWinCondition(gameState);
  return condition.hasWinner && condition.winner === playerId;
}

/**
 * Check if a player is in a losing position
 */
export function isLosingPosition(gameState: GameState, playerId: PlayerId): boolean {
  const condition = checkWinCondition(gameState);
  const opponentId: PlayerId = playerId === 'player1' ? 'player2' : 'player1';
  return condition.hasWinner && condition.winner === opponentId;
}
