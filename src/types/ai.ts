/**
 * AI Engine types for The Sovereign Warp
 */

import { GameState, Move, Position, AILevel } from './game';

export interface AIConfig {
  level: AILevel;
  maxDepth: number; // Minimax search depth
  useAlphaBeta: boolean; // Alpha-beta pruning
  useWorker: boolean; // Run in Web Worker
  thinkingTime?: number; // Artificial delay for realism (ms)
}

export interface BoardEvaluation {
  score: number;
  pieceAdvantage: number;
  positionAdvantage: number;
  captureOpportunities: number;
  mobilityScore: number;
}

export interface MinimaxNode {
  state: GameState;
  move: Move | null;
  score: number;
  depth: number;
  alpha: number;
  beta: number;
  isMaximizing: boolean;
}

export interface AIMove {
  move: Move;
  evaluation: BoardEvaluation;
  searchDepth: number;
  nodesEvaluated: number;
  timeElapsed: number;
  confidence: number; // 0-1 score of move quality
}

export interface AIPlayer {
  config: AIConfig;
  evaluateBoard: (state: GameState, playerId: string) => BoardEvaluation;
  findBestMove: (state: GameState) => Promise<AIMove>;
  minimax: (
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ) => number;
}

/**
 * Difficulty level configurations
 */
export const AI_CONFIGS: Record<AILevel, AIConfig> = {
  novice: {
    level: 'novice',
    maxDepth: 1,
    useAlphaBeta: false,
    useWorker: false,
    thinkingTime: 500,
  },
  easy: {
    level: 'easy',
    maxDepth: 2,
    useAlphaBeta: true,
    useWorker: false,
    thinkingTime: 800,
  },
  medium: {
    level: 'medium',
    maxDepth: 3,
    useAlphaBeta: true,
    useWorker: true,
    thinkingTime: 1000,
  },
  hard: {
    level: 'hard',
    maxDepth: 4,
    useAlphaBeta: true,
    useWorker: true,
    thinkingTime: 1200,
  },
  master: {
    level: 'master',
    maxDepth: 5,
    useAlphaBeta: true,
    useWorker: true,
    thinkingTime: 1500,
  },
};
