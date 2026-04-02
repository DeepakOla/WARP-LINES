import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Theme, ThemeType } from '../types/theme';
import { themes } from '../styles/themes';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('warp-lines-theme');
    return (saved as ThemeType) || 'sovereign';
  });

  const theme = themes[themeType];

  useEffect(() => {
    localStorage.setItem('warp-lines-theme', themeType);

    // Apply theme colors to CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--color-${cssVar}`, value);
    });

    // Apply fonts
    root.style.setProperty('--font-display', theme.fonts.display);
    root.style.setProperty('--font-body', theme.fonts.body);

    // Apply effects
    root.style.setProperty('--glass-blur', `${theme.effects.glassBlur}px`);
    root.style.setProperty('--glass-opacity', `${theme.effects.glassOpacity}`);
    root.style.setProperty('--shadow-color', theme.effects.shadowColor);
    root.style.setProperty('--shadow-opacity', `${theme.effects.shadowOpacity}`);
    root.style.setProperty('--shadow-blur', `${theme.effects.shadowBlur}px`);

    // Apply theme class to body
    document.body.className = `theme-${themeType}`;
  }, [theme, themeType]);

  const toggleTheme = () => {
    setThemeType(prev => prev === 'sovereign' ? 'cyber' : 'sovereign');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
