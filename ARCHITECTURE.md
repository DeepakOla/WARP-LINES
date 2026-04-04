# Warp Board Game - Cross-Platform Architecture

## Architecture Decision: Pure Web First Approach

### Executive Summary
For the Warp Board game, we recommend a **pure web-first architecture** using React + TypeScript, with future mobile support via **Capacitor** or **PWA** (Progressive Web App).

### Why Not Unity/Native Engines?

**Unity/Game Engines:**
- ❌ Overkill for 2D board game
- ❌ Large bundle sizes (20-50MB+)
- ❌ Slower web performance
- ❌ Requires WebGL expertise
- ❌ Difficult to customize UI
- ✅ Good for 3D/physics-heavy games only

**React Native/Flutter:**
- ❌ Mobile-first (we need web deployment)
- ❌ No direct GitHub Pages deployment
- ❌ Additional build complexity
- ❌ Limited web animation performance
- ✅ Good if mobile was primary target

### Recommended Stack: Pure Web with Capacitor Bridge

```
┌─────────────────────────────────────────────────────┐
│              WEB (Primary Platform)                  │
│  React 19 + TypeScript + Tailwind + Framer Motion  │
│            Vite Build System                         │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│ GitHub Pages │  │  Cloudflare │  │  Supabase  │
│   (Static)   │  │    Pages    │  │   Hosting  │
└──────────────┘  └─────────────┘  └────────────┘
                         │
              ┌──────────▼──────────┐
              │    Capacitor.js     │
              │   (Native Bridge)   │
              └──────────┬──────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│ iOS App      │  │ Android App │  │ PWA/Mobile │
│ (App Store)  │  │(Play Store) │  │   Web      │
└──────────────┘  └─────────────┘  └────────────┘
```

### Core Technology Choices

#### 1. **Game Logic Layer** (Pure TypeScript)
```typescript
// Platform-agnostic, reusable across web/mobile
src/game/
  ├── engine/
  │   ├── GameEngine.ts      // Pure TS, no React
  │   ├── BoardState.ts      // Serializable state
  │   └── MoveValidator.ts   // Stateless validation
  ├── ai/
  │   └── Minimax.ts         // Pure algorithm, runs anywhere
  └── types.ts               // Shared type definitions
```

**Benefits:**
- ✅ Runs in browser, Node.js, web workers, service workers
- ✅ Easy to test (no DOM dependencies)
- ✅ Portable to any platform
- ✅ Can run AI in web worker for non-blocking

#### 2. **UI Layer** (React Components)
```typescript
// Platform-specific rendering
src/components/
  ├── GameBoard.tsx          // Web: SVG + DOM
  │                          // Mobile: Same code via Capacitor
  ├── Piece.tsx
  └── GameMenu.tsx
```

**Benefits:**
- ✅ React runs on web natively
- ✅ Capacitor wraps web app in native container
- ✅ Same codebase for all platforms

#### 3. **Backend/Multiplayer** (Firebase)
```typescript
// Cloud-based, platform-agnostic
Firebase Firestore: Real-time game state
Firebase Auth: User authentication
Firebase Storage: Assets, profile pictures
```

**Benefits:**
- ✅ Works on web, iOS, Android (same SDK)
- ✅ Real-time sync built-in
- ✅ Free tier available
- ✅ No server maintenance

### Deployment Strategy

#### Phase 1: Web Deployment (Current Priority)
```bash
# Build for static hosting
npm run build
# Deploy to:
- GitHub Pages (Free, easy)
- Cloudflare Pages (Fast, global CDN)
- Vercel/Netlify (Easy CI/CD)
- Supabase (Full backend support)
```

**Advantages:**
- Instant updates (no app store approval)
- Global CDN distribution
- Works on any device with browser
- SEO-friendly
- Shareable links

#### Phase 2: Progressive Web App (PWA)
```javascript
// Add service worker for offline play
workbox-precache
- Cache game assets
- Offline game vs AI
- Install as app on mobile
```

**Advantages:**
- Install icon on home screen
- Works offline
- Push notifications
- Near-native experience
- No app store needed

#### Phase 3: Native Apps (Optional Future)
```bash
# Wrap web app in native container
npx cap init
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
npx cap open android
```

**Capacitor Benefits:**
- ✅ Same React codebase
- ✅ Access native APIs (haptics, notifications)
- ✅ App store distribution
- ✅ Better performance on older devices
- ✅ Native share dialogs

### Shared Logic Architecture

