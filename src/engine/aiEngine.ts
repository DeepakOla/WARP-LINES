/**
 * AI Engine for The Sovereign Warp
 * Implements minimax algorithm with alpha-beta pruning
 */

import {
  GameState,
  Position,
  Move,
  AILevel,
  PlayerId,
} from '../types/game';
import {
  AIConfig,
  BoardEvaluation,
  AIMove,
  MinimaxNode,
  AI_CONFIGS,
} from '../types/ai';
import { getAllValidMoves, getAvailableMoves } from './moveValidator';
import { executeMove, cloneGameState } from './gameState';
import { checkWinCondition, calculateScore } from './winCondition';
import { getPlayerPieces } from './boardGenerator';
import { getPotentialCaptures } from './captureDetector';

/**
 * AI Player class that handles AI decision making
 */
export class AIPlayer {
  private config: AIConfig;

  constructor(level: AILevel) {
    this.config = AI_CONFIGS[level];
  }

  /**
   * Find the best move for the current game state
   */
  async findBestMove(gameState: GameState): Promise<AIMove> {
    const startTime = Date.now();
    let nodesEvaluated = 0;

    const currentPlayerId = gameState.currentPlayer;
    const allMoves = this.getAllPossibleMoves(gameState, currentPlayerId);

    if (allMoves.length === 0) {
      throw new Error('No valid moves available');
    }

    // For novice level, pick a random move
    if (this.config.level === 'novice') {
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      const evaluation = this.evaluateBoard(gameState, currentPlayerId);

      await this.addThinkingDelay();

      return {
        move: randomMove,
        evaluation,
        searchDepth: 0,
        nodesEvaluated: 1,
        timeElapsed: Date.now() - startTime,
        confidence: 0.5,
      };
    }

    // For other levels, use minimax
    let bestMove: Move | null = null;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of allMoves) {
      // Execute move on a cloned state
      const newState = this.simulateMove(gameState, move);
      nodesEvaluated++;

      // Evaluate using minimax
      const score = this.minimax(
        newState,
        this.config.maxDepth - 1,
        alpha,
        beta,
        false,
        currentPlayerId,
        { nodesEvaluated: 0 }
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      if (this.config.useAlphaBeta) {
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
    }

    if (!bestMove) {
      bestMove = allMoves[0]; // Fallback to first move
    }

    await this.addThinkingDelay();

    const finalEvaluation = this.evaluateBoard(gameState, currentPlayerId);

    return {
      move: bestMove,
      evaluation: finalEvaluation,
      searchDepth: this.config.maxDepth,
      nodesEvaluated,
      timeElapsed: Date.now() - startTime,
      confidence: this.normalizeScore(bestScore),
    };
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  private minimax(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    aiPlayerId: PlayerId,
    stats: { nodesEvaluated: number }
  ): number {
    stats.nodesEvaluated++;

    // Check win condition
    const winCondition = checkWinCondition(state);
    if (winCondition.hasWinner) {
      if (winCondition.winner === aiPlayerId) {
        return 10000 + depth; // Prefer quicker wins
      } else {
        return -10000 - depth; // Avoid quicker losses
      }
    }

    if (winCondition.isDraw) {
      return 0;
    }

    // Terminal node - evaluate position
    if (depth === 0) {
      return this.evaluatePosition(state, aiPlayerId);
    }

    const currentPlayerId = state.currentPlayer;
    const moves = this.getAllPossibleMoves(state, currentPlayerId);

    if (moves.length === 0) {
      // No moves available - this is a loss
      return currentPlayerId === aiPlayerId ? -9000 : 9000;
    }

    if (isMaximizing) {
      let maxScore = -Infinity;

      for (const move of moves) {
        const newState = this.simulateMove(state, move);
        const score = this.minimax(newState, depth - 1, alpha, beta, false, aiPlayerId, stats);
        maxScore = Math.max(maxScore, score);

        if (this.config.useAlphaBeta) {
          alpha = Math.max(alpha, score);
          if (beta <= alpha) {
            break; // Beta cutoff
          }
        }
      }

      return maxScore;
    } else {
      let minScore = Infinity;

      for (const move of moves) {
        const newState = this.simulateMove(state, move);
        const score = this.minimax(newState, depth - 1, alpha, beta, true, aiPlayerId, stats);
        minScore = Math.min(minScore, score);

        if (this.config.useAlphaBeta) {
          beta = Math.min(beta, score);
          if (beta <= alpha) {
            break; // Alpha cutoff
          }
        }
      }

      return minScore;
    }
  }

  /**
   * Evaluate board position for a player
   */
  private evaluatePosition(state: GameState, playerId: PlayerId): number {
    const evaluation = this.evaluateBoard(state, playerId);
    return evaluation.score;
  }

  /**
   * Evaluate the current board state
   */
  evaluateBoard(state: GameState, playerId: PlayerId): BoardEvaluation {
    const opponentId: PlayerId = playerId === 'player1' ? 'player2' : 'player1';

    const playerPieces = getPlayerPieces(state.board, playerId);
    const opponentPieces = getPlayerPieces(state.board, opponentId);

    // Piece count advantage
    const pieceAdvantage = (playerPieces.length - opponentPieces.length) * 100;

    // Position advantage (pieces closer to opponent's side)
    let positionAdvantage = 0;
    const boardRows = state.board.length;

    playerPieces.forEach((piece) => {
      const rowAdvantage = playerId === 'player1'
        ? piece.position.row
        : boardRows - 1 - piece.position.row;
      positionAdvantage += rowAdvantage * 5;
    });

    opponentPieces.forEach((piece) => {
      const rowAdvantage = opponentId === 'player1'
        ? piece.position.row
        : boardRows - 1 - piece.position.row;
      positionAdvantage -= rowAdvantage * 5;
    });

    // Capture opportunities
    let captureOpportunities = 0;
    playerPieces.forEach((piece) => {
      const moves = getAvailableMoves(state, piece);
      moves.forEach((move) => {
        const captures = getPotentialCaptures(state, piece.position, move);
        captureOpportunities += captures.length * 30;
      });
    });

    // Mobility score (number of available moves)
    const playerMoves = this.getAllPossibleMoves(state, playerId);
    const opponentMoves = this.getAllPossibleMoves(state, opponentId);
    const mobilityScore = (playerMoves.length - opponentMoves.length) * 10;

    // Total score
    const score = pieceAdvantage + positionAdvantage + captureOpportunities + mobilityScore;

    return {
      score,
      pieceAdvantage,
      positionAdvantage,
      captureOpportunities,
      mobilityScore,
    };
  }

  /**
   * Get all possible moves for a player
   */
  private getAllPossibleMoves(state: GameState, playerId: PlayerId): Move[] {
    const moves: Move[] = [];
    const pieces = getPlayerPieces(state.board, playerId);

    pieces.forEach((piece) => {
      const validMoves = getAvailableMoves(state, piece);
      validMoves.forEach((toPosition) => {
        moves.push({
          piece,
          from: piece.position,
          to: toPosition,
          timestamp: Date.now(),
        });
      });
    });

    return moves;
  }

  /**
   * Simulate a move and return new state
   */
  private simulateMove(state: GameState, move: Move): GameState {
    const result = executeMove(state, move.from, move.to);
    if (!result.success) {
      throw new Error('Failed to simulate move: ' + result.error);
    }
    return result.newState;
  }

  /**
   * Add artificial thinking delay for realism
   */
  private async addThinkingDelay(): Promise<void> {
    if (this.config.thinkingTime && this.config.thinkingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, this.config.thinkingTime));
    }
  }

  /**
   * Normalize score to 0-1 confidence range
   */
  private normalizeScore(score: number): number {
    // Sigmoid function to normalize scores
    return 1 / (1 + Math.exp(-score / 1000));
  }
}

/**
 * Factory function to create AI player
 */
export function createAIPlayer(level: AILevel): AIPlayer {
  return new AIPlayer(level);
}
