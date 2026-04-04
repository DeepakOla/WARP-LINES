/**
 * Core game type definitions for Warp Board
 * A variant of Alquerque/Checkers played on a node-based board
 */

export type Player = 'green' | 'red';
export type PieceType = 'regular' | 'king';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;
  player: Player;
  type: PieceType;
  position: Position;
}

export interface Move {
  from: Position;
  to: Position;
  captures?: Position[]; // Positions of captured pieces
  isCapture: boolean;
  multiHop?: boolean; // Part of a multi-hop capture sequence
}

export interface GameSettings {
  boardSize: 3 | 4; // 3x3 or 4x4 grid of squares (nodes at intersections)
  mandatoryCaptures: boolean;
  infiltrators: 0 | 1 | 2; // Number of pieces swapped between players
  blitzTimer?: number; // Turn time limit in seconds (0 = off)
  aiDifficulty?: 1 | 2 | 3; // AI search depth: 1=2, 2=4, 3=6
}

export interface GameState {
  board: (Piece | null)[][]; // 2D array of pieces by position
  turn: Player;
  pieces: Piece[];
  settings: GameSettings;
  moveHistory: Move[];
  winner: Player | null;
  selectedPiece: Piece | null;
  legalMoves: Move[];
  capturedPieces: { green: Piece[]; red: Piece[] };
  mustCapture: boolean; // Whether current player must make a capture
  gameMode: GameMode;
  campaignLevel?: number;
  moveCount: number;
  timerRemaining?: number; // Seconds remaining for current turn
}

export type GameMode = 'solo' | 'local' | 'online' | 'campaign';

export interface Connection {
  from: Position;
  to: Position;
  type: 'horizontal' | 'vertical' | 'diagonal';
}

export interface BoardLayout {
  size: number; // Number of nodes per side
  nodes: Position[];
  connections: Connection[];
}

export interface CampaignLevel {
  level: number;
  name: string;
  description: string;
  settings: GameSettings;
  tutorial?: boolean;
  starsThresholds: [number, number, number]; // Move counts for 3, 2, 1 stars
}

export interface PlayerProfile {
  username: string;
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    winRate: number;
  };
  campaign: {
    currentLevel: number;
    levelsCompleted: number[];
    stars: Record<number, number>; // Level -> stars earned
  };
  unlockedThemes: string[];
  settings: {
    soundEnabled: boolean;
    volume: number;
  };
}

export interface OnlineGame {
  id: string;
  players: {
    green: string; // User ID
    red: string;
  };
  state: GameState;
  createdAt: number;
  updatedAt: number;
  isPrivate: boolean;
  status: 'waiting' | 'active' | 'finished';
}
