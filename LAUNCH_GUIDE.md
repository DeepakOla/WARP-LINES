# WARP-LINES Launch Guide
## Complete Steps to Launch on Android, iOS, and Web

---

## Prerequisites

### Required Tools
- ✅ Node.js 18+ and npm
- ✅ Git
- ⏳ Android Studio (for Android builds)
- ⏳ Xcode 15+ and macOS (for iOS builds)
- ⏳ Apple Developer Account ($99/year for App Store)
- ⏳ Google Play Developer Account ($25 one-time fee)

### Development Environment Setup
```bash
# Verify Node.js
node --version  # Should be 18+
npm --version   # Should be 9+

# Clone repository (if not already)
git clone <repo-url>
cd WARP-LINES

# Install dependencies
npm install
```

---

## Phase 1: Development & Testing (Current Stage)

### 1.1 Local Development
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Test all features:
# - Game plays correctly
# - AI works at all difficulties
# - Audio plays properly
# - Theme switching works
# - Save/load functions
# - Undo/redo works
```

### 1.2 Production Build Test
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Test at http://localhost:4173
```

**Verification Checklist**:
- [ ] No console errors
- [ ] All features work as expected
- [ ] Performance is smooth (60fps)
- [ ] Audio plays correctly
- [ ] Theme switching works
- [ ] Responsive design works on mobile viewport

---

## Phase 2: Capacitor Setup (Cross-Platform)

### 2.1 Install Capacitor
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Install platform packages
npm install @capacitor/android @capacitor/ios

# Install useful plugins
npm install @capacitor/haptics      # Vibration feedback
npm install @capacitor/status-bar   # Status bar customization
npm install @capacitor/splash-screen # Splash screen
npm install @capacitor/preferences  # Native storage
```

### 2.2 Initialize Capacitor
```bash
# Initialize Capacitor project
npx cap init

# When prompted:
# App name: Warp Lines
# App ID: com.warplines.game (or your preferred ID)
# Web directory: dist
```

This creates `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.warplines.game',
  appName: 'Warp Lines',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    }
  }
};

export default config;
```

### 2.3 Build and Sync
```bash
# Build the web app
npm run build

# Add platforms
npx cap add android
npx cap add ios  # Only on macOS

# Sync web assets to native projects
npx cap sync
```

**What This Does**:
- Creates `android/` folder with Android project
- Creates `ios/` folder with iOS project (macOS only)
- Copies built web app to native projects

---

## Phase 3: Android Build & Deployment

### 3.1 Install Android Studio
1. Download Android Studio from https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio → SDK Manager
4. Install:
   - Android SDK Platform 34 (Android 14)
   - Android SDK Build-Tools 34.0.0
   - Android Emulator (for testing)

### 3.2 Configure Android Project

#### Update Build Configuration
Edit `android/app/build.gradle`:
```gradle
android {
    namespace "com.warplines.game"
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.warplines.game"
        minSdkVersion 23  // Android 6.0 (Marshmallow)
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"

        // Enable multidex for large apps
        multiDexEnabled true
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}
```

#### Update AndroidManifest.xml
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:screenOrientation="portrait"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 3.3 Generate App Icons

#### Option A: Use Online Generator (Easiest)
1. Create 1024x1024 PNG icon
2. Use https://icon.kitchen/ or https://easyappicon.com/
3. Download Android icon pack
4. Replace files in `android/app/src/main/res/mipmap-*/`

#### Option B: Manual
Create icons for all densities:
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### 3.4 Create Splash Screen

Edit `android/app/src/main/res/values/styles.xml`:
```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

Create `android/app/src/main/res/drawable/splash.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/ic_launcher"/>
    </item>
</layer-list>
```

### 3.5 Build APK (Debug)
```bash
# Open Android project
npx cap open android

# In Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# Or via command line:
cd android
./gradlew assembleDebug

# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### 3.6 Test on Device/Emulator
```bash
# List connected devices
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio:
# Run → Run 'app' (Shift+F10)
```

**Testing Checklist**:
- [ ] App launches without crashes
- [ ] Touch controls work
- [ ] Audio plays
- [ ] Haptic feedback works
- [ ] Save/load persists after closing app
- [ ] Back button exits app (from main menu)
- [ ] No performance issues
- [ ] Works on different screen sizes

### 3.7 Build Release APK/AAB

#### Create Keystore (First Time Only)
```bash
# Generate signing key
keytool -genkey -v -keystore warplines-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias warplines

