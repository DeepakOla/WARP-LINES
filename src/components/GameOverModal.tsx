import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameResult } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface GameOverModalProps {
  isOpen: boolean;
  result: GameResult;
  player1Name: string;
  player2Name: string;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  player1Name,
  player2Name,
  onPlayAgain,
  onMainMenu,
}) => {
  const { theme, themeType } = useTheme();

  if (!result) return null;

  const getResultMessage = () => {
    switch (result) {
      case 'player1-win':
        return {
          title: `${player1Name} Wins!`,
          subtitle: 'Congratulations on your victory',
          color: themeType === 'cyber' ? '#00ffff' : '#8a4853',
        };
      case 'player2-win':
        return {
          title: `${player2Name} Wins!`,
          subtitle: 'Congratulations on your victory',
          color: themeType === 'cyber' ? '#ff00ff' : '#5f5e5e',
        };
      case 'draw':
        return {
          title: "It's a Draw!",
          subtitle: 'Well played by both sides',
          color: themeType === 'cyber' ? '#00ff00' : '#666666',
        };
      default:
        return {
          title: 'Game Over',
          subtitle: '',
          color: theme.colors.text,
        };
    }
  };

  const resultData = getResultMessage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMainMenu}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div
              className="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl"
              style={{
                border: themeType === 'cyber'
                  ? `2px solid ${resultData.color}`
                  : '1px solid rgba(128, 128, 128, 0.2)',
                boxShadow: themeType === 'cyber'
                  ? `0 0 40px ${resultData.color}40`
                  : '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated trophy or icon */}
              <motion.div
                className="text-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl"
                  style={{
                    background: `linear-gradient(145deg, ${resultData.color}, ${resultData.color}cc)`,
                    boxShadow: themeType === 'cyber'
                      ? `0 0 30px ${resultData.color}80`
                      : '0 10px 30px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {result === 'draw' ? '🤝' : '🏆'}
                </div>
              </motion.div>

              {/* Result title */}
              <motion.h2
                className="text-3xl font-bold text-center mb-2"
                style={{ color: resultData.color }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {resultData.title}
              </motion.h2>

              {/* Result subtitle */}
              <motion.p
                className="text-center mb-8 opacity-70"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {resultData.subtitle}
              </motion.p>

              {/* Action buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: themeType === 'cyber'
                      ? 'linear-gradient(145deg, #00ffff, #00cccc)'
                      : 'linear-gradient(145deg, #8a4853, #a6606b)',
                    color: themeType === 'cyber' ? '#000' : '#fff',
                    boxShadow: themeType === 'cyber'
                      ? '0 0 20px rgba(0, 255, 255, 0.4)'
                      : '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                  onClick={onPlayAgain}
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
                  Play Again
                </button>

                <button
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: themeType === 'cyber'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                    border: themeType === 'cyber'
                      ? '1px solid rgba(0, 255, 255, 0.3)'
                      : '1px solid rgba(0, 0, 0, 0.2)',
                    color: theme.colors.text,
                  }}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
