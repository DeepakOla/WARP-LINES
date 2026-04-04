/**
 * Game Engine
 * Main game logic controller - handles moves, captures, promotions, and win conditions
 */

import { GameConfig } from '../config/gameConfig';
import { GameState, switchPlayer, getPieceAt } from '../types/gameState';
import { Move, positionsEqual } from '../types/move';
import { Piece } from '../types/piece';
import { initializeBoard } from './BoardInitializer';
import { isValidMove, getAllLegalMoves } from './MoveValidator';
import { getAvailableCaptures, filterForcedCaptures, mustContinueCapturing } from './CaptureDetector';
import { handlePromotion, markPromotionMove } from './PromotionHandler';
import { checkWinCondition, setWinner } from './WinConditionChecker';

export class GameEngine {
  private state: GameState;

  constructor(config: GameConfig) {
    this.state = initializeBoard(config);
    this.updateAvailableMoves();
  }

  /**
   * Gets current game state
   */
  getState(): GameState {
    return this.state;
  }

  /**
   * Starts a new game
   */
  newGame(config?: GameConfig): void {
    const gameConfig = config || this.state.config;
    this.state = initializeBoard(gameConfig);
    this.updateAvailableMoves();
  }

  /**
   * Makes a move
   */
  makeMove(move: Move): boolean {
    // Validate move
    if (!isValidMove(this.state, move)) {
      console.warn('Invalid move attempted:', move);
      return false;
    }

    // Execute move
    this.executMove(move);

    // Handle promotion
    this.state = handlePromotion(this.state, move.pieceId);

    // Check if piece can continue capturing
    if (move.type === 'CAPTURE' && move.continueJump && this.state.config.multiJumps) {
      // Enter capture mode - same piece must continue
      this.state.captureMode = true;
      this.state.activePieceId = move.pieceId;

      // Check if piece actually has more captures available
      if (!mustContinueCapturing(this.state)) {
        // No more captures, end turn
        this.endTurn();
      }
    } else {
      // Normal move or last capture in sequence
      this.endTurn();
    }

    // Update available moves
    this.updateAvailableMoves();

    // Check win condition
    const winResult = checkWinCondition(this.state);
    if (winResult) {
      this.state = setWinner(this.state, winResult.winner, winResult.reason);
    }

    return true;
  }

  /**
   * Executes a move (modifies game state)
   */
  private executMove(move: Move): void {
    const piece = this.state.pieces.get(move.pieceId);
    if (!piece) {
      throw new Error(`Piece ${move.pieceId} not found`);
    }

    // Create new pieces map
    const newPieces = new Map(this.state.pieces);

    // Move piece
    const movedPiece: Piece = {
      ...piece,
      position: { ...move.to },
    };
    newPieces.set(move.pieceId, movedPiece);

    // Handle capture
    if (move.type === 'CAPTURE' && move.capturedPieceId) {
      const capturedPiece = newPieces.get(move.capturedPieceId);
      if (capturedPiece) {
        const captured: Piece = {
          ...capturedPiece,
          captured: true,
        };
        newPieces.set(move.capturedPieceId, captured);

        // Add to captured pieces list
        this.state.capturedPieces = [...this.state.capturedPieces, move.capturedPieceId];
      }
    }

    // Update state
    this.state = {
      ...this.state,
      pieces: newPieces,
      moveHistory: [...this.state.moveHistory, move],
      lastMoveTime: Date.now(),
    };
  }

  /**
   * Ends current turn and switches player
   */
  private endTurn(): void {
    this.state.captureMode = false;
    this.state.activePieceId = null;
    this.state = switchPlayer(this.state);
  }

  /**
   * Updates available moves for current player
   */
  private updateAvailableMoves(): void {
    let moves = getAllLegalMoves(this.state);

    // Filter for forced captures if enabled
    moves = filterForcedCaptures(this.state, moves);

    // Mark moves that result in promotion
    moves = moves.map((move) => markPromotionMove(this.state, move));

    this.state.availableMoves = moves;
  }

  /**
   * Gets available moves for a specific piece
   */
  getMovesForPiece(pieceId: string): Move[] {
    return this.state.availableMoves.filter((move) => move.pieceId === pieceId);
  }

  /**
   * Checks if a specific piece can move
   */
  canPieceMove(pieceId: string): boolean {
    return this.getMovesForPiece(pieceId).length > 0;
  }

  /**
   * Gets piece at position
   */
  getPieceAtPosition(row: number, col: number): Piece | null {
    return getPieceAt(this.state, row, col);
  }

  /**
   * Undoes last move (if available in history)
   */
  undoMove(): boolean {
    if (this.state.moveHistory.length === 0) {
      return false; // No moves to undo
    }

    // For now, simple implementation - will be enhanced with proper history management
    // This would require storing full state snapshots or implementing reverse moves
    console.warn('Undo not yet fully implemented');
    return false;
  }

  /**
   * Gets current player
   */
  getCurrentPlayer(): string {
    return this.state.currentPlayer;
  }

  /**
   * Checks if game is over
   */
  isGameOver(): boolean {
    return this.state.winner !== null || this.state.status === 'finished';
  }

  /**
   * Gets winner (null if game not over)
   */
  getWinner(): string | null {
    return this.state.winner;
  }

  /**
   * Pauses game
   */
  pause(): void {
    if (this.state.status === 'playing') {
      this.state.status = 'paused';
    }
  }

  /**
   * Resumes game
   */
  resume(): void {
    if (this.state.status === 'paused') {
      this.state.status = 'playing';
    }
  }

  /**
   * Exports game state for saving
   */
  exportState(): string {
    return JSON.stringify({
      config: this.state.config,
      pieces: Array.from(this.state.pieces.entries()),
      currentPlayer: this.state.currentPlayer,
      moveHistory: this.state.moveHistory,
      capturedPieces: this.state.capturedPieces,
      winner: this.state.winner,
      status: this.state.status,
      startTime: this.state.startTime,
    });
  }

  /**
   * Imports game state from saved data
   */
  importState(savedState: string): boolean {
    try {
      const data = JSON.parse(savedState);

      // Reconstruct pieces map
      const pieces = new Map<string, Piece>(data.pieces);

      this.state = {
        ...this.state,
        config: data.config,
        pieces,
        currentPlayer: data.currentPlayer,
        moveHistory: data.moveHistory || [],
        capturedPieces: data.capturedPieces || [],
        winner: data.winner || null,
        status: data.status || 'playing',
        startTime: data.startTime || Date.now(),
        boardSize: data.config.boardSize,
      };

      this.updateAvailableMoves();
      return true;
    } catch (error) {
      console.error('Failed to import game state:', error);
      return false;
    }
  }
}
