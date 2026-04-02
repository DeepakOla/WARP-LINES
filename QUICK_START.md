# Quick Start Guide: Theme System

## Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
```

## Using the Theme Switcher

1. **Theme Switcher Button**: Located in the top-right corner (grid icon)
2. **Click to Open**: View both available themes
3. **Select a Theme**: Click on either:
   - **Sovereign Aesthetic** - Luxury, high-art design
   - **Cyber Tech** - Futuristic neon 3D design
4. **Instant Switch**: Theme applies immediately across the entire website
5. **Persistence**: Your choice is saved and will be remembered on next visit

## Theme Descriptions

### Sovereign Aesthetic ("The Digital Atelier")
- **Visual Style**: Elegant, minimalist, luxury gallery aesthetic
- **Colors**:
  - Rose Gold (#8a4853) for primary actions
  - Gunmetal (#5f5e5e) for structure
  - White Marble (#f9f9f9) for surfaces
  - Deep Charcoal (#1a1c1c) for text
- **Typography**: Noto Serif for headings, Manrope for body
- **Effects**: Subtle whisper shadows, marble texture overlay, soft glassmorphism
- **Philosophy**: Whitespace as luxury, asymmetrical layouts, editorial pacing

### Cyber Tech ("Digital Neon Grid")
- **Visual Style**: Futuristic, high-tech, neon-lit cyberpunk
- **Colors**:
  - Cyan Neon (#00ffff) for primary
  - Magenta Neon (#ff00ff) for secondary
  - Deep Black (#0a0a0a) for surfaces
  - Light Gray (#e0e0e0) for text
- **Typography**: Orbitron/Rajdhani for futuristic feel
- **Effects**: Neon glows, animated grid background, scanlines, holographic shimmer
- **Philosophy**: High contrast, visible grids, CRT aesthetic, maximum 3D depth

## 3D Interactive Features

### Game Board
- **Mouse Tracking**: Board rotates based on mouse position
- **3D Depth**: Multiple z-axis layers create true 3D effect
- **Hover Effects**: Cells lift and glow on hover
- **Floating Cards**: Player info cards float in 3D space
- **Perspective**: Extreme perspective for dramatic depth

### UI Elements
- **Glass Effect**: Theme-aware glassmorphism on overlays
- **3D Cards**: Hover to see cards lift with shadow changes
- **Animated Pieces**: Game pieces rotate when placed
- **Smooth Transitions**: All theme changes animate smoothly

## Customization

### Adding Custom Colors
Edit `src/styles/themes.ts` to modify theme colors:

```typescript
export const sovereignTheme: Theme = {
  colors: {
    primary: '#8a4853', // Change this
    // ... other colors
  }
};
```

### Modifying 3D Effects
Edit `src/styles/global.css` to adjust 3D parameters:

```css
.perspective {
  perspective: 1000px; /* Adjust depth */
}

.theme-cyber .glow-cyan {
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); /* Adjust glow */
}
```

### Theme-Specific Styles
Add custom styles based on active theme:

```css
/* Only in Sovereign theme */
.theme-sovereign .my-element {
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
}

/* Only in Cyber theme */
.theme-cyber .my-element {
  background: #0a0a0a;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}
```

## File Structure

```
src/
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
├── components/
│   ├── GameBoard.tsx         # 3D interactive game board
│   └── ThemeSwitcher.tsx     # Theme selection UI
├── contexts/
│   └── ThemeContext.tsx      # Central theme state management
├── styles/
│   ├── global.css            # All global styles and 3D effects
│   ├── tailwind.css          # Tailwind import
│   └── themes.ts             # Theme definitions
└── types/
    └── theme.ts              # TypeScript type definitions
```

## Keyboard Shortcuts

Currently, theme switching is via UI only. To add keyboard shortcut:

1. Add event listener in `ThemeContext.tsx`
2. Listen for key combination (e.g., Ctrl+T)
3. Call `toggleTheme()` function

## Browser Requirements

- Modern browser with CSS Grid support
- CSS Custom Properties (variables)
- 3D Transforms support
- Backdrop Filter support (for glassmorphism)
- ES2022+ JavaScript

Recommended: Chrome, Firefox, Safari, Edge (latest versions)

## Performance Notes

- 3D transforms use GPU acceleration
- Theme switching is instant (CSS variables)
- Animations use `will-change` for smooth performance
- localStorage used for persistence (very fast)

## Troubleshooting

**Theme doesn't switch:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Refresh the page

**3D effects not working:**
- Update to latest browser
- Check if hardware acceleration is enabled
- Disable browser extensions that might interfere

**Build fails:**
- Run `npm install` to ensure all dependencies
- Check Node.js version (18+ recommended)
- Clear build cache: `npm run clean`

## Next Steps

1. **Add More Themes**: Follow pattern in `themes.ts`
2. **Customize Board**: Edit `GameBoard.tsx` for different layouts
3. **Add Game Logic**: Implement actual game rules
4. **Multiplayer**: Integrate Firebase from config files
5. **Mobile Responsive**: Add touch controls and responsive breakpoints

## Resources

- Full documentation: See `THEME_SYSTEM.md`
- React docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Motion (Framer Motion): https://motion.dev

---

**Tip**: Start by exploring both themes to see the dramatic difference in visual styles!
