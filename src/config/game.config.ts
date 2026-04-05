/**
 * Centralized Game Configuration
 *
 * This file contains all configurable parameters for the game,
 * making it easy to adjust board sizes, shapes, and game rules
 * without modifying core game logic.
 */

export type BoardShape = 'triangle' | 'rectangle' | 'square';
export type NodeCount = 10 | 13 | 16 | 19 | 22 | 25;

export interface BoardConfig {
  /** Shape of the board */
  shape: BoardShape;
  /** Number of nodes per side (for triangle) or rows (for rectangle/square) */
  nodes: NodeCount;
  /** Number of rows in the board */
  rows: number;
}

export interface GameRules {
  /** Whether captures are mandatory when available */
  mandatoryCaptures: boolean;
  /** Number of infiltrator pieces per player (0, 1, or 2) */
  infiltrators: 0 | 1 | 2;
  /** Turn time limit in seconds (0 for no limit) */
  turnTimeLimit: number;
  /** Maximum number of moves before declaring a draw */
  maxMovesForDraw: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  boardConfig: BoardConfig;
  aiDifficulty: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'master';
  rules: GameRules;
  /** Number of moves target for 3-star rating */
  threeStarMoves: number;
  /** Number of moves target for 2-star rating */
  twoStarMoves: number;
}

/**
 * Default board configurations for different levels
 */
export const BOARD_CONFIGS: Record<string, BoardConfig> = {
  small: {
    shape: 'triangle',
    nodes: 10,
    rows: 3,
  },
  medium: {
    shape: 'triangle',
    nodes: 13,
    rows: 4,
  },
  large: {
    shape: 'triangle',
    nodes: 16,
    rows: 5,
  },
  xlarge: {
    shape: 'triangle',
    nodes: 19,
    rows: 6,
  },
  rectangular: {
    shape: 'rectangle',
    nodes: 16,
    rows: 4,
  },
  square: {
    shape: 'square',
    nodes: 16,
    rows: 4,
  },
};

/**
 * Default game rules
 */
export const DEFAULT_RULES: GameRules = {
  mandatoryCaptures: true,
  infiltrators: 0,
  turnTimeLimit: 0,
  maxMovesForDraw: 100,
};

/**
 * Campaign levels configuration
 * Extended to support more than 7 levels as requested
 */
export const CAMPAIGN_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'First Steps',
    boardConfig: BOARD_CONFIGS.small,
    aiDifficulty: 'novice',
    rules: {
      ...DEFAULT_RULES,
      mandatoryCaptures: false,
    },
    threeStarMoves: 5,
    twoStarMoves: 8,
  },
  {
    id: 2,
    name: 'Learning the Warp',
    boardConfig: BOARD_CONFIGS.small,
    aiDifficulty: 'novice',
    rules: DEFAULT_RULES,
    threeStarMoves: 6,
    twoStarMoves: 10,
  },
  {
    id: 3,
    name: 'Strategic Thinking',
    boardConfig: BOARD_CONFIGS.small,
    aiDifficulty: 'beginner',
    rules: DEFAULT_RULES,
    threeStarMoves: 7,
    twoStarMoves: 12,
  },
  {
    id: 4,
    name: 'Medium Challenge',
    boardConfig: BOARD_CONFIGS.medium,
    aiDifficulty: 'beginner',
    rules: DEFAULT_RULES,
    threeStarMoves: 10,
    twoStarMoves: 15,
  },
  {
    id: 5,
    name: 'Infiltrator Introduction',
    boardConfig: BOARD_CONFIGS.medium,
    aiDifficulty: 'intermediate',
    rules: {
      ...DEFAULT_RULES,
      infiltrators: 1,
    },
    threeStarMoves: 12,
    twoStarMoves: 18,
  },
  {
    id: 6,
    name: 'Time Pressure',
    boardConfig: BOARD_CONFIGS.medium,
    aiDifficulty: 'intermediate',
    rules: {
      ...DEFAULT_RULES,
      turnTimeLimit: 30,
    },
    threeStarMoves: 10,
    twoStarMoves: 15,
  },
  {
    id: 7,
    name: 'Advanced Tactics',
    boardConfig: BOARD_CONFIGS.large,
    aiDifficulty: 'intermediate',
    rules: DEFAULT_RULES,
    threeStarMoves: 15,
    twoStarMoves: 22,
  },
  {
    id: 8,
    name: 'Double Infiltrators',
    boardConfig: BOARD_CONFIGS.large,
    aiDifficulty: 'advanced',
    rules: {
      ...DEFAULT_RULES,
      infiltrators: 2,
    },
    threeStarMoves: 18,
    twoStarMoves: 25,
  },
  {
    id: 9,
    name: 'Rectangular Arena',
    boardConfig: BOARD_CONFIGS.rectangular,
    aiDifficulty: 'advanced',
    rules: DEFAULT_RULES,
    threeStarMoves: 12,
    twoStarMoves: 18,
  },
  {
    id: 10,
    name: 'Square Battlefield',
    boardConfig: BOARD_CONFIGS.square,
    aiDifficulty: 'advanced',
    rules: {
      ...DEFAULT_RULES,
      infiltrators: 1,
      turnTimeLimit: 45,
    },
    threeStarMoves: 14,
    twoStarMoves: 20,
  },
  {
    id: 11,
    name: 'Master Challenge I',
    boardConfig: BOARD_CONFIGS.xlarge,
    aiDifficulty: 'master',
    rules: DEFAULT_RULES,
    threeStarMoves: 20,
    twoStarMoves: 30,
  },
  {
    id: 12,
    name: 'Master Challenge II',
    boardConfig: BOARD_CONFIGS.xlarge,
    aiDifficulty: 'master',
    rules: {
      ...DEFAULT_RULES,
      infiltrators: 2,
      turnTimeLimit: 60,
    },
    threeStarMoves: 22,
    twoStarMoves: 32,
  },
];

/**
 * Visual configuration for different board shapes
 */
export const VISUAL_CONFIG = {
  triangle: {
    cellSize: 60,
    spacing: 8,
    perspective: 1200,
  },
  rectangle: {
    cellSize: 70,
    spacing: 6,
    perspective: 1000,
  },
  square: {
    cellSize: 65,
    spacing: 6,
    perspective: 1000,
  },
};

/**
 * Player colors configuration
 */
export const PLAYER_COLORS = {
  RED: 'red',
  GREEN: 'green',
} as const;

export type PlayerColor = keyof typeof PLAYER_COLORS;
