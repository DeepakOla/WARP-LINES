/**
 * Warp Board Game Component
 * Node-based board with SVG rendering
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameState, Move, Piece, Position } from '../types/game';
import { GameEngine } from '../game/GameEngine';
import { generateBoardLayout, positionsEqual } from '../game/BoardLayout';
import { createAIPlayer } from '../game/AIPlayer';
import { useTheme } from '../contexts/ThemeContext';

interface WarpBoardProps {
  gameState: GameState;
  onMove: (move: Move) => void;
  onStateChange: (state: GameState) => void;
}

export const WarpBoard: React.FC<WarpBoardProps> = ({
  gameState,
  onMove,
  onStateChange,
}) => {
  const { theme, themeType } = useTheme();
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [highlightedMoves, setHighlightedMoves] = useState<Move[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const layout = generateBoardLayout(gameState.settings.boardSize);
  const nodeSize = layout.size;
  const boardPixelSize = 600;
  const cellSize = boardPixelSize / (nodeSize - 1);

  // AI move handling
  useEffect(() => {
    if (
      gameState.gameMode === 'solo' &&
      gameState.turn === 'red' &&
      !gameState.winner &&
      !isAIThinking
    ) {
      setIsAIThinking(true);
      // Delay AI move slightly for better UX
      setTimeout(() => {
        const aiPlayer = createAIPlayer(
          gameState.settings.aiDifficulty || 2,
          'red'
        );
        const move = aiPlayer.getBestMove(gameState);
        if (move) {
          const newState = GameEngine.applyMove(gameState, move);
          onStateChange(newState);
          onMove(move);
        }
        setIsAIThinking(false);
      }, 500);
    }
  }, [gameState, isAIThinking, onMove, onStateChange]);

  const handlePieceClick = (piece: Piece) => {
    if (gameState.winner || piece.player !== gameState.turn) return;
    if (gameState.gameMode === 'solo' && gameState.turn === 'red') return;

    if (selectedPiece && positionsEqual(selectedPiece.position, piece.position)) {
      setSelectedPiece(null);
      setHighlightedMoves([]);
    } else {
      setSelectedPiece(piece);
      const moves = GameEngine.getLegalMoves(gameState, piece);
      setHighlightedMoves(moves);
    }
  };

  const handleNodeClick = (position: Position) => {
    if (!selectedPiece || gameState.winner) return;

    const move = highlightedMoves.find((m) => positionsEqual(m.to, position));
    if (move) {
      const newState = GameEngine.applyMove(gameState, move);
      onStateChange(newState);
      onMove(move);
      setSelectedPiece(null);
      setHighlightedMoves([]);
    }
  };

  const getNodePosition = (pos: Position) => ({
    x: pos.col * cellSize,
    y: pos.row * cellSize,
  });

  const pieceAtPosition = (pos: Position): Piece | null => {
    return gameState.board[pos.row][pos.col];
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Game Info */}
      <div className="flex items-center justify-between w-full max-w-2xl px-4">
        <div className="text-sm font-semibold">
          Turn: {gameState.turn === 'green' ? 'Green' : 'Red'}
        </div>
        <div className="text-sm">Moves: {gameState.moveCount}</div>
        {isAIThinking && (
          <div className="text-sm opacity-70">AI thinking...</div>
        )}
      </div>

      {/* Board */}
      <div
        className="relative"
        style={{
          width: boardPixelSize,
          height: boardPixelSize,
        }}
      >
        <svg
          width={boardPixelSize}
          height={boardPixelSize}
          className="absolute inset-0"
        >
          {/* Draw connections */}
          <g>
            {layout.connections.map((conn, index) => {
              const fromPos = getNodePosition(conn.from);
              const toPos = getNodePosition(conn.to);

              return (
                <line
                  key={index}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={
                    themeType === 'cyber'
                      ? 'rgba(0, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.2)'
                  }
                  strokeWidth={2}
                />
              );
            })}
          </g>

          {/* Draw highlighted moves */}
          {highlightedMoves.map((move, index) => {
            const fromPos = getNodePosition(move.from);
            const toPos = getNodePosition(move.to);

            return (
              <g key={`highlight-${index}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={move.isCapture ? '#ff0000' : theme.colors.primary}
                  strokeWidth={4}
                  strokeOpacity={0.5}
                  strokeDasharray={move.isCapture ? '10,5' : '0'}
                />
              </g>
            );
          })}
        </svg>

        {/* Draw nodes and pieces */}
        {layout.nodes.map((node, index) => {
          const pos = getNodePosition(node);
          const piece = pieceAtPosition(node);
          const isHighlighted = highlightedMoves.some((m) =>
            positionsEqual(m.to, node)
          );
          const isSelected =
            selectedPiece && positionsEqual(selectedPiece.position, node);

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: pos.x - 20,
                top: pos.y - 20,
                width: 40,
                height: 40,
              }}
            >
              {/* Node indicator */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => handleNodeClick(node)}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      themeType === 'cyber'
                        ? 'rgba(0, 255, 255, 0.5)'
                        : 'rgba(0, 0, 0, 0.3)',
                  }}
                />
              </motion.div>

              {/* Highlighted move target */}
              {isHighlighted && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${theme.colors.primary}40, transparent)`,
                      border: `2px solid ${theme.colors.primary}`,
                    }}
                  />
                </motion.div>
              )}

              {/* Piece */}
              <AnimatePresence>
                {piece && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => handlePieceClick(piece)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className="w-10 h-10 rounded-full shadow-lg transition-all"
                      style={{
                        background:
                          piece.player === 'green'
                            ? themeType === 'cyber'
                              ? 'linear-gradient(145deg, #00ff00, #00cc00)'
                              : 'linear-gradient(145deg, #22c55e, #16a34a)'
                            : themeType === 'cyber'
                            ? 'linear-gradient(145deg, #ff0055, #cc0044)'
                            : 'linear-gradient(145deg, #ef4444, #dc2626)',
                        border: isSelected
                          ? `3px solid ${theme.colors.primary}`
                          : 'none',
                        boxShadow:
                          themeType === 'cyber'
                            ? piece.player === 'green'
                              ? '0 0 20px rgba(0, 255, 0, 0.6)'
                              : '0 0 20px rgba(255, 0, 85, 0.6)'
                            : '0 4px 6px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {piece.type === 'king' && (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          K
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Captured pieces display */}
      <div className="flex justify-between w-full max-w-2xl px-4">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold">Captured by Green:</div>
          <div className="flex gap-1">
            {gameState.capturedPieces.green.map((piece, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full"
                style={{
                  background:
                    themeType === 'cyber'
                      ? 'linear-gradient(145deg, #ff0055, #cc0044)'
                      : 'linear-gradient(145deg, #ef4444, #dc2626)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="text-xs font-semibold">Captured by Red:</div>
          <div className="flex gap-1">
            {gameState.capturedPieces.red.map((piece, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full"
                style={{
                  background:
                    themeType === 'cyber'
                      ? 'linear-gradient(145deg, #00ff00, #00cc00)'
                      : 'linear-gradient(145deg, #22c55e, #16a34a)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Winner display */}
      {gameState.winner && (
        <motion.div
          className="glass-effect p-6 rounded-xl shadow-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-2xl font-bold text-center">
            {gameState.winner === 'green' ? 'Green' : 'Red'} Wins!
          </div>
          <div className="text-sm text-center mt-2">
            Moves: {gameState.moveCount}
          </div>
        </motion.div>
      )}
    </div>
  );
};
