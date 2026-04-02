import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { GameBoard } from './components/GameBoard';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <ThemeSwitcher />
        <GameBoard />
      </div>
    </ThemeProvider>
  );
};

export default App;
