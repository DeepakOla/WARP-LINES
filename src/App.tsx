import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { MainMenu } from './components/MainMenu';
import { ModeSelector } from './components/ModeSelector';
import { GameBoard } from './components/GameBoard';
import { CampaignMap } from './components/CampaignMap';
import './styles/global.css';

const AppContent: React.FC = () => {
  const { screen } = useGame();

  switch (screen) {
    case 'MENU':         return <MainMenu />;
    case 'MODE_SELECT':  return <ModeSelector />;
    case 'CAMPAIGN_MAP': return <CampaignMap />;
    case 'GAME':         return <GameBoard />;
    default:             return <MainMenu />;
  }
};

const App: React.FC = () => (
  <ThemeProvider>
    <GameProvider>
      <AppContent />
    </GameProvider>
  </ThemeProvider>
);

export default App;