# Save keystore in safe location (NOT in git!)
# Remember the passwords!
```

#### Configure Signing
Create `android/key.properties`:
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=warplines
storeFile=/path/to/warplines-release-key.jks
```

**⚠️ IMPORTANT**: Add to `.gitignore`:
```
android/key.properties
*.jks
*.keystore
```

Edit `android/app/build.gradle`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Build Release AAB (App Bundle)
```bash
cd android
./gradlew bundleRelease

# AAB location: android/app/build/outputs/bundle/release/app-release.aab
```

**Why AAB?**
- Google Play requires AAB (not APK) since August 2021
- Smaller download size (dynamic delivery)
- Automatic APK generation for different device configs

---

## Phase 4: iOS Build & Deployment

### 4.1 Prerequisites (macOS Only)
```bash
# Install Xcode from App Store (15+ required)
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Verify
xcodebuild -version
pod --version
```

### 4.2 Open iOS Project
```bash
# Sync latest build
npm run build
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 4.3 Configure iOS Project

#### Update Info.plist
Edit `ios/App/App/Info.plist`:
```xml
<dict>
    <key>CFBundleDisplayName</key>
    <string>Warp Lines</string>

    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>

    <key>CFBundleVersion</key>
    <string>1</string>

    <!-- Force portrait orientation -->
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>

    <!-- Disable iPad split view -->
    <key>UIRequiresFullScreen</key>
    <true/>

    <!-- Status bar style -->
    <key>UIStatusBarStyle</key>
    <string>UIStatusBarStyleLightContent</string>

    <!-- Privacy descriptions (required even if not used) -->
    <key>NSCameraUsageDescription</key>
    <string>This app does not use the camera.</string>

    <key>NSMicrophoneUsageDescription</key>
    <string>This app does not use the microphone.</string>
</dict>
```

#### Update App Icons
1. Open Xcode
2. Navigate to `App → App → Assets.xcassets → AppIcon`
3. Drag and drop 1024x1024 PNG icon
4. Xcode will auto-generate all sizes

**Or** use https://appicon.co/ to generate all sizes

#### Create Splash Screen
1. Open `LaunchScreen.storyboard` in Xcode
2. Design simple splash screen (logo + background)
3. Or use Image asset:
   - Add image to `Assets.xcassets`
   - Reference in storyboard

### 4.4 Set Bundle Identifier
In Xcode:
1. Select project root (App)
2. Select target (App)
3. General tab → Identity
4. Bundle Identifier: `com.warplines.game`
5. Display Name: `Warp Lines`
6. Version: `1.0.0`
7. Build: `1`

### 4.5 Test on Simulator
```bash
# In Xcode:
# Product → Destination → iPhone 15 Pro (or any simulator)
# Product → Run (⌘R)

# Or command line:
xcodebuild -workspace ios/App/App.xcworkspace \
           -scheme App \
           -sdk iphonesimulator \
           -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
           build
```

**Testing Checklist**:
- [ ] App launches without crashes
- [ ] Touch controls work
- [ ] Audio plays
- [ ] Haptic feedback works (on device, not simulator)
- [ ] Save/load persists after closing app
- [ ] Safe area respected (notch, dynamic island)
- [ ] Works on all iPhone sizes (SE to Pro Max)
- [ ] Works on iPad (if supporting)

### 4.6 Test on Real Device
1. Connect iPhone via USB
2. Xcode → Window → Devices and Simulators
3. Trust computer on iPhone
4. Select your device in Xcode destination menu
5. Product → Run (⌘R)

**First Time Setup**:
- Xcode → Preferences → Accounts
- Add Apple ID
- Download certificates
- Xcode will create Free Provisioning Profile (for testing)

### 4.7 Build for App Store

#### Setup Apple Developer Account
1. Enroll at https://developer.apple.com/programs/ ($99/year)
2. Create App ID: `com.warplines.game`
3. Create Provisioning Profiles (Xcode can do automatically)

#### Configure Signing in Xcode
1. Select project root
2. Signing & Capabilities tab
3. Team: Select your Apple Developer team
4. Signing Certificate: Apple Distribution
5. Provisioning Profile: App Store profile

#### Archive Build
```bash
# In Xcode:
# Product → Destination → Any iOS Device (arm64)
# Product → Archive

