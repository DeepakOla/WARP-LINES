/**
 * Main Game Container Component
 * Handles game state, modes, and UI flow
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WarpBoard } from './WarpBoard';
import { SettingsModal } from './SettingsModal';
import type { GameState, GameMode, GameSettings, Move } from '../types/game';
import { GameEngine } from '../game/GameEngine';
import { CAMPAIGN_LEVELS, getStarsForMoves } from '../game/CampaignLevels';
import { useTheme } from '../contexts/ThemeContext';
import { Play, Users, Trophy, Settings, RotateCcw, Home } from 'lucide-react';
import { soundManager } from '../services/SoundManager';

type Screen = 'menu' | 'game' | 'settings' | 'campaign';

export const GameContainer: React.FC = () => {
  const { theme, themeType } = useTheme();
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [settings, setSettings] = useState<GameSettings>({
    boardSize: 3,
    mandatoryCaptures: true,
    infiltrators: 0,
    aiDifficulty: 2,
  });
  const [campaignLevel, setCampaignLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const startGame = (mode: GameMode, customSettings?: GameSettings) => {
    const gameSettings = customSettings || settings;
    const newGameState = GameEngine.createGame(gameSettings, mode);

    if (mode === 'campaign') {
      const level = CAMPAIGN_LEVELS[campaignLevel - 1];
      newGameState.settings = level.settings;
      newGameState.campaignLevel = campaignLevel;
    }

    setGameState(newGameState);
    setGameMode(mode);
    setScreen('game');
  };

  const handleMove = (move: Move) => {
    // Sound effect would play here
    console.log('Move:', move);
  };

  const handleStateChange = (newState: GameState) => {
    setGameState(newState);

    // Check for campaign level completion
    if (newState.winner && newState.gameMode === 'campaign' && newState.campaignLevel) {
      const level = CAMPAIGN_LEVELS[newState.campaignLevel - 1];
      const stars = getStarsForMoves(level, newState.moveCount);

      // Update completed levels
      if (!completedLevels.includes(newState.campaignLevel)) {
        setCompletedLevels([...completedLevels, newState.campaignLevel]);
      }

      console.log(`Campaign level ${newState.campaignLevel} completed with ${stars} stars!`);
    }
  };

  const handleUndo = () => {
    if (gameState && gameState.gameMode !== 'online') {
      const newState = GameEngine.undoMove(gameState);
      setGameState(newState);
    }
  };

  const returnToMenu = () => {
    setScreen('menu');
    setGameState(null);
  };

  const MenuButton: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
  }> = ({ icon, title, description, onClick }) => (
    <motion.button
      className="glass-effect p-6 rounded-xl text-left w-full"
      onClick={() => {
        soundManager.play('click');
        onClick();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background:
          themeType === 'cyber'
            ? 'rgba(0, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="p-3 rounded-lg"
          style={{
            background: theme.colors.primary,
            color: theme.colors.onPrimary,
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold mb-1">{title}</div>
          <div className="text-sm opacity-70">{description}</div>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <motion.div
            key="menu"
            className="max-w-md w-full space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10" /> {/* Spacer for centering */}
                <h1 className="text-5xl font-bold flex-1" style={{ fontFamily: theme.fonts.display }}>
                  WARP BOARD
                </h1>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="glass-effect p-3 rounded-lg"
                >
                  <Settings size={20} />
                </button>
              </div>
              <p className="text-sm opacity-70">
                A strategic board game of captures and tactics
              </p>
            </div>

            <MenuButton
              icon={<Play size={24} />}
              title="Solo vs AI"
              description="Challenge the computer opponent"
              onClick={() => startGame('solo')}
            />

            <MenuButton
              icon={<Users size={24} />}
              title="Local Pass & Play"
              description="Play with a friend on this device"
              onClick={() => startGame('local')}
            />

            <MenuButton
              icon={<Trophy size={24} />}
              title="Campaign Mode"
              description="Progress through 7 challenging levels"
              onClick={() => {
                setScreen('campaign');
              }}
            />

            <MenuButton
              icon={<Settings size={24} />}
              title="Custom Match"
              description="Customize rules and settings"
              onClick={() => setScreen('settings')}
            />
          </motion.div>
        )}

        {screen === 'campaign' && (
          <motion.div
            key="campaign"
            className="max-w-2xl w-full space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Campaign Mode</h2>
              <button
                onClick={() => setScreen('menu')}
                className="glass-effect p-3 rounded-lg"
              >
                <Home size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {CAMPAIGN_LEVELS.map((level) => {
                const isCompleted = completedLevels.includes(level.level);
                const isUnlocked =
                  level.level === 1 || completedLevels.includes(level.level - 1);

                return (
                  <motion.button
                    key={level.level}
                    className="glass-effect p-6 rounded-xl text-left disabled:opacity-50"
                    onClick={() => {
                      setCampaignLevel(level.level);
                      startGame('campaign');
                    }}
                    disabled={!isUnlocked}
                    whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm opacity-70">Level {level.level}</div>
                        <div className="text-xl font-bold mb-1">{level.name}</div>
                        <div className="text-sm opacity-70">{level.description}</div>
                      </div>
                      <div className="flex gap-1">
                        {isCompleted && <span className="text-yellow-500">⭐</span>}
                        {!isUnlocked && <span className="text-gray-500">🔒</span>}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {screen === 'settings' && (
          <motion.div
            key="settings"
            className="max-w-md w-full glass-effect p-8 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Custom Match</h2>
              <button
                onClick={() => setScreen('menu')}
                className="glass-effect p-3 rounded-lg"
              >
                <Home size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Board Size
                </label>
                <select
                  value={settings.boardSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      boardSize: Number(e.target.value) as 3 | 4,
                    })
                  }
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: theme.colors.surface,
                    color: theme.colors.onSurface,
                  }}
                >
                  <option value={3}>3x3 (Smaller)</option>
                  <option value={4}>4x4 (Larger)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  AI Difficulty
                </label>
                <select
                  value={settings.aiDifficulty}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      aiDifficulty: Number(e.target.value) as 1 | 2 | 3,
                    })
                  }
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: theme.colors.surface,
                    color: theme.colors.onSurface,
                  }}
                >
                  <option value={1}>Apprentice (Easy)</option>
                  <option value={2}>Strategist (Medium)</option>
                  <option value={3}>Grandmaster (Hard)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.mandatoryCaptures}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mandatoryCaptures: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-semibold">Mandatory Captures</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Infiltrators
                </label>
                <select
                  value={settings.infiltrators}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      infiltrators: Number(e.target.value) as 0 | 1 | 2,
                    })
                  }
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: theme.colors.surface,
                    color: theme.colors.onSurface,
                  }}
                >
                  <option value={0}>None</option>
                  <option value={1}>1 Piece</option>
                  <option value={2}>2 Pieces</option>
                </select>
              </div>

              <motion.button
                className="w-full p-4 rounded-lg font-bold"
                onClick={() => startGame('solo', settings)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: theme.colors.primary,
                  color: theme.colors.onPrimary,
                }}
              >
                Start Game
              </motion.button>
            </div>
          </motion.div>
        )}

        {screen === 'game' && gameState && (
          <motion.div
            key="game"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-4">
              <button
                onClick={returnToMenu}
                className="glass-effect p-3 rounded-lg"
              >
                <Home size={20} />
              </button>

              {(gameMode === 'solo' || gameMode === 'campaign') && (
                <button
                  onClick={handleUndo}
                  className="glass-effect p-3 rounded-lg"
                  disabled={gameState.moveHistory.length === 0}
                >
                  <RotateCcw size={20} />
                </button>
              )}
            </div>

            <WarpBoard
              gameState={gameState}
              onMove={handleMove}
              onStateChange={handleStateChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
