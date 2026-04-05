import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { GeometricGrid } from './GeometricGrid';
import { ScorePanel } from './ScorePanel';
import { GameOverModal } from './GameOverModal';
import { TimerDisplay } from './TimerDisplay';
import { AudioManager, playSound } from './AudioManager';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { Move } from '../types/game';
import { ChevronLeft, RotateCcw, Undo2 } from 'lucide-react';

export const GameBoard: React.FC = () => {
  const { theme, themeType } = useTheme();
  const {
    gameState,
    isAIThinking,
    selectPiece,
    makeMove,
    resetGame,
    undoMove,
    passTurn,
  } = useGame();

  const [timerKey, setTimerKey] = useState(0);

  if (!gameState) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.colors.background }}>
      <p style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body, opacity: 0.5 }}>Loading game2026</p>
    </div>
  );

  const isSovereign = themeType === 'sovereign';
  const isGameOver = gameState.status === 'GAMEOVER' || gameState.status === 'DRAW';
  const lastMove: Move | null = gameState.history[gameState.history.length - 1] ?? null;

  const handleNodeClick = useCallback((nodeId: number) => {
    if (!gameState || isAIThinking) return;
    const gs = gameState;

    if ((gs.mode === 'SOLO' || gs.mode === 'CAMPAIGN') && gs.currentPlayer === 'player2') return;

    const clickedPiece = gs.pieces.find(p => p.nodeId === nodeId);

    if (gs.chainCaptureNodeId !== null) {
      const chainMove = gs.validMoves.find(m => m.toNodeId === nodeId);
      if (chainMove) {
        playSound('capture');
        makeMove(chainMove);
        setTimerKey(k => k + 1);
      }
      return;
    }

    if (gs.selectedPieceId) {
      const targetMove = gs.validMoves.find(
        m => m.pieceId === gs.selectedPieceId && m.toNodeId === nodeId
      );
      if (targetMove) {
        playSound(targetMove.capturedPieceId ? 'capture' : 'move');
        makeMove(targetMove);
        setTimerKey(k => k + 1);
        return;
      }
      if (clickedPiece && clickedPiece.owner === gs.currentPlayer) {
        playSound('select');
        selectPiece(clickedPiece.id);
        return;
      }
      selectPiece(null);
      return;
    }

    if (clickedPiece && clickedPiece.owner === gs.currentPlayer) {
      const hasMoves = gs.validMoves.some(m => m.pieceId === clickedPiece.id);
      if (hasMoves) {
        playSound('select');
        selectPiece(clickedPiece.id);
      }
    }
  }, [gameState, isAIThinking, selectPiece, makeMove]);

  useEffect(() => {
    if (gameState.status === 'GAMEOVER') {
      if (gameState.winner === 'player1') playSound('win');
      else playSound('gameover');
    }
  }, [gameState.status]);

  const handleTimerExpire = useCallback(() => {
    passTurn();
    setTimerKey(k => k + 1);
  }, [passTurn]);

  const surface = isSovereign ? theme.colors.surfaceContainerLow : '#0a0a0a';
  const border = isSovereign ? theme.colors.outlineVariant : '#1e3a3a';

  const currentPlayerLabel =
    gameState.currentPlayer === 'player1'
      ? 'Player 1'
      : (gameState.mode === 'SOLO' || gameState.mode === 'CAMPAIGN') ? 'AI' : 'Player 2';

  const boardValidMoves = gameState.selectedPieceId
    ? gameState.validMoves.filter(m => m.pieceId === gameState.selectedPieceId)
    : gameState.chainCaptureNodeId !== null
    ? gameState.validMoves
    : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.colors.background }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: surface, borderColor: border }}
      >
        <button onClick={resetGame} className="p-2 rounded-lg hover:opacity-70 transition-all"
          style={{ color: theme.colors.onSurface }}>
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-bold"
            style={{ fontFamily: theme.fonts.display, color: theme.colors.onSurface }}>
            WARP LINES
          </h1>
          {gameState.status === 'PLAYING' && (
            <p className="text-xs opacity-60"
              style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
              {isAIThinking ? 'AI thinking…' : `${currentPlayerLabel}'s turn`}
              {gameState.chainCaptureNodeId !== null && ' · Chain capture!'}
            </p>
          )}
        </div>

        {gameState.rulesConfig.turnTimeLimit && gameState.status === 'PLAYING' && (
          <TimerDisplay
            key={timerKey}
            seconds={gameState.rulesConfig.turnTimeLimit}
            isActive={!isAIThinking && gameState.status === 'PLAYING'}
            onExpire={handleTimerExpire}
            resetKey={timerKey}
          />
        )}

        <AudioManager />

        {gameState.mode === 'LOCAL' && gameState.history.length > 0 && (
          <button onClick={undoMove} className="p-2 rounded-lg hover:opacity-70 transition-all"
            style={{ color: theme.colors.onSurface }} title="Undo">
            <Undo2 size={18} />
          </button>
        )}
        <button onClick={resetGame} className="p-2 rounded-lg hover:opacity-70 transition-all"
          style={{ color: theme.colors.onSurface }} title="Restart">
          <RotateCcw size={18} />
        </button>
        <ThemeSwitcher />
      </div>

      <div className="px-4 pt-4">
        <ScorePanel gameState={gameState} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <GeometricGrid
          board={gameState.board}
          pieces={gameState.pieces}
          currentPlayer={gameState.currentPlayer}
          selectedPieceId={gameState.selectedPieceId}
          validMoves={boardValidMoves}
          lastMove={lastMove}
          chainCaptureNodeId={gameState.chainCaptureNodeId}
          isAIThinking={isAIThinking}
          onNodeClick={handleNodeClick}
        />
      </div>

      {gameState.status === 'PLAYING' && (
        <div className="px-4 py-2 text-center text-xs opacity-40 border-t"
          style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body, borderColor: border }}>
          {gameState.rulesConfig.mandatoryCaptures && 'Mandatory captures · '}
          {gameState.boardConfig.id} · {gameState.pieces.length} pieces
        </div>
      )}

      {isGameOver && <GameOverModal gameState={gameState} />}
    </div>
  );
};
