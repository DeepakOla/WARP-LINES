/**
 * Centralized Game Configuration
 * All game rules and settings in one place for easy modification
 */

export interface GameConfig {
  // Board configuration
  boardSize: number;           // 6, 8, 10, or 12
  piecesPerPlayer: number;     // Number of pieces each player starts with

  // Game modes
  enableInfiltration: boolean; // Infiltration mode (symmetric piece swap)

  // Rules
  enableKings: boolean;        // Can pieces be promoted to kings?
  forcedCaptures: boolean;     // Must capture if possible (mandatory jumps)
  multiJumps: boolean;         // Can continue jumping in same turn
  kingsCanMoveBackward: boolean; // Kings can move in all directions

  // Win conditions
  captureAllToWin: boolean;    // Win by capturing all opponent pieces
  blockAllToWin: boolean;      // Win by blocking all opponent moves
}

/**
 * Default game configuration (Classic Warp Board rules)
 */
export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 8,
  piecesPerPlayer: 12,
  enableInfiltration: false,
  enableKings: true,
  forcedCaptures: true,
  multiJumps: true,
  kingsCanMoveBackward: true,
  captureAllToWin: true,
  blockAllToWin: true,
};

/**
 * Preset configurations for different board sizes
 */
export const BOARD_PRESETS: Record<number, Partial<GameConfig>> = {
  6: {
    boardSize: 6,
    piecesPerPlayer: 6,
  },
  8: {
    boardSize: 8,
    piecesPerPlayer: 12,
  },
  10: {
    boardSize: 10,
    piecesPerPlayer: 20,
  },
  12: {
    boardSize: 12,
    piecesPerPlayer: 30,
  },
};

/**
 * Validates game configuration
 */
export function validateConfig(config: GameConfig): boolean {
  if (config.boardSize < 6 || config.boardSize > 12 || config.boardSize % 2 !== 0) {
    return false; // Board size must be even and between 6-12
  }

  if (config.piecesPerPlayer < 1 || config.piecesPerPlayer > (config.boardSize * config.boardSize) / 2) {
    return false; // Too many pieces for board
  }

  return true;
}

/**
 * Creates a configuration with a specific board size
 */
export function createConfig(boardSize: 6 | 8 | 10 | 12, overrides?: Partial<GameConfig>): GameConfig {
  const preset = BOARD_PRESETS[boardSize];
  return {
    ...DEFAULT_CONFIG,
    ...preset,
    ...overrides,
  };
}
