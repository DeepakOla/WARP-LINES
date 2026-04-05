/**
 * Core Game Type Definitions
 */

import { BoardConfig, GameRules, PlayerColor } from '../config/game.config';

/**
 * Position on the game board
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Game piece on the board
 */
export interface Piece {
  id: number;
  color: PlayerColor;
  position: Position;
  isInfiltrator: boolean;
  isCaptured: boolean;
}

/**
 * Move made by a player
 */
export interface Move {
  pieceId: number;
  from: Position;
  to: Position;
  capturedPieceId?: number;
  timestamp: number;
}

/**
 * Player in the game
 */
export interface Player {
  id: string;
  color: PlayerColor;
  name: string;
  isAI: boolean;
  pieces: Piece[];
  capturedPieces: number;
}

/**
 * Game board state
 */
export interface Board {
  config: BoardConfig;
  cells: Cell[][];
  pieces: Piece[];
}

/**
 * Individual cell on the board
 */
export interface Cell {
  position: Position;
  piece: Piece | null;
  isPlayable: boolean;
  neighbors: Position[];
}

/**
 * Valid move for a piece
 */
export interface ValidMove {
  to: Position;
  isCapture: boolean;
  capturedPieceId?: number;
  chainCaptures?: Position[];
}

/**
 * Game state
 */
export interface GameState {
  id: string;
  board: Board;
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  rules: GameRules;
  status: GameStatus;
  moves: Move[];
  winner?: PlayerColor;
  startTime: number;
  lastMoveTime: number;
  turnStartTime: number;
}

/**
 * Game status
 */
export type GameStatus =
  | 'not_started'
  | 'in_progress'
  | 'paused'
  | 'finished'
  | 'abandoned';

/**
 * Game result
 */
export interface GameResult {
  winner: PlayerColor | 'draw';
  reason: GameEndReason;
  totalMoves: number;
  duration: number;
  stars?: 1 | 2 | 3;
}

/**
 * Reason for game ending
 */
export type GameEndReason =
  | 'checkmate'
  | 'no_valid_moves'
  | 'time_out'
  | 'resignation'
  | 'draw_by_moves'
  | 'draw_by_agreement';

/**
 * AI difficulty levels
 */
export type AIDifficulty = 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'master';

/**
 * Game mode
 */
export type GameMode = 'local' | 'solo' | 'online' | 'campaign';
