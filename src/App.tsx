import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { GameContainer } from './components/GameContainer';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <ThemeSwitcher />
        <GameContainer />
      </div>
    </ThemeProvider>
  );
};

export default App;
