import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider } from './contexts/GameContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { GameBoard } from './components/GameBoard';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <div className="min-h-screen">
          <ThemeSwitcher />
          <GameBoard />
        </div>
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
