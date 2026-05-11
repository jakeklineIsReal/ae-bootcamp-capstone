# Research: Wyatt's Scooter Adventure

**Date**: 2026-05-11  
**Purpose**: Phase 0 research to resolve technical unknowns and establish best practices for implementation

---

## 1. Phaser 3 + TypeScript Integration

### Decision: Use Phaser 3.70+ with TypeScript 5.x
**Rationale**: 
- Phaser 3 is the most popular HTML5 game framework with excellent documentation
- TypeScript provides type safety and improved Copilot autocomplete
- Strong community support and extensive examples available
- Built-in physics engine suitable for side-scrolling mechanics
- Scene-based architecture naturally fits our game flow (Start → Game → Celebration)

### Best Practices:
- **Scene Management**: Use Phaser's scene system for clear separation (BootScene, StartScene, GameScene, CelebrationScene)
- **Type Safety**: Define interfaces for game state, config, and entity properties
- **Asset Loading**: Preload all assets in BootScene to prevent mid-game loading
- **Game Config**: Externalize configuration (speeds, jump heights, collision boxes) to constants file
- **Update Loop**: Use Phaser's update() method for game logic, avoid setInterval/setTimeout

### Key Resources:
- Phaser 3 TypeScript examples: https://github.com/photonstorm/phaser3-typescript-project-template
- Official Phaser 3 documentation: https://photonstorm.github.io/phaser3-docs/
- Community tutorials: Ourcade.co (excellent TypeScript + Phaser content)

**Alternatives Considered**:
- **p5.js**: Simpler but lacks built-in physics and collision; would require manual implementation
- **PixiJS**: Lower-level, more control but steeper learning curve; overkill for this scope
- **Godot (web export)**: Considered but larger bundle size and less web-optimized than Phaser

---

## 2. Vite Build Configuration for Phaser

### Decision: Use Vite 5.x as build tool with custom Phaser configuration
**Rationale**:
- Extremely fast hot module reload (HMR) for rapid iteration
- Native ES modules support works well with modern Phaser
- Simple configuration with good TypeScript support
- Optimized production builds with code splitting
- Better developer experience than Webpack for this use case

### Best Practices:
- **Asset Handling**: Place assets in `public/` directory to avoid bundling (Phaser loads at runtime)
- **Build Optimization**: Configure Vite to exclude Phaser from tree-shaking (mark as external)
- **Dev Server**: Set port and open browser automatically for quick testing
- **Production Build**: Enable minification and gzip compression for faster loads
- **Base Path**: Configure proper base path for GitHub Pages deployment

### Configuration Essentials:
```typescript
// vite.config.ts essentials
export default defineConfig({
  base: './', // For GitHub Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'] // Separate chunk for better caching
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

**Alternatives Considered**:
- **Webpack**: More complex configuration, slower build times
- **Parcel**: Less control over build process, occasional Phaser compatibility issues
- **Rollup**: Requires more manual configuration than Vite

---

## 3. Side-Scrolling Mechanics in Phaser

### Decision: Infinite scrolling background with tile sprites + camera follow
**Rationale**:
- TileSprite in Phaser allows seamless repeating backgrounds
- Camera follows player sprite for smooth movement feel
- Parallax scrolling adds depth perception (background moves slower than foreground)
- Keeps player sprite centered on screen (easier for young children to track)
- Memory-efficient for longer journeys

### Best Practices:
- **Camera Setup**: Lock camera to player Y-axis, follow X-axis with lerp for smooth movement
- **Parallax Layers**: Background (0.2x speed), midground (0.5x speed), foreground (1x speed)
- **Bounds**: Set world bounds to define start (home) and end (park) positions
- **Player Movement**: Auto-forward movement option OR simple right arrow key
- **Jump Mechanics**: Fixed jump velocity with gravity for predictable arc

### Implementation Pattern:
```typescript
// Camera follow with smooth tracking
this.cameras.main.startFollow(player, true, 0.1, 0.1);
this.cameras.main.setDeadzone(100, 150);

