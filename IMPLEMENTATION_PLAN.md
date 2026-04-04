# WARP-LINES Implementation Plan
## Production-Ready Launch for Web, Android, and iOS

### Executive Summary
This plan outlines the complete implementation roadmap to transform WARP-LINES from a UI prototype into a production-ready board game for web, Android, and iOS platforms with focus on:
- Complete game engine with Warp Board rules
- Fixed infiltration mode with symmetric piece swapping
- Beautiful 3D board with proper shadows and lighting
- Offline AI player with adjustable difficulty
- Cross-platform support (Web, Android, iOS)
- Performance optimization for low-end devices
- Polished UI/UX with music and sound effects
- App store compliance and launch readiness

---

## Phase 1: Core Game Engine (Foundation)

### 1.1 Centralized Game Configuration
**Objective**: Make board size, piece count, and game rules configurable

**Implementation**:
```typescript
// src/config/gameConfig.ts
export interface GameConfig {
  boardSize: number;           // Default: 8 (configurable to 6, 10, 12)
  piecesPerPlayer: number;     // Default: 12
  enableInfiltration: boolean; // Infiltration mode toggle
  enableKings: boolean;        // Promotion to kings
  forcedCaptures: boolean;     // Mandatory jumps
  multiJumps: boolean;         // Continue jumping in same turn
}
```

**Files to Create**:
- `src/config/gameConfig.ts` - Centralized configuration
- `src/config/boardTemplates.ts` - Pre-defined board layouts (8x8, 10x10, 12x12)

### 1.2 Game State Management
**Objective**: Implement complete game state with Firebase integration

**Architecture**:
```typescript
// src/types/gameState.ts
interface GameState {
  config: GameConfig;
  board: Board;
  currentPlayer: 'RED' | 'GREEN';
  pieces: Map<string, Piece>;
  availableMoves: Move[];
  captureMode: boolean;      // In multi-jump sequence
  activePieceId: string | null;
  history: GameMove[];       // For undo/replay
  winner: 'RED' | 'GREEN' | null;
  status: 'setup' | 'playing' | 'paused' | 'finished';
}
```

**Files to Create**:
- `src/types/gameState.ts` - Complete type definitions
- `src/types/piece.ts` - Piece types (regular, king)
- `src/types/move.ts` - Move and capture types
- `src/hooks/useGameState.ts` - React hook for game state
- `src/engine/GameEngine.ts` - Core game logic class

### 1.3 Game Rules Engine
**Objective**: Implement Warp Board rules (similar to Kharbaga/Zamma)

**Core Rules**:
1. **Movement**: Diagonal moves to adjacent empty squares
2. **Captures**: Jump over opponent pieces (mandatory if available)
3. **Multi-jumps**: Continue jumping in same turn if possible
4. **Promotion**: Reaching opponent's back rank promotes to King
5. **King Movement**: Kings can move/jump both directions
6. **Win Condition**: Capture all opponent pieces or block all moves

**Files to Create**:
- `src/engine/MoveValidator.ts` - Legal move validation
- `src/engine/CaptureDetector.ts` - Forced capture detection
- `src/engine/PromotionHandler.ts` - King promotion logic
- `src/engine/WinConditionChecker.ts` - Game end detection

---

## Phase 2: Infiltration Mode (Symmetry Fix)

### 2.1 Fixed Infiltration Algorithm
**Objective**: Deterministic symmetric piece swapping (not random)

**Algorithm**:
```typescript
// Symmetric front-line swap for 8x8 board
function initializeInfiltrationMode(board: Board): void {
  // RED front line: Row 2 (indices 0-7)
  // GREEN front line: Row 5 (indices 0-7)

  // Swap patterns (symmetric):
  // Position 0 <-> Position 7 (corners)
  // Position 1 <-> Position 6
  // Position 2 <-> Position 5
  // Position 3 <-> Position 4

  // This ensures perfect symmetry and fairness
}
```

