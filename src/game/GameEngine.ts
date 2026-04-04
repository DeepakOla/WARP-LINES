/**
 * Game Engine for Warp Board
 * Pure TypeScript implementation with no React dependencies
 */

import type {
  GameState,
  GameSettings,
  Piece,
  Move,
  Position,
  Player,
  GameMode,
} from '../types/game';
import {
  generateBoardLayout,
  getInitialPieceSetup,
  getConnectedPositions,
  positionsEqual,
  getMiddlePosition,
  isPositionValid,
  getDirection,
} from './BoardLayout';

export class GameEngine {
  /**
   * Creates a new game state
   */
  static createGame(settings: GameSettings, mode: GameMode): GameState {
    const layout = generateBoardLayout(settings.boardSize);
    const piecePositions = getInitialPieceSetup(
      settings.boardSize,
      settings.infiltrators
    );

    // Initialize board
    const board: (Piece | null)[][] = Array(layout.size)
      .fill(null)
      .map(() => Array(layout.size).fill(null));

    // Create pieces
    const pieces: Piece[] = [];
    const nodeSize = settings.boardSize + 1;
    const greenRows = 2; // Top 2 rows for green

    piecePositions.forEach((pos, index) => {
      const isGreen = pos.row < greenRows;
      const piece: Piece = {
        id: `piece-${index}`,
        player: isGreen ? 'green' : 'red',
        type: 'regular',
        position: pos,
      };
      pieces.push(piece);
      board[pos.row][pos.col] = piece;
    });

    return {
      board,
      turn: 'green',
      pieces,
      settings,
      moveHistory: [],
      winner: null,
      selectedPiece: null,
      legalMoves: [],
      capturedPieces: { green: [], red: [] },
      mustCapture: false,
      gameMode: mode,
      moveCount: 0,
      timerRemaining: settings.blitzTimer,
    };
  }

  /**
   * Gets all legal moves for the current player
   */
  static getLegalMoves(state: GameState, piece?: Piece): Move[] {
    const layout = generateBoardLayout(state.settings.boardSize);
    const currentPieces = piece
      ? [piece]
      : state.pieces.filter((p) => p.player === state.turn);

    const allMoves: Move[] = [];
    const captureMoves: Move[] = [];

    currentPieces.forEach((p) => {
      const moves = this.getPieceMoves(state, p, layout);
      allMoves.push(...moves);

      const captures = moves.filter((m) => m.isCapture);
      captureMoves.push(...captures);
    });

    // If mandatory captures enabled and captures available, return only captures
    if (state.settings.mandatoryCaptures && captureMoves.length > 0) {
      return captureMoves;
    }

    return allMoves;
  }

  /**
   * Gets legal moves for a specific piece
   */
  private static getPieceMoves(
    state: GameState,
    piece: Piece,
    layout: ReturnType<typeof generateBoardLayout>
  ): Move[] {
    const moves: Move[] = [];
    const connected = getConnectedPositions(layout, piece.position);

    connected.forEach((pos) => {
      // Simple move to empty position
      if (!state.board[pos.row][pos.col]) {
        // Check if piece can move in this direction (regular pieces move forward only)
        if (this.canPieceMoveInDirection(piece, pos)) {
          moves.push({
            from: piece.position,
            to: pos,
            isCapture: false,
          });
        }
      } else {
        // Check for capture
        const targetPiece = state.board[pos.row][pos.col];
        if (targetPiece && targetPiece.player !== piece.player) {
          // Get position beyond the enemy piece
          const direction = getDirection(piece.position, pos);
          const landingPos = {
            row: pos.row + direction.row,
            col: pos.col + direction.col,
          };

          // Check if landing position is valid and empty
          if (
            isPositionValid(layout, landingPos) &&
            !state.board[landingPos.row][landingPos.col]
          ) {
            moves.push({
              from: piece.position,
              to: landingPos,
              captures: [pos],
              isCapture: true,
            });

            // Check for multi-hop captures
            const multiHops = this.getMultiHopCaptures(
              state,
              piece,
              landingPos,
              [pos],
              layout
            );
            moves.push(...multiHops);
          }
        }
      }
    });

    return moves;
  }

  /**
   * Gets multi-hop capture sequences
   */
  private static getMultiHopCaptures(
    state: GameState,
    piece: Piece,
    currentPos: Position,
    capturedSoFar: Position[],
    layout: ReturnType<typeof generateBoardLayout>
  ): Move[] {
    const moves: Move[] = [];
    const connected = getConnectedPositions(layout, currentPos);

    connected.forEach((pos) => {
      const targetPiece = state.board[pos.row][pos.col];

      // Can't capture a position we already captured in this sequence
      if (capturedSoFar.some((cp) => positionsEqual(cp, pos))) {
        return;
      }

      if (targetPiece && targetPiece.player !== piece.player) {
        const direction = getDirection(currentPos, pos);
        const landingPos = {
          row: pos.row + direction.row,
          col: pos.col + direction.col,
        };

        if (
          isPositionValid(layout, landingPos) &&
          !state.board[landingPos.row][landingPos.col]
        ) {
          const newCaptures = [...capturedSoFar, pos];

          moves.push({
            from: piece.position,
            to: landingPos,
            captures: newCaptures,
            isCapture: true,
            multiHop: true,
          });

          // Recursively check for more hops
          const furtherHops = this.getMultiHopCaptures(
            state,
            piece,
            landingPos,
            newCaptures,
            layout
          );
          moves.push(...furtherHops);
        }
      }
    });

    return moves;
  }

