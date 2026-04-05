import type { GameState, Player, Board, Piece } from '../types/game';
import { getAllValidMovesForPlayer } from '../engine/moveValidator';

const PIECE_WEIGHT = 100;
const KING_WEIGHT = 50;
const MOBILITY_WEIGHT = 5;
const POSITION_WEIGHT = 10;
const WIN_SCORE = 10_000;

/**
 * Score the board from the perspective of `player`.
 * Higher is better for that player.
 *
 * Factors:
 * - Piece count advantage (weighted heavily)
 * - Mobility advantage (number of valid moves)
 * - King advantage
 * - Positional score (center nodes are more valuable)
 */
export function evaluateBoard(state: GameState, player: Player): number {
  const opponent: Player = player === 'player1' ? 'player2' : 'player1';

  const myPieces = state.pieces.filter(p => p.owner === player);
  const opPieces = state.pieces.filter(p => p.owner === opponent);

  if (opPieces.length === 0) return WIN_SCORE;
  if (myPieces.length === 0) return -WIN_SCORE;

  const pieceScore = (myPieces.length - opPieces.length) * PIECE_WEIGHT;
  const kingScore =
    (myPieces.filter(p => p.isKing).length - opPieces.filter(p => p.isKing).length) * KING_WEIGHT;

  // Mobility
  const myMoves = getAllValidMovesForPlayer(
    state.board, state.pieces, player, state.rulesConfig.mandatoryCaptures
  ).length;
  const opMoves = getAllValidMovesForPlayer(
    state.board, state.pieces, opponent, state.rulesConfig.mandatoryCaptures
  ).length;
  const mobilityScore = (myMoves - opMoves) * MOBILITY_WEIGHT;

  const centerScore = positionalScore(state.board, myPieces) -
    positionalScore(state.board, opPieces);

  return pieceScore + kingScore + mobilityScore + centerScore;
}

function positionalScore(board: Board, pieces: Piece[]): number {
  if (board.nodes.length === 0) return 0;

  const allX = board.nodes.map(n => n.position.x);
  const allY = board.nodes.map(n => n.position.y);
  const midX = (Math.min(...allX) + Math.max(...allX)) / 2;
  const midY = (Math.min(...allY) + Math.max(...allY)) / 2;
  const maxDist = Math.sqrt(
    Math.pow(Math.max(...allX) - midX, 2) + Math.pow(Math.max(...allY) - midY, 2)
  );

  if (maxDist === 0) return 0;

  return pieces.reduce((sum, piece) => {
    const node = board.nodes[piece.nodeId];
    if (!node) return sum;
    const dist = Math.sqrt(
      Math.pow(node.position.x - midX, 2) + Math.pow(node.position.y - midY, 2)
    );
    return sum + (1 - dist / maxDist) * POSITION_WEIGHT;
  }, 0);
}
