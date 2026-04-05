import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { BOARD_CONFIG_LIST, AI_DIFFICULTY_LABELS, TIME_LIMIT_OPTIONS } from '../config/gameConfig';
import type { GameMode, AIDifficulty } from '../types/game';
import { ChevronLeft } from 'lucide-react';

const MODES: Array<{ id: GameMode; label: string; desc: string; icon: string }> = [
  { id: 'LOCAL', label: 'Local 2P', desc: 'Two players, same device', icon: '👥' },
  { id: 'SOLO', label: 'vs AI', desc: 'Play against the computer', icon: '🤖' },
];

export const ModeSelector: React.FC = () => {
  const { theme, themeType } = useTheme();
  const {
    selectedMode, setMode,
    selectedDifficulty, setDifficulty,
    selectedBoardConfig, setBoardConfig,
    selectedRulesConfig, setRulesConfig,
    startGame, navigateTo,
  } = useGame();

  const isSovereign = themeType === 'sovereign';

  const surface = isSovereign ? theme.colors.surfaceContainerLow : '#111';
  const card = isSovereign ? theme.colors.surfaceContainer : '#161616';
  const border = isSovereign ? theme.colors.outlineVariant : '#1e3a3a';

  const toggle = (key: keyof typeof selectedRulesConfig, val: unknown) =>
    setRulesConfig({ ...selectedRulesConfig, [key]: val });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-10 px-4"
      style={{ background: theme.colors.background }}
    >
      {/* Header */}
      <div className="w-full max-w-lg mb-8 flex items-center gap-3">
        <button
          onClick={() => navigateTo('MENU')}
          className="p-2 rounded-lg transition-all hover:opacity-70"
          style={{ color: theme.colors.onSurface }}
        >
          <ChevronLeft size={22} />
        </button>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: theme.fonts.display, color: theme.colors.onSurface }}
        >
          New Game
        </h2>
      </div>

      <div className="w-full max-w-lg space-y-6">

        {/* Mode selection */}
        <Section title="Mode" surface={surface} border={border} theme={theme}>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map(m => (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  background: selectedMode === m.id
                    ? isSovereign
                      ? `${theme.colors.primary}18`
                      : `${theme.colors.primary}15`
                    : card,
                  border: `1.5px solid ${selectedMode === m.id ? theme.colors.primary : border}`,
                  color: theme.colors.onSurface,
                  boxShadow: selectedMode === m.id && !isSovereign
                    ? `0 0 12px ${theme.colors.primary}33` : 'none',
                }}
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="font-semibold text-sm" style={{ fontFamily: theme.fonts.body }}>{m.label}</div>
                <div className="text-xs opacity-60 mt-1">{m.desc}</div>
              </motion.button>
            ))}
          </div>
        </Section>

        {/* AI Difficulty */}
        {selectedMode === 'SOLO' && (
          <Section title="AI Difficulty" surface={surface} border={border} theme={theme}>
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as AIDifficulty[]).map(d => (
                <motion.button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 rounded-lg text-xs font-semibold text-center"
                  style={{
                    background: selectedDifficulty === d
                      ? isSovereign ? theme.colors.primary : `${theme.colors.primary}25`
                      : card,
                    color: selectedDifficulty === d
                      ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
                      : theme.colors.onSurfaceVariant,
                    border: `1.5px solid ${selectedDifficulty === d ? theme.colors.primary : border}`,
                    boxShadow: selectedDifficulty === d && !isSovereign
                      ? `0 0 10px ${theme.colors.primary}44` : 'none',
                    fontFamily: theme.fonts.body,
                  }}
                >
                  <div className="text-base mb-0.5">{d}</div>
                  <div className="opacity-80">{AI_DIFFICULTY_LABELS[d].slice(0, 5)}</div>
                </motion.button>
              ))}
            </div>
          </Section>
        )}

        {/* Board size */}
        <Section title="Board Size" surface={surface} border={border} theme={theme}>
          <div className="space-y-2">
            {BOARD_CONFIG_LIST.map(cfg => (
              <motion.button
                key={cfg.id}
                onClick={() => setBoardConfig(cfg)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl text-left flex items-center gap-4 transition-all"
                style={{
                  background: selectedBoardConfig.id === cfg.id
                    ? isSovereign ? `${theme.colors.primary}14` : `${theme.colors.primary}12`
                    : card,
                  border: `1.5px solid ${selectedBoardConfig.id === cfg.id ? theme.colors.primary : border}`,
                  color: theme.colors.onSurface,
                  fontFamily: theme.fonts.body,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: selectedBoardConfig.id === cfg.id ? theme.colors.primary : border,
                    color: selectedBoardConfig.id === cfg.id ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                  }}
                >
                  {cfg.nodeCount}
                </div>
                <div>
                  <div className="font-semibold text-sm">{cfg.id} Board</div>
                  <div className="text-xs opacity-60">{cfg.nodeCount} nodes · Rows: {cfg.rows.join('-')}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Rules */}
        <Section title="Rules" surface={surface} border={border} theme={theme}>
          <div className="space-y-3">
            {/* Mandatory captures */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
                  Mandatory Captures
                </div>
                <div className="text-xs opacity-50">Must capture if available</div>
              </div>
              <Toggle
                value={selectedRulesConfig.mandatoryCaptures}
                onChange={v => toggle('mandatoryCaptures', v)}
                theme={theme}
                isSovereign={isSovereign}
              />
            </div>

            {/* Time limit */}
            <div>
              <div className="text-sm font-medium mb-2" style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
                Turn Timer
              </div>
              <div className="flex gap-2 flex-wrap">
                {TIME_LIMIT_OPTIONS.map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => toggle('turnTimeLimit', opt.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: selectedRulesConfig.turnTimeLimit === opt.value
                        ? isSovereign ? theme.colors.primary : `${theme.colors.primary}22`
                        : card,
                      color: selectedRulesConfig.turnTimeLimit === opt.value
                        ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                      border: `1px solid ${selectedRulesConfig.turnTimeLimit === opt.value ? theme.colors.primary : border}`,
                      fontFamily: theme.fonts.body,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Start */}
        <motion.button
          onClick={() => startGame()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all"
          style={{
            fontFamily: theme.fonts.display,
            background: isSovereign
              ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryContainer})`
              : `linear-gradient(135deg, ${theme.colors.primary}22, ${theme.colors.primary}44)`,
            color: isSovereign ? theme.colors.onPrimary : theme.colors.primary,
            border: `1.5px solid ${theme.colors.primary}`,
            boxShadow: !isSovereign ? `0 0 24px ${theme.colors.primary}44` : 'none',
            letterSpacing: '0.08em',
          }}
        >
          Start Game →
        </motion.button>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const Section: React.FC<{
  title: string;
  surface: string;
  border: string;
  theme: { fonts: { display: string; body: string }; colors: { onSurface: string } };
  children: React.ReactNode;
}> = ({ title, surface, border, theme, children }) => (
  <div
    className="rounded-2xl p-5"
    style={{ background: surface, border: `1px solid ${border}` }}
  >
    <h3
      className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-60"
      style={{ fontFamily: theme.fonts.body, color: theme.colors.onSurface }}
    >
      {title}
    </h3>
    {children}
  </div>
);

const Toggle: React.FC<{
  value: boolean;
  onChange: (v: boolean) => void;
  theme: { colors: { primary: string } };
  isSovereign: boolean;
}> = ({ value, onChange, theme, isSovereign }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-12 h-6 rounded-full transition-all"
    style={{
      background: value
        ? isSovereign ? theme.colors.primary : `${theme.colors.primary}66`
        : '#444',
      boxShadow: value && !isSovereign ? `0 0 10px ${theme.colors.primary}66` : 'none',
    }}
  >
    <span
      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
      style={{ left: value ? '26px' : '4px' }}
    />
  </button>
);
