/**
 * Centralized game configuration for The Sovereign Warp
 */

import { GameRules } from '../types/game';

export interface BoardConfig {
  nodeCount: 10 | 13 | 16;
  rowCount: 3 | 4 | 5;
  boardSize: number; // Fixed board size in pixels
  dynamicSpacing: boolean; // Auto-adjust spacing to maintain board size
}

export interface VisualConfig {
  boardSize: number; // in pixels
  nodeRadius: number; // Radius of each node circle
  pieceRadius: number; // Radius of game pieces
  elevationHeight: number; // 3D elevation (translateZ)
  animationDuration: number; // in ms
}

/**
 * Board layout configurations based on node count
 */
export const BOARD_LAYOUTS: Record<10 | 13 | 16, BoardConfig> = {
  10: {
    nodeCount: 10,
    rowCount: 3,
    boardSize: 600,
    dynamicSpacing: true,
  },
  13: {
    nodeCount: 13,
    rowCount: 4,
    boardSize: 600,
    dynamicSpacing: true,
  },
  16: {
    nodeCount: 16,
    rowCount: 5,
    boardSize: 600,
    dynamicSpacing: true,
  },
};

/**
 * Default game rules
 */
export const DEFAULT_RULES: GameRules = {
  mandatoryCaptures: false,
  infiltratorCount: 0,
  turnTimeLimit: null,
  nodeCount: 13,
  rowCount: 4,
};

/**
 * Visual configuration for 3D board rendering
 */
export const VISUAL_CONFIG: VisualConfig = {
  boardSize: 600,
  nodeRadius: 30,
  pieceRadius: 25,
  elevationHeight: 20,
  animationDuration: 300,
};

/**
 * Calculate dynamic spacing between rows based on node count
 * to maintain consistent board size
 */
export function calculateRowSpacing(nodeCount: 10 | 13 | 16): number {
  const config = BOARD_LAYOUTS[nodeCount];
  const { boardSize, rowCount } = config;

  // Reserve space for node radius and padding
  const usableHeight = boardSize - (VISUAL_CONFIG.nodeRadius * 2 * 2);

  // Divide by number of gaps between rows (rowCount - 1)
  const spacing = usableHeight / (rowCount - 1);

  return spacing;
}

/**
 * Get row configuration for geometric grid layout
 * Returns number of nodes per row for the given layout
 */
export function getRowConfiguration(nodeCount: 10 | 13 | 16): number[] {
  switch (nodeCount) {
    case 10:
      // 3 rows: 3-4-3 pattern
      return [3, 4, 3];
    case 13:
      // 4 rows: 3-4-3-3 pattern
      return [3, 4, 3, 3];
    case 16:
      // 5 rows: 3-4-3-3-3 pattern
      return [3, 4, 3, 3, 3];
    default:
      return [3, 4, 3];
  }
}

/**
 * Calculate horizontal spacing for nodes in a row
 */
export function calculateColumnSpacing(nodesInRow: number): number {
  const usableWidth = VISUAL_CONFIG.boardSize - (VISUAL_CONFIG.nodeRadius * 2 * 2);

  if (nodesInRow === 1) return 0;

  return usableWidth / (nodesInRow - 1);
}

/**
 * Get board configuration for a specific node count
 */
export function getBoardConfig(nodeCount: 10 | 13 | 16): BoardConfig {
  return BOARD_LAYOUTS[nodeCount];
}
