import type { GameState, Move, Player, AIDifficulty } from '../types/game';
import { applyMove } from '../engine/gameState';
import { evaluateBoard } from './evaluation';
import { evaluateGameEnd } from '../engine/winCondition';
import { AI_CONFIGS } from '../config/gameConfig';

const WIN_SCORE = 10_000;
const NEG_INF = -Infinity;
const POS_INF = Infinity;

/**
 * Minimax with alpha-beta pruning.
 * Returns the best score for `maximizingPlayer` at the given depth.
 */
function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player
): number {
  const endResult = evaluateGameEnd(state);
  if (endResult) {
    if ('draw' in endResult) return 0;
    if (endResult.winner === aiPlayer) return WIN_SCORE + depth; // prefer faster wins
    return -WIN_SCORE - depth;
  }

  if (depth === 0) return evaluateBoard(state, aiPlayer);

  const moves = state.validMoves;
  if (moves.length === 0) {
    return evaluateBoard(state, aiPlayer);
  }

  if (maximizingPlayer) {
    let best = NEG_INF;
    for (const move of moves) {
      const newState = applyMove(state, move);
      const score = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = POS_INF;
    for (const move of moves) {
      const newState = applyMove(state, move);
      const score = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

/**
 * Returns the best move for the AI given the current state and difficulty.
 */
export function getBestMove(state: GameState, difficulty: AIDifficulty): Move | null {
  const config = AI_CONFIGS[difficulty];
  const aiPlayer = state.currentPlayer;
  const moves = state.validMoves;

  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  let bestMove: Move | null = null;
  let bestScore = NEG_INF;

  for (const move of moves) {
    const newState = applyMove(state, move);
    const score = minimax(newState, config.maxDepth - 1, NEG_INF, POS_INF, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
