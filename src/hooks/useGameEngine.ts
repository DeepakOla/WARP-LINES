/**
 * React Hook for Game State Management
 * Provides easy access to game engine in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { GameConfig, DEFAULT_CONFIG } from '../config/gameConfig';
import { GameState } from '../types/gameState';
import { Move } from '../types/move';
import { Piece } from '../types/piece';

export interface UseGameEngineReturn {
  // State
  gameState: GameState;
  isGameOver: boolean;
  winner: string | null;

  // Actions
  makeMove: (move: Move) => boolean;
  newGame: (config?: GameConfig) => void;
  pause: () => void;
  resume: () => void;
  undoMove: () => boolean;

  // Queries
  getMovesForPiece: (pieceId: string) => Move[];
  canPieceMove: (pieceId: string) => boolean;
  getPieceAtPosition: (row: number, col: number) => Piece | null;

  // Save/Load
  saveGame: () => string;
  loadGame: (savedState: string) => boolean;

  // Game engine instance (for advanced usage)
  engine: GameEngine;
}

/**
 * Hook to manage game state with React
 */
export function useGameEngine(initialConfig?: GameConfig): UseGameEngineReturn {
  const config = initialConfig || DEFAULT_CONFIG;

  // Create game engine once
  const engineRef = useRef<GameEngine>(new GameEngine(config));
  const engine = engineRef.current;

  // Track state updates
  const [gameState, setGameState] = useState<GameState>(engine.getState());
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Force re-render when game state changes
  const forceUpdate = useCallback(() => {
    setGameState(engine.getState());
    setUpdateTrigger((prev) => prev + 1);
  }, [engine]);

  // Make a move
  const makeMove = useCallback(
    (move: Move) => {
      const success = engine.makeMove(move);
      if (success) {
        forceUpdate();
      }
      return success;
    },
    [engine, forceUpdate]
  );

  // Start new game
  const newGame = useCallback(
    (newConfig?: GameConfig) => {
      engine.newGame(newConfig);
      forceUpdate();
    },
    [engine, forceUpdate]
  );

  // Pause game
  const pause = useCallback(() => {
    engine.pause();
    forceUpdate();
  }, [engine, forceUpdate]);

  // Resume game
  const resume = useCallback(() => {
    engine.resume();
    forceUpdate();
  }, [engine, forceUpdate]);

  // Undo move
  const undoMove = useCallback(() => {
    const success = engine.undoMove();
    if (success) {
      forceUpdate();
    }
    return success;
  }, [engine, forceUpdate]);

  // Get moves for piece
  const getMovesForPiece = useCallback(
    (pieceId: string) => {
      return engine.getMovesForPiece(pieceId);
    },
    [engine, updateTrigger]
  );

  // Check if piece can move
  const canPieceMove = useCallback(
    (pieceId: string) => {
      return engine.canPieceMove(pieceId);
    },
    [engine, updateTrigger]
  );

  // Get piece at position
  const getPieceAtPosition = useCallback(
    (row: number, col: number) => {
      return engine.getPieceAtPosition(row, col);
    },
    [engine, updateTrigger]
  );

  // Save game
  const saveGame = useCallback(() => {
    return engine.exportState();
  }, [engine]);

  // Load game
  const loadGame = useCallback(
    (savedState: string) => {
      const success = engine.importState(savedState);
      if (success) {
        forceUpdate();
      }
      return success;
    },
    [engine, forceUpdate]
  );

  // Derived state
  const isGameOver = engine.isGameOver();
  const winner = engine.getWinner();

  return {
    gameState,
    isGameOver,
    winner,
    makeMove,
    newGame,
    pause,
    resume,
    undoMove,
    getMovesForPiece,
    canPieceMove,
    getPieceAtPosition,
    saveGame,
    loadGame,
    engine,
  };
}
