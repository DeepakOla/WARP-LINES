/**
 * Move Validator
 * Validates if moves are legal according to game rules
 */

import { GameState, getPieceAt, isOnBoard, isOccupied, getOpponentColor } from '../types/gameState';
import { Piece, canMoveBackward, getForwardDirection } from '../types/piece';
import { Move, isDiagonal, getMiddlePosition, positionsEqual } from '../types/move';

/**
 * Gets all legal moves for a piece
 */
export function getLegalMoves(state: GameState, piece: Piece): Move[] {
  if (piece.captured) {
    return [];
  }

  const moves: Move[] = [];
  const { boardSize, config } = state;
  const { row, col } = piece.position;

  // Get possible move directions
  const directions = getMoveDirections(piece, config.kingsCanMoveBackward);

  for (const dir of directions) {
    // Check simple moves (one square diagonal)
    const simpleRow = row + dir.row;
    const simpleCol = col + dir.col;

    if (isOnBoard(simpleRow, simpleCol, boardSize) && !isOccupied(state, simpleRow, simpleCol)) {
      moves.push({
        pieceId: piece.id,
        from: { row, col },
        to: { row: simpleRow, col: simpleCol },
        type: 'MOVE',
      });
    }

    // Check capture moves (jump over opponent)
    const jumpRow = row + dir.row * 2;
    const jumpCol = col + dir.col * 2;
    const middleRow = row + dir.row;
    const middleCol = col + dir.col;

    if (
      isOnBoard(jumpRow, jumpCol, boardSize) &&
      !isOccupied(state, jumpRow, jumpCol)
    ) {
      const middlePiece = getPieceAt(state, middleRow, middleCol);

      // Can only jump over opponent pieces
      if (middlePiece && middlePiece.color !== piece.color) {
        // Check if this jump allows more jumps
        const canContinue = hasMoreCaptures(
          state,
          piece,
          { row: jumpRow, col: jumpCol },
          middlePiece.id
        );

        moves.push({
          pieceId: piece.id,
          from: { row, col },
          to: { row: jumpRow, col: jumpCol },
          type: 'CAPTURE',
          capturedPieceId: middlePiece.id,
          continueJump: canContinue,
        });
      }
    }
  }

  return moves;
}

/**
 * Gets move directions for a piece (regular pieces move forward, kings move all directions)
 */
function getMoveDirections(piece: Piece, kingsCanMoveBackward: boolean): Array<{ row: number; col: number }> {
  const forward = getForwardDirection(piece.color);

  if (piece.type === 'KING' && kingsCanMoveBackward) {
    // Kings can move in all 4 diagonal directions
    return [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];
  } else {
    // Regular pieces can only move forward diagonally
    return [
      { row: forward, col: 1 },
      { row: forward, col: -1 },
    ];
  }
}

/**
 * Checks if piece can make more captures from a position
 * Used to detect multi-jump scenarios
 */
function hasMoreCaptures(
  state: GameState,
  piece: Piece,
  fromPosition: { row: number; col: number },
  ignoreCapturedId: string
): boolean {
  const { boardSize, config } = state;
  const { row, col } = fromPosition;
  const directions = getMoveDirections(piece, config.kingsCanMoveBackward);

  for (const dir of directions) {
    const jumpRow = row + dir.row * 2;
    const jumpCol = col + dir.col * 2;
    const middleRow = row + dir.row;
    const middleCol = col + dir.col;

    if (isOnBoard(jumpRow, jumpCol, boardSize) && !isOccupied(state, jumpRow, jumpCol)) {
      const middlePiece = getPieceAt(state, middleRow, middleCol);

      // Can capture if there's an opponent piece that's not the one we just captured
      if (
        middlePiece &&
        middlePiece.color !== piece.color &&
        middlePiece.id !== ignoreCapturedId
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validates if a specific move is legal
 */
export function isValidMove(state: GameState, move: Move): boolean {
  const piece = state.pieces.get(move.pieceId);
  if (!piece || piece.captured) {
    return false;
  }

  // Check if it's this piece's turn
  if (piece.color !== state.currentPlayer) {
    return false;
  }

  // In capture mode, only the active piece can move
  if (state.captureMode && state.activePieceId !== piece.id) {
    return false;
  }

  // Verify move is in the list of legal moves
  const legalMoves = getLegalMoves(state, piece);
  return legalMoves.some((legalMove) =>
    positionsEqual(legalMove.from, move.from) &&
    positionsEqual(legalMove.to, move.to) &&
    legalMove.type === move.type
  );
}

/**
 * Gets all legal moves for current player
 */
export function getAllLegalMoves(state: GameState): Move[] {
  const moves: Move[] = [];

  // If in capture mode, only get moves for active piece
  if (state.captureMode && state.activePieceId) {
    const piece = state.pieces.get(state.activePieceId);
    if (piece) {
      return getLegalMoves(state, piece).filter((move) => move.type === 'CAPTURE');
    }
    return [];
  }

  // Get all pieces for current player
  for (const piece of state.pieces.values()) {
    if (piece.color === state.currentPlayer && !piece.captured) {
      const pieceMoves = getLegalMoves(state, piece);
      moves.push(...pieceMoves);
    }
  }

  return moves;
}

/**
 * Checks if current player has any legal moves
 */
export function hasLegalMoves(state: GameState): boolean {
  return getAllLegalMoves(state).length > 0;
}
