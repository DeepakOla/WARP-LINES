export type ThemeType = 'sovereign' | 'cyber';

export interface ThemeColors {
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  surface: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  background: string;
}

export interface Theme {
  name: string;
  type: ThemeType;
  colors: ThemeColors;
  fonts: {
    display: string;
    body: string;
  };
  effects: {
    glassBlur: number;
    glassOpacity: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowBlur: number;
  };
}
