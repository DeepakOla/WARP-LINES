/**
 * Move validation logic for The Sovereign Warp
 */

import { GameState, MoveValidation, Position, Piece, Node } from '../types/game';
import { getNodeAt, getAdjacentPositions } from './boardGenerator';

/**
 * Validate if a move is legal
 */
export function validateMove(
  gameState: GameState,
  piece: Piece,
  from: Position,
  to: Position
): MoveValidation {
  const { board, currentPlayer, rules } = gameState;

  // Check if piece belongs to current player
  if (piece.owner !== currentPlayer) {
    return {
      isValid: false,
      reason: 'Not your piece',
    };
  }

  // Check if destination is valid
  const toNode = getNodeAt(board, to);
  if (!toNode) {
    return {
      isValid: false,
      reason: 'Invalid destination',
    };
  }

  // Check if destination is playable
  if (!toNode.isPlayable) {
    return {
      isValid: false,
      reason: 'Destination is not playable',
    };
  }

  // Check if destination is occupied
  if (toNode.piece !== null) {
    return {
      isValid: false,
      reason: 'Destination is occupied',
    };
  }

  // Check if move is adjacent
  const adjacentPositions = getAdjacentPositions(board, from);
  const isAdjacent = adjacentPositions.some(
    (pos) => pos.row === to.row && pos.col === to.col
  );

  if (!isAdjacent) {
    return {
      isValid: false,
      reason: 'Must move to adjacent node',
    };
  }

  // Check mandatory captures rule
  if (rules.mandatoryCaptures) {
    const captureAvailable = hasAvailableCaptures(gameState, currentPlayer);
    const isCapture = willCaptureOpponent(gameState, from, to);

    if (captureAvailable && !isCapture) {
      return {
        isValid: false,
        reason: 'Must capture when possible',
      };
    }
  }

  return {
    isValid: true,
    availableMoves: getAvailableMoves(gameState, piece),
  };
}

/**
 * Get all valid moves for a piece
 */
export function getAvailableMoves(gameState: GameState, piece: Piece): Position[] {
  const { board } = gameState;
  const adjacentPositions = getAdjacentPositions(board, piece.position);

  const validMoves: Position[] = [];

  adjacentPositions.forEach((pos) => {
    const node = getNodeAt(board, pos);
    if (node && node.isPlayable && node.piece === null) {
      validMoves.push(pos);
    }
  });

  return validMoves;
}

/**
 * Get all pieces that have valid moves
 */
export function getMovablePieces(gameState: GameState, playerId: string): Piece[] {
  const { board } = gameState;
  const movablePieces: Piece[] = [];

  board.forEach((row) => {
    row.forEach((node) => {
      if (node.piece && node.piece.owner === playerId) {
        const moves = getAvailableMoves(gameState, node.piece);
        if (moves.length > 0) {
          movablePieces.push(node.piece);
        }
      }
    });
  });

  return movablePieces;
}

/**
 * Check if a player has any valid moves
 */
export function hasValidMoves(gameState: GameState, playerId: string): boolean {
  const movablePieces = getMovablePieces(gameState, playerId);
  return movablePieces.length > 0;
}

/**
 * Check if moving to a position will capture an opponent piece
 */
function willCaptureOpponent(
  gameState: GameState,
  from: Position,
  to: Position
): boolean {
  const { board, currentPlayer } = gameState;

  // Get adjacent positions from destination
  const adjacentToDestination = getAdjacentPositions(board, to);

  // Check if any adjacent piece at destination forms a capture pattern
  for (const adjPos of adjacentToDestination) {
    // Skip the "from" position
    if (adjPos.row === from.row && adjPos.col === from.col) continue;

    const adjNode = getNodeAt(board, adjPos);
    if (!adjNode || !adjNode.piece) continue;

    // Check if it's an opponent piece
    if (adjNode.piece.owner === currentPlayer) {
      // It's our piece - check for sandwich capture
      const oppositePos = getOppositePosition(to, adjPos);
      if (oppositePos) {
        const oppositeNode = getNodeAt(board, oppositePos);
        if (oppositeNode && oppositeNode.piece && oppositeNode.piece.owner !== currentPlayer) {
          return true;
        }
      }
    } else {
      // It's an opponent piece - check if we can sandwich it
      const oppositePos = getOppositePosition(to, adjPos);
      if (oppositePos) {
        const oppositeNode = getNodeAt(board, oppositePos);
        if (oppositeNode && oppositeNode.piece && oppositeNode.piece.owner === currentPlayer) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if a player has any available captures
 */
function hasAvailableCaptures(gameState: GameState, playerId: string): boolean {
  const { board } = gameState;

  // Check all player pieces
  for (const row of board) {
    for (const node of row) {
      if (!node.piece || node.piece.owner !== playerId) continue;

      const moves = getAvailableMoves(gameState, node.piece);
      for (const move of moves) {
        if (willCaptureOpponent(gameState, node.piece.position, move)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Get opposite position across a center point
 */
function getOppositePosition(center: Position, point: Position): Position | null {
  const deltaRow = center.row - point.row;
  const deltaCol = center.col - point.col;

  return {
    row: center.row + deltaRow,
    col: center.col + deltaCol,
  };
}

/**
 * Check if positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Get all valid moves for all pieces of a player
 */
export function getAllValidMoves(
  gameState: GameState,
  playerId: string
): Map<string, Position[]> {
  const { board } = gameState;
  const movesMap = new Map<string, Position[]>();

  board.forEach((row) => {
    row.forEach((node) => {
      if (node.piece && node.piece.owner === playerId) {
        const moves = getAvailableMoves(gameState, node.piece);
        movesMap.set(node.piece.id, moves);
      }
    });
  });

  return movesMap;
}