  /**
   * Checks if a piece can move in a given direction
   */
  private static canPieceMoveInDirection(piece: Piece, to: Position): boolean {
    // Kings can move in any direction
    if (piece.type === 'king') {
      return true;
    }

    // Regular pieces move forward only
    if (piece.player === 'green') {
      return to.row >= piece.position.row; // Green moves down/sideways
    } else {
      return to.row <= piece.position.row; // Red moves up/sideways
    }
  }

  /**
   * Applies a move to the game state (returns new state)
   */
  static applyMove(state: GameState, move: Move): GameState {
    const newBoard = state.board.map((row) => [...row]);
    const newPieces = [...state.pieces];

    // Find the piece being moved
    const pieceIndex = newPieces.findIndex((p) =>
      positionsEqual(p.position, move.from)
    );
    if (pieceIndex === -1) return state;

    const piece = { ...newPieces[pieceIndex] };

    // Remove piece from old position
    newBoard[piece.position.row][piece.position.col] = null;

    // Update piece position
    piece.position = move.to;

    // Check for king promotion (reaching opposite end)
    const nodeSize = state.settings.boardSize + 1;
    if (piece.type === 'regular') {
      if (
        (piece.player === 'green' && move.to.row === nodeSize - 1) ||
        (piece.player === 'red' && move.to.row === 0)
      ) {
        piece.type = 'king';
      }
    }

    // Place piece at new position
    newBoard[piece.position.row][piece.position.col] = piece;
    newPieces[pieceIndex] = piece;

    // Handle captures
    const capturedPieces = { ...state.capturedPieces };
    if (move.captures && move.captures.length > 0) {
      move.captures.forEach((capturePos) => {
        const capturedPiece = newBoard[capturePos.row][capturePos.col];
        if (capturedPiece) {
          capturedPieces[capturedPiece.player].push(capturedPiece);
          newBoard[capturePos.row][capturePos.col] = null;

          // Remove from pieces array
          const captureIndex = newPieces.findIndex((p) =>
            positionsEqual(p.position, capturePos)
          );
          if (captureIndex !== -1) {
            newPieces.splice(captureIndex, 1);
          }
        }
      });
    }

    // Check for winner
    const winner = this.checkWinner(newPieces);

    // Switch turn
    const nextTurn = state.turn === 'green' ? 'red' : 'green';

    // Check if next player must capture
    const nextState: GameState = {
      ...state,
      board: newBoard,
      pieces: newPieces,
      turn: nextTurn,
      moveHistory: [...state.moveHistory, move],
      capturedPieces,
      winner,
      selectedPiece: null,
      legalMoves: [],
      mustCapture: false,
      moveCount: state.moveCount + 1,
      timerRemaining: state.settings.blitzTimer,
    };

    // Determine if next player must capture
    if (state.settings.mandatoryCaptures && !winner) {
      const nextMoves = this.getLegalMoves(nextState);
      nextState.mustCapture = nextMoves.some((m) => m.isCapture);
    }

    nextState.legalMoves = this.getLegalMoves(nextState);

    return nextState;
  }

  /**
   * Checks if there's a winner
   */
  static checkWinner(pieces: Piece[]): Player | null {
    const greenPieces = pieces.filter((p) => p.player === 'green');
    const redPieces = pieces.filter((p) => p.player === 'red');

    if (greenPieces.length === 0) return 'red';
    if (redPieces.length === 0) return 'green';

    return null;
  }

  /**
   * Undoes the last move
   */
  static undoMove(state: GameState): GameState {
    if (state.moveHistory.length === 0) {
      return state;
    }

    // For simplicity, recreate the game and replay all moves except the last one
    const newState = this.createGame(state.settings, state.gameMode);
    const movesToReplay = state.moveHistory.slice(0, -1);

    let currentState = newState;
    movesToReplay.forEach((move) => {
      currentState = this.applyMove(currentState, move);
    });

    return currentState;
  }

  /**
   * Serializes game state to JSON
   */
  static serializeState(state: GameState): string {
    return JSON.stringify(state);
  }

  /**
   * Deserializes game state from JSON
   */
  static deserializeState(json: string): GameState {
    return JSON.parse(json);
  }
}