**Files to Create**:
- `src/engine/InfiltrationMode.ts` - Fixed infiltration logic
- `src/engine/BoardInitializer.ts` - Setup standard vs infiltration boards

### 2.2 Infiltration Mode UI
**Objective**: Toggle and visual indication of infiltration mode

**Features**:
- Settings menu toggle
- Visual markers on swapped pieces (subtle glow)
- Mode indicator in game info panel

---

## Phase 3: Cross-Platform Setup (Capacitor)

### 3.1 Capacitor Integration
**Why Capacitor?**
- ✅ Official Ionic framework (well-maintained)
- ✅ Better than Cordova (modern, faster, more plugins)
- ✅ Native API access (camera, storage, notifications)
- ✅ PWA support (web + native in one codebase)
- ✅ Hot reload during development
- ✅ Easy plugin ecosystem

**Setup**:
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init
```

**Files to Create**:
- `capacitor.config.ts` - Capacitor configuration
- `android/` - Android native project (auto-generated)
- `ios/` - iOS native project (auto-generated)

### 3.2 Platform-Specific Adjustments
**Objective**: Handle platform differences gracefully

**Implementation**:
```typescript
// src/utils/platform.ts
import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const isAndroid = Capacitor.getPlatform() === 'android';
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isWeb = Capacitor.getPlatform() === 'web';
```

**Platform Adjustments**:
- Android: Handle back button, vibration feedback
- iOS: Handle safe areas, notch spacing
- Web: Keyboard shortcuts, mouse interactions

**Files to Create**:
- `src/utils/platform.ts` - Platform detection
- `src/utils/haptics.ts` - Vibration/haptic feedback (native only)
- `src/utils/storage.ts` - Native storage wrapper

---

## Phase 4: Responsive Design & Touch Controls

### 4.1 Responsive Breakpoints
**Objective**: Perfect layout on all screen sizes

**Breakpoints**:
```css
/* Mobile: 320px - 767px */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px+ */
```

**Board Sizing**:
- Mobile: 90vw (max 400px)
- Tablet: 600px
- Desktop: 700px

**Files to Update**:
- `src/styles/global.css` - Add responsive utilities
- `src/components/GameBoard.tsx` - Dynamic sizing

### 4.2 Touch Controls
**Objective**: Native-like touch interactions

**Features**:
1. **Tap to select** - Highlight selected piece + valid moves
2. **Tap to move** - Tap destination to move
3. **Drag & drop** - Alternative control method
4. **Pinch to zoom** - Mobile board zoom (optional)
5. **Touch feedback** - Visual + haptic (vibration)

**Files to Create**:
- `src/hooks/useTouchControls.ts` - Touch event handlers
- `src/hooks/useDragAndDrop.ts` - Drag & drop logic
- `src/components/TouchIndicator.tsx` - Visual touch feedback

---

## Phase 5: 3D Board Enhancement

### 5.1 Improved 3D Rendering
**Objective**: Professional 3D board with realistic shadows

**Enhancements**:
1. **Lighting System**:
   - Directional light (top-right)
   - Ambient light (soft fill)
   - Piece shadows on board
   - Board shadow on ground plane

2. **Material System**:
   - Wood texture for board (Sovereign)
   - Metallic texture for pieces
   - Glass overlay for cyber theme
   - Reflective properties

3. **Camera System**:
   - Fixed perspective (no rotation on mobile)
   - Optional rotation on desktop (mouse)
   - Smooth camera transitions

**Technology Options**:
- **Option A**: CSS 3D transforms (current - lightweight)
- **Option B**: Three.js (heavier but more realistic)
- **Recommendation**: Stick with CSS for performance, enhance lighting

**Files to Update**:
- `src/components/GameBoard.tsx` - Enhanced 3D CSS
- `src/styles/3d-effects.css` - Lighting and shadow utilities
- `src/components/Piece.tsx` - Extract piece component

### 5.2 Performance Optimization
**Objective**: 60fps on low-end Android devices

**Strategies**:
1. **GPU Acceleration**: Use `will-change`, `transform`, `opacity` only
2. **Reduce Paint Operations**: Avoid `box-shadow`, use `filter: drop-shadow()`
3. **Optimize Animations**: Use CSS animations instead of JS where possible
4. **Lazy Rendering**: Only render visible cells (if board > 12x12)
5. **Reduce Motion**: Respect `prefers-reduced-motion` media query

**Target Devices**:
- Samsung Galaxy A10 (2GB RAM, SD 410)
- Redmi 9A (2GB RAM, Helio G25)
- iPhone SE 2016 (2GB RAM, A9 chip)

---

## Phase 6: Offline AI Player

### 6.1 AI Difficulty Levels
**Objective**: Engaging single-player experience

**Difficulty Levels**:
1. **Easy**: Random valid moves
2. **Medium**: Greedy algorithm (prioritize captures)
3. **Hard**: Minimax with alpha-beta pruning (depth 4)
4. **Expert**: Minimax (depth 6) + position evaluation

**Evaluation Function**:
```typescript
function evaluatePosition(state: GameState): number {
  let score = 0;

  // Material count
  score += (redPieces.length - greenPieces.length) * 100;

  // King value
  score += (redKings.length - greenKings.length) * 150;

  // Board control (center squares)
  score += controlBonus;

  // Mobility (available moves)
  score += (redMoves.length - greenMoves.length) * 10;

  return score;
}
```

**Files to Create**:
- `src/ai/AIPlayer.ts` - Main AI controller
- `src/ai/algorithms/RandomAI.ts` - Easy difficulty
- `src/ai/algorithms/GreedyAI.ts` - Medium difficulty
- `src/ai/algorithms/MinimaxAI.ts` - Hard/Expert difficulty
- `src/ai/evaluation.ts` - Position evaluation

### 6.2 Progressive Difficulty
**Objective**: Adapt difficulty to player skill (like Subway Surfers)

**Implementation**:
- Track player win/loss ratio
- Auto-suggest difficulty adjustment after 3 games
- Gradual difficulty increase within game (every 5 turns)

**Files to Create**:
- `src/ai/DifficultyManager.ts` - Adaptive difficulty
- `src/utils/analytics.ts` - Track player performance (local only)

---

## Phase 7: Audio System

### 7.1 Background Music
**Objective**: Immersive ambient music

**Music Tracks** (Royalty-Free Sources):
- **Sovereign Theme**: Classical piano, ambient strings
- **Cyber Theme**: Synthwave, electronic ambient

**Sources**:
- Pixabay Music (CC0 license)
- Incompetech (Kevin MacLeod - CC BY)
- Free Music Archive

**Files to Create**:
- `public/audio/music/sovereign-theme.mp3`
- `public/audio/music/cyber-theme.mp3`
- `src/utils/AudioManager.ts` - Music + SFX controller
- `src/components/AudioControls.tsx` - Volume controls

### 7.2 Sound Effects
**Objective**: Satisfying gameplay feedback

**SFX List**:
- Piece select (subtle click)
- Move piece (soft slide)
- Capture piece (satisfying "pop")
- Promotion to king (triumphant chime)
- Illegal move (gentle error tone)
- Game win (celebration fanfare)
- Menu navigation (UI clicks)

**Files to Create**:
- `public/audio/sfx/*.mp3` - Sound effect files
- Use Web Audio API for low-latency playback

---

## Phase 8: UI/UX Polish

### 8.1 Complete UI Components
**Objective**: Professional game interface

**Components to Create**:
1. **Main Menu**: Play, Settings, How to Play, Credits
2. **Game Mode Selector**: vs AI, Local 2P, Online (future)
3. **Settings Panel**:
   - Board size selector (6x6, 8x8, 10x10, 12x12)
   - Infiltration mode toggle
   - Difficulty selector
   - Audio controls (music/sfx volume)
   - Theme selector
4. **Game HUD**:
   - Current player indicator
   - Piece count
   - Captured pieces display
   - Timer (optional)
   - Undo/Redo buttons
5. **Win Screen**:
   - Winner announcement
   - Move count
   - Play again / Main menu buttons
   - Confetti animation (already have canvas-confetti)

**Files to Create**:
- `src/components/MainMenu.tsx`
- `src/components/GameModeSelector.tsx`
- `src/components/SettingsPanel.tsx`
- `src/components/GameHUD.tsx`
- `src/components/WinScreen.tsx`
- `src/components/HowToPlay.tsx`

### 8.2 Animations & Transitions
**Objective**: Smooth, delightful interactions

**Animation Types**:
- Page transitions (fade/slide)
- Button hover effects (already have)
- Piece movement (smooth slide)
- Capture animation (piece disappear + particle effect)
- Promotion animation (piece transform + glow)
- Win celebration (confetti + scale animation)

**Files to Update**:
- Use Motion (Framer Motion) for all animations
- Add spring physics for natural feel

---

## Phase 9: Game Features

### 9.1 Undo/Redo System
**Objective**: Player-friendly move management

**Implementation**:
```typescript
class GameHistory {
  private history: GameState[] = [];
  private currentIndex: number = -1;

  push(state: GameState): void;
  undo(): GameState | null;
  redo(): GameState | null;
  canUndo(): boolean;
  canRedo(): boolean;
}
```

**Rules**:
- Allow undo only before AI responds
- Limit undo depth (last 10 moves)
- Disable undo in online multiplayer (future)

**Files to Create**:
- `src/utils/GameHistory.ts` - Undo/redo manager

### 9.2 Save/Load System
**Objective**: Resume games anytime

**Implementation**:
```typescript
// Save to localStorage (web) or native storage (mobile)
interface SavedGame {
  id: string;
  timestamp: number;
  state: GameState;
  config: GameConfig;
  playerNames: { red: string; green: string };
}
```

**Features**:
- Auto-save every move
- Manual save slots (3 slots)
- Continue last game from main menu
- Save game browser

**Files to Create**:
- `src/utils/SaveManager.ts` - Save/load logic
- `src/components/SaveGameBrowser.tsx` - UI for saved games

### 9.3 Replay System
**Objective**: Watch completed games

**Features**:
- Step through move history
- Play/pause/speed controls
- Export replay as JSON
- Share replay code (future)

**Files to Create**:
- `src/components/ReplayViewer.tsx` - Replay UI
- `src/utils/ReplayExporter.ts` - Export/import replays

---

## Phase 10: Performance Optimization

### 10.1 Low-End Device Optimization
**Target**: 60fps on devices with 2GB RAM

**Strategies**:
1. **Reduce Animations**: Detect low-end devices, simplify effects
2. **Optimize Renders**: Use React.memo, useMemo, useCallback
3. **Lazy Loading**: Code splitting for menu screens
4. **Asset Optimization**:
   - Compress audio (reduce bitrate)
   - Use WebP for images
   - Minify CSS/JS (Vite does this)
5. **Memory Management**:
   - Clean up event listeners
   - Dispose audio contexts when not playing
   - Limit history depth

**Device Detection**:
```typescript
const isLowEndDevice = () => {
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
  return false;
};
```

**Files to Create**:
- `src/utils/performanceDetector.ts` - Device capability detection
- `src/utils/performanceMonitor.ts` - FPS tracking

### 10.2 Bundle Size Optimization
**Objective**: Fast initial load (< 500KB total)

**Current**: 337KB JS + 10KB CSS = 347KB ✅ (Good!)

**Further Optimization**:
- Lazy load AI algorithms
- Lazy load audio files
- Use dynamic imports for heavy components

---

## Phase 11: Android Build Configuration

### 11.1 Android Setup
**Files to Configure**:
```
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml  - Permissions, orientation
│   │   ├── res/
│   │   │   ├── drawable/        - App icons (all densities)
│   │   │   ├── values/
│   │   │   │   ├── strings.xml  - App name
│   │   │   │   └── styles.xml   - Splash screen
│   ├── build.gradle             - App config, versions
│   └── google-services.json     - Firebase (if using)
└── build.gradle                 - Project config
```

**Configuration**:
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.warplines.game"
        minSdkVersion 23  // Android 6.0+ (covers 95% devices)
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }
}
```

**App Icons**: Generate all densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
**Splash Screen**: Use Android 12+ splash screen API

### 11.2 Android Testing
**Steps**:
1. `npx cap sync android` - Sync web build to native
2. `npx cap open android` - Open in Android Studio
3. Build APK (debug): `./gradlew assembleDebug`
4. Build AAB (release): `./gradlew bundleRelease`
5. Test on emulator + real devices

**Testing Checklist**:
- [ ] App launches without crashes
- [ ] Touch controls work smoothly
- [ ] Audio plays correctly
- [ ] Save/load persists across app restarts
- [ ] Back button works (exit on main menu)
- [ ] Vibration/haptic feedback works
- [ ] No memory leaks (use Android Profiler)
- [ ] Battery usage is reasonable
- [ ] Works on small screens (320dp width)

---

## Phase 12: iOS Build Configuration

### 12.1 iOS Setup
**Requirements**:
- macOS with Xcode 15+
- Apple Developer Account ($99/year for App Store)
- iOS device for testing (simulator OK for development)

**Files to Configure**:
```
ios/
├── App/
│   ├── App/
│   │   ├── Info.plist           - Permissions, config
│   │   ├── Assets.xcassets/     - App icons, splash
│   │   └── GoogleService-Info.plist  - Firebase
│   └── App.xcodeproj/           - Xcode project
```

**Configuration**:
```xml
<!-- ios/App/App/Info.plist -->
<key>CFBundleDisplayName</key>
<string>Warp Lines</string>
<key>CFBundleVersion</key>
<string>1.0.0</string>
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>arm64</string>
</array>
<key>UIRequiresFullScreen</key>
<true/>
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
</array>
```

**App Icons**: Use Asset Catalog (1024x1024 master + auto-generate)
**Splash Screen**: LaunchScreen.storyboard

### 12.2 iOS Testing
**Steps**:
1. `npx cap sync ios` - Sync web build to native
2. `npx cap open ios` - Open in Xcode
3. Select device/simulator
4. Product → Build (⌘B)
5. Product → Run (⌘R)

**Testing Checklist**:
- [ ] App launches without crashes
- [ ] Touch controls work smoothly
- [ ] Audio plays correctly
- [ ] Save/load persists across app restarts
- [ ] Home button/swipe works (graceful background)
- [ ] Haptic feedback works (Taptic Engine)
- [ ] No memory leaks (use Instruments)
- [ ] Battery usage is reasonable
- [ ] Works on all screen sizes (iPhone SE to Pro Max)
- [ ] Safe area respected (notch/dynamic island)

---

## Phase 13: App Store Compliance

### 13.1 Google Play Requirements
**Checklist**:
- [x] Target API 34 (Android 14)
- [x] App Bundle (AAB) format
- [ ] Privacy Policy URL (required if collecting data)
- [ ] Content rating (IARC questionnaire)
- [ ] Screenshots (min 2, recommended 8)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512 PNG)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Categorization: Games > Board
- [ ] Age rating: Everyone
- [ ] No ads, no in-app purchases (as per requirements)
- [ ] Test track (internal/closed/open beta)

**Files to Create**:
- `store/google-play/screenshots/` - 8 screenshots
- `store/google-play/feature-graphic.png`
- `store/google-play/description.txt`
- `PRIVACY_POLICY.md` - Privacy policy (even if no data collection)

### 13.2 Apple App Store Requirements
**Checklist**:
- [ ] App built with Xcode 15+
- [ ] iOS 13.0+ deployment target
- [ ] App Store Connect account setup
- [ ] App identifier (com.warplines.game)
- [ ] Provisioning profile (distribution)
- [ ] Code signing certificate
- [ ] Privacy Policy URL
- [ ] Content rating (Age 4+)
- [ ] Screenshots (6.7", 6.5", 5.5" required)
- [ ] App Preview video (optional but recommended)
- [ ] App icon (1024x1024)
- [ ] Description (4000 chars)
- [ ] Keywords (100 chars)
- [ ] Subtitle (30 chars)
- [ ] Promotional text (170 chars)
- [ ] Category: Games > Board
- [ ] TestFlight beta testing

**Files to Create**:
- `store/app-store/screenshots/` - Screenshots for all sizes
- `store/app-store/description.txt`
- `store/app-store/keywords.txt`

---

## Phase 14: Launch Preparation

### 14.1 Pre-Launch Testing
**Testing Matrix**:
```
| Platform | Device | Screen | OS | Status |
|----------|--------|--------|-----|--------|
| Android | Samsung A10 | 6.2" | 11 | [ ] |
| Android | Pixel 5 | 6.0" | 14 | [ ] |
| Android | Tablet | 10.1" | 13 | [ ] |
| iOS | iPhone SE | 4.7" | 15 | [ ] |
| iOS | iPhone 14 | 6.1" | 17 | [ ] |
| iOS | iPad | 10.2" | 17 | [ ] |
| Web | Chrome | Desktop | - | [ ] |
| Web | Safari | Desktop | - | [ ] |
| Web | Mobile | 375px | - | [ ] |
```

**Test Scenarios**:
1. Complete game vs AI (all difficulties)
2. Complete game 2-player local
3. Undo/redo during game
4. Save and resume game
5. Theme switching during game
6. Board size changes
7. Audio controls (mute/volume)
8. App backgrounding (mobile)
9. Low battery mode (mobile)
10. Offline mode (no internet)

### 14.2 Documentation
**Files to Create**:
1. `LAUNCH_GUIDE.md` - Step-by-step launch instructions
2. `USER_GUIDE.md` - How to play tutorial
3. `TROUBLESHOOTING.md` - Common issues and fixes
4. `CHANGELOG.md` - Version history
5. `CREDITS.md` - Attributions (music, icons, etc.)

---

## Phase 15: Launch Timeline

### Week 1-2: Core Foundation
- [x] Project setup complete
- [ ] Game engine implementation
- [ ] Game rules implementation
- [ ] Infiltration mode
- [ ] Basic AI (easy/medium)

### Week 3-4: Platform Support
- [ ] Capacitor integration
- [ ] Android build working
- [ ] iOS build working (requires macOS)
- [ ] Responsive design
- [ ] Touch controls

### Week 5: Polish & Features
- [ ] 3D enhancements
- [ ] Audio system
- [ ] UI/UX components
- [ ] Undo/redo/save/load
- [ ] Advanced AI (hard/expert)

### Week 6: Optimization & Testing
- [ ] Performance optimization
- [ ] Multi-device testing
- [ ] Bug fixes
- [ ] User testing feedback

### Week 7: Store Preparation
- [ ] Screenshots and assets
- [ ] Store listings
- [ ] Privacy policy
- [ ] Beta testing (TestFlight/Play Console)

### Week 8: Launch
- [ ] Submit to Google Play
- [ ] Submit to App Store
- [ ] Web deployment (Vercel/Netlify)
- [ ] Marketing materials
- [ ] Community launch

**Total Estimated Time**: 8 weeks (2 months) for full production launch

---

## Technology Recommendations

### Cross-Platform Framework
✅ **Capacitor** (Chosen)
- Modern, well-maintained
- Better performance than Cordova
- Native API access
- PWA support
- Easy updates

❌ Alternatives:
- React Native: Requires complete rewrite, heavier
- Flutter: Different language (Dart), overkill for this
- Cordova: Deprecated, slower

### 3D Rendering
✅ **CSS 3D Transforms** (Current)
- Lightweight (no extra dependencies)
- Good performance on mobile
- Sufficient for board game

❌ Three.js:
- Too heavy (100KB+ extra)
- Overkill for static board
- Performance issues on low-end devices

### State Management
✅ **React Context + Hooks** (Current)
- Built-in, no extra dependencies
- Perfect for small-medium apps
- Easy to understand

❌ Alternatives:
- Redux: Too complex for this use case
- Zustand: Extra dependency, not needed
- MobX: Overkill

### Audio
✅ **Web Audio API**
- Native browser API
- Low latency
- Full control over playback

Fallback: HTML5 `<audio>` for background music

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | TBD |
| Time to Interactive | < 3s | TBD |
| Bundle Size (JS) | < 400KB | 337KB ✅ |
| Bundle Size (CSS) | < 15KB | 10KB ✅ |
| Frame Rate | 60fps | TBD |
| Memory Usage | < 100MB | TBD |
| Initial Load Time | < 2s | TBD |
| Audio Latency | < 50ms | TBD |

---

## Open Source Resources

### Game AI
- [Minimax Algorithm](https://github.com/topics/minimax-algorithm) - Game tree search
- [Alpha-Beta Pruning](https://github.com/topics/alpha-beta-pruning) - Optimization

### Board Games
- [Checkers AI](https://github.com/search?q=checkers+ai+typescript) - Similar game logic
- [Chess.js](https://github.com/jhlywa/chess.js) - Inspiration for move validation

### Mobile Games
- [React Native Games](https://github.com/topics/react-native-game) - Mobile game patterns
- [Phaser](https://github.com/photonstorm/phaser) - Game framework (reference only)

### Audio
- [Howler.js](https://github.com/goldfire/howler.js) - Audio library (optional)
- [Tone.js](https://github.com/Tonejs/Tone.js) - Advanced audio (if needed)

### UI/UX
- [Framer Motion Examples](https://github.com/topics/framer-motion) - Animation patterns
- [React Spring](https://github.com/pmndrs/react-spring) - Physics-based animations

---

## Risk Mitigation

### Technical Risks
1. **Performance on Low-End Devices**
   - Mitigation: Early testing, performance budgets, graceful degradation

2. **iOS Build (Requires macOS)**
   - Mitigation: Use cloud Mac (MacStadium, AWS Mac) or GitHub Actions

3. **Audio Licensing**
   - Mitigation: Use only CC0/CC-BY licensed music, keep attribution

4. **App Store Rejection**
   - Mitigation: Follow guidelines strictly, beta test thoroughly

### Timeline Risks
1. **Feature Creep**
   - Mitigation: MVP first, then polish, prioritize ruthlessly

2. **Testing Delays**
   - Mitigation: Automated testing, parallel device testing

---

## Success Metrics (Post-Launch)

### User Engagement
- Daily Active Users (DAU)
- Session duration (target: 10+ min)
- Games completed per session (target: 2+)
- Retention rate (Day 1, Day 7, Day 30)

### Technical Metrics
- Crash rate (target: < 1%)
- ANR rate (Android) (target: < 0.5%)
- App size (target: < 50MB installed)
- Load time (target: < 3s on 3G)

### Store Metrics
- Rating (target: 4.5+ stars)
- Review sentiment
- Download/install conversion rate
- Organic search ranking

---

## Conclusion

This plan provides a comprehensive roadmap to transform WARP-LINES into a production-ready, cross-platform board game. The architecture is designed to be:

✅ **Scalable**: Easy to add more board sizes, pieces, modes
✅ **Maintainable**: Clean separation of concerns, typed interfaces
✅ **Performant**: Optimized for low-end devices
✅ **User-Friendly**: Polished UI/UX, offline-first
✅ **Compliant**: Meets app store requirements

**Next Steps**: Begin Phase 1 implementation (Core Game Engine)