# Wait for build (can take 5-10 minutes)
# Organizer window opens automatically
```

#### Upload to App Store Connect
1. In Organizer window, select archive
2. Click "Distribute App"
3. Choose "App Store Connect"
4. Upload
5. Wait for processing (can take 30-60 minutes)

---

## Phase 5: Google Play Deployment

### 5.1 Create Google Play Console Account
1. Go to https://play.google.com/console
2. Sign up ($25 one-time registration fee)
3. Complete account verification

### 5.2 Create App in Console
1. Play Console → All apps → Create app
2. App details:
   - Name: Warp Lines
   - Default language: English (United States)
   - App or game: Game
   - Free or paid: Free
3. Accept declarations
4. Create app

### 5.3 Complete Store Listing

#### Main Store Listing
- **App name**: Warp Lines
- **Short description** (80 chars):
  ```
  Strategic board game - Capture pieces by jumping in this 3D abstract puzzle
  ```

- **Full description** (4000 chars):
  ```
  🎯 WARP LINES - Master the Art of Strategic Capture

  Warp Lines is a beautiful 3D abstract strategy game that combines the classic
  mechanics of jump-based capture games with stunning modern visuals and smooth
  gameplay. Challenge yourself against sophisticated AI opponents or play with
  friends locally.

  🎮 GAMEPLAY
  - Jump over opponent pieces to capture them
  - Plan multi-jump combos for maximum captures
  - Reach the opponent's back rank to promote to King
  - Kings can move in all directions for ultimate power
  - Force your opponent into positions with no legal moves

  ✨ FEATURES
  - Smooth 3D board with realistic shadows and lighting
  - Two stunning themes: Sovereign (luxury) and Cyber (futuristic)
  - Four AI difficulty levels from beginner to expert
  - Configurable board sizes (6x6, 8x8, 10x10, 12x12)
  - Infiltration mode for advanced strategic gameplay
  - Undo/redo moves to perfect your strategy
  - Save and resume games anytime
  - Replay completed games to learn from mistakes
  - Beautiful ambient music and satisfying sound effects
  - Offline play - no internet required
  - No ads, no in-app purchases, no distractions

  🧠 PERFECT FOR
  - Strategy game fans
  - Puzzle enthusiasts
  - Players who enjoy chess, checkers, or abstract games
  - Anyone looking for a relaxing but challenging brain workout
  - Offline gaming during commutes or travel

  🎨 DUAL THEMES
  Switch between two beautiful visual styles:
  - Sovereign: Elegant marble and rose gold aesthetic
  - Cyber: Neon-lit futuristic grid with holographic effects

  🤖 AI OPPONENTS
  - Easy: Perfect for learning the game
  - Medium: Casual challenge
  - Hard: Serious competition
  - Expert: Ultimate test of skill

  📱 OPTIMIZED FOR ALL DEVICES
  - Works perfectly on phones and tablets
  - Responsive design for all screen sizes
  - Smooth 60fps performance even on budget devices
  - Small download size, minimal battery usage

  🎵 IMMERSIVE AUDIO
  - Theme-matched background music
  - Satisfying sound effects for every action
  - Full volume controls
  - Mute option for silent play

  💾 NEVER LOSE PROGRESS
  - Auto-save after every move
  - Manual save slots for multiple games
  - Resume your last game instantly
  - Cloud sync coming soon

  Warp Lines is completely free with no hidden costs. No ads interrupt your
  gameplay. No purchases required to unlock features. Just pure strategic
  gameplay designed for players who appreciate elegant game design.

  Download now and experience the perfect blend of classic strategy and modern
  game design!
  ```

#### Graphics Assets
Create and upload:
1. **App Icon** (512x512 PNG)
   - High-res version of your launcher icon
   - No transparency, no rounded corners

2. **Feature Graphic** (1024x500 PNG)
   - Horizontal banner image
   - Showcases game with text overlay

3. **Screenshots** (at least 2, recommended 8)
   - Phone screenshots: 1080x1920 or 1440x2560
   - 7-inch tablet: 1080x1776 or 1200x1920
   - 10-inch tablet: 1200x1920 or 1600x2560

   **Suggested screenshots**:
   - Game board in Sovereign theme
   - Game board in Cyber theme
   - Main menu
   - Mid-game position showing strategy
   - Settings panel
   - Win screen with confetti
   - AI difficulty selector
   - Board size options

4. **Video** (optional but highly recommended)
   - 30-second gameplay trailer
   - Upload to YouTube as unlisted
   - Add link in Play Console

#### Categorization
- **Category**: Board
- **Tags**: Strategy, Puzzle, Board Game, Offline

#### Contact Details
- **Email**: your-support@email.com
- **Phone**: Optional
- **Website**: Optional (or GitHub repo)
- **Privacy Policy URL**: Required if collecting any data
  - If not collecting data, create simple privacy policy:
    ```
    https://yourdomain.com/privacy-policy.html
    (Or host on GitHub Pages)
    ```

### 5.4 Content Rating
1. Play Console → Content rating → Start questionnaire
2. Select IARC
3. Answer questions:
   - **Violence**: None
   - **Sexuality**: None
   - **Language**: None
   - **Controlled Substances**: None
   - **Gambling**: None
   - **Realistic**: Board game (not realistic)
4. Submit
5. Receive rating: PEGI 3, ESRB Everyone, etc.

### 5.5 Target Audience & Content

#### Target Age
- Primary: 13-17, 18+
- Appeals to all ages but primarily teens/adults

#### Data Safety
1. Play Console → Data safety
2. If NOT collecting any data:
   - Does your app collect or share user data? **No**
   - Submit
3. If using analytics or Firebase:
   - Declare exactly what data is collected
   - Explain why it's collected
   - Confirm encryption in transit
   - Confirm deletion option

### 5.6 App Access
- Is your app restricted? **No**
- Are there any restrictions? **No**
- Special access (if app doesn't need special permissions): **None required**

### 5.7 News Apps (Skip)
- Is this a news app? **No**

### 5.8 COVID-19 Contact Tracing/Status Apps (Skip)
- Is this app related to COVID-19? **No**

### 5.9 Government Apps (Skip)
- Is this a government app? **No**

### 5.10 Create Release

#### Internal Testing (Recommended First)
1. Play Console → Testing → Internal testing
2. Create release
3. Upload AAB file (`app-release.aab`)
4. Release name: `1.0.0 (1)` or similar
5. Release notes:
   ```
   Initial release
   - Complete Warp Board gameplay
   - 4 AI difficulty levels
   - 2 beautiful themes
   - Offline play
   - Save/load games
   - Undo/redo
   ```
6. Add testers (email addresses)
7. Review and roll out
8. Share testing link with testers
9. Collect feedback, fix bugs
10. Update and roll out new internal versions

#### Closed Testing (Optional)
- Invite up to 100 testers via email list
- Get wider feedback before public release
- Test on more device types

#### Open Testing (Beta)
- Available to anyone with the link
- Appears in Play Store as "Early Access"
- Great for building initial user base

#### Production Release
1. Play Console → Production
2. Create release
3. Upload final AAB
4. Version: `1.0.0`
5. Version code: `1`
6. Release notes for all languages:
   ```
   🎮 Warp Lines v1.0.0 - Initial Release

   Welcome to Warp Lines! Enjoy:
   ✨ Strategic board game with jump-based captures
   🎨 Two stunning themes (Sovereign & Cyber)
   🤖 AI opponents from beginner to expert
   📏 Multiple board sizes (6x6 to 12x12)
   🎵 Beautiful music and sound effects
   💾 Save games and replay system
   🚫 No ads, no in-app purchases

   Have fun and happy gaming!
   ```
7. Review release summary
8. **Start rollout to Production**

**Review Time**: 1-7 days typically (can be faster)

### 5.11 Post-Submission Checklist
- [ ] Check for review status daily
- [ ] Respond to any Google messages promptly
- [ ] Have app ready to go live within 7 days of approval
- [ ] Monitor crash reports (if any pre-launch testing found issues)

---

## Phase 6: Apple App Store Deployment

### 6.1 Create App Store Connect Account
1. Go to https://appstoreconnect.apple.com
2. Sign in with Apple Developer account
3. Accept agreements

### 6.2 Create App
1. Apps → (+) → New App
2. Platforms: iOS (and iPadOS if supporting)
3. Name: Warp Lines
4. Primary Language: English (U.S.)
5. Bundle ID: Select `com.warplines.game`
6. SKU: `WARPLINES001` (unique identifier, your choice)
7. User Access: Full Access

### 6.3 Complete App Information

#### General
- **App Name**: Warp Lines (30 chars max)
- **Subtitle**: Strategic Board Game (30 chars)
- **Category**:
  - Primary: Games → Board
  - Secondary: Games → Strategy
- **Content Rights**: No third-party content

#### Pricing and Availability
- **Price**: Free
- **Availability**: All countries
- **App Distribution**: App Store (not just TestFlight)

#### Age Rating
1. Complete questionnaire:
   - Unrestricted Web Access: No
   - Cartoon/Fantasy Violence: None
   - Realistic Violence: None
   - Profanity: None
   - Mature/Suggestive Themes: None
   - Horror/Fear Themes: None
   - Medical/Treatment: None
   - Alcohol/Drugs/Tobacco: None
   - Gambling: No
   - Made for Kids: No (but appropriate for 4+)
2. Result: **4+** (everyone)

### 6.4 Version Information (1.0)

#### Screenshots (Required)
Must provide for at least one device size:
- **6.7" Display** (iPhone 15 Pro Max): 1290x2796
- **6.5" Display** (iPhone 11 Pro Max): 1242x2688
- **5.5" Display** (iPhone 8 Plus): 1242x2208

Optional:
- **iPad Pro (12.9")**: 2048x2732
- **iPad Pro (12.9", 2nd gen)**: 2048x2732

**Tip**: Provide all sizes for best presentation

**Suggested screenshots** (same as Android):
1. Main menu with theme options
2. Game board - Sovereign theme
3. Game board - Cyber theme
4. Mid-game showing captures
5. Settings panel
6. AI difficulty selection
7. Win screen
8. Board size options

#### App Preview Video (Optional but Recommended)
- 15-30 seconds
- Vertical orientation (1080x1920)
- Shows actual gameplay
- No music with lyrics
- Upload directly to App Store Connect

#### Promotional Text (170 chars, updateable anytime)
```
New: Infiltration mode for advanced strategy! Master the art of capture in
this beautiful 3D board game. 4 AI levels, 2 themes, offline play.
```

#### Description (4000 chars)
```
Master Strategic Capture in Beautiful 3D

