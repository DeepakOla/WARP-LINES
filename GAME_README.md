# WARP BOARD - Strategic Board Game

<div align="center">

![Warp Board Banner](https://img.shields.io/badge/Game-Warp%20Board-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A strategic board game variant of Alquerque/Checkers played on a node-based grid with diagonal connections.**

[Play Now](#quick-start) · [Features](#features) · [How to Play](#how-to-play) · [Development](#development)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Quick Start](#quick-start)
- [How to Play](#how-to-play)
- [Game Modes](#game-modes)
- [Development](#development)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎮 About

**Warp Board** is a modern web-based implementation of an abstract strategy board game inspired by Alquerque and Checkers. The game features:

- **Node-based board**: Pieces move along connections between nodes (intersections)
- **Strategic captures**: Jump over enemy pieces to capture them
- **AI opponent**: Play against an intelligent AI using Minimax algorithm with Alpha-Beta pruning
- **Campaign mode**: Progress through 7 levels of increasing difficulty
- **Beautiful themes**: Switch between Sovereign Aesthetic and Cyber Tech themes
- **Smooth animations**: Powered by Framer Motion for fluid gameplay

---

## ✨ Features

### 🎯 Core Gameplay
- ✅ **Node-based movement** - Move pieces along connected paths
- ✅ **Capture mechanics** - Jump over enemy pieces to capture them
- ✅ **Multi-hop captures** - Chain multiple captures in a single turn
- ✅ **Mandatory captures** - Force players to take captures when available
- ✅ **King promotions** - Reach the opposite end to become a king
- ✅ **Move validation** - All moves are validated by the game engine

### 🤖 AI System
- ✅ **Minimax algorithm** with Alpha-Beta pruning
- ✅ **Three difficulty levels**:
  - Apprentice (depth 2) - Beginner level
  - Strategist (depth 4) - Intermediate level
  - Grandmaster (depth 6) - Advanced level
- ✅ **Position evaluation** considering material, king value, mobility, and center control
- ✅ **Efficient search** with move ordering and pruning

### 🎮 Game Modes
- ✅ **Solo vs AI** - Challenge the computer opponent
- ✅ **Local Pass & Play** - Play with a friend on the same device
- ✅ **Campaign Mode** - Progress through 7 levels with tutorials
- ✅ **Custom Match** - Customize board size, AI difficulty, mandatory captures, and infiltrators

### 🎨 Visual Features
- ✅ **Dual theme system**:
  - **Sovereign Aesthetic** - Elegant luxury gallery design
  - **Cyber Tech** - Futuristic neon cyberpunk style
- ✅ **SVG board rendering** - Smooth lines and connections
- ✅ **Piece animations** - Spring-based physics animations
- ✅ **Move highlighting** - Visual feedback for legal moves
- ✅ **Captured pieces display** - Track captured pieces for each player

### 🔊 Audio System
- ✅ **Sound effects** using Web Audio API:
  - Move sound (soft click)
  - Capture sound (sharp impact)
  - King promotion sound (ascending tones)
  - Win sound (celebratory melody)
  - UI click sound
- ✅ **Volume control** - Adjust sound volume
- ✅ **Mute toggle** - Turn sounds on/off
- ✅ **Settings persistence** - Sound preferences saved to localStorage

### ⚙️ Additional Features
- ✅ **Undo functionality** - Revert moves in Solo and Campaign modes
- ✅ **Move counter** - Track the number of moves made
- ✅ **Turn indicator** - Always know whose turn it is
- ✅ **Winner screen** - Celebrate victory with statistics
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **TypeScript** - Fully typed for reliability
- ✅ **Campaign progression** - Unlock levels by completing previous ones
- ✅ **Star ratings** - Earn 1-3 stars based on move efficiency

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DeepakOla/WARP-LINES.git
   cd WARP-LINES
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

---

## 🎲 How to Play

### Basic Rules

1. **The Board**
   - Played on a grid of nodes (intersections) connected by lines
   - Available in 3x3 (16 nodes) and 4x4 (25 nodes) sizes
   - Connections include horizontal, vertical, and diagonal lines

2. **Pieces**
   - **Green pieces** start at the top
   - **Red pieces** start at the bottom
   - Each player starts with 8 (3x3 board) or 10 (4x4 board) pieces

3. **Movement (Step)**
   - Move to any adjacent empty node along connecting lines
   - Regular pieces move forward or sideways
   - Kings can move in any direction

4. **Capturing (Jump)**
   - Jump over an adjacent enemy piece to an empty node beyond it
   - Captured pieces are removed from the board
   - Must capture when possible (if mandatory captures enabled)

5. **Multi-Hop Captures**
   - If a capture lands you in a position where another capture is possible, you **must** continue jumping

6. **King Promotion**
   - Reach the opposite end of the board to promote to a king
   - Kings can move backward

7. **Winning**
   - Eliminate all opponent pieces to win
   - No legal moves = you lose

### Tips for Success

- 🎯 **Control the center** - Center positions offer more movement options
- 🛡️ **Protect your pieces** - Don't leave pieces vulnerable to captures
- ⚔️ **Force captures** - Set up situations where your opponent must make unfavorable captures
- 👑 **Promote wisely** - Getting kings early gives you a mobility advantage
- 🧠 **Think ahead** - Plan multi-hop captures to capture multiple pieces

---

## 🎮 Game Modes

### Solo vs AI
Play against the computer with three difficulty levels:
- **Apprentice** - Good for learning the game
- **Strategist** - Balanced challenge
- **Grandmaster** - Expert-level AI

### Local Pass & Play
Play against a friend on the same device. Players alternate turns.

### Campaign Mode
Progress through 7 levels of increasing difficulty:

1. **Tutorial: First Steps** - Learn movement and capturing (3x3, No mandatory captures)
2. **Apprentice Challenge** - Practice against beginner AI (3x3, Mandatory captures)
3. **Mandatory Captures** - Master forced captures (3x3, 1 infiltrator)
4. **Strategist Rising** - Face stronger opponent (3x3, Medium AI)
5. **Larger Board** - Expand to 4x4 board (4x4, Medium AI)
6. **Infiltration Tactics** - Deal with swapped pieces (4x4, 2 infiltrators)
7. **Grandmaster Trial** - Ultimate challenge (4x4, Hard AI, 2 infiltrators)

**Star Ratings**: Earn 1-3 stars based on move efficiency. Fewer moves = more stars!

### Custom Match
Customize your game:
- **Board Size**: 3x3 or 4x4
- **AI Difficulty**: 1-3
- **Mandatory Captures**: On/Off
- **Infiltrators**: 0-2 (swap pieces between players)

---

## 🛠️ Development

### Project Structure

```
WARP-LINES/
├── src/
│   ├── game/                    # Game engine (pure TypeScript)
│   │   ├── GameEngine.ts        # Core game logic
│   │   ├── AIPlayer.ts          # Minimax AI
│   │   ├── BoardLayout.ts       # Board generation
│   │   └── CampaignLevels.ts    # Campaign configuration
│   ├── components/              # React components
│   │   ├── GameContainer.tsx    # Main game UI
│   │   ├── WarpBoard.tsx        # Game board rendering
│   │   ├── ThemeSwitcher.tsx    # Theme selector
│   │   └── SettingsModal.tsx    # Settings UI
│   ├── services/                # Services
│   │   └── SoundManager.ts      # Audio system
│   ├── contexts/                # React contexts
│   │   └── ThemeContext.tsx     # Theme management
│   ├── types/                   # TypeScript types
│   │   ├── game.ts              # Game types
│   │   └── theme.ts             # Theme types
│   ├── styles/                  # Styles
│   │   ├── global.css           # Global styles
│   │   ├── tailwind.css         # Tailwind imports
│   │   └── themes.ts            # Theme definitions
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
├── public/                      # Static assets
├── ARCHITECTURE.md              # Architecture documentation
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
└── README.md                    # This file
```

### Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion (motion)
- **Icons**: Lucide React
- **Audio**: Web Audio API

### Scripts

```bash
# Development
npm run dev          # Start dev server on port 3000

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # TypeScript type checking
npm run clean        # Remove dist folder
```

### Key Design Decisions

1. **Pure TypeScript Game Engine**
   - Game logic is separate from UI (no React dependencies)
   - Can be ported to other platforms easily
   - Easy to test

2. **Node-based Board**
   - More strategic than grid-based checkers
   - Diagonal connections add complexity
   - SVG rendering for smooth lines

3. **Web Audio API**
   - No external dependencies
   - Programmatically generated sounds
   - Small bundle size

4. **Theme System**
   - CSS variables for instant switching
   - localStorage persistence
   - Two distinct aesthetics

---

## 🏗️ Architecture

### Game Engine Design

The game engine follows a **functional, stateless design**:

```typescript
// Game state is immutable
const newState = GameEngine.applyMove(currentState, move);

// All functions are pure
const legalMoves = GameEngine.getLegalMoves(state);
const winner = GameEngine.checkWinner(state.pieces);
```

**Benefits:**
- Easy to test
- Undo/redo is simple
- No hidden state
- Predictable behavior

### AI Implementation

The AI uses **Minimax with Alpha-Beta pruning**:

```
         Maximize (AI)
        /      |      \
    Min      Min      Min
   /  \     /  \     /  \
  Max Max  Max Max  Max Max
```

**Evaluation Function** considers:
- Material count (100 points per piece)
- King value (50 bonus points)
- Position value (center control)
- Mobility (number of legal moves)
- Capture opportunities

**Performance:**
- Depth 2: ~100 nodes evaluated (~50ms)
- Depth 4: ~10,000 nodes evaluated (~500ms)
- Depth 6: ~1,000,000 nodes evaluated (~5s)

### Board Representation

Nodes are stored in a 2D array:

```typescript
// 3x3 grid = 4x4 nodes
board[row][col] = Piece | null

// Connections are calculated on-demand
connections: Connection[] = [
  { from: {row: 0, col: 0}, to: {row: 0, col: 1}, type: 'horizontal' },
  { from: {row: 0, col: 0}, to: {row: 1, col: 0}, type: 'vertical' },
  { from: {row: 0, col: 0}, to: {row: 1, col: 1}, type: 'diagonal' },
  // ...
]
```

---

## 🌐 Deployment

### GitHub Pages

1. **Configure Vite for GitHub Pages**

   Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/WARP-LINES/', // Replace with your repo name
     // ... rest of config
   });
   ```

2. **Build and deploy**
   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

3. **Configure GitHub Pages**
   - Go to Settings > Pages
   - Select `gh-pages` branch
   - Save

### Cloudflare Pages

1. **Connect repository** to Cloudflare Pages
2. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **Deploy**

### Vercel/Netlify

```bash
# Deploy with Vercel
npx vercel

# Deploy with Netlify
npx netlify deploy --prod
```

### Static Hosting

Simply upload the contents of `dist/` folder to any static hosting service.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with strict typing
- Follow existing code style
- Test your changes thoroughly
- Update documentation if needed
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by Alquerque and Checkers
- Built with React, TypeScript, and Vite
- Animations powered by Framer Motion
- Icons from Lucide React

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
2. Review existing [Issues](https://github.com/DeepakOla/WARP-LINES/issues)
3. Open a new issue with details

---

<div align="center">

**Made with ❤️ using React, TypeScript, and modern web technologies**

[⬆ Back to Top](#warp-board---strategic-board-game)

</div>
