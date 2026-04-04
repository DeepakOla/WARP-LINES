/**
 * Move and capture types
 */

import { Position } from './piece';

export type MoveType = 'MOVE' | 'CAPTURE';

export interface Move {
  pieceId: string;        // ID of piece being moved
  from: Position;         // Starting position
  to: Position;           // Ending position
  type: MoveType;         // Move or capture
  capturedPieceId?: string; // ID of captured piece (if capture move)
  isPromotion?: boolean;  // Does this move result in promotion?
  continueJump?: boolean; // Can this piece continue jumping?
}

export interface CaptureSequence {
  moves: Move[];          // Sequence of captures in multi-jump
  pieceId: string;        // Piece performing captures
}

/**
 * Creates a simple move
 */
export function createMove(
  pieceId: string,
  from: Position,
  to: Position
): Move {
  return {
    pieceId,
    from,
    to,
    type: 'MOVE',
  };
}

/**
 * Creates a capture move
 */
export function createCapture(
  pieceId: string,
  from: Position,
  to: Position,
  capturedPieceId: string,
  continueJump: boolean = false
): Move {
  return {
    pieceId,
    from,
    to,
    type: 'CAPTURE',
    capturedPieceId,
    continueJump,
  };
}

/**
 * Calculates Manhattan distance between two positions
 */
export function distance(from: Position, to: Position): number {
  return Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
}

/**
 * Checks if move is diagonal
 */
export function isDiagonal(from: Position, to: Position): boolean {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return rowDiff === colDiff && rowDiff > 0;
}

/**
 * Gets the position between two positions (for capture detection)
 */
export function getMiddlePosition(from: Position, to: Position): Position | null {
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  // Must be exactly 2 squares apart diagonally for a jump
  if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
    return {
      row: from.row + rowDiff / 2,
      col: from.col + colDiff / 2,
    };
  }

  return null;
}

/**
 * Checks if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}
