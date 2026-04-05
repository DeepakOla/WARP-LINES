import type { Board, Piece, Move, Player } from '../types/game';

/**
 * For a capture A → B → C, C is the "mirror" of A through B.
 * C = 2*B - A  (midpoint formula).
 * Returns the nodeId of C if it exists and is empty, otherwise null.
 */
function getCaptureDestination(
  fromNodeId: number,
  overNodeId: number,
  board: Board,
  pieces: Piece[]
): number | null {
  const from = board.nodes[fromNodeId];
  const over = board.nodes[overNodeId];
  if (!from || !over) return null;

  const cx = Math.round((2 * over.position.x - from.position.x) * 100) / 100;
  const cy = Math.round((2 * over.position.y - from.position.y) * 100) / 100;

  // Find a node at that position (within 1px tolerance)
  const dest = board.nodes.find(
    n => Math.abs(n.position.x - cx) < 1 && Math.abs(n.position.y - cy) < 1
  );
  if (!dest) return null;

  // Destination must be connected to 'over' node
  const neighbors = board.adjacencyMap.get(overNodeId) ?? [];
  if (!neighbors.includes(dest.id)) return null;

  // Destination must be empty
  const occupied = pieces.some(p => p.nodeId === dest.id);
  if (occupied) return null;

  return dest.id;
}

/**
 * Returns all valid moves for a single piece, including captures and simple slides.
 * Does NOT enforce the mandatory-capture rule — that is applied at the game level.
 */
export function getValidMoves(
  board: Board,
  piece: Piece,
  pieces: Piece[]
): Move[] {
  const moves: Move[] = [];
  const neighbors = board.adjacencyMap.get(piece.nodeId) ?? [];

  for (const neighborId of neighbors) {
    const neighborPiece = pieces.find(p => p.nodeId === neighborId);

    if (!neighborPiece) {
      // Empty adjacent node → simple slide move
      moves.push({
        pieceId: piece.id,
        fromNodeId: piece.nodeId,
        toNodeId: neighborId,
      });
    } else if (neighborPiece.owner !== piece.owner) {
      // Opponent piece → try capture
      const destId = getCaptureDestination(piece.nodeId, neighborId, board, pieces);
      if (destId !== null) {
        moves.push({
          pieceId: piece.id,
          fromNodeId: piece.nodeId,
          toNodeId: destId,
          capturedPieceId: neighborPiece.id,
          capturedNodeId: neighborId,
        });
      }
    }
  }

  return moves;
}

/**
 * Checks whether a specific move (from → to) is valid for the given piece.
 */
export function isValidMove(
  board: Board,
  piece: Piece,
  toNodeId: number,
  pieces: Piece[]
): boolean {
  const moves = getValidMoves(board, piece, pieces);
  return moves.some(m => m.toNodeId === toNodeId);
}

/**
 * Returns all capture moves available for a given player across all their pieces.
 * Used to enforce the mandatory-capture rule.
 */
export function getMandatoryCaptures(
  board: Board,
  pieces: Piece[],
  player: Player
): Move[] {
  const captures: Move[] = [];
  const playerPieces = pieces.filter(p => p.owner === player);

  for (const piece of playerPieces) {
    const moves = getValidMoves(board, piece, pieces);
    captures.push(...moves.filter(m => m.capturedPieceId !== undefined));
  }

  return captures;
}

/**
 * Returns all valid moves for a player, respecting mandatory capture rules.
 * If any captures are available, only captures are returned.
 */
export function getAllValidMovesForPlayer(
  board: Board,
  pieces: Piece[],
  player: Player,
  mandatoryCaptures: boolean
): Move[] {
  const playerPieces = pieces.filter(p => p.owner === player);
  const allMoves: Move[] = [];

  for (const piece of playerPieces) {
    allMoves.push(...getValidMoves(board, piece, pieces));
  }

  if (mandatoryCaptures) {
    const captures = allMoves.filter(m => m.capturedPieceId !== undefined);
    if (captures.length > 0) return captures;
  }

  return allMoves;
}
