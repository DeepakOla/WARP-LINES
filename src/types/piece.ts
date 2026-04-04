/**
 * Piece types and interfaces
 */

export type PieceColor = 'RED' | 'GREEN';
export type PieceType = 'REGULAR' | 'KING';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;           // Unique identifier (e.g., "RED_1", "GREEN_5")
  color: PieceColor;    // RED or GREEN
  type: PieceType;      // REGULAR or KING
  position: Position;   // Current position on board
  captured: boolean;    // Has this piece been captured?
}

/**
 * Creates a new piece
 */
export function createPiece(
  id: string,
  color: PieceColor,
  row: number,
  col: number,
  type: PieceType = 'REGULAR'
): Piece {
  return {
    id,
    color,
    type,
    position: { row, col },
    captured: false,
  };
}

/**
 * Checks if piece can move backward (only kings can)
 */
export function canMoveBackward(piece: Piece): boolean {
  return piece.type === 'KING';
}

/**
 * Gets the forward direction for a piece color
 * RED moves down (increasing row), GREEN moves up (decreasing row)
 */
export function getForwardDirection(color: PieceColor): number {
  return color === 'RED' ? 1 : -1;
}

/**
 * Checks if position is promotion row for given color
 */
export function isPromotionRow(row: number, color: PieceColor, boardSize: number): boolean {
  if (color === 'RED') {
    return row === boardSize - 1; // RED promotes at bottom row
  } else {
    return row === 0; // GREEN promotes at top row
  }
}

/**
 * Promotes a piece to king
 */
export function promotePiece(piece: Piece): Piece {
  return {
    ...piece,
    type: 'KING',
  };
}
