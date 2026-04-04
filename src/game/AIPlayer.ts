/**
 * AI Player using Minimax algorithm with Alpha-Beta pruning
 * Pure TypeScript implementation for Warp Board
 */

import type { GameState, Move, Player, Piece } from '../types/game';
import { GameEngine } from './GameEngine';

export interface AIConfig {
  depth: number; // Search depth (1=easy, 2=medium, 3=hard maps to 2, 4, 6)
  player: Player;
}

export class AIPlayer {
  private config: AIConfig;
  private nodesEvaluated: number = 0;

  constructor(config: AIConfig) {
    this.config = config;
  }

  /**
   * Gets the best move for the AI player
   */
  getBestMove(state: GameState): Move | null {
    this.nodesEvaluated = 0;
    const startTime = Date.now();

    const legalMoves = GameEngine.getLegalMoves(state);
    if (legalMoves.length === 0) return null;

    const actualDepth = this.getActualDepth(this.config.depth);

    let bestMove: Move | null = null;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    // Evaluate each possible move
    for (const move of legalMoves) {
      const newState = GameEngine.applyMove(state, move);
      const score = this.minimax(newState, actualDepth - 1, alpha, beta, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, score);
    }

    const elapsedTime = Date.now() - startTime;
    console.log(
      `AI evaluated ${this.nodesEvaluated} nodes in ${elapsedTime}ms, best score: ${bestScore}`
    );

    return bestMove;
  }

  /**
   * Minimax algorithm with Alpha-Beta pruning
   */
  private minimax(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    this.nodesEvaluated++;

    // Terminal conditions
    if (state.winner) {
      return state.winner === this.config.player ? 10000 : -10000;
    }

    if (depth === 0) {
      return this.evaluatePosition(state);
    }

    const legalMoves = GameEngine.getLegalMoves(state);
    if (legalMoves.length === 0) {
      // No legal moves = loss
      return isMaximizing ? -10000 : 10000;
    }

    if (isMaximizing) {
      let maxScore = -Infinity;

      for (const move of legalMoves) {
        const newState = GameEngine.applyMove(state, move);
        const score = this.minimax(newState, depth - 1, alpha, beta, false);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);

        if (beta <= alpha) {
          break; // Beta cutoff
        }
      }

      return maxScore;
    } else {
      let minScore = Infinity;

      for (const move of legalMoves) {
        const newState = GameEngine.applyMove(state, move);
        const score = this.minimax(newState, depth - 1, alpha, beta, true);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);

        if (beta <= alpha) {
          break; // Alpha cutoff
        }
      }

      return minScore;
    }
  }

  /**
   * Evaluates the current board position
   */
  private evaluatePosition(state: GameState): number {
    let score = 0;

    const aiPlayer = this.config.player;
    const opponent = aiPlayer === 'green' ? 'red' : 'green';

    const aiPieces = state.pieces.filter((p) => p.player === aiPlayer);
    const opponentPieces = state.pieces.filter((p) => p.player === opponent);

    // Material count (most important)
    score += aiPieces.length * 100;
    score -= opponentPieces.length * 100;

    // King value
    const aiKings = aiPieces.filter((p) => p.type === 'king').length;
    const opponentKings = opponentPieces.filter((p) => p.type === 'king').length;
    score += aiKings * 50;
    score -= opponentKings * 50;

    // Positional evaluation
    aiPieces.forEach((piece) => {
      score += this.evaluatePiecePosition(piece, state, true);
    });

    opponentPieces.forEach((piece) => {
      score -= this.evaluatePiecePosition(piece, state, false);
    });

    // Mobility (number of legal moves)
    const aiMoves = GameEngine.getLegalMoves(state);
    score += aiMoves.length * 5;

    // Capture opportunities
    const captureMoves = aiMoves.filter((m) => m.isCapture);
    score += captureMoves.length * 10;

    return score;
  }

  /**
   * Evaluates a piece's position value
   */
  private evaluatePiecePosition(
    piece: Piece,
    state: GameState,
    isAI: boolean
  ): number {
    let score = 0;
    const nodeSize = state.settings.boardSize + 1;

    // Center control is valuable
    const centerRow = Math.floor(nodeSize / 2);
    const centerCol = Math.floor(nodeSize / 2);
    const distanceFromCenter =
      Math.abs(piece.position.row - centerRow) +
      Math.abs(piece.position.col - centerCol);
    score += (nodeSize - distanceFromCenter) * 2;

    // Advancement towards opponent (for regular pieces)
    if (piece.type === 'regular') {
      if (piece.player === 'green') {
        // Green moves down
        score += piece.position.row * 3;
      } else {
        // Red moves up
        score += (nodeSize - 1 - piece.position.row) * 3;
      }
    }

    // Edge positions are less valuable
    if (
      piece.position.row === 0 ||
      piece.position.row === nodeSize - 1 ||
      piece.position.col === 0 ||
      piece.position.col === nodeSize - 1
    ) {
      score -= 5;
    }

    // Corner positions are even worse
    if (
      (piece.position.row === 0 || piece.position.row === nodeSize - 1) &&
      (piece.position.col === 0 || piece.position.col === nodeSize - 1)
    ) {
      score -= 10;
    }

    return score;
  }

  /**
   * Maps difficulty level to actual search depth
   */
  private getActualDepth(difficulty: number): number {
    switch (difficulty) {
      case 1:
        return 2; // Apprentice
      case 2:
        return 4; // Strategist
      case 3:
        return 6; // Grandmaster
      default:
        return 4;
    }
  }

  /**
   * Gets statistics about the last search
   */
  getStats() {
    return {
      nodesEvaluated: this.nodesEvaluated,
      depth: this.getActualDepth(this.config.depth),
    };
  }
}

/**
 * Factory function to create AI player
 */
export function createAIPlayer(difficulty: 1 | 2 | 3, player: Player): AIPlayer {
  return new AIPlayer({ depth: difficulty, player });
}
