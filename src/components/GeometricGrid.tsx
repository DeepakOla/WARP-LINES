import React from 'react';
import { motion } from 'motion/react';
import { Node, Position } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';
import { calculateNodeCoordinates } from '../engine/boardGenerator';

interface GeometricGridProps {
  board: Node[][];
  nodeCount: 10 | 13 | 16;
  selectedPiece: Position | null;
  availableMoves: Position[];
  hoveredNode: Position | null;
  onNodeClick: (position: Position) => void;
  onNodeHover: (position: Position | null) => void;
}

export const GeometricGrid: React.FC<GeometricGridProps> = ({
  board,
  nodeCount,
  selectedPiece,
  availableMoves,
  hoveredNode,
  onNodeClick,
  onNodeHover,
}) => {
  const { theme, themeType } = useTheme();

  const isPositionEqual = (pos1: Position | null, pos2: Position) => {
    return pos1?.row === pos2.row && pos1?.col === pos2.col;
  };

  const isAvailableMove = (position: Position) => {
    return availableMoves.some(move => move.row === position.row && move.col === position.col);
  };

  return (
    <svg width="600" height="600" viewBox="0 0 600 600">
      {/* Draw connection lines between adjacent nodes */}
      {board.map((row, rowIndex) =>
        row.map((node, colIndex) => {
          const fromCoords = calculateNodeCoordinates(node.position, board, nodeCount);

          return node.adjacentNodes.map((adjPos, adjIndex) => {
            // Only draw each line once (from lower row to higher row, or left to right in same row)
            if (adjPos.row > node.position.row ||
                (adjPos.row === node.position.row && adjPos.col > node.position.col)) {
              const toCoords = calculateNodeCoordinates(adjPos, board, nodeCount);

              return (
                <line
                  key={`line-${rowIndex}-${colIndex}-${adjIndex}`}
                  x1={fromCoords.x}
                  y1={fromCoords.y}
                  x2={toCoords.x}
                  y2={toCoords.y}
                  stroke={themeType === 'cyber' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
                  strokeWidth="2"
                />
              );
            }
            return null;
          });
        })
      )}

      {/* Draw nodes */}
      {board.map((row, rowIndex) =>
        row.map((node, colIndex) => {
          const coords = calculateNodeCoordinates(node.position, board, nodeCount);
          const isSelected = isPositionEqual(selectedPiece, node.position);
          const isHovered = isPositionEqual(hoveredNode, node.position);
          const isAvailable = isAvailableMove(node.position);
          const hasPiece = node.piece !== null;

          return (
            <g key={`node-${rowIndex}-${colIndex}`}>
              {/* Node circle */}
              <motion.circle
                cx={coords.x}
                cy={coords.y}
                r={30}
                fill={
                  themeType === 'sovereign'
                    ? isHovered || isSelected
                      ? '#e8e8e8'
                      : '#f5f5f5'
                    : isHovered || isSelected
                    ? '#2a2a2a'
                    : '#1a1a1a'
                }
                stroke={
                  isSelected
                    ? themeType === 'cyber' ? '#00ffff' : '#8a4853'
                    : isAvailable
                    ? themeType === 'cyber' ? '#00ff00' : '#a6606b'
                    : themeType === 'cyber' ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)'
                }
                strokeWidth={isSelected || isAvailable ? 3 : 1}
                style={{ cursor: 'pointer' }}
                onClick={() => onNodeClick(node.position)}
                onMouseEnter={() => onNodeHover(node.position)}
                onMouseLeave={() => onNodeHover(null)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Glow effect for available moves */}
              {isAvailable && themeType === 'cyber' && (
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={32}
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="2"
                  opacity={0.5}
                  animate={{ r: [30, 35, 30] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Available move indicator */}
              {isAvailable && !hasPiece && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={8}
                  fill={themeType === 'cyber' ? '#00ff00' : '#a6606b'}
                  opacity={0.6}
                />
              )}

              {/* Piece rendering */}
              {hasPiece && (
                <g>
                  <motion.circle
                    cx={coords.x}
                    cy={coords.y}
                    r={25}
                    fill={
                      node.piece!.owner === 'player1'
                        ? themeType === 'sovereign'
                          ? 'url(#player1-gradient-sovereign)'
                          : 'url(#player1-gradient-cyber)'
                        : themeType === 'sovereign'
                        ? 'url(#player2-gradient-sovereign)'
                        : 'url(#player2-gradient-cyber)'
                    }
                    style={{
                      filter: themeType === 'cyber'
                        ? node.piece!.owner === 'player1'
                          ? 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'
                          : 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.8))'
                        : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />

                  {/* Piece inner highlight */}
                  <circle
                    cx={coords.x - 5}
                    cy={coords.y - 5}
                    r={8}
                    fill="white"
                    opacity={0.3}
                  />
                </g>
              )}
            </g>
          );
        })
      )}

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="player1-gradient-sovereign" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a4853" />
          <stop offset="100%" stopColor="#a6606b" />
        </linearGradient>
        <linearGradient id="player2-gradient-sovereign" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5f5e5e" />
          <stop offset="100%" stopColor="#7a7979" />
        </linearGradient>
        <linearGradient id="player1-gradient-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#00cccc" />
        </linearGradient>
        <linearGradient id="player2-gradient-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff00ff" />
          <stop offset="100%" stopColor="#cc00cc" />
        </linearGradient>
      </defs>
    </svg>
  );
};
