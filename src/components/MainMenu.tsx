import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GameMode, AILevel } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface MainMenuProps {
  onModeSelect: (mode: GameMode, aiDifficulty?: AILevel) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect }) => {
  const { theme, themeType } = useTheme();
  const [hoveredMode, setHoveredMode] = useState<GameMode | null>(null);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AILevel>('medium');

  const difficulties: Array<{
    level: AILevel;
    name: string;
    description: string;
  }> = [
    { level: 'novice', name: 'Novice', description: 'Learning the game' },
    { level: 'easy', name: 'Easy', description: 'Casual player' },
    { level: 'medium', name: 'Medium', description: 'Balanced challenge' },
    { level: 'hard', name: 'Hard', description: 'Experienced player' },
    { level: 'master', name: 'Master', description: 'Expert strategist' },
  ];

  const modes: Array<{
    mode: GameMode;
    title: string;
    description: string;
    icon: string;
    available: boolean;
  }> = [
    {
      mode: 'local',
      title: 'LOCAL',
      description: 'Pass & play with a friend on the same device',
      icon: '👥',
      available: true,
    },
    {
      mode: 'solo',
      title: 'SOLO',
      description: 'Challenge the AI with 5 difficulty levels',
      icon: '🤖',
      available: true, // Phase 3 - NOW AVAILABLE
    },
    {
      mode: 'campaign',
      title: 'CAMPAIGN',
      description: 'Progress through 7 challenging levels',
      icon: '🎯',
      available: false, // Phase 5
    },
    {
      mode: 'online',
      title: 'ONLINE',
      description: 'Play against opponents worldwide',
      icon: '🌐',
      available: false, // Phase 6
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-6xl font-bold mb-4"
            style={{
              color: theme.colors.primary,
              textShadow: themeType === 'cyber'
                ? '0 0 30px rgba(0, 255, 255, 0.5)'
                : 'none',
            }}
          >
            The Sovereign Warp
          </h1>
          <p className="text-xl opacity-70">Select Your Game Mode</p>
        </motion.div>

        {/* Mode grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((modeItem, index) => {
            const isHovered = hoveredMode === modeItem.mode;

            return (
              <motion.div
                key={modeItem.mode}
                className="relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              >
                <button
                  className="w-full p-8 rounded-2xl glass-effect text-left transition-all duration-300"
                  style={{
                    border: isHovered
                      ? themeType === 'cyber'
                        ? '2px solid #00ffff'
                        : '2px solid #8a4853'
                      : themeType === 'cyber'
                      ? '1px solid rgba(0, 255, 255, 0.2)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: isHovered
                      ? themeType === 'cyber'
                        ? '0 0 30px rgba(0, 255, 255, 0.4)'
                        : '0 10px 40px rgba(0, 0, 0, 0.2)'
                      : 'none',
                    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                    opacity: modeItem.available ? 1 : 0.5,
                    cursor: modeItem.available ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    if (!modeItem.available) return;
                    if (modeItem.mode === 'solo') {
                      setShowDifficultySelect(true);
                    } else {
                      onModeSelect(modeItem.mode);
                    }
                  }}
                  onMouseEnter={() => modeItem.available && setHoveredMode(modeItem.mode)}
                  onMouseLeave={() => setHoveredMode(null)}
                  disabled={!modeItem.available}
                >
                  {/* Icon */}
                  <div
                    className="text-6xl mb-4"
                    style={{
                      filter: themeType === 'cyber' && isHovered
                        ? 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'
                        : 'none',
                    }}
                  >
                    {modeItem.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{
                      color: isHovered
                        ? themeType === 'cyber' ? '#00ffff' : '#8a4853'
                        : theme.colors.text,
                    }}
                  >
                    {modeItem.title}
                  </h3>

                  {/* Description */}
                  <p className="opacity-70 mb-4">
                    {modeItem.description}
                  </p>

                  {/* Coming Soon badge */}
                  {!modeItem.available && (
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: themeType === 'cyber'
                          ? 'rgba(255, 0, 255, 0.2)'
                          : 'rgba(0, 0, 0, 0.2)',
                        border: themeType === 'cyber'
                          ? '1px solid rgba(255, 0, 255, 0.4)'
                          : '1px solid rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      Coming Soon
                    </div>
                  )}

                  {/* Hover indicator */}
                  {modeItem.available && isHovered && (
                    <motion.div
                      className="absolute bottom-4 right-4 text-sm font-semibold"
                      style={{ color: themeType === 'cyber' ? '#00ffff' : '#8a4853' }}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      Click to play →
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          className="text-center mt-8 opacity-50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8 }}
        >
          More game modes coming in future phases
        </motion.div>
      </div>

      {/* Difficulty Selection Modal */}
      {showDifficultySelect && (
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
            onClick={() => setShowDifficultySelect(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div
              className="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl"
              style={{
                border: themeType === 'cyber'
                  ? '2px solid #00ffff'
                  : '1px solid rgba(128, 128, 128, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-2xl font-bold mb-6 text-center"
                style={{ color: theme.colors.primary }}
              >
                Select AI Difficulty
              </h2>

              <div className="space-y-3">
                {difficulties.map((diff, index) => (
                  <motion.button
                    key={diff.level}
                    className="w-full p-4 rounded-lg transition-all duration-200"
                    style={{
                      background: selectedDifficulty === diff.level
                        ? themeType === 'cyber'
                          ? 'rgba(0, 255, 255, 0.2)'
                          : 'rgba(138, 72, 83, 0.2)'
                        : 'rgba(128, 128, 128, 0.1)',
                      border: selectedDifficulty === diff.level
                        ? themeType === 'cyber'
                          ? '2px solid #00ffff'
                          : '2px solid #8a4853'
                        : '1px solid rgba(128, 128, 128, 0.2)',
                    }}
                    onClick={() => setSelectedDifficulty(diff.level)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="text-left">
                      <div className="font-bold text-lg">{diff.name}</div>
                      <div className="text-sm opacity-70">{diff.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: themeType === 'cyber'
                      ? 'linear-gradient(145deg, #00ffff, #00cccc)'
                      : 'linear-gradient(145deg, #8a4853, #a6606b)',
                    color: themeType === 'cyber' ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    onModeSelect('solo', selectedDifficulty);
                    setShowDifficultySelect(false);
                  }}
                >
                  Start Game
                </button>

                <button
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: 'rgba(128, 128, 128, 0.2)',
                    border: '1px solid rgba(128, 128, 128, 0.3)',
                  }}
                  onClick={() => setShowDifficultySelect(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
