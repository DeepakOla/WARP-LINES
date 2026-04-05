import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import type { Board, Piece, Move, Player } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';
import { BOARD_VISUAL } from '../config/gameConfig';

interface Props {
  board: Board;
  pieces: Piece[];
  currentPlayer: Player;
  selectedPieceId: string | null;
  validMoves: Move[];
  lastMove?: Move | null;
  chainCaptureNodeId: number | null;
  isAIThinking?: boolean;
  onNodeClick: (nodeId: number) => void;
}

const { NODE_RADIUS } = BOARD_VISUAL;

export const GeometricGrid: React.FC<Props> = ({
  board,
  pieces,
  currentPlayer,
  selectedPieceId,
  validMoves,
  lastMove,
  chainCaptureNodeId,
  isAIThinking,
  onNodeClick,
}) => {
  const { theme, themeType } = useTheme();
  const boardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 15, y: -10 });

  // Build lookup sets for fast rendering checks
  const validDestinations = new Set(validMoves.map(m => m.toNodeId));
  const captureOverNodes = new Set(
    validMoves.filter(m => m.capturedNodeId != null).map(m => m.capturedNodeId!)
  );
  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  // Mouse-driven 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setRotation({
        x: 15 + (e.clientY - cy) / 30,
        y: -10 + (e.clientX - cx) / 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute SVG bounds from node positions
  const allX = board.nodes.map(n => n.position.x);
  const allY = board.nodes.map(n => n.position.y);
  const minX = Math.min(...allX) - BOARD_VISUAL.SVG_PADDING;
  const minY = Math.min(...allY) - BOARD_VISUAL.SVG_PADDING;
  const maxX = Math.max(...allX) + BOARD_VISUAL.SVG_PADDING;
  const maxY = Math.max(...allY) + BOARD_VISUAL.SVG_PADDING;
  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  const isSovereign = themeType === 'sovereign';

  // Theme colours
  const colors = {
    edgeLine: isSovereign ? '#d0c4b0' : '#1a3a3a',
    edgeGlow: isSovereign ? 'none' : theme.colors.outline,
    nodeEmpty: isSovereign ? '#f0ece6' : '#111',
    nodeEmptyStroke: isSovereign ? '#c8b8a2' : '#1e5f5f',
    nodeValid: isSovereign ? '#d4f0d4' : '#002a2a',
    nodeValidStroke: isSovereign ? '#4caf50' : '#00ffaa',
    p1Fill: isSovereign
      ? 'url(#gradP1Sov)' : 'url(#gradP1Cyber)',
    p2Fill: isSovereign
      ? 'url(#gradP2Sov)' : 'url(#gradP2Cyber)',
    selectedRing: isSovereign ? '#8a4853' : '#00ffff',
    captureTarget: isSovereign ? '#ffd0d0' : '#330000',
    captureStroke: isSovereign ? '#e53935' : '#ff0055',
    lastMove: isSovereign ? 'rgba(138,72,83,0.25)' : 'rgba(0,255,255,0.15)',
    bgSurface: isSovereign
      ? 'linear-gradient(145deg, #faf8f5, #f0ece6)'
      : 'linear-gradient(145deg, #0e1e1e, #060e0e)',
  };

  const handleNodeClick = useCallback((nodeId: number) => {
    if (isAIThinking) return;
    onNodeClick(nodeId);
  }, [isAIThinking, onNodeClick]);

  return (
    <div className="flex items-center justify-center w-full" style={{ perspective: '1200px' }}>
      <motion.div
        ref={boardRef}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.12s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Board backing */}
        <div
          className="relative rounded-2xl shadow-2xl"
          style={{
            background: colors.bgSurface,
            padding: '24px',
            boxShadow: isSovereign
              ? '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)'
              : `0 24px 64px rgba(0,255,255,0.08), 0 0 40px rgba(0,255,255,0.05), inset 0 0 60px rgba(0,255,255,0.03)`,
          }}
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`${minX} ${minY} ${svgWidth} ${svgHeight}`}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              {/* Player gradients – Sovereign */}
              <radialGradient id="gradP1Sov" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#c4737e" />
                <stop offset="100%" stopColor="#6a2e38" />
              </radialGradient>
              <radialGradient id="gradP2Sov" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#888" />
                <stop offset="100%" stopColor="#3a3a3a" />
              </radialGradient>
              {/* Player gradients – Cyber */}
              <radialGradient id="gradP1Cyber" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#44ffff" />
                <stop offset="100%" stopColor="#007a7a" />
              </radialGradient>
              <radialGradient id="gradP2Cyber" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#ff55ff" />
                <stop offset="100%" stopColor="#7a007a" />
              </radialGradient>
              {/* Glow filters for cyber */}
              <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glowMag" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* ── Edges ─────────────────────────────────────────────────── */}
            {board.edges.map((edge, i) => {
              const a = board.nodes[edge.from];
              const b = board.nodes[edge.to];
              if (!a || !b) return null;
              const isLastMoveEdge =
                lastMove &&
                ((lastMove.fromNodeId === edge.from && lastMove.toNodeId === edge.to) ||
                  (lastMove.fromNodeId === edge.to && lastMove.toNodeId === edge.from));
              return (
                <line
                  key={i}
                  x1={a.position.x}
                  y1={a.position.y}
                  x2={b.position.x}
                  y2={b.position.y}
                  stroke={isLastMoveEdge ? colors.selectedRing : colors.edgeLine}
                  strokeWidth={isLastMoveEdge ? 2.5 : 1.5}
                  strokeLinecap="round"
                  opacity={isLastMoveEdge ? 0.9 : 0.6}
                  filter={!isSovereign && isLastMoveEdge ? 'url(#glowCyan)' : undefined}
                />
              );
            })}

            {/* ── Nodes ─────────────────────────────────────────────────── */}
            {board.nodes.map(node => {
              const piece = pieces.find(p => p.nodeId === node.id);
              const isValidDest = validDestinations.has(node.id);
              const isCaptureOver = captureOverNodes.has(node.id);
              const isSelected = selectedPiece?.nodeId === node.id;
              const isLastFrom = lastMove?.fromNodeId === node.id;
              const isLastTo = lastMove?.toNodeId === node.id;
              const isChainNode = chainCaptureNodeId === node.id;

              let nodeFill = colors.nodeEmpty;
              let nodeStroke = colors.nodeEmptyStroke;
              let strokeWidth = 1.5;

              if (isCaptureOver) {
                nodeFill = colors.captureTarget;
                nodeStroke = colors.captureStroke;
                strokeWidth = 2;
              } else if (isValidDest && !piece) {
                nodeFill = colors.nodeValid;
                nodeStroke = colors.nodeValidStroke;
                strokeWidth = 2;
              } else if (isLastFrom || isLastTo) {
                nodeFill = colors.lastMove;
              }

              const pieceFill = piece?.owner === 'player1' ? colors.p1Fill : colors.p2Fill;
              const glowFilter = !isSovereign && piece
                ? (piece.owner === 'player1' ? 'url(#glowCyan)' : 'url(#glowMag)')
                : undefined;

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  style={{ cursor: isAIThinking ? 'not-allowed' : 'pointer' }}
                >
                  {/* Selection ring for selected piece or chain capture */}
                  {(isSelected || isChainNode) && (
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={NODE_RADIUS + 6}
                      fill="none"
                      stroke={colors.selectedRing}
                      strokeWidth={2.5}
                      opacity={0.8}
                      strokeDasharray="4 3"
                    >
                      {!isSovereign && (
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from={`0 ${node.position.x} ${node.position.y}`}
                          to={`360 ${node.position.x} ${node.position.y}`}
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                  )}

                  {/* Valid destination pulse */}
                  {isValidDest && !piece && (
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={NODE_RADIUS + 3}
                      fill={colors.nodeValidStroke}
                      opacity={0.18}
                    >
                      <animate attributeName="r" values={`${NODE_RADIUS + 2};${NODE_RADIUS + 7};${NODE_RADIUS + 2}`} dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.18;0.08;0.18" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Node background */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={NODE_RADIUS}
                    fill={piece ? pieceFill : nodeFill}
                    stroke={isSelected ? colors.selectedRing : nodeStroke}
                    strokeWidth={isSelected ? 3 : strokeWidth}
                    filter={glowFilter}
                  />

                  {/* Piece shine */}
                  {piece && (
                    <ellipse
                      cx={node.position.x - NODE_RADIUS * 0.25}
                      cy={node.position.y - NODE_RADIUS * 0.3}
                      rx={NODE_RADIUS * 0.35}
                      ry={NODE_RADIUS * 0.2}
                      fill="white"
                      opacity={0.3}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* King crown */}
                  {piece?.isKing && (
                    <text
                      x={node.position.x}
                      y={node.position.y + 5}
                      textAnchor="middle"
                      fontSize={14}
                      fill="gold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      ♛
                    </text>
                  )}

                  {/* Valid move dot indicator */}
                  {isValidDest && !piece && (
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={5}
                      fill={colors.nodeValidStroke}
                      opacity={0.8}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                </g>
              );
            })}

            {/* AI thinking overlay */}
            {isAIThinking && (
              <text
                x={svgWidth / 2 + minX}
                y={svgHeight / 2 + minY}
                textAnchor="middle"
                fontSize={14}
                fill={isSovereign ? '#8a4853' : '#00ffff'}
                opacity={0.7}
              >
                AI thinking…
              </text>
            )}
          </svg>

          {/* 3D edge shadow */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -16,
              height: 16,
              background: isSovereign
                ? 'linear-gradient(180deg, #d8d0c8, #b8b0a8)'
                : 'linear-gradient(180deg, #0a1a1a, #050d0d)',
              borderRadius: '0 0 12px 12px',
              transform: 'rotateX(-90deg)',
              transformOrigin: 'top',
              opacity: 0.6,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
