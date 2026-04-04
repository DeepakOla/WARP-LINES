/**
 * Complete game state management
 */

import { GameConfig } from '../config/gameConfig';
import { Piece, PieceColor } from './piece';
import { Move } from './move';

export type GameStatus = 'setup' | 'playing' | 'paused' | 'finished';

export interface GameState {
  // Configuration
  config: GameConfig;

  // Board state
  pieces: Map<string, Piece>;    // All pieces by ID
  boardSize: number;              // Cached from config

  // Game flow
  currentPlayer: PieceColor;      // Whose turn is it?
  status: GameStatus;             // Current game status

  // Capture sequence handling
  captureMode: boolean;           // In middle of multi-jump?
  activePieceId: string | null;  // Piece that must continue jumping

  // Available moves for current player
  availableMoves: Move[];         // Legal moves for current player

  // Game history
  moveHistory: Move[];            // All moves made
  capturedPieces: string[];       // IDs of captured pieces

  // Win condition
  winner: PieceColor | null;      // Who won? (null if game ongoing)

  // Timestamps
  startTime: number;              // Game start timestamp
  lastMoveTime: number;           // Last move timestamp
}

/**
 * Creates initial game state
 */
export function createInitialGameState(config: GameConfig): GameState {
  return {
    config,
    pieces: new Map(),
    boardSize: config.boardSize,
    currentPlayer: 'RED',
    status: 'setup',
    captureMode: false,
    activePieceId: null,
    availableMoves: [],
    moveHistory: [],
    capturedPieces: [],
    winner: null,
    startTime: Date.now(),
    lastMoveTime: Date.now(),
  };
}

/**
 * Gets all pieces for a specific color
 */
export function getPiecesByColor(state: GameState, color: PieceColor): Piece[] {
  return Array.from(state.pieces.values()).filter(
    (piece) => piece.color === color && !piece.captured
  );
}

/**
 * Gets piece at specific position
 */
export function getPieceAt(state: GameState, row: number, col: number): Piece | null {
  for (const piece of state.pieces.values()) {
    if (!piece.captured && piece.position.row === row && piece.position.col === col) {
      return piece;
    }
  }
  return null;
}

/**
 * Checks if position is on board
 */
export function isOnBoard(row: number, col: number, boardSize: number): boolean {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

/**
 * Checks if position is occupied
 */
export function isOccupied(state: GameState, row: number, col: number): boolean {
  return getPieceAt(state, row, col) !== null;
}

/**
 * Switches to other player
 */
export function switchPlayer(state: GameState): GameState {
  return {
    ...state,
    currentPlayer: state.currentPlayer === 'RED' ? 'GREEN' : 'RED',
    lastMoveTime: Date.now(),
  };
}

/**
 * Checks if game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.winner !== null || state.status === 'finished';
}

/**
 * Gets opponent color
 */
export function getOpponentColor(color: PieceColor): PieceColor {
  return color === 'RED' ? 'GREEN' : 'RED';
}
