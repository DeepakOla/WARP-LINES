import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useGame } from '../contexts/GameContext';

export const MainMenu: React.FC = () => {
  const { theme, themeType } = useTheme();
  const { navigateTo } = useGame();

  const isSovereign = themeType === 'sovereign';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: theme.colors.background }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isSovereign ? (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{ background: theme.colors.primary, transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{ background: theme.colors.secondary, transform: 'translate(-30%, 30%)' }} />
          </>
        ) : (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: 2,
                  height: 2,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                  opacity: 0.6,
                }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }} />
          </>
        )}
      </div>

      <ThemeSwitcher />

      <motion.div
        className="relative z-10 text-center px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <motion.div
          animate={isSovereign ? {} : { textShadow: ['0 0 20px #00ffff', '0 0 40px #00ffff', '0 0 20px #00ffff'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h1
            className="text-6xl md:text-8xl font-bold mb-2"
            style={{
              fontFamily: theme.fonts.display,
              color: isSovereign ? theme.colors.onSurface : theme.colors.primary,
              letterSpacing: isSovereign ? '0.05em' : '0.15em',
            }}
          >
            WARP LINES
          </h1>
          <p
            className="text-lg md:text-xl mb-2"
            style={{
              fontFamily: theme.fonts.body,
              color: theme.colors.primary,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            The Sovereign Warp
          </p>
        </motion.div>

        <p
          className="text-base mb-12 opacity-60"
          style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}
        >
          A strategic board game of warp lines and captures
        </p>

        {/* Mode buttons */}
        <div className="flex flex-col gap-4 items-center">
          <MenuButton
            label="⚔  Play Now"
            primary
            onClick={() => navigateTo('MODE_SELECT')}
          />
          <MenuButton
            label="🗺  Campaign"
            onClick={() => navigateTo('CAMPAIGN_MAP')}
          />
        </div>

        {/* Tagline */}
        <p
          className="mt-12 text-xs opacity-40"
          style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body, letterSpacing: '0.2em' }}
        >
          LOCAL · SOLO · CAMPAIGN
        </p>
      </motion.div>
    </div>
  );
};

interface MenuButtonProps {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, onClick, primary }) => {
  const { theme, themeType } = useTheme();
  const isSovereign = themeType === 'sovereign';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="w-64 py-4 px-8 rounded-xl text-base font-semibold transition-all"
      style={{
        fontFamily: theme.fonts.body,
        background: primary
          ? isSovereign
            ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryContainer})`
            : `linear-gradient(135deg, ${theme.colors.primary}22, ${theme.colors.primary}44)`
          : isSovereign
            ? theme.colors.surfaceContainer
            : 'rgba(255,255,255,0.05)',
        color: primary
          ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
          : theme.colors.onSurface,
        border: `1px solid ${primary ? theme.colors.primary : theme.colors.outlineVariant}`,
        boxShadow: primary && !isSovereign
          ? `0 0 20px ${theme.colors.primary}44`
          : 'none',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </motion.button>
  );
};