Warp Lines brings the classic joy of jump-based strategy games into the modern
era with stunning 3D graphics, intelligent AI, and flawless offline gameplay.

PURE STRATEGY
Every move counts in this elegant abstract game. Jump over opponent pieces to
capture them, plan multi-jump combos, and promote pieces to powerful Kings.
Simple rules, deep strategy.

STUNNING VISUALS
• Smooth 3D board with realistic lighting
• Two gorgeous themes: Sovereign (marble luxury) and Cyber (neon future)
• Polished animations and effects
• Perfect for phones and tablets

INTELLIGENT AI
Four difficulty levels ensure perfect challenge:
• Easy - Learn the ropes
• Medium - Casual play
• Hard - Real competition
• Expert - Ultimate challenge

FEATURES YOU'LL LOVE
✓ Offline play - no internet needed
✓ Multiple board sizes (6x6 to 12x12)
✓ Infiltration mode for advanced tactics
✓ Undo/redo your moves
✓ Save and resume games
✓ Replay system to review games
✓ Beautiful music and sound effects
✓ No ads, ever
✓ No in-app purchases
✓ Designed for pure gameplay

MADE FOR STRATEGY FANS
Perfect for players who enjoy chess, checkers, or any abstract strategy game.
Quick to learn, endlessly replayable.

