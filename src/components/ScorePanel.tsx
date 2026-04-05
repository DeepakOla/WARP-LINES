import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { GameState } from '../types/game';

interface Props {
  gameState: GameState;
}

export const ScorePanel: React.FC<Props> = ({ gameState }) => {
  const { theme, themeType } = useTheme();
  const isSovereign = themeType === 'sovereign';

  const p1Pieces = gameState.pieces.filter(p => p.owner === 'player1');
  const p2Pieces = gameState.pieces.filter(p => p.owner === 'player2');

  const p1Color = isSovereign
    ? 'linear-gradient(135deg, #c4737e, #6a2e38)'
    : 'linear-gradient(135deg, #44ffff, #007a7a)';
  const p2Color = isSovereign
    ? 'linear-gradient(135deg, #888, #3a3a3a)'
    : 'linear-gradient(135deg, #ff55ff, #7a007a)';

  const glowP1 = !isSovereign ? '0 0 12px #00ffff88' : 'none';
  const glowP2 = !isSovereign ? '0 0 12px #ff00ff88' : 'none';

  const isP1Turn = gameState.currentPlayer === 'player1';
  const isP2Turn = gameState.currentPlayer === 'player2';

  const surface = isSovereign ? theme.colors.surfaceContainerLow : '#111';
  const border = isSovereign ? theme.colors.outlineVariant : '#1e3a3a';

  return (
    <div className="flex gap-3 w-full">
      {/* Player 1 */}
      <PlayerCard
        label="Player 1"
        pieceCount={p1Pieces.length}
        isActive={isP1Turn && gameState.status === 'PLAYING'}
        gradient={p1Color}
        glow={glowP1}
        surface={surface}
        border={border}
        theme={theme}
        isSovereign={isSovereign}
      />

      {/* Center info */}
      <div
        className="flex flex-col items-center justify-center px-3 py-2 rounded-xl flex-shrink-0"
        style={{ background: surface, border: `1px solid ${border}`, minWidth: 80 }}
      >
        <div
          className="text-xs opacity-50 mb-1"
          style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}
        >
          Move
        </div>
        <div
          className="text-xl font-bold"
          style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.display }}
        >
          {gameState.moveCount}
        </div>
        <div
          className="text-xs opacity-50 mt-1"
          style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}
        >
          {gameState.rulesConfig.mandatoryCaptures ? '⚡ Caps' : '·'}
        </div>
      </div>

      {/* Player 2 */}
      <PlayerCard
        label={
          (gameState.mode === 'SOLO' || gameState.mode === 'CAMPAIGN') ? 'AI' : 'Player 2'
        }
        pieceCount={p2Pieces.length}
        isActive={isP2Turn && gameState.status === 'PLAYING'}
        gradient={p2Color}
        glow={glowP2}
        surface={surface}
        border={border}
        theme={theme}
        isSovereign={isSovereign}
      />
    </div>
  );
};

interface PlayerCardProps {
  label: string;
  pieceCount: number;
  isActive: boolean;
  gradient: string;
  glow: string;
  surface: string;
  border: string;
  theme: { colors: { onSurface: string; primary: string }; fonts: { display: string; body: string } };
  isSovereign: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  label, pieceCount, isActive, gradient, glow, surface, border, theme, isSovereign,
}) => (
  <div
    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
    style={{
      background: isActive
        ? isSovereign ? `${theme.colors.primary}0d` : `${theme.colors.primary}10`
        : surface,
      border: `1.5px solid ${isActive ? theme.colors.primary : border}`,
      boxShadow: isActive ? (isSovereign ? 'none' : `0 0 14px ${theme.colors.primary}33`) : 'none',
    }}
  >
    <div
      className="w-9 h-9 rounded-full flex-shrink-0"
      style={{ background: gradient, boxShadow: isActive ? glow : 'none' }}
    />
    <div>
      <div
        className="text-xs font-semibold opacity-70"
        style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.body }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold"
        style={{ color: theme.colors.onSurface, fontFamily: theme.fonts.display }}
      >
        {pieceCount}
      </div>
    </div>
    {isActive && (
      <div
        className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          background: isSovereign ? theme.colors.primary : `${theme.colors.primary}22`,
          color: isSovereign ? '#fff' : theme.colors.primary,
          fontFamily: theme.fonts.body,
        }}
      >
        ▶ Turn
      </div>
    )}
  </div>
);
