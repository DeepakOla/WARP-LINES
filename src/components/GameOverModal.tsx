import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import type { GameState, Player } from '../types/game';
import { useGame } from '../contexts/GameContext';

interface Props {
  gameState: GameState;
}

function starRating(moveCount: number, thresholds: [number, number, number]): number {
  if (moveCount <= thresholds[0]) return 3;
  if (moveCount <= thresholds[1]) return 2;
  if (moveCount <= thresholds[2]) return 1;
  return 0;
}

export const GameOverModal: React.FC<Props> = ({ gameState }) => {
  const { theme, themeType } = useTheme();
  const { startGame, resetGame, gameState: gs, campaignProgress } = useGame();
  const isSovereign = themeType === 'sovereign';
  const [showConfetti, setShowConfetti] = useState(false);

  const isDraw = gameState.isDraw;
  const winner: Player | null = gameState.winner;
  const isPlayerWin = winner === 'player1';

  // Import confetti lazily for the win animation
  useEffect(() => {
    if (isPlayerWin) {
      setShowConfetti(true);
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 } });
      });
    }
  }, [isPlayerWin]);

  const isCampaign = gameState.mode === 'CAMPAIGN' && gameState.campaignLevel != null;
  const campaignLevel = gameState.campaignLevel ?? 1;

  // Determine campaign stars
  let stars = 0;
  if (isCampaign && isPlayerWin) {
    const progress = campaignProgress[campaignLevel];
    stars = progress?.stars ?? 0;
  }

  const titleText = isDraw
    ? 'Draw!'
    : winner === 'player1'
    ? isCampaign ? '⭐ Victory!' : 'Player 1 Wins!'
    : gameState.mode === 'SOLO' || gameState.mode === 'CAMPAIGN'
    ? 'AI Wins!'
    : 'Player 2 Wins!';

  const surface = isSovereign ? theme.colors.surfaceContainerLow : '#0e1e1e';
  const border = isSovereign ? theme.colors.outlineVariant : '#1e3a3a';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full max-w-sm mx-4 rounded-2xl p-8 text-center"
          style={{
            background: surface,
            border: `1.5px solid ${border}`,
            boxShadow: isSovereign
              ? '0 24px 64px rgba(0,0,0,0.18)'
              : `0 24px 64px rgba(0,255,255,0.1), 0 0 40px rgba(0,255,255,0.05)`,
          }}
        >
          {/* Title */}
          <motion.h2
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: theme.fonts.display, color: theme.colors.onSurface }}
            animate={!isSovereign && isPlayerWin ? {
              textShadow: ['0 0 20px #00ffff', '0 0 40px #00ffff', '0 0 20px #00ffff'],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {titleText}
          </motion.h2>

          {/* Stars for campaign */}
          {isCampaign && isPlayerWin && (
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3].map(s => (
                <motion.span
                  key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: s * 0.2, type: 'spring' }}
                  className="text-4xl"
                >
                  {s <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="my-6 space-y-2">
            <Stat label="Total Moves" value={gameState.moveCount} theme={theme} />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {isCampaign && isPlayerWin && (
              <ActionButton
                label="Next Level →"
                primary
                onClick={() => startGame(campaignLevel + 1)}
                theme={theme}
                isSovereign={isSovereign}
              />
            )}
            <ActionButton
              label="Play Again"
              primary={!isCampaign || !isPlayerWin}
              onClick={() => {
                if (isCampaign) startGame(campaignLevel);
                else startGame();
              }}
              theme={theme}
              isSovereign={isSovereign}
            />
            <ActionButton
              label="Main Menu"
              onClick={resetGame}
              theme={theme}
              isSovereign={isSovereign}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Stat: React.FC<{
  label: string;
  value: number | string;
  theme: { colors: { onSurface: string; onSurfaceVariant: string }; fonts: { body: string } };
}> = ({ label, value, theme }) => (
  <div
    className="flex items-center justify-between px-4 py-2 rounded-lg"
    style={{ background: 'rgba(128,128,128,0.08)' }}
  >
    <span className="text-sm opacity-60" style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
      {label}
    </span>
    <span className="text-sm font-bold" style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
      {value}
    </span>
  </div>
);

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  primary?: boolean;
  theme: { colors: { primary: string; onPrimary: string; surfaceContainerHigh: string; onSurface: string; outlineVariant: string }; fonts: { body: string } };
  isSovereign: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, primary, theme, isSovereign }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
    style={{
      fontFamily: theme.fonts.body,
      background: primary
        ? isSovereign
          ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}cc)`
          : `${theme.colors.primary}20`
        : isSovereign ? theme.colors.surfaceContainerHigh : 'rgba(255,255,255,0.05)',
      color: primary
        ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
        : theme.colors.onSurface,
      border: `1px solid ${primary ? theme.colors.primary : theme.colors.outlineVariant}`,
      boxShadow: primary && !isSovereign ? `0 0 16px ${theme.colors.primary}44` : 'none',
    }}
  >
    {label}
  </motion.button>
);
