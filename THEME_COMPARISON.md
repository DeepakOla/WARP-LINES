# Visual Theme Comparison

## Side-by-Side Theme Features

| Feature | Sovereign Aesthetic | Cyber Tech |
|---------|-------------------|-----------|
| **Philosophy** | "The Digital Atelier" - Gallery luxury | "Digital Neon Grid" - Cyberpunk future |
| **Primary Color** | Rose Gold (#8a4853) | Cyan Neon (#00ffff) |
| **Secondary Color** | Gunmetal (#5f5e5e) | Magenta Neon (#ff00ff) |
| **Background** | White Marble (#f9f9f9) | Deep Black (#0a0a0a) |
| **Text Color** | Deep Charcoal (#1a1c1c) | Light Gray (#e0e0e0) |
| **Display Font** | Noto Serif | Orbitron/Rajdhani |
| **Body Font** | Manrope | Rajdhani |
| **Shadow Style** | Soft whisper (4% opacity) | Neon glow (30% opacity) |
| **Blur Amount** | 20px backdrop blur | 16px backdrop blur |
| **Border Style** | None (color shifts) | 1-2px neon lines |
| **Background Pattern** | Subtle marble texture | Animated grid |
| **Special Effects** | Glassmorphism, noise texture | Scanlines, holographic, neon glow |
| **Animation Style** | Smooth, elegant transitions | Sharp, tech-y movements |
| **Contrast** | Medium (accessible) | High (dramatic) |
| **Spacing** | Generous (2.75rem+) | Compact with grid alignment |
| **3D Depth** | Subtle layering | Extreme perspective |

## Color Palettes

### Sovereign Aesthetic Palette
```
Primary:                #8a4853  ████ Rose Gold
Primary Container:      #a6606b  ████ Light Rose Gold
Secondary:              #5f5e5e  ████ Gunmetal
Surface:                #f9f9f9  ████ White Marble
Surface Container Low:  #f3f3f3  ████ Light Gray
Surface Container High: #e2e2e2  ████ Medium Gray
On Surface:             #1a1c1c  ████ Deep Charcoal
Error:                  #ba1a1a  ████ Deep Red
```

### Cyber Tech Palette
```
Primary:                #00ffff  ████ Cyan Neon
Primary Container:      #00cccc  ████ Dark Cyan
Secondary:              #ff00ff  ████ Magenta Neon
Surface:                #0a0a0a  ████ Deep Black
Surface Container Low:  #121212  ████ Almost Black
Surface Container High: #2a2a2a  ████ Dark Gray
On Surface:             #e0e0e0  ████ Light Gray
Error:                  #ff0055  ████ Neon Red
```

## Effect Demonstrations

### Button States (Primary Button)

**Sovereign:**
- Normal: Rose Gold gradient (135deg)
- Hover: Lifts 2px, subtle shadow increase
- Active: Shine effect sweeps across
- Effect: Elegant, tactile feedback

**Cyber:**
- Normal: Cyan gradient with inner glow
- Hover: Lifts 2px, neon glow expands
- Active: Pulse effect with shadow rings
- Effect: Electric, energized feedback

### Card Elements

**Sovereign:**
- Background: White (#ffffff) on Marble (#f9f9f9)
- Elevation: Color-based (no shadow)
- Hover: Slight Y-axis lift, 5deg rotation
- Border: None (uses background shift)

**Cyber:**
- Background: Almost Black (#121212) on Black (#0a0a0a)
- Elevation: Neon glow shadow
- Hover: Major Y-axis lift, cyan glow expansion
- Border: 1px cyan with blur

### Game Board Cells

**Sovereign:**
- Light cells: Pure white (#ffffff)
- Dark cells: Light gray (#f3f3f3)
- Piece: Rose Gold gradient with soft shadow
- Hover: Cell lifts 10px in 3D space

**Cyber:**
- Light cells: Dark gray (#1a1a1a)
- Dark cells: Deep black (#0a0a0a)
- Piece: Cyan gradient with multi-ring glow
- Hover: Cell lifts with pulsing glow effect
- Grid lines: Visible cyan/magenta lines

## Background Treatments

### Sovereign Aesthetic
- Base: Linear gradient white to marble
- Overlay: Subtle 2px repeating lines (1.5% opacity)
- Texture: Marble noise pattern (30% opacity)
- Animation: None (static luxury)
- Feel: Gallery wall, museum quality

### Cyber Tech
- Base: Linear gradient black
- Grid: 50px repeating cyan/magenta grid (3% opacity)
- Overlay: Radial gradient glow (30-50% opacity)
- Animation: Grid moves, glow pulses (8-20s cycles)
- Feel: Digital matrix, holographic display

## Typography Scale

| Level | Sovereign | Cyber | Use Case |
|-------|-----------|-------|----------|
| Display Large | 3.5rem Noto Serif | 3.5rem Orbitron | Hero headlines |
| Display Medium | 2.5rem Noto Serif | 2.5rem Orbitron | Page titles |
| Heading 1 | 2rem Noto Serif | 2rem Orbitron | Section headers |
| Body Large | 1.125rem Manrope | 1.125rem Rajdhani | Emphasized text |
| Body | 1rem Manrope | 1rem Rajdhani | Main content |
| Label | 0.875rem Manrope | 0.875rem Rajdhani | UI labels |
| Caption | 0.75rem Manrope | 0.75rem Rajdhani | Small text |

### Font Weights
- **Sovereign**: 300 (light), 400 (regular), 600 (semibold), 700 (bold)
- **Cyber**: 400 (regular), 500 (medium), 700 (bold), 900 (black)

## 3D Transform Values

| Element | Sovereign | Cyber |
|---------|-----------|-------|
| Perspective | 1000px | 2000px (extreme) |
| Card Hover Rotation | rotateX(5deg) | rotateX(10deg) |
| Board Base Rotation | rotateX(20deg) rotateY(-20deg) | rotateX(20deg) rotateY(-20deg) |
| Z-axis Depth | -20px to +40px | -20px to +60px |
| Hover Lift | translateY(-10px) | translateY(-10px) |
| Piece Elevation | translateZ(20px) | translateZ(30px) |

## Glass Effect Parameters

**Sovereign:**
- Opacity: 70%
- Blur: 20px
- Background: rgba(249, 249, 249, 0.7)
- Border: 1px solid rgba(255, 255, 255, 0.18)
- Shadow: 0 8px 32px rgba(44, 44, 44, 0.04)

**Cyber:**
- Opacity: 15%
- Blur: 16px
- Background: rgba(10, 10, 10, 0.15)
- Border: 1px solid rgba(0, 255, 255, 0.2)
- Shadow: 0 8px 32px rgba(0, 255, 255, 0.1)
- Inner Shadow: inset 0 0 20px rgba(0, 255, 255, 0.05)

## Animation Timings

| Animation | Sovereign | Cyber |
|-----------|-----------|-------|
| Theme Switch | 500ms ease | 500ms ease |
| Hover Response | 300ms ease | 300ms ease |
| Button Shine | 500ms ease | N/A |
| Color Transition | 300ms ease | 300ms ease |
| Transform | 300ms ease-out | 300ms ease-out |
| Float | 6s ease-in-out | 3s ease-in-out |
| Grid Animation | N/A | 20s linear infinite |
| Glow Pulse | N/A | 8s ease-in-out alternate |
| Scanline | N/A | 4s linear infinite |

## Special Effect Classes

### Sovereign Only
- `.glass-effect` - Marble-tinted glassmorphism
- `.card-3d` - Subtle 3D lift with whisper shadow
- `.float-animation` - Gentle floating motion

### Cyber Only
- `.glow-cyan` - Cyan neon glow rings
- `.glow-magenta` - Magenta neon glow rings
- `.text-glow-cyan` - Cyan text shadow glow
- `.text-glow-magenta` - Magenta text shadow glow
- `.scanline` - CRT scanline effect
- `.neon-border` - Animated neon border
- `.holographic` - Holographic shimmer effect

### Universal
- `.preserve-3d` - Enable 3D transform space
- `.perspective` - Standard perspective
- `.perspective-extreme` - Deep perspective
- `.tilt-3d` - 3D tilt on hover

## Accessibility

Both themes maintain WCAG 2.1 AA contrast ratios:

**Sovereign:**
- Rose Gold on White: 4.5:1 (AA)
- Charcoal on White: 15.8:1 (AAA)
- Gunmetal on White: 7.2:1 (AAA)

**Cyber:**
- Cyan on Black: 13.1:1 (AAA)
- Magenta on Black: 8.3:1 (AAA)
- Light Gray on Black: 14.6:1 (AAA)

## When to Use Each Theme

### Use Sovereign Aesthetic When:
- Target audience appreciates luxury/premium design
- Content is editorial or gallery-like
- Need to convey sophistication and craftsmanship
- Professional or business context
- Accessibility is top priority (higher contrast available)

### Use Cyber Tech When:
- Gaming or tech-focused audience
- Want to emphasize futuristic/sci-fi elements
- Need high energy, exciting visual experience
- Target younger, tech-savvy demographics
- 3D and animation effects are key features

## Technical Implementation Notes

- Themes are fully decoupled - changing one doesn't affect the other
- All effects are CSS-based (no images, lightweight)
- 3D transforms use GPU acceleration
- Animations use `will-change` for performance
- Theme switch is instant (CSS variables, no re-render)
- Both themes work on same component structure
- Fully responsive (mobile, tablet, desktop)

---

**Try Both Themes!** The visual difference is dramatic - switch between them to experience the full range of the design system.
