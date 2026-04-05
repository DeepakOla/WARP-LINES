import type { GameState, Move, Piece, Player, GameMode, BoardConfig, RulesConfig, AIDifficulty } from '../types/game';
import { buildBoard, createInitialPieces } from './boardGenerator';
import { getAllValidMovesForPlayer, getMandatoryCaptures } from './moveValidator';
import { getChainCaptures } from './captureDetector';

/**
 * Create a fresh game state from a board configuration.
 */
export function createInitialGameState(
  boardConfig: BoardConfig,
  mode: GameMode,
  rulesConfig: RulesConfig,
  aiDifficulty?: AIDifficulty,
  campaignLevel?: number
): GameState {
  const board = buildBoard(boardConfig);
  const pieces = createInitialPieces(boardConfig);

  const initialState: GameState = {
    board,
    pieces,
    currentPlayer: 'player1',
    mode,
    status: 'PLAYING',
    winner: null,
    isDraw: false,
    moveCount: 0,
    movesSinceCapture: 0,
    history: [],
    selectedPieceId: null,
    validMoves: [],
    chainCaptureNodeId: null,
    aiDifficulty,
    boardConfig,
    rulesConfig,
    campaignLevel,
  };

  // Pre-compute valid moves for player 1
  return recomputeValidMoves(initialState);
}

/**
 * Recompute valid moves for the current player and store them in state.
 * Also handles mandatory capture enforcement.
 */
export function recomputeValidMoves(state: GameState): GameState {
  const moves = getAllValidMovesForPlayer(
    state.board,
    state.pieces,
    state.currentPlayer,
    state.rulesConfig.mandatoryCaptures
  );
  return { ...state, validMoves: moves };
}

/**
 * Apply a move to the game state, returning a new (immutable) state.
 * Handles: piece movement, capture removal, chain capture detection,
 * turn switching, and move counting.
 */
export function applyMove(state: GameState, move: Move): GameState {
  let pieces = [...state.pieces];

  // Move the piece
  pieces = pieces.map(p =>
    p.id === move.pieceId ? { ...p, nodeId: move.toNodeId } : p
  );

  // Remove captured piece
  if (move.capturedPieceId) {
    pieces = pieces.filter(p => p.id !== move.capturedPieceId);
  }

  const isCapture = !!move.capturedPieceId;
  const movesSinceCapture = isCapture ? 0 : state.movesSinceCapture + 1;
  const history = [...state.history, move];
  const moveCount = state.moveCount + 1;

  // Check for chain captures (only after a capture)
  if (isCapture) {
    const movedPiece = pieces.find(p => p.id === move.pieceId);
    if (movedPiece) {
      const chains = getChainCaptures(state.board, pieces, move.pieceId);
      if (chains.length > 0) {
        // Must continue capturing from this piece
        return {
          ...state,
          pieces,
          moveCount,
          movesSinceCapture,
          history,
          chainCaptureNodeId: move.toNodeId,
          selectedPieceId: move.pieceId,
          validMoves: chains.map(m => ({ ...m, isChainCapture: true })),
        };
      }
    }
  }

  // No chain capture — switch turn
  const nextPlayer: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';

  const newState: GameState = {
    ...state,
    pieces,
    currentPlayer: nextPlayer,
    moveCount,
    movesSinceCapture,
    history,
    selectedPieceId: null,
    chainCaptureNodeId: null,
    validMoves: [],
  };

  return recomputeValidMoves(newState);
}

/**
 * Switch to the next player's turn (used for time-out passes).
 */
export function switchTurn(state: GameState): GameState {
  const nextPlayer: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';
  const newState: GameState = {
    ...state,
    currentPlayer: nextPlayer,
    selectedPieceId: null,
    chainCaptureNodeId: null,
    validMoves: [],
  };
  return recomputeValidMoves(newState);
}

/**
 * Compute how many valid moves a player has (used for win-condition checks).
 */
export function countValidMoves(state: GameState, player: Player): number {
  return getAllValidMovesForPlayer(
    state.board,
    state.pieces,
    player,
    state.rulesConfig.mandatoryCaptures
  ).length;
}
