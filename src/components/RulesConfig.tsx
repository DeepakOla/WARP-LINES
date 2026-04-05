import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { BOARD_CONFIG_LIST, TIME_LIMIT_OPTIONS } from '../config/gameConfig';
import type { RulesConfig } from '../types/game';

interface Props {
  rulesConfig: RulesConfig;
  onChange: (config: RulesConfig) => void;
  showBoardSelector?: boolean;
}

export const RulesConfigPanel: React.FC<Props> = ({ rulesConfig, onChange, showBoardSelector }) => {
  const { theme, themeType } = useTheme();
  const { selectedBoardConfig, setBoardConfig } = useGame();
  const isSovereign = themeType === 'sovereign';

  const toggle = (key: keyof RulesConfig, val: unknown) =>
    onChange({ ...rulesConfig, [key]: val });

  const surface = isSovereign ? theme.colors.surfaceContainerLow : '#111';
  const border = isSovereign ? theme.colors.outlineVariant : '#1e3a3a';

  return (
    <div className="space-y-4">
      {showBoardSelector && (
        <Row label="Board Size" theme={theme}>
          <div className="flex gap-2">
            {BOARD_CONFIG_LIST.map(cfg => (
              <button
                key={cfg.id}
                onClick={() => setBoardConfig(cfg)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: selectedBoardConfig.id === cfg.id
                    ? isSovereign ? theme.colors.primary : `${theme.colors.primary}22`
                    : surface,
                  color: selectedBoardConfig.id === cfg.id
                    ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                  border: `1px solid ${selectedBoardConfig.id === cfg.id ? theme.colors.primary : border}`,
                  fontFamily: theme.fonts.body,
                }}
              >
                {cfg.nodeCount}N
              </button>
            ))}
          </div>
        </Row>
      )}

      <Row label="Mandatory Captures" theme={theme}>
        <button
          onClick={() => toggle('mandatoryCaptures', !rulesConfig.mandatoryCaptures)}
          className="relative w-12 h-6 rounded-full transition-all"
          style={{
            background: rulesConfig.mandatoryCaptures
              ? isSovereign ? theme.colors.primary : `${theme.colors.primary}66`
              : '#444',
          }}
        >
          <span
            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: rulesConfig.mandatoryCaptures ? '26px' : '4px' }}
          />
        </button>
      </Row>

      <Row label="Turn Timer" theme={theme}>
        <div className="flex gap-2 flex-wrap">
          {TIME_LIMIT_OPTIONS.map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => toggle('turnTimeLimit', opt.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: rulesConfig.turnTimeLimit === opt.value
                  ? isSovereign ? theme.colors.primary : `${theme.colors.primary}22`
                  : surface,
                color: rulesConfig.turnTimeLimit === opt.value
                  ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
                  : theme.colors.onSurfaceVariant,
                border: `1px solid ${rulesConfig.turnTimeLimit === opt.value ? theme.colors.primary : border}`,
                fontFamily: theme.fonts.body,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Row>

      <Row label="Infiltrators" theme={theme}>
        <div className="flex gap-2">
          {([0, 1, 2] as const).map(n => (
            <button
              key={n}
              onClick={() => toggle('infiltrators', n)}
              className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
              style={{
                background: rulesConfig.infiltrators === n
                  ? isSovereign ? theme.colors.primary : `${theme.colors.primary}22`
                  : surface,
                color: rulesConfig.infiltrators === n
                  ? isSovereign ? theme.colors.onPrimary : theme.colors.primary
                  : theme.colors.onSurfaceVariant,
                border: `1px solid ${rulesConfig.infiltrators === n ? theme.colors.primary : border}`,
                fontFamily: theme.fonts.body,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </Row>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  theme: { colors: { onSurface: string }; fonts: { body: string } };
  children: React.ReactNode;
}> = ({ label, children, theme }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium" style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}>
      {label}
    </span>
    {children}
  </div>
);
