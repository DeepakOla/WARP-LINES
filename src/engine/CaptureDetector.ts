/**
 * Capture Detector
 * Detects and enforces forced capture rules
 */

import { GameState, getPiecesByColor } from '../types/gameState';
import { Move } from '../types/move';
import { getLegalMoves } from './MoveValidator';

/**
 * Gets all available captures for current player
 */
export function getAvailableCaptures(state: GameState): Move[] {
  const captures: Move[] = [];

  // Get all pieces for current player
  const playerPieces = getPiecesByColor(state, state.currentPlayer);

  for (const piece of playerPieces) {
    const moves = getLegalMoves(state, piece);
    const captureMoves = moves.filter((move) => move.type === 'CAPTURE');
    captures.push(...captureMoves);
  }

  return captures;
}

/**
 * Checks if any captures are available for current player
 */
export function hasForcedCaptures(state: GameState): boolean {
  if (!state.config.forcedCaptures) {
    return false; // Forced captures disabled
  }

  return getAvailableCaptures(state).length > 0;
}

/**
 * Filters moves to only include captures if forced captures are enabled
 */
export function filterForcedCaptures(state: GameState, moves: Move[]): Move[] {
  if (!state.config.forcedCaptures) {
    return moves; // No filtering needed
  }

  const captures = moves.filter((move) => move.type === 'CAPTURE');

  // If captures are available, only allow captures
  if (captures.length > 0) {
    return captures;
  }

  return moves;
}

/**
 * Gets the longest capture sequence available
 * Used for prioritizing multi-jump moves
 */
export function getLongestCaptureSequence(state: GameState, pieceId: string): Move[] {
  const piece = state.pieces.get(pieceId);
  if (!piece) {
    return [];
  }

  const allSequences: Move[][] = [];
  const visited = new Set<string>();

  // Depth-first search to find all capture sequences
  function findSequences(currentPiece: typeof piece, currentSequence: Move[], capturedIds: Set<string>) {
    const moves = getLegalMoves(state, currentPiece);
    const captures = moves.filter((move) => move.type === 'CAPTURE');

    if (captures.length === 0) {
      // No more captures, this sequence is complete
      if (currentSequence.length > 0) {
        allSequences.push([...currentSequence]);
      }
      return;
    }

    for (const capture of captures) {
      // Skip if we already captured this piece in this sequence
      if (capture.capturedPieceId && capturedIds.has(capture.capturedPieceId)) {
        continue;
      }

      // Create new state with piece at new position
      const movedPiece = {
        ...currentPiece,
        position: capture.to,
      };

      const newCapturedIds = new Set(capturedIds);
      if (capture.capturedPieceId) {
        newCapturedIds.add(capture.capturedPieceId);
      }

      const newSequence = [...currentSequence, capture];
      findSequences(movedPiece, newSequence, newCapturedIds);
    }

    // Also record current sequence if it's not empty
    if (currentSequence.length > 0) {
      allSequences.push([...currentSequence]);
    }
  }

  findSequences(piece, [], new Set());

  // Return the longest sequence
  return allSequences.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
    []
  );
}

/**
 * Checks if a piece must continue capturing (multi-jump)
 */
export function mustContinueCapturing(state: GameState): boolean {
  if (!state.config.multiJumps || !state.captureMode || !state.activePieceId) {
    return false;
  }

  const piece = state.pieces.get(state.activePieceId);
  if (!piece) {
    return false;
  }

  const moves = getLegalMoves(state, piece);
  const captures = moves.filter((move) => move.type === 'CAPTURE');

  return captures.length > 0;
}