```typescript
// Game Engine (runs everywhere)
export class GameEngine {
  // Pure TypeScript, no platform dependencies
  static getLegalMoves(state: GameState): Move[] { }
  static applyMove(state: GameState, move: Move): GameState { }
  static checkWin(state: GameState): Player | null { }
}

// Platform-specific usage:
// WEB: Direct import in React components
import { GameEngine } from './game/engine/GameEngine';

// WEB WORKER: Run AI without blocking UI
const worker = new Worker('./ai-worker.js');
worker.postMessage({ state, depth: 6 });

// MOBILE (via Capacitor): Same imports work
import { GameEngine } from './game/engine/GameEngine';
// Capacitor provides native wrapper, code unchanged
```

### State Management Strategy

```typescript
// Use React Context + useReducer (or Zustand)
// Serializable state = easy sync across platforms

interface GameState {
  board: Piece[][];
  turn: Player;
  history: Move[];
  winner: Player | null;
}

// Web: Store in memory + localStorage
localStorage.setItem('gameState', JSON.stringify(state));

// Online: Sync to Firebase
await updateDoc(gameRef, { state });

// Mobile: Same code via Capacitor
// Can also use Capacitor Storage plugin for native storage
```

### Performance Considerations

| Feature | Web | PWA | Capacitor | Unity |
|---------|-----|-----|-----------|-------|
| Initial Load | 🔵 100KB | 🟢 50KB cached | 🟡 5MB app | 🔴 50MB app |
| Frame Rate | 🟢 60fps | 🟢 60fps | 🟢 60fps | 🟢 60fps |
| Bundle Size | 🟢 Small | 🟢 Tiny | 🟡 Medium | 🔴 Large |
| Offline Play | 🔴 No | 🟢 Yes | 🟢 Yes | 🟢 Yes |
| Update Speed | 🟢 Instant | 🟢 Instant | 🟡 App Store | 🟡 App Store |
| SEO | 🟢 Yes | 🟢 Yes | 🔴 No | 🔴 No |

### Tech Stack Final Decision

```json
{
  "core": {
    "language": "TypeScript",
    "framework": "React 19",
    "bundler": "Vite",
    "styling": "Tailwind CSS",
    "animation": "Framer Motion (motion)",
    "state": "React Context + Zustand (lightweight)"
  },
  "backend": {
    "database": "Firebase Firestore",
    "auth": "Firebase Auth",
    "storage": "Firebase Storage",
    "hosting": "GitHub Pages / Cloudflare Pages"
  },
  "mobile": {
    "pwa": "Workbox Service Worker",
    "native": "Capacitor (future phase)",
    "fallback": "Responsive web design"
  },
  "ai": {
    "execution": "Web Worker (non-blocking)",
    "algorithm": "Minimax with Alpha-Beta pruning",
    "language": "Pure TypeScript"
  },
  "audio": {
    "library": "Web Audio API (built-in)",
    "format": "MP3/OGG",
    "fallback": "HTML5 Audio"
  }
}
```

### Why This Avoids Tech Dead-Ends

✅ **Web-first = Universal access**
- Works on desktop, mobile, tablet
- No app store gatekeeping
- Instant updates

✅ **Pure TypeScript game logic = Portable**
- Can move to any platform later
- Easy to test
- No vendor lock-in

✅ **React = Massive ecosystem**
- Easy to hire developers
- Tons of libraries
- Long-term support

✅ **Firebase = Managed backend**
- No server to maintain
- Scales automatically
- Multi-platform SDKs

✅ **Capacitor bridge = Native escape hatch**
- Can go native anytime
- Minimal code changes
- Keep web version working

### Migration Paths (If Needed)

**If we need 3D graphics later:**
- Add Three.js to existing React app
- Keep game logic unchanged
- Progressive enhancement

**If we need better mobile performance:**
- Add Capacitor wrapper
- Keep 99% of code unchanged
- Get native APIs

**If we need desktop apps:**
- Use Electron or Tauri
- Same React codebase
- Native installers

**If we need different game engine:**
- Game logic in TypeScript is portable
- Can rewrite UI layer only
- Business logic preserved

### Conclusion

**Use pure web (React + TypeScript) with these safeguards:**
1. Keep game logic in pure TypeScript (no React dependencies)
2. Use Firebase for backend (works everywhere)
3. Design for mobile-responsive web first
4. Add PWA for offline + install
5. If needed later: wrap with Capacitor for native apps

**This approach:**
- ✅ Deploys to GitHub Pages immediately
- ✅ Works on all devices via browser
- ✅ Can go native later with minimal work
- ✅ Avoids vendor lock-in
- ✅ Keeps options open
- ✅ Fastest time to market

**We avoid dead-ends by:**
- Separating business logic from UI
- Using standard web technologies
- Choosing platforms with clear migration paths
- Not committing to mobile-only or desktop-only solutions
