import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Position, GameMode, GameRules, AILevel } from '../types/game';
import {
  createGameState,
  startGame,
  executeMove,
  pauseGame,
  resumeGame,
  endGame,
  resetGame,
  updateRules,
  getCurrentPlayer,
  getOpponentPlayer,
} from '../engine/gameState';
import { checkWinCondition } from '../engine/winCondition';
import { DEFAULT_RULES } from '../config/gameConfig';
import { createAIPlayer } from '../engine/aiEngine';

interface GameContextType {
  gameState: GameState | null;
  selectedPiece: Position | null;
  availableMoves: Position[];
  isGameActive: boolean;
  isAIThinking: boolean;

  // Game actions
  createNewGame: (mode: GameMode, rules?: GameRules, aiDifficulty?: AILevel) => void;
  startCurrentGame: () => void;
  makeMove: (from: Position, to: Position) => boolean;
  selectPiece: (position: Position | null) => void;
  pauseCurrentGame: () => void;
  resumeCurrentGame: () => void;
  resetCurrentGame: () => void;
  updateGameRules: (rules: Partial<GameRules>) => void;

  // Getters
  getCurrentPlayerName: () => string;
  getOpponentPlayerName: () => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [availableMoves, setAvailableMoves] = useState<Position[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiPlayerRef = useRef<ReturnType<typeof createAIPlayer> | null>(null);

  const createNewGame = useCallback((mode: GameMode, rules: GameRules = DEFAULT_RULES, aiDifficulty: AILevel = 'medium') => {
    const newGame = createGameState(mode, rules);

    // Update AI difficulty if in solo mode
    if (mode === 'solo') {
      newGame.players[1].aiDifficulty = aiDifficulty;
      aiPlayerRef.current = createAIPlayer(aiDifficulty);
    } else {
      aiPlayerRef.current = null;
    }

    setGameState(newGame);
    setSelectedPiece(null);
    setAvailableMoves([]);
  }, []);

  const startCurrentGame = useCallback(() => {
    if (!gameState) return;
    const updatedGame = startGame(gameState);
    setGameState(updatedGame);
  }, [gameState]);

  const makeMove = useCallback((from: Position, to: Position): boolean => {
    if (!gameState) return false;

    const result = executeMove(gameState, from, to);

    if (result.success) {
      setGameState(result.newState);
      setSelectedPiece(null);
      setAvailableMoves([]);

      // Check for win condition
      const winCondition = checkWinCondition(result.newState);
      if (winCondition.hasWinner || winCondition.isDraw) {
        const finalState = endGame(
          result.newState,
          winCondition.isDraw ? 'draw' : winCondition.winner === 'player1' ? 'player1-win' : 'player2-win'
        );
        setGameState(finalState);
      }

      return true;
    }

    return false;
  }, [gameState]);

  // AI move execution
  useEffect(() => {
    if (!gameState || gameState.status !== 'playing') return;
    if (isAIThinking) return;

    const currentPlayer = getCurrentPlayer(gameState);

    // Check if it's AI's turn
    if (currentPlayer.isAI && aiPlayerRef.current) {
      setIsAIThinking(true);

      // Execute AI move after a brief delay
      aiPlayerRef.current.findBestMove(gameState)
        .then((aiMove) => {
          // Execute the AI's move
          const result = executeMove(gameState, aiMove.move.from, aiMove.move.to);

          if (result.success) {
            setGameState(result.newState);
            setSelectedPiece(null);
            setAvailableMoves([]);

            // Check for win condition
            const winCondition = checkWinCondition(result.newState);
            if (winCondition.hasWinner || winCondition.isDraw) {
              const finalState = endGame(
                result.newState,
                winCondition.isDraw ? 'draw' : winCondition.winner === 'player1' ? 'player1-win' : 'player2-win'
              );
              setGameState(finalState);
            }
          }

          setIsAIThinking(false);
        })
        .catch((error) => {
          console.error('AI move error:', error);
          setIsAIThinking(false);
        });
    }
  }, [gameState, isAIThinking]);

  const selectPiece = useCallback((position: Position | null) => {
    setSelectedPiece(position);

    if (!position || !gameState) {
      setAvailableMoves([]);
      return;
    }

    // Calculate available moves for the selected piece
    const node = gameState.board[position.row]?.[position.col];
    if (node?.piece) {
      const { getAvailableMoves } = require('../engine/moveValidator');
      const moves = getAvailableMoves(gameState, node.piece);
      setAvailableMoves(moves);
    } else {
      setAvailableMoves([]);
    }
  }, [gameState]);

  const pauseCurrentGame = useCallback(() => {
    if (!gameState) return;
    const updatedGame = pauseGame(gameState);
    setGameState(updatedGame);
  }, [gameState]);

  const resumeCurrentGame = useCallback(() => {
    if (!gameState) return;
    const updatedGame = resumeGame(gameState);
    setGameState(updatedGame);
  }, [gameState]);

  const resetCurrentGame = useCallback(() => {
    if (!gameState) return;
    const newGame = resetGame(gameState);
    setGameState(newGame);
    setSelectedPiece(null);
    setAvailableMoves([]);
  }, [gameState]);

  const updateGameRules = useCallback((rules: Partial<GameRules>) => {
    if (!gameState) return;
    const updatedGame = updateRules(gameState, rules);
    setGameState(updatedGame);
  }, [gameState]);

  const getCurrentPlayerName = useCallback(() => {
    if (!gameState) return '';
    const player = getCurrentPlayer(gameState);
    return player.name;
  }, [gameState]);

  const getOpponentPlayerName = useCallback(() => {
    if (!gameState) return '';
    const player = getOpponentPlayer(gameState);
    return player.name;
  }, [gameState]);

  const isGameActive = gameState?.status === 'playing';

  const value: GameContextType = {
    gameState,
    selectedPiece,
    availableMoves,
    isGameActive,
    isAIThinking,
    createNewGame,
    startCurrentGame,
    makeMove,
    selectPiece,
    pauseCurrentGame,
    resumeCurrentGame,
    resetCurrentGame,
    updateGameRules,
    getCurrentPlayerName,
    getOpponentPlayerName,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
