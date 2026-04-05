/**
 * Core game types for The Sovereign Warp
 */

export type PlayerId = 'player1' | 'player2';

export type PieceType = 'normal' | 'infiltrator';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;
  owner: PlayerId;
  position: Position;
  type: PieceType;
  isKing?: boolean; // For future king piece functionality
}

export interface Node {
  position: Position;
  piece: Piece | null;
  isPlayable: boolean; // Whether pieces can be placed here
  adjacentNodes: Position[]; // Neighboring nodes for move validation
}

export interface Player {
  id: PlayerId;
  name: string;
  pieces: Piece[];
  capturedPieces: number;
  isAI: boolean;
  aiDifficulty?: AILevel;
}

export type AILevel = 'novice' | 'easy' | 'medium' | 'hard' | 'master';

export type GameMode = 'local' | 'solo' | 'campaign' | 'online';

export type GameStatus = 'setup' | 'playing' | 'paused' | 'finished';

export type GameResult = 'player1-win' | 'player2-win' | 'draw' | null;

export interface GameRules {
  mandatoryCaptures: boolean;
  infiltratorCount: 0 | 1 | 2;
  turnTimeLimit: number | null; // in seconds, null for unlimited
  nodeCount: 10 | 13 | 16; // Total nodes on the board
  rowCount: 3 | 4 | 5; // Number of rows
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  timestamp: number;
}

export interface GameState {
  id: string;
  mode: GameMode;
  status: GameStatus;
  rules: GameRules;
  players: [Player, Player];
  currentPlayer: PlayerId;
  board: Node[][];
  moveHistory: Move[];
  turnNumber: number;
  timeRemaining?: number; // for turn time limit
  result: GameResult;
  startedAt: number;
  finishedAt?: number;
}

export interface MoveValidation {
  isValid: boolean;
  reason?: string;
  availableMoves?: Position[];
}

export interface CaptureResult {
  captured: boolean;
  capturedPiece?: Piece;
  capturedPosition?: Position;
}

export interface WinCondition {
  hasWinner: boolean;
  winner?: PlayerId;
  isDraw: boolean;
  reason: string;
}
