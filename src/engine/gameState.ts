/**
 * Game state management and turn manager for The Sovereign Warp
 */

import {
  GameState,
  GameMode,
  GameRules,
  Player,
  PlayerId,
  Move,
  Position,
  Piece,
} from '../types/game';
import { generateBoard, initializePieces, movePiece, cloneBoard } from './boardGenerator';
import { validateMove } from './moveValidator';
import { detectAndExecuteCaptures } from './captureDetector';
import { DEFAULT_RULES } from '../config/gameConfig';

/**
 * Create a new game state
 */
export function createGameState(
  mode: GameMode,
  rules: GameRules = DEFAULT_RULES
): GameState {
  const board = generateBoard(rules.nodeCount);
  initializePieces(board, rules.nodeCount);

  const player1: Player = {
    id: 'player1',
    name: 'Player 1',
    pieces: [],
    capturedPieces: 0,
    isAI: false,
  };

  const player2: Player = {
    id: 'player2',
    name: 'Player 2',
    pieces: [],
    capturedPieces: 0,
    isAI: mode === 'solo',
    aiDifficulty: mode === 'solo' ? 'medium' : undefined,
  };

  return {
    id: `game-${Date.now()}`,
    mode,
    status: 'setup',
    rules,
    players: [player1, player2],
    currentPlayer: 'player1',
    board,
    moveHistory: [],
    turnNumber: 1,
    result: null,
    startedAt: Date.now(),
  };
}

/**
 * Start the game
 */
export function startGame(gameState: GameState): GameState {
  return {
    ...gameState,
    status: 'playing',
    startedAt: Date.now(),
  };
}

/**
 * Execute a move and update game state
 */
export function executeMove(
  gameState: GameState,
  from: Position,
  to: Position
): { success: boolean; newState: GameState; error?: string } {
  const { board } = gameState;

  // Get the piece at from position
  const fromNode = board[from.row]?.[from.col];
  if (!fromNode || !fromNode.piece) {
    return {
      success: false,
      newState: gameState,
      error: 'No piece at source position',
    };
  }

  const piece = fromNode.piece;

  // Validate the move
  const validation = validateMove(gameState, piece, from, to);
  if (!validation.isValid) {
    return {
      success: false,
      newState: gameState,
      error: validation.reason,
    };
  }

  // Clone the game state for immutability
  const newState = cloneGameState(gameState);

  // Execute the move
  const moveSuccess = movePiece(newState.board, from, to);
  if (!moveSuccess) {
    return {
      success: false,
      newState: gameState,
      error: 'Failed to execute move',
    };
  }

  // Detect and execute captures
  const captures = detectAndExecuteCaptures(newState, to);

  // Update captured pieces count
  if (captures.length > 0) {
    const currentPlayerIndex = newState.currentPlayer === 'player1' ? 0 : 1;
    newState.players[currentPlayerIndex].capturedPieces += captures.length;
  }

  // Record the move
  const move: Move = {
    piece,
    from,
    to,
    capturedPiece: captures.length > 0 ? captures[0].capturedPiece : undefined,
    timestamp: Date.now(),
  };
  newState.moveHistory.push(move);

  // Switch turns
  newState.currentPlayer = newState.currentPlayer === 'player1' ? 'player2' : 'player1';
  newState.turnNumber += 1;

  return {
    success: true,
    newState,
  };
}

/**
 * Switch to next player's turn
 */
export function switchTurn(gameState: GameState): GameState {
  return {
    ...gameState,
    currentPlayer: gameState.currentPlayer === 'player1' ? 'player2' : 'player1',
    turnNumber: gameState.turnNumber + 1,
  };
}

/**
 * Get current player
 */
export function getCurrentPlayer(gameState: GameState): Player {
  return gameState.currentPlayer === 'player1' ? gameState.players[0] : gameState.players[1];
}

/**
 * Get opponent player
 */
export function getOpponentPlayer(gameState: GameState): Player {
  return gameState.currentPlayer === 'player1' ? gameState.players[1] : gameState.players[0];
}

/**
 * Pause the game
 */
export function pauseGame(gameState: GameState): GameState {
  return {
    ...gameState,
    status: 'paused',
  };
}

/**
 * Resume the game
 */
export function resumeGame(gameState: GameState): GameState {
  return {
    ...gameState,
    status: 'playing',
  };
}

/**
 * End the game
 */
export function endGame(
  gameState: GameState,
  result: 'player1-win' | 'player2-win' | 'draw'
): GameState {
  return {
    ...gameState,
    status: 'finished',
    result,
    finishedAt: Date.now(),
  };
}

/**
 * Undo last move
 */
export function undoMove(gameState: GameState): GameState | null {
  if (gameState.moveHistory.length === 0) {
    return null;
  }

  // For now, return null - full undo implementation would require
  // storing board state snapshots or implementing reverse operations
  // This is a placeholder for future implementation
  return null;
}

/**
 * Clone game state (deep copy)
 */
function cloneGameState(gameState: GameState): GameState {
  return {
    ...gameState,
    players: gameState.players.map((p) => ({ ...p, pieces: [...p.pieces] })),
    board: cloneBoard(gameState.board),
    moveHistory: [...gameState.moveHistory],
  };
}

/**
 * Reset game to initial state
 */
export function resetGame(gameState: GameState): GameState {
  return createGameState(gameState.mode, gameState.rules);
}

/**
 * Update game rules (only in setup mode)
 */
export function updateRules(gameState: GameState, rules: Partial<GameRules>): GameState {
  if (gameState.status !== 'setup') {
    return gameState;
  }

  const newRules = { ...gameState.rules, ...rules };

  // Regenerate board if node count changed
  if (rules.nodeCount && rules.nodeCount !== gameState.rules.nodeCount) {
    const newBoard = generateBoard(newRules.nodeCount);
    initializePieces(newBoard, newRules.nodeCount);

    return {
      ...gameState,
      rules: newRules,
      board: newBoard,
    };
  }

  return {
    ...gameState,
    rules: newRules,
  };
}

/**
 * Get game statistics
 */
export function getGameStats(gameState: GameState) {
  const duration = gameState.finishedAt
    ? gameState.finishedAt - gameState.startedAt
    : Date.now() - gameState.startedAt;

  return {
    duration,
    totalMoves: gameState.moveHistory.length,
    player1Captures: gameState.players[0].capturedPieces,
    player2Captures: gameState.players[1].capturedPieces,
    turnNumber: gameState.turnNumber,
  };
}
