import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { GameStatus } from '../types/game';

interface GameControlsProps {
  gameStatus: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onMainMenu: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  onStart,
  onPause,
  onResume,
  onReset,
  onMainMenu,
}) => {
  const { theme, themeType } = useTheme();

  const buttonBaseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: themeType === 'cyber'
      ? 'linear-gradient(145deg, #00ffff, #00cccc)'
      : 'linear-gradient(145deg, #8a4853, #a6606b)',
    color: themeType === 'cyber' ? '#000' : '#fff',
    boxShadow: themeType === 'cyber'
      ? '0 0 20px rgba(0, 255, 255, 0.4)'
      : '0 4px 12px rgba(0, 0, 0, 0.2)',
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    background: themeType === 'cyber'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)',
    border: themeType === 'cyber'
      ? '1px solid rgba(0, 255, 255, 0.3)'
      : '1px solid rgba(0, 0, 0, 0.2)',
    color: theme.colors.text,
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass-effect px-6 py-4 rounded-xl shadow-xl flex gap-4 z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
    >
      {/* Start button */}
      {gameStatus === 'setup' && (
        <button
          style={primaryButtonStyle}
          onClick={onStart}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = themeType === 'cyber'
              ? '0 0 30px rgba(0, 255, 255, 0.6)'
              : '0 6px 16px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = themeType === 'cyber'
              ? '0 0 20px rgba(0, 255, 255, 0.4)'
              : '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
        >
          Start Game
        </button>
      )}

      {/* Pause/Resume button */}
      {gameStatus === 'playing' && (
        <button
          style={secondaryButtonStyle}
          onClick={onPause}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = themeType === 'cyber'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = themeType === 'cyber'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)';
          }}
        >
          Pause
        </button>
      )}

      {gameStatus === 'paused' && (
        <button
          style={primaryButtonStyle}
          onClick={onResume}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = themeType === 'cyber'
              ? '0 0 30px rgba(0, 255, 255, 0.6)'
              : '0 6px 16px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = themeType === 'cyber'
              ? '0 0 20px rgba(0, 255, 255, 0.4)'
              : '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
        >
          Resume
        </button>
      )}

      {/* Reset button */}
      {(gameStatus === 'playing' || gameStatus === 'paused') && (
        <button
          style={secondaryButtonStyle}
          onClick={onReset}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = themeType === 'cyber'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = themeType === 'cyber'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)';
          }}
        >
          Reset
        </button>
      )}

      {/* Main Menu button */}
      <button
        style={secondaryButtonStyle}
        onClick={onMainMenu}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.background = themeType === 'cyber'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.background = themeType === 'cyber'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)';
        }}
      >
        Main Menu
      </button>
    </motion.div>
  );
};