// Parallax scrolling in update loop
background.tilePositionX += scrollSpeed * 0.2;
midground.tilePositionX += scrollSpeed * 0.5;
```

**Alternatives Considered**:
- **Static screen with moving player**: Less visually engaging, harder to create "journey" feel
- **Top-down view**: Doesn't match "scooter ride" mental model as well as side view
- **Isometric**: Too complex for target age group and development timeline

---

## 4. Accessibility Features for Young Players

### Decision: Multi-sensory feedback system with visual + audio cues for every action
**Rationale**:
- Young children rely heavily on audio feedback to understand cause-effect
- Color blindness affects ~8% of males; shapes provide redundant encoding
- Audio cues support players who may have visual processing challenges
- Positive reinforcement audio ("Great job!", "Awesome!") enhances engagement
- Parent volume control respects household needs

### Best Practices:
- **Audio Manager**: Centralize sound control with volume settings and mute capability
- **Unique SFX**: Each collectible type has distinct sound (star = twinkle, heart = chime, circle = pop)
- **Action Feedback**: Every button press plays immediate audio (jump, trick, movement start)
- **Visual Feedback**: Particle effects + sprite animations + UI counters
- **Shape Encoding**: Stars ⭐ (5 points), Hearts ❤️ (rounded), Circles ⚪ (simple round)
- **High Contrast**: Use distinct colors with high contrast ratios (WCAG AA minimum)

### Implementation Pattern:
```typescript
// AudioManager with categorized sounds
class AudioManager {
  playSFX(soundKey: string, volume: number = 0.7) { /* ... */ }
  playMusic(musicKey: string, loop: boolean = true) { /* ... */ }
  setVolume(category: 'sfx' | 'music', volume: number) { /* ... */ }
}

// Collectible with shape + sound
class Collectible {
  shape: 'star' | 'heart' | 'circle';
  soundKey: string; // Maps to unique SFX
  color: string; // Bright, distinct colors
}
```

**Alternatives Considered**:
- **Visual-only feedback**: Excludes players who benefit from audio cues
- **Text labels**: Target player cannot read; violates age-first design
- **Color-only encoding**: Fails accessibility for color blind players

---

## 5. Touch Controls for Tablet/Mobile

### Decision: Dual input support (keyboard + touch) with responsive layout
**Rationale**:
- 4-year-olds often use tablets; touch control is essential
- Keyboard support enables desktop play and testing
- Large touch targets prevent frustration (minimum 44x44px)
- Visual feedback on touch (button highlight) confirms input
- Auto-forward movement option reduces control complexity

### Best Practices:
- **Touch Regions**: Full left/right screen halves for movement, center for jump
- **Virtual Buttons**: Optional on-screen buttons with large tap areas
- **Gesture Support**: Simple tap to jump, swipe up for jump (alternative)
- **Responsive Canvas**: Canvas scales to fit screen while maintaining aspect ratio
- **Orientation**: Support both portrait and landscape (landscape preferred)

### Implementation Pattern:
```typescript
// Touch input zones
this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
  if (pointer.x < this.scale.width / 2) {
    // Left side - move left or nothing (auto-forward mode)
  } else if (pointer.x > this.scale.width / 2 && pointer.y > 100) {
    // Right side - jump
    this.player.jump();
    this.audioManager.playSFX('jump');
  }
});

// Responsive scaling
scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 800,
  height: 600
}
```

**Alternatives Considered**:
- **Keyboard-only**: Excludes tablet users (primary target device)
- **Complex gestures**: Too difficult for 4-year-old; violates simplicity principle
- **Gamepad-only**: Requires additional hardware; increases barrier to entry

---

## 6. LocalStorage for Customization Persistence

### Decision: Browser LocalStorage with JSON serialization for preferences
**Rationale**:
- No backend server required (keeps project simple)
- Preferences persist across browser sessions
- Synchronous API is simple to implement
- Works offline after initial load
- Adequate for limited data (helmet color, scooter design)

### Best Practices:
- **Wrapper Class**: Abstract LocalStorage behind utility class for error handling
- **Default Values**: Provide sensible defaults if no saved preferences exist
- **Versioning**: Include version key to handle future schema changes
- **Error Handling**: Graceful degradation if LocalStorage unavailable (Safari private mode)
- **Data Validation**: Validate loaded data to prevent corruption issues

### Implementation Pattern:
```typescript
interface GamePreferences {
  version: string;
  helmetColor: string;
  scooterDesign: string;
  volume: {
    sfx: number;
    music: number;
  };
}

class LocalStorageManager {
  private readonly STORAGE_KEY = 'wyatt-scooter-prefs';
  private readonly CURRENT_VERSION = '1.0.0';
  