PRIVACY FIRST
No data collection. No account required. Just download and play.

Download Warp Lines today and experience strategic gaming at its finest.
```

#### Keywords (100 chars, comma-separated)
```
board game,strategy,puzzle,checkers,offline,brain,abstract,3d,chess,logic
```

#### Support URL
- Your website or GitHub repo
- Example: `https://github.com/yourusername/warp-lines`

#### Marketing URL (Optional)
- Landing page if you have one

#### Privacy Policy URL (Required)
- Even if not collecting data
- Example: `https://yourdomain.com/privacy`

### 6.5 App Review Information

#### Contact Information
- **First/Last Name**: Your name
- **Phone Number**: Your phone
- **Email**: Your email
- **Notes**:
  ```
  Warp Lines is a complete offline board game requiring no special setup.
  Simply launch and tap "Play" to start a game against AI or local multiplayer.
  No account or internet connection needed.
  ```

#### Demo Account (if app requires login)
- Not applicable for this app

#### Attachments
- Optional screenshots showing specific features

### 6.6 Build Upload
Already done in Phase 4.7 (Archive and Upload)

1. Wait for processing (30-60 minutes)
2. Refresh App Store Connect
3. Build appears in TestFlight → Builds section
4. Select build for App Store review
5. Click (+) next to "Build"
6. Select your uploaded build
7. Save

