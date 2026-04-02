# WARP LINES - Centralized Theme System

A dual-theme 3D game board application with a sophisticated centralized theme system.

## Features

### 🎨 Dual Theme System

#### 1. Sovereign Aesthetic - "The Digital Atelier"
- **Philosophy**: High-art luxury, editorial pacing, intentional asymmetry
- **Colors**:
  - Primary: Rose Gold (#8a4853)
  - Secondary: Gunmetal (#5f5e5e)
  - Surface: White Marble (#f9f9f9)
- **Typography**: Noto Serif (display) + Manrope (body)
- **Effects**: Subtle whisper shadows, marble textures, glassmorphism

#### 2. Cyber Tech - "Digital Neon Grid"
- **Philosophy**: Futuristic 3D, neon aesthetics, grid-based design
- **Colors**:
  - Primary: Cyan Neon (#00ffff)
  - Secondary: Magenta Neon (#ff00ff)
  - Surface: Deep Black (#0a0a0a)
- **Typography**: Orbitron/Rajdhani
- **Effects**: Neon glows, scanlines, holographic effects, animated grid

### 🎮 3D Effects Throughout

- **3D Board**: Interactive board with mouse-tracking rotation
- **Depth Layers**: Multiple z-axis layers for visual depth
- **Hover Effects**: 3D transformations on interaction
- **Parallax**: Dynamic perspective based on mouse movement
- **Floating Elements**: Animated info cards with 3D positioning

### 🔄 Theme Switcher

- Floating theme selector in top-right corner
- Live preview of both themes
- Smooth transitions between themes
- Persistent theme selection (localStorage)
- Instant application-wide theme changes

## Architecture

### Centralized Theme System

```
src/
├── contexts/
│   └── ThemeContext.tsx      # Central theme provider & state management
├── styles/
│   ├── themes.ts              # Theme definitions (Sovereign & Cyber)
│   ├── global.css             # Global styles & 3D effects
│   └── tailwind.css           # Tailwind CSS import
├── types/
│   └── theme.ts               # TypeScript theme interfaces
└── components/
    ├── ThemeSwitcher.tsx      # Theme selection UI
    └── GameBoard.tsx          # 3D game board component
```

### How It Works

1. **ThemeContext**: Central source of truth for theme state
   - Manages current theme selection
   - Provides theme switching functionality
   - Persists theme choice to localStorage
   - Injects CSS variables dynamically

2. **CSS Variables**: Themes applied via CSS custom properties
   - All colors mapped to `--color-*` variables
   - Font families as `--font-display` and `--font-body`
   - Effect values (blur, opacity, shadows) as variables
   - Enables instant theme switching without rerender

3. **Theme-Specific Styles**:
   - Body classes: `theme-sovereign` and `theme-cyber`
   - Conditional styling based on active theme
   - 3D effects optimized per theme aesthetic

## Usage

### Using the Theme in Components

```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, themeType, toggleTheme } = useTheme();

  return (
    <div style={{ color: theme.colors.primary }}>
      Current theme: {theme.name}
    </div>
  );
};
```

### CSS Variables in Styles

```css
.my-element {
  background: var(--color-surface);
  color: var(--color-on-surface);
  box-shadow: 0 0 var(--shadow-blur) var(--shadow-color);
}
```

### Theme-Specific Styling

```css
/* Applies only in Sovereign theme */
.theme-sovereign .my-element {
  border: 1px solid #e2e2e2;
}

/* Applies only in Cyber theme */
.theme-cyber .my-element {
  border: 1px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}
```

## 3D Effects Library

### Available Classes

- `.preserve-3d` - Enable 3D transform space
- `.perspective` - Add perspective (1000px)
- `.perspective-extreme` - Extreme perspective (2000px)
- `.glass-effect` - Glassmorphism with theme-aware styling
- `.card-3d` - 3D card with hover lift effect
- `.float-animation` - Floating animation
- `.tilt-3d` - 3D tilt on hover
- `.holographic` - Holographic gradient effect

### Cyber Theme Specific

- `.glow-cyan` - Cyan neon glow
- `.glow-magenta` - Magenta neon glow
- `.text-glow-cyan` - Cyan text glow
- `.text-glow-magenta` - Magenta text glow
- `.scanline` - CRT scanline effect
- `.neon-border` - Animated neon border

## Development

### Running the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Type Checking

```bash
npm run lint
```

## Design Principles

### Sovereign Aesthetic
1. **No-Line Rule**: Use background color shifts instead of borders
2. **Whitespace as Luxury**: Generous spacing using 2.75rem+ tokens
3. **Asymmetry**: Intentional imbalance for editorial feel
4. **Material Hierarchy**: Layered surfaces with subtle elevation
5. **Typography Scale**: Large display text for impact

### Cyber Tech
1. **Neon Hierarchy**: Primary (cyan) for action, secondary (magenta) for emphasis
2. **Grid Foundation**: Visible grid patterns throughout
3. **Glow Effects**: Multiple shadow layers for neon effect
4. **Scanlines**: Retro-future CRT aesthetic
5. **High Contrast**: Deep blacks with bright neon accents

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS 4** - Utility-first CSS
- **Motion** (Framer Motion) - Advanced animations
- **Lucide React** - Icon system

## Theme Extension

To add a new theme:

1. Define theme in `src/styles/themes.ts`:
```tsx
export const myTheme: Theme = {
  name: 'My Theme',
  type: 'mytheme',
  colors: { /* ... */ },
  fonts: { /* ... */ },
  effects: { /* ... */ }
};
```

2. Add to themes object and update `ThemeType` in `src/types/theme.ts`

3. Add theme-specific styles in `src/styles/global.css`:
```css
body.theme-mytheme {
  /* custom styles */
}
```

4. Update theme switcher in `src/components/ThemeSwitcher.tsx`

## Browser Support

- Modern browsers with CSS Grid support
- CSS Custom Properties (CSS Variables)
- 3D Transforms
- Backdrop Filter (for glassmorphism)

## License

See repository license file.
