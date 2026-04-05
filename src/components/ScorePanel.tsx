import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface ScorePanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  position: 'left' | 'right';
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ player, isCurrentPlayer, position }) => {
  const { theme, themeType } = useTheme();

  const pieceCount = player.pieces.length;
  const capturedCount = player.capturedPieces;

  const animationDelay = position === 'left' ? 0 : 0.5;

  return (
    <motion.div
      className={`absolute ${position === 'left' ? '-left-48' : '-right-48'} top-1/4 glass-effect p-6 rounded-xl shadow-xl`}
      style={{
        width: '180px',
        transform: `translateZ(40px) rotateY(${position === 'left' ? '15deg' : '-15deg'})`,
        border: isCurrentPlayer
          ? themeType === 'cyber'
            ? `2px solid ${player.id === 'player1' ? '#00ffff' : '#ff00ff'}`
            : `2px solid ${player.id === 'player1' ? '#8a4853' : '#5f5e5e'}`
          : 'none',
      }}
      animate={{ y: [0, position === 'left' ? -10 : 10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: animationDelay }}
    >
      {/* Player indicator */}
      {isCurrentPlayer && (
        <div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
          style={{
            background: themeType === 'cyber'
              ? player.id === 'player1' ? '#00ffff' : '#ff00ff'
              : player.id === 'player1' ? '#8a4853' : '#5f5e5e',
            boxShadow: themeType === 'cyber'
              ? `0 0 15px ${player.id === 'player1' ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 0, 255, 0.8)'}`
              : 'none',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      <div
        className="text-sm font-semibold mb-3"
        style={{
          color: player.id === 'player1' ? theme.colors.primary : theme.colors.secondary,
        }}
      >
        {player.name}
        {player.isAI && (
          <span className="text-xs ml-1 opacity-70">
            (AI - {player.aiDifficulty})
          </span>
        )}
      </div>

      {/* Player piece icon */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full"
          style={{
            background: player.id === 'player1'
              ? themeType === 'sovereign'
                ? 'linear-gradient(145deg, #8a4853, #a6606b)'
                : 'linear-gradient(145deg, #00ffff, #00cccc)'
              : themeType === 'sovereign'
              ? 'linear-gradient(145deg, #5f5e5e, #7a7979)'
              : 'linear-gradient(145deg, #ff00ff, #cc00cc)',
            boxShadow: themeType === 'cyber'
              ? player.id === 'player1'
                ? '0 0 15px rgba(0, 255, 255, 0.5)'
                : '0 0 15px rgba(255, 0, 255, 0.5)'
              : '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        />
        <div>
          <div className="text-2xl font-bold">{pieceCount}</div>
          <div className="text-xs opacity-70">Pieces</div>
        </div>
      </div>

      {/* Captured pieces */}
      <div className="border-t pt-3" style={{ borderColor: 'rgba(128, 128, 128, 0.2)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-70">Captured</span>
          <span className="text-lg font-bold">{capturedCount}</span>
        </div>
      </div>

      {/* Current turn indicator */}
      {isCurrentPlayer && (
        <motion.div
          className="mt-3 text-center text-xs font-semibold"
          style={{
            color: themeType === 'cyber'
              ? player.id === 'player1' ? '#00ffff' : '#ff00ff'
              : player.id === 'player1' ? '#8a4853' : '#5f5e5e',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Your Turn
        </motion.div>
      )}
    </motion.div>
  );
};