### 6.7 TestFlight Beta Testing (Highly Recommended)

#### Internal Testing
1. TestFlight → Internal Testing
2. Add internal testers (up to 100, must be in App Store Connect team)
3. Enable automatic distribution
4. Testers receive email with TestFlight link
5. Collect feedback

#### External Testing
1. TestFlight → External Testing
2. Create test group (up to 10,000 testers)
3. Add beta testers by email or public link
4. Requires brief App Review (1-2 days)
5. Set what to test description
6. Distribute to external testers
7. Collect feedback

### 6.8 Submit for Review
1. Complete all sections (green checkmarks)
2. Version page → Submit for Review
3. Confirm submission
4. Wait for review

**Review Timeline**:
- Initial review: 1-3 days typically
- Updates: Often faster (24-48 hours)

**Status Tracking**:
- Waiting for Review
- In Review (app is being tested)
- Pending Developer Release (approved, waiting for your release)
- Ready for Sale (live in App Store)

### 6.9 Respond to Review Feedback
If app is rejected:
1. Read rejection reason carefully
2. Make necessary changes
3. Upload new build
4. Respond in Resolution Center
5. Resubmit

Common rejection reasons:
- Crashes on launch
- Missing features mentioned in description
- Privacy policy issues
- Misleading screenshots
- Spam/low quality (shouldn't apply to well-made game)

### 6.10 Release App
Once approved:

**Option A: Manual Release**
- Status: Pending Developer Release
- Click "Release This Version"
- App goes live within hours

**Option B: Automatic Release**
- Configure in Version → App Store Version Release
- Set to "Automatically release"
- Goes live immediately upon approval

---

## Phase 7: Web Deployment

### 7.1 Choose Hosting Platform

#### Option A: Vercel (Recommended)
**Pros**: Free, automatic HTTPS, global CDN, GitHub integration
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Select account
# - Link to existing project or create new
# - Confirm settings

# Production deployment
vercel --prod
```

**Automatic Deployment**:
1. Push to GitHub
2. Import repo in Vercel dashboard
3. Auto-deploys on every push to main branch

#### Option B: Netlify
**Pros**: Free, drag-and-drop deployment, forms, serverless functions
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

#### Option C: GitHub Pages
**Pros**: Free, integrated with GitHub
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

Configure:
- Repository Settings → Pages
- Source: gh-pages branch
- Save
- Access at: `https://username.github.io/warp-lines`

#### Option D: Firebase Hosting
**Pros**: Already using Firebase, global CDN, preview channels
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

### 7.2 Configure Custom Domain (Optional)
1. Buy domain (Namecheap, Google Domains, etc.)
2. Add domain in hosting platform
3. Update DNS records (platform provides instructions)
4. Wait for DNS propagation (up to 48 hours)
5. SSL certificate auto-generated

### 7.3 Progressive Web App (PWA) Setup
Make app installable on web:

#### Create manifest.json
`public/manifest.json`:
```json
{
  "name": "Warp Lines",
  "short_name": "Warp Lines",
  "description": "Strategic board game - Capture pieces by jumping",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#8a4853",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Create Service Worker (Optional)
For offline caching:
```bash
npm install workbox-cli -D

# Generate service worker
npx workbox wizard

# Follow prompts
# Generates workbox-config.js and sw.js
```

#### Update index.html
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#8a4853">
```

---

## Phase 8: Post-Launch Monitoring

### 8.1 Set Up Analytics (Privacy-Friendly)

#### Option A: Simple Analytics (Privacy-first)
```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```
- No cookies, GDPR-compliant
- Just visitor counts and page views

#### Option B: Plausible Analytics
```html
<script defer data-domain="warplines.com" src="https://plausible.io/js/script.js"></script>
```
- Privacy-friendly, GDPR-compliant
- Beautiful dashboards

#### Option C: Google Analytics (If needed)
- More detailed but requires cookie consent

### 8.2 Monitor App Performance

#### Android (Google Play Console)
- Dashboard → Statistics
  - Installs by country, device, Android version
  - Crashes and ANRs (App Not Responding)
  - User ratings and reviews
- Pre-launch report (automated testing on Firebase Test Lab)

#### iOS (App Store Connect)
- App Analytics
  - Downloads, updates, sessions
  - Crashes (requires opt-in from users)
  - Retention metrics
- Ratings and reviews

### 8.3 Crash Reporting

#### Sentry (Recommended)
```bash
npm install @sentry/react @sentry/capacitor

# src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
  environment: import.meta.env.MODE
});
```

#### Firebase Crashlytics (Alternative)
- Integrated with Android/iOS
- Free
- Automatic crash reporting

### 8.4 User Feedback

#### In-App Feedback
Add "Send Feedback" button that opens email:
```typescript
const feedbackEmail = "feedback@warplines.com";
const subject = encodeURIComponent("Warp Lines Feedback");
window.location.href = `mailto:${feedbackEmail}?subject=${subject}`;
```

#### Review Monitoring
- Google Play: Enable email notifications for reviews
- App Store: App Store Connect → Ratings and Reviews
- Respond to reviews (especially negative ones)

---

## Timeline Summary

| Phase | Task | Duration | Total |
|-------|------|----------|-------|
| 1 | Development complete | (Already done) | - |
| 2 | Capacitor setup | 2 hours | 2h |
| 3 | Android build & test | 1 day | 1d |
| 4 | iOS build & test (macOS) | 1 day | 2d |
| 5 | Google Play submission | 2 hours | 2d 2h |
| 5 | Google Play review | 1-7 days | 3-9d |
| 6 | App Store submission | 2 hours | 3-9d |
| 6 | App Store review | 1-3 days | 4-12d |
| 7 | Web deployment | 1 hour | 4-12d |
| 8 | Monitoring setup | 2 hours | 4-12d |

**Total Time to Launch**: 4-12 days (mostly waiting for reviews)
**Active Work**: ~3-4 days

---

## Troubleshooting

### Android Build Issues

**Issue**: Build fails with "SDK not found"
**Solution**:
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
```

**Issue**: Gradle build fails
**Solution**:
```bash
cd android
./gradlew clean
./gradlew build --stacktrace
```

**Issue**: App crashes on launch
**Solution**: Check `adb logcat` for errors
```bash
adb logcat | grep -i "error\|exception"
```

### iOS Build Issues

**Issue**: "No signing identity found"
**Solution**: Xcode → Preferences → Accounts → Download Manual Profiles

**Issue**: "Module not found"
**Solution**:
```bash
cd ios/App
pod install
```

**Issue**: Build succeeds but archive fails
**Solution**: Check Build Settings → Skip Install (should be NO for app target)

### Store Submission Issues

**Issue**: Google Play - "Your app contains policy violations"
**Solution**: Read email carefully, fix specific issues, resubmit

**Issue**: App Store - "Binary rejected"
**Solution**: Check Resolution Center for reason, upload new build

**Issue**: Reviews taking too long
**Solution**: Be patient, check status daily, don't resubmit

---

## Maintenance & Updates

### Releasing Updates

#### Android
1. Increment version in `android/app/build.gradle`:
   ```gradle
   versionCode 2  // Increment by 1
   versionName "1.0.1"  // Update version
   ```
2. Build new AAB
3. Upload to Play Console
4. Add release notes
5. Roll out (can be staged: 10% → 50% → 100%)

#### iOS
1. Increment version in Xcode:
   - Version: `1.0.1`
   - Build: `2`
2. Archive and upload
3. Create new version in App Store Connect
4. Add "What's New" text
5. Submit for review

#### Web
```bash
# Simply redeploy
npm run build
vercel --prod  # or your platform command
```

### Monitoring Performance
- Weekly: Check analytics, crash reports
- Monthly: Review ratings/reviews, plan updates
- Quarterly: Major feature updates

---

## Conclusion

You now have a complete guide to launch Warp Lines on all platforms!

**Next Steps**:
1. ✅ Finish Phase 1 implementation (game logic)
2. ⏳ Set up Capacitor (Phase 2)
3. ⏳ Build and test on Android (Phase 3)
4. ⏳ Build and test on iOS if macOS available (Phase 4)
5. ⏳ Submit to stores (Phases 5-6)
6. ⏳ Deploy web version (Phase 7)
7. ⏳ Monitor and iterate (Phase 8)

**Estimated Timeline**: 4-12 days from now to live in stores!

Good luck with your launch! 🚀
