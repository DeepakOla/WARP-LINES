/**
 * Capture detection and handling for The Sovereign Warp
 */

import { CaptureResult, Position, Piece, Node, GameState } from '../types/game';
import { getNodeAt, getAdjacentPositions, removePiece } from './boardGenerator';

/**
 * Detect and execute captures after a move
 * Uses sandwich/custodian capture mechanic
 */
export function detectAndExecuteCaptures(
  gameState: GameState,
  movedTo: Position
): CaptureResult[] {
  const { board, currentPlayer } = gameState;
  const captures: CaptureResult[] = [];

  // Get all adjacent positions from the moved-to position
  const adjacentPositions = getAdjacentPositions(board, movedTo);

  adjacentPositions.forEach((adjPos) => {
    const adjNode = getNodeAt(board, adjPos);
    if (!adjNode || !adjNode.piece) return;

    const adjPiece = adjNode.piece;

    // Only consider opponent pieces
    if (adjPiece.owner === currentPlayer) return;

    // Check for sandwich capture
    const captureResult = checkSandwichCapture(gameState, movedTo, adjPos);
    if (captureResult.captured) {
      captures.push(captureResult);

      // Remove the captured piece from the board
      if (captureResult.capturedPosition) {
        removePiece(board, captureResult.capturedPosition);
      }
    }
  });

  return captures;
}

/**
 * Check if a piece is sandwiched between two opponent pieces
 */
function checkSandwichCapture(
  gameState: GameState,
  allyPosition: Position,
  targetPosition: Position
): CaptureResult {
  const { board, currentPlayer } = gameState;

  const targetNode = getNodeAt(board, targetPosition);
  if (!targetNode || !targetNode.piece) {
    return { captured: false };
  }

  const targetPiece = targetNode.piece;

  // Target must be an opponent piece
  if (targetPiece.owner === currentPlayer) {
    return { captured: false };
  }

  // Calculate opposite position
  const oppositePos = getOppositePosition(allyPosition, targetPosition);
  if (!oppositePos) {
    return { captured: false };
  }

  const oppositeNode = getNodeAt(board, oppositePos);
  if (!oppositeNode || !oppositeNode.piece) {
    return { captured: false };
  }

  // Opposite piece must be our piece
  if (oppositeNode.piece.owner !== currentPlayer) {
    return { captured: false };
  }

  // Capture successful!
  return {
    captured: true,
    capturedPiece: targetPiece,
    capturedPosition: targetPosition,
  };
}

/**
 * Get opposite position across a center point
 */
function getOppositePosition(center: Position, point: Position): Position | null {
  const deltaRow = point.row - center.row;
  const deltaCol = point.col - center.col;

  return {
    row: center.row - deltaRow,
    col: center.col - deltaCol,
  };
}

/**
 * Check if a piece can be captured at a specific position
 */
export function canBeCaptured(
  gameState: GameState,
  position: Position
): boolean {
  const { board } = gameState;
  const node = getNodeAt(board, position);

  if (!node || !node.piece) return false;

  const piece = node.piece;
  const adjacentPositions = getAdjacentPositions(board, position);

  // Check all adjacent pairs for sandwich pattern
  for (let i = 0; i < adjacentPositions.length; i++) {
    for (let j = i + 1; j < adjacentPositions.length; j++) {
      const pos1 = adjacentPositions[i];
      const pos2 = adjacentPositions[j];

      // Check if pos1 and pos2 are on opposite sides
      if (!areOpposite(position, pos1, pos2)) continue;

      const node1 = getNodeAt(board, pos1);
      const node2 = getNodeAt(board, pos2);

      if (!node1?.piece || !node2?.piece) continue;

      // Both must be opponent pieces
      if (
        node1.piece.owner !== piece.owner &&
        node2.piece.owner !== piece.owner &&
        node1.piece.owner === node2.piece.owner
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if two positions are opposite across a center point
 */
function areOpposite(center: Position, pos1: Position, pos2: Position): boolean {
  const delta1Row = pos1.row - center.row;
  const delta1Col = pos1.col - center.col;
  const delta2Row = pos2.row - center.row;
  const delta2Col = pos2.col - center.col;

  return delta1Row === -delta2Row && delta1Col === -delta2Col;
}

/**
 * Get all pieces that are currently under threat of capture
 */
export function getThreatenedPieces(
  gameState: GameState,
  playerId: string
): Piece[] {
  const { board } = gameState;
  const threatened: Piece[] = [];

  board.forEach((row) => {
    row.forEach((node) => {
      if (node.piece && node.piece.owner === playerId) {
        if (canBeCaptured(gameState, node.position)) {
          threatened.push(node.piece);
        }
      }
    });
  });

  return threatened;
}

/**
 * Calculate potential captures for a move
 */
export function getPotentialCaptures(
  gameState: GameState,
  from: Position,
  to: Position
): Position[] {
  const { board, currentPlayer } = gameState;
  const potentialCaptures: Position[] = [];

  // Get adjacent positions from destination
  const adjacentPositions = getAdjacentPositions(board, to);

  adjacentPositions.forEach((adjPos) => {
    // Skip the "from" position
    if (adjPos.row === from.row && adjPos.col === from.col) return;

    const adjNode = getNodeAt(board, adjPos);
    if (!adjNode || !adjNode.piece) return;

    // Only consider opponent pieces
    if (adjNode.piece.owner === currentPlayer) return;

    // Check for potential sandwich
    const oppositePos = getOppositePosition(to, adjPos);
    if (!oppositePos) return;

    const oppositeNode = getNodeAt(board, oppositePos);
    if (!oppositeNode || !oppositeNode.piece) return;

    // If opposite is our piece or will be our piece (from position)
    if (
      oppositeNode.piece.owner === currentPlayer ||
      (oppositePos.row === from.row && oppositePos.col === from.col)
    ) {
      potentialCaptures.push(adjPos);
    }
  });

  return potentialCaptures;
}

/**
 * Count total captures that would result from a move
 */
export function countCapturesForMove(
  gameState: GameState,
  from: Position,
  to: Position
): number {
  return getPotentialCaptures(gameState, from, to).length;
}