  savePreferences(prefs: GamePreferences): void { /* ... */ }
  loadPreferences(): GamePreferences { /* ... */ }
  clearPreferences(): void { /* ... */ }
}
```

**Alternatives Considered**:
- **Cookies**: More complex, size limits, not designed for app state
- **IndexedDB**: Overkill for simple key-value storage; async API adds complexity
- **Backend API**: Requires server, authentication, network dependency; violates simplicity

---

## 7. Asset Management & Optimization

### Decision: Sprite sheets + audio sprite + lazy loading strategy
**Rationale**:
- Sprite sheets reduce HTTP requests and improve load time
- Audio sprites combine multiple SFX into single file (reduces latency)
- Optimized assets keep initial bundle size under 5MB target
- WebP format for sprites (better compression than PNG)
- MP3/OGG dual format for audio (cross-browser compatibility)

### Best Practices:
- **Sprite Sheet Tools**: Use TexturePacker or free alternatives (Leshy SpriteSheet)
- **Image Optimization**: Compress images with TinyPNG or ImageOptim
- **Audio Format**: 64kbps MP3 for SFX, 128kbps for music (balance quality/size)
- **Preloading**: All essential assets loaded in BootScene with progress bar
- **Asset Naming**: Consistent naming convention (e.g., `player-walk-01.png`)

### Asset Checklist:
**Sprites**: Wyatt (idle, walk, jump, trick), Friends (idle, celebrate), Collectibles (star, heart, circle), Obstacles (puddle, rock, hill), Backgrounds (home, neighborhood, park)
**Audio**: BGM (upbeat music loop), SFX (jump, collect-star, collect-heart, collect-circle, bump, celebration), Voice (great-job, awesome, you-did-it)

### Implementation Pattern:
```typescript
// BootScene asset loading
preload() {
  // Sprite sheets
  this.load.atlas('player', 'assets/sprites/player-sheet.png', 'assets/sprites/player-sheet.json');
  this.load.atlas('collectibles', 'assets/sprites/collectibles-sheet.png', 'assets/sprites/collectibles-sheet.json');
  
  // Audio sprite
  this.load.audioSprite('sfx', 'assets/audio/sfx-sprite.json', [
    'assets/audio/sfx-sprite.mp3',
    'assets/audio/sfx-sprite.ogg'
  ]);
  
  // Progress bar
  this.load.on('progress', (value: number) => {
    progressBar.clear();
    progressBar.fillStyle(0x00ff00, 1);
    progressBar.fillRect(10, 290, 780 * value, 20);
  });
}
```

**Alternatives Considered**:
- **Individual files**: Slower loading, more HTTP requests, poor performance
- **High-res assets**: Larger file size, slower load, overkill for target devices
- **SVG sprites**: Runtime rendering cost, not ideal for game performance

---

## 8. Age-Appropriate Game Patterns

### Decision: "Auto-runner" style with optional manual control + guaranteed success
**Rationale**:
- Auto-forward movement reduces cognitive load (only worry about timing jumps)
- Forgiving collision detection (large hitboxes favor player success)
- No fail states means stress-free experimentation
- Positive feedback loop encourages continued play
- Short play sessions (2-5 min) match attention span

### Best Practices:
- **Difficulty Curve**: Flat difficulty (no ramping challenge); focus on exploration
- **Obstacle Design**: Telegraph obstacles early (appear on right side of screen with time to react)
- **Collision Response**: Gentle feedback (slow down, small bump) never game over
- **Visual Clarity**: Large sprites, high contrast, simple backgrounds
- **Immediate Feedback**: Action → Response within 100ms (no delayed consequences)

### Implementation Pattern:
```typescript
// Forgiving collision
private handleObstacle(player: Player, obstacle: Obstacle): void {
  // Gentle slowdown instead of stop
  player.velocity *= 0.7;
  
  // Friendly audio cue
  this.audioManager.playSFX('bump');
  
  // Visual feedback (small bounce)
  this.tweens.add({
    targets: player,
    y: player.y - 10,
    duration: 150,
    yoyo: true
  });
  
  // NEVER: game over, health loss, or failure state
}

