import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { motion } from 'motion/react';
import { Position, GameMode, AILevel } from '../types/game';
import { GeometricGrid } from './GeometricGrid';
import { ScorePanel } from './ScorePanel';
import { GameControls } from './GameControls';
import { GameOverModal } from './GameOverModal';
import { MainMenu } from './MainMenu';
import { getPlayerPieces } from '../engine/boardGenerator';

export const GameBoard: React.FC = () => {
  const { themeType } = useTheme();
  const {
    gameState,
    selectedPiece,
    availableMoves,
    isGameActive,
    createNewGame,
    startCurrentGame,
    makeMove,
    selectPiece,
    pauseCurrentGame,
    resumeCurrentGame,
    resetCurrentGame,
  } = useGame();

  const boardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 20, y: -20 });
  const [hoveredNode, setHoveredNode] = useState<Position | null>(null);
  const [showMainMenu, setShowMainMenu] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientY - centerY) / 20;
      const deltaY = (e.clientX - centerX) / 20;

      setRotation({ x: 20 + deltaX, y: -20 + deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleModeSelect = (mode: GameMode, aiDifficulty?: AILevel) => {
    createNewGame(mode, undefined, aiDifficulty);
    setShowMainMenu(false);
  };

  const handleNodeClick = (position: Position) => {
    if (!gameState || !isGameActive) return;

    const clickedNode = gameState.board[position.row]?.[position.col];
    if (!clickedNode) return;

    // If a piece is already selected
    if (selectedPiece) {
      // Check if clicking on an available move
      const isAvailableMove = availableMoves.some(
        move => move.row === position.row && move.col === position.col
      );

      if (isAvailableMove) {
        // Execute the move
        const success = makeMove(selectedPiece, position);
        if (success) {
          selectPiece(null);
        }
      } else {
        // Select a different piece or deselect
        if (clickedNode.piece && clickedNode.piece.owner === gameState.currentPlayer) {
          selectPiece(position);
        } else {
          selectPiece(null);
        }
      }
    } else {
      // No piece selected, try to select one
      if (clickedNode.piece && clickedNode.piece.owner === gameState.currentPlayer) {
        selectPiece(position);
      }
    }
  };

  const handleMainMenu = () => {
    setShowMainMenu(true);
    selectPiece(null);
  };

  const handlePlayAgain = () => {
    if (gameState) {
      const aiDifficulty = gameState.players[1].aiDifficulty;
      createNewGame(gameState.mode, gameState.rules, aiDifficulty);
    }
  };

  // Show main menu if no game or explicitly requested
  if (showMainMenu || !gameState) {
    return <MainMenu onModeSelect={handleModeSelect} />;
  }

  // Update piece counts for players
  if (gameState) {
    const player1Pieces = getPlayerPieces(gameState.board, 'player1');
    const player2Pieces = getPlayerPieces(gameState.board, 'player2');
    gameState.players[0].pieces = player1Pieces;
    gameState.players[1].pieces = player2Pieces;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="perspective-extreme">
        <motion.div
          ref={boardRef}
          className="preserve-3d"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Board container */}
          <div className="relative" style={{ width: '600px', height: '600px' }}>
            {/* Board base with 3D effect */}
            <div
              className="absolute inset-0 rounded-xl shadow-2xl"
              style={{
                background: themeType === 'sovereign'
                  ? 'linear-gradient(145deg, #ffffff, #f3f3f3)'
                  : 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
                transform: 'translateZ(-20px)',
                boxShadow: themeType === 'cyber'
                  ? '0 20px 60px rgba(0, 255, 255, 0.3), inset 0 0 40px rgba(0, 255, 255, 0.05)'
                  : '0 20px 60px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Geometric Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <GeometricGrid
                board={gameState.board}
                nodeCount={gameState.rules.nodeCount}
                selectedPiece={selectedPiece}
                availableMoves={availableMoves}
                hoveredNode={hoveredNode}
                onNodeClick={handleNodeClick}
                onNodeHover={setHoveredNode}
              />
            </div>

            {/* Decorative edges for 3D effect */}
            <div
              className="absolute -bottom-8 left-0 right-0 h-8 rounded-b-xl"
              style={{
                background: themeType === 'sovereign'
                  ? 'linear-gradient(180deg, #e2e2e2, #d0d0d0)'
                  : 'linear-gradient(180deg, #0a0a0a, #000000)',
                transform: 'rotateX(-90deg)',
                transformOrigin: 'top',
                opacity: 0.5,
              }}
            />
          </div>

          {/* Score Panels */}
          <ScorePanel
            player={gameState.players[0]}
            isCurrentPlayer={gameState.currentPlayer === 'player1'}
            position="left"
          />

          <ScorePanel
            player={gameState.players[1]}
            isCurrentPlayer={gameState.currentPlayer === 'player2'}
            position="right"
          />
        </motion.div>
      </div>

      {/* Game Controls */}
      <GameControls
        gameStatus={gameState.status}
        onStart={startCurrentGame}
        onPause={pauseCurrentGame}
        onResume={resumeCurrentGame}
        onReset={resetCurrentGame}
        onMainMenu={handleMainMenu}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState.status === 'finished'}
        result={gameState.result}
        player1Name={gameState.players[0].name}
        player2Name={gameState.players[1].name}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleMainMenu}
      />
    </div>
  );
};
