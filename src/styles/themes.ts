import type { Theme } from '../types/theme';

// Sovereign Aesthetic Theme - "The Digital Atelier"
export const sovereignTheme: Theme = {
  name: 'Sovereign Aesthetic',
  type: 'sovereign',
  colors: {
    primary: '#8a4853', // Rose Gold
    primaryContainer: '#a6606b',
    onPrimary: '#ffffff',
    secondary: '#5f5e5e', // Gunmetal
    onSecondary: '#ffffff',
    surface: '#f9f9f9', // White Marble
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f3f3f3',
    surfaceContainer: '#eeeeee',
    surfaceContainerHigh: '#e8e8e8',
    surfaceContainerHighest: '#e2e2e2',
    onSurface: '#1a1c1c', // Deep Charcoal
    onSurfaceVariant: '#5f5e5e',
    outline: '#5f5e5e',
    outlineVariant: '#d0d0d0',
    error: '#ba1a1a',
    onError: '#ffffff',
    background: '#f9f9f9',
  },
  fonts: {
    display: '"Noto Serif", serif',
    body: '"Manrope", sans-serif',
  },
  effects: {
    glassBlur: 20,
    glassOpacity: 0.7,
    shadowColor: '#2c2c2c',
    shadowOpacity: 0.04,
    shadowBlur: 40,
  },
};

// Cyber Tech Theme - "Digital Neon Grid"
export const cyberTheme: Theme = {
  name: 'Cyber Tech',
  type: 'cyber',
  colors: {
    primary: '#00ffff', // Cyan Neon
    primaryContainer: '#00cccc',
    onPrimary: '#000000',
    secondary: '#ff00ff', // Magenta Neon
    onSecondary: '#000000',
    surface: '#0a0a0a', // Deep Black
    surfaceContainerLowest: '#000000',
    surfaceContainerLow: '#121212',
    surfaceContainer: '#1a1a1a',
    surfaceContainerHigh: '#222222',
    surfaceContainerHighest: '#2a2a2a',
    onSurface: '#e0e0e0', // Light Gray
    onSurfaceVariant: '#a0a0a0',
    outline: '#00ffff',
    outlineVariant: '#003333',
    error: '#ff0055',
    onError: '#ffffff',
    background: '#0a0a0a',
  },
  fonts: {
    display: '"Orbitron", "Rajdhani", sans-serif',
    body: '"Rajdhani", sans-serif',
  },
  effects: {
    glassBlur: 16,
    glassOpacity: 0.15,
    shadowColor: '#00ffff',
    shadowOpacity: 0.3,
    shadowBlur: 20,
  },
};

export const themes = {
  sovereign: sovereignTheme,
  cyber: cyberTheme,
};