// Guaranteed park arrival
private update(): void {
  if (this.player.x >= this.parkPosition) {
    this.scene.start('CelebrationScene', { 
      collectibles: this.score.getCollectibles() 
    });
  }
}
```

**Alternatives Considered**:
- **Challenge-based gameplay**: Frustrating for target age; violates no-failure principle
- **Timer pressure**: Creates stress; inappropriate for 4-year-old
- **Lives/health system**: Implies failure; contradicts positive-only feedback

---

## 9. Deployment to GitHub Pages / Netlify

### Decision: GitHub Pages as primary, Netlify as alternative
**Rationale**:
- GitHub Pages is free, simple, integrates with existing repo
- Automatic deployment via GitHub Actions on push to main
- Custom domain support if desired
- HTTPS by default (secure)
- Netlify alternative offers preview deploys and faster builds

### Best Practices:
- **Build Command**: `npm run build` (Vite outputs to `dist/`)
- **Base Path**: Configure Vite base path for GH Pages subpath (e.g., `/scooter-game/`)
- **404 Handling**: Create 404.html that redirects to index.html (SPA routing)
- **Asset Paths**: Use relative paths for all assets
- **CI/CD**: GitHub Actions workflow automates build and deploy on merge

### Implementation Pattern:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Alternatives Considered**:
- **Vercel**: Excellent but less integrated with GitHub's ecosystem
- **Custom server**: Overkill for static site; adds maintenance burden
- **Itch.io**: Game distribution platform but less accessible than direct URL

---

## 10. Testing Strategy for Young Children

### Decision: Manual playtesting with target user + automated unit tests for systems
**Rationale**:
- 4-year-old cannot provide verbal feedback; observation is primary method
- Watch for: confusion (controls too complex), boredom (not engaging), frustration (failure states)
- Automated tests ensure systems work (collision, audio, scoring) between manual tests
- Parent/guardian interviews provide complementary feedback
- Cross-device testing ensures accessibility

### Best Practices:
- **Observation Protocol**: Watch without instruction; note when player asks questions
- **Success Metrics**: Can player start game within 30 seconds? Complete journey in 5 min?
- **Iteration Frequency**: Test after each major phase (Week 1, Week 2, Week 3)
- **Device Testing**: Desktop (Chrome), Tablet (Safari iOS), Phone (Chrome Android)
- **Audio Testing**: Verify SFX plays, check volume levels (not too loud/quiet)

### Test Coverage:
- **Unit Tests**: CollisionManager, AudioManager, ScoreManager logic
- **Integration Tests**: Scene transitions, asset loading, save/load preferences
- **Manual Tests**: Full playthrough, touch controls, keyboard controls, volume adjustment
- **Accessibility Tests**: Mute audio and verify visual-only playability, test shape recognition

### Implementation Pattern:
```typescript
// Vitest unit test example
describe('CollisionManager', () => {
  it('should slow player on obstacle collision', () => {
    const manager = new CollisionManager();
    const player = createMockPlayer({ velocity: 100 });
    const obstacle = createMockObstacle();
    
    manager.handleCollision(player, obstacle);
    
    expect(player.velocity).toBeLessThan(100);
    expect(player.velocity).toBeGreaterThan(0); // Never stops
  });
});
```

**Alternatives Considered**:
- **Automated E2E tests**: Too complex to set up for game testing; manual observation more valuable
- **A/B testing**: Not applicable for single-user personalized experience
- **Analytics**: Overkill for personal project; observation sufficient

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Framework** | Phaser 3.70+ with TypeScript 5.x | Best HTML5 game framework, strong typing, excellent docs |
| **Build Tool** | Vite 5.x | Fast HMR, simple config, optimized builds |
| **Game Style** | Side-scrolling auto-runner with camera follow | Age-appropriate, reduces cognitive load, feels like journey |
| **Accessibility** | Multi-sensory (audio + visual), shape-based collectibles | Inclusive design, supports diverse needs |
| **Input** | Dual keyboard + touch support | Desktop and tablet play, large touch targets |
| **Storage** | LocalStorage with JSON | Simple, offline-capable, no backend needed |
| **Assets** | Sprite sheets + audio sprite | Optimized loading, reduced requests |
| **Difficulty** | No failure states, forgiving collisions | Stress-free, positive experience, guaranteed success |
| **Deployment** | GitHub Pages with Actions CI/CD | Free, automated, integrated with repo |
| **Testing** | Manual observation + unit tests | Age-appropriate feedback method, system reliability |

**Next Steps**: Proceed to Phase 1 (Design) to create data model, contracts, and quickstart guide.
