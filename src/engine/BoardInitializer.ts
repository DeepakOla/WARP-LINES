/**
 * Board Initializer
 * Sets up initial piece positions for standard and infiltration modes
 */

import { GameConfig } from '../config/gameConfig';
import { GameState, createInitialGameState } from '../types/gameState';
import { createPiece, PieceColor } from '../types/piece';

/**
 * Initializes board with pieces in standard configuration
 */
export function initializeStandardBoard(config: GameConfig): GameState {
  const state = createInitialGameState(config);
  const { boardSize } = config;

  // Calculate how many rows to fill for each player
  const rowsPerPlayer = Math.ceil((config.piecesPerPlayer * 2) / boardSize);

  let redId = 0;
  let greenId = 0;

  // Place RED pieces (top rows)
  for (let row = 0; row < rowsPerPlayer; row++) {
    for (let col = 0; col < boardSize; col++) {
      // Only place on dark squares (checkerboard pattern)
      if ((row + col) % 2 === 1) {
        if (redId < config.piecesPerPlayer) {
          const piece = createPiece(`RED_${redId}`, 'RED', row, col);
          state.pieces.set(piece.id, piece);
          redId++;
        }
      }
    }
  }

  // Place GREEN pieces (bottom rows)
  for (let row = boardSize - rowsPerPlayer; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      // Only place on dark squares (checkerboard pattern)
      if ((row + col) % 2 === 1) {
        if (greenId < config.piecesPerPlayer) {
          const piece = createPiece(`GREEN_${greenId}`, 'GREEN', row, col);
          state.pieces.set(piece.id, piece);
          greenId++;
        }
      }
    }
  }

  state.status = 'playing';
  return state;
}

/**
 * Initializes board with infiltration mode (fixed symmetric piece swap)
 *
 * This implements the fixed infiltration mode where front-line pieces are
 * swapped symmetrically (not randomly) to ensure fairness and determinism.
 */
export function initializeInfiltrationBoard(config: GameConfig): GameState {
  // First create standard board
  const state = initializeStandardBoard(config);
  const { boardSize } = config;

  // Get front-line pieces (the row closest to the middle)
  const rowsPerPlayer = Math.ceil((config.piecesPerPlayer * 2) / boardSize);
  const redFrontRow = rowsPerPlayer - 1;
  const greenFrontRow = boardSize - rowsPerPlayer;

  // Collect front-line pieces
  const redFrontPieces: string[] = [];
  const greenFrontPieces: string[] = [];

  for (const [id, piece] of state.pieces.entries()) {
    if (!piece.captured) {
      if (piece.color === 'RED' && piece.position.row === redFrontRow) {
        redFrontPieces.push(id);
      } else if (piece.color === 'GREEN' && piece.position.row === greenFrontRow) {
        greenFrontPieces.push(id);
      }
    }
  }

  // Fixed symmetric swap pattern
  // For 8x8 board with 4 pieces per front row:
  // Position 0 <-> Position 3 (corners)
  // Position 1 <-> Position 2 (inner pieces)
  // This ensures perfect symmetry

  const swapCount = Math.min(redFrontPieces.length, greenFrontPieces.length);

  for (let i = 0; i < swapCount; i++) {
    const redPieceId = redFrontPieces[i];
    const greenPieceId = greenFrontPieces[swapCount - 1 - i]; // Symmetric position

    const redPiece = state.pieces.get(redPieceId);
    const greenPiece = state.pieces.get(greenPieceId);

    if (redPiece && greenPiece) {
      // Swap positions (not colors - pieces physically swap locations)
      const tempPos = { ...redPiece.position };
      redPiece.position = { ...greenPiece.position };
      greenPiece.position = tempPos;

      // Update in map
      state.pieces.set(redPieceId, redPiece);
      state.pieces.set(greenPieceId, greenPiece);
    }
  }

  return state;
}

/**
 * Main board initializer that chooses standard or infiltration mode
 */
export function initializeBoard(config: GameConfig): GameState {
  if (config.enableInfiltration) {
    return initializeInfiltrationBoard(config);
  } else {
    return initializeStandardBoard(config);
  }
}

/**
 * Gets initial board layout for display purposes (before game starts)
 */
export function getBoardLayout(boardSize: number): boolean[][] {
  const layout: boolean[][] = [];

  for (let row = 0; row < boardSize; row++) {
    layout[row] = [];
    for (let col = 0; col < boardSize; col++) {
      // Dark squares are playable (checkerboard pattern)
      layout[row][col] = (row + col) % 2 === 1;
    }
  }

  return layout;
}
