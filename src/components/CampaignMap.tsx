import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { CAMPAIGN_LEVELS, getCampaignLevel } from '../config/gameConfig';
import { ChevronLeft, Lock, Star } from 'lucide-react';

const VISIBLE_LEVELS = 15; // Show up to this many levels on the map

export const CampaignMap: React.FC = () => {
  const { theme, themeType } = useTheme();
  const { campaignProgress, startGame, navigateTo } = useGame();
  const isSovereign = themeType === 'sovereign';

  // Determine the max unlocked level
  const maxCompleted = Object.keys(campaignProgress)
    .map(Number)
    .filter(id => campaignProgress[id]?.completed)
    .reduce((max, id) => Math.max(max, id), 0);
  const maxUnlocked = maxCompleted + 1;

  // Build level list (always show at least 10 preset + some generated)
  const totalVisible = Math.max(VISIBLE_LEVELS, maxCompleted + 3);
  const levels = Array.from({ length: totalVisible }, (_, i) => {
    const id = i + 1;
    return getCampaignLevel(id);
  });

  const surface = isSovereign ? theme.colors.surfaceContainerLow : '#111';
  const border = isSovereign ? theme.colors.outlineVariant : '#1e3a3a';

  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-4"
      style={{ background: theme.colors.background }}
    >
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 flex items-center gap-3">
        <button
          onClick={() => navigateTo('MENU')}
          className="p-2 rounded-lg hover:opacity-70 transition-all"
          style={{ color: theme.colors.onSurface }}
        >
          <ChevronLeft size={22} />
        </button>
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: theme.fonts.display, color: theme.colors.onSurface }}
          >
            Campaign
          </h2>
          <p className="text-xs opacity-50" style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
            {maxCompleted} / {totalVisible} levels completed
          </p>
        </div>
      </div>

      {/* Level grid */}
      <div className="w-full max-w-2xl grid grid-cols-3 md:grid-cols-4 gap-4">
        {levels.map((level, i) => {
          const progress = campaignProgress[level.id];
          const isCompleted = !!progress?.completed;
          const isUnlocked = level.id <= maxUnlocked;
          const stars = progress?.stars ?? 0;

          return (
            <motion.button
              key={level.id}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && startGame(level.id)}
              whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
              whileTap={isUnlocked ? { scale: 0.97 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
              style={{
                background: isCompleted
                  ? isSovereign ? `${theme.colors.primary}12` : `${theme.colors.primary}10`
                  : isUnlocked
                  ? surface
                  : isSovereign ? '#e8e8e8' : '#0a0a0a',
                border: `1.5px solid ${
                  isCompleted
                    ? theme.colors.primary
                    : isUnlocked
                    ? border
                    : 'transparent'
                }`,
                opacity: isUnlocked ? 1 : 0.45,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                boxShadow: isCompleted && !isSovereign
                  ? `0 0 14px ${theme.colors.primary}33`
                  : 'none',
              }}
            >
              {/* Level number */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
                style={{
                  background: isCompleted
                    ? isSovereign
                      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryContainer})`
                      : `${theme.colors.primary}22`
                    : isUnlocked
                    ? isSovereign ? theme.colors.surfaceContainerHigh : '#1a2a2a'
                    : '#888',
                  color: isCompleted
                    ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
                    : theme.colors.onSurface,
                }}
              >
                {isUnlocked ? level.id : <Lock size={16} />}
              </div>

              {/* Level name */}
              <span
                className="text-xs text-center leading-tight"
                style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body, opacity: isUnlocked ? 0.8 : 0.5 }}
              >
                {level.name}
              </span>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3].map(s => (
                  <Star
                    key={s}
                    size={10}
                    fill={s <= stars ? '#fbbf24' : 'none'}
                    stroke={s <= stars ? '#fbbf24' : theme.colors.outlineVariant}
                  />
                ))}
              </div>

              {/* Difficulty badge */}
              {isUnlocked && (
                <span
                  className="absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    background: diffColor(level.aiDifficulty, isSovereign) + '33',
                    color: diffColor(level.aiDifficulty, isSovereign),
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {level.aiDifficulty}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="mt-8 flex gap-6 text-xs opacity-50 pb-8"
        style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}
      >
        <span>⭐ = Stars earned</span>
        <span>1–5 = AI Difficulty</span>
      </div>
    </div>
  );
};

function diffColor(d: number, isSovereign: boolean): string {
  if (isSovereign) {
    const palette = ['#4caf50', '#8bc34a', '#ff9800', '#f44336', '#9c27b0'];
    return palette[d - 1] ?? '#888';
  }
  const palette = ['#00ff88', '#aaff00', '#ffaa00', '#ff5500', '#ff0055'];
  return palette[d - 1] ?? '#888';
}
