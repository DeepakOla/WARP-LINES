/**
 * Settings Modal Component
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../services/SoundManager';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const [soundEnabled, setSoundEnabled] = React.useState(
    soundManager.getSettings().enabled
  );
  const [volume, setVolume] = React.useState(
    soundManager.getSettings().volume
  );

  const handleSoundToggle = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
    if (newEnabled) {
      soundManager.play('click');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div
              className="glass-effect p-8 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-black/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sound Settings */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 size={20} />
                      ) : (
                        <VolumeX size={20} />
                      )}
                      <span className="font-semibold">Sound Effects</span>
                    </div>
                    <button
                      onClick={handleSoundToggle}
                      className="relative w-12 h-6 rounded-full transition-colors"
                      style={{
                        background: soundEnabled
                          ? theme.colors.primary
                          : theme.colors.outline,
                      }}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
                        animate={{ x: soundEnabled ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {soundEnabled && (
                    <div>
                      <label className="block text-sm mb-2">Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full"
                      />
                      <div className="text-sm text-center mt-1">
                        {Math.round(volume * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Test Sound Button */}
                {soundEnabled && (
                  <motion.button
                    className="w-full p-3 rounded-lg font-semibold"
                    onClick={() => soundManager.play('win')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: theme.colors.primaryContainer,
                      color: theme.colors.onPrimary,
                    }}
                  >
                    Test Sound
                  </motion.button>
                )}
              </div>

              {/* About Section */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.outline }}>
                <h3 className="font-semibold mb-2">About Warp Board</h3>
                <p className="text-sm opacity-70">
                  A strategic board game variant of Alquerque/Checkers played on a
                  node-based grid with diagonal connections.
                </p>
                <p className="text-xs opacity-50 mt-4">
                  Built with React, TypeScript, and Framer Motion
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
