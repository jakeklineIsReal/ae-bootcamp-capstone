# Quickstart Guide: Wyatt's Scooter Adventure

**Last Updated**: 2026-05-11  
**Project**: Wyatt's Scooter Adventure  
**Tech Stack**: Phaser 3 + TypeScript + Vite

---

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Modern Web Browser**: Chrome, Firefox, or Safari (latest version)

### Recommended Tools
- **VS Code**: Editor with Copilot extension
- **VS Code Extensions**:
  - TypeScript and JavaScript Language Features (built-in)
  - ESLint
  - Prettier
  - Live Server (optional, Vite provides its own)

### Check Installed Versions
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show v9.x.x or higher
git --version    # Any recent version
```

---

## Project Setup

### 1. Clone or Create Repository
```bash
# If cloning existing repo
git clone <repository-url>
cd wyatts-scooter-adventure

# If creating new project
mkdir wyatts-scooter-adventure
cd wyatts-scooter-adventure
git init
```

### 2. Initialize Node.js Project
```bash
# Create package.json
npm init -y
```

### 3. Install Dependencies

#### Core Dependencies
```bash
# Phaser game framework
npm install phaser

# TypeScript (development dependency)
npm install --save-dev typescript

# Vite build tool and plugins
npm install --save-dev vite vite-plugin-checker
```

#### Testing Dependencies (optional for MVP)
```bash
npm install --save-dev vitest @vitest/ui
```

### 4. Configure TypeScript

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "types": ["phaser"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Configure Vite

Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  base: './', // For GitHub Pages deployment
  plugins: [
    checker({
      typescript: true, // Type checking during build
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'], // Separate chunk for caching
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true, // Auto-open browser
  },
});
```

### 6. Update package.json Scripts

Edit `package.json` to add scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

### 6a. E2E Debug Environment Variables (Playwright)

Use these environment variables to control Playwright runs:

- `E2E_BASE_URL`: Override base URL for live smoke tests.
- `PW_HEADLESS`: Set to `false` to run headed.
- `PW_TRACE`: Use `on` to always capture traces.
- `PW_VIDEO`: Use `on` to always capture videos.

Examples:
```bash
# Live smoke test
E2E_BASE_URL=https://jakeklineisreal.github.io/ae-bootcamp-capstone/ npm run test:e2e

# Headed with trace and video (local or live)
PW_HEADLESS=false PW_TRACE=on PW_VIDEO=on npm run test:e2e
```

---

## Project Structure Setup

### 7. Create Directory Structure
```bash
# Create source directories
mkdir -p src/{scenes,entities,systems,config,utils}

# Create public directories  
mkdir -p public/assets/{sprites,backgrounds,audio/{music,sfx,voice}}

# Create test directory
mkdir -p tests/{unit,integration}

# Create specs documentation (if not exists)
mkdir -p specs/001-scooter-adventure-game/contracts
```

### 8. Create Entry HTML

Create `public/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wyatt's Scooter Adventure</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #87CEEB; /* Sky blue */
      font-family: 'Comic Sans MS', cursive, sans-serif;
    }
    #game-container {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 9. Create Main Entry Point

Create `src/main.ts`:
```typescript
import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';

// Initialize Phaser game
const game = new Phaser.Game(gameConfig);

// Expose globally for debugging (optional)
if (import.meta.env.DEV) {
  (window as any).game = game;
}
```

### 10. Create Game Configuration

Create `src/config/gameConfig.ts`:
```typescript
import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { StartScene } from '../scenes/StartScene';
import { GameScene } from '../scenes/GameScene';
import { CelebrationScene } from '../scenes/CelebrationScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: import.meta.env.DEV, // Debug mode in development
    },
  },
  scene: [BootScene, StartScene, GameScene, CelebrationScene],
  backgroundColor: '#87CEEB', // Sky blue
};
```

### 11. Create Placeholder Scenes

Create `src/scenes/BootScene.ts`:
```typescript
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // TODO: Load assets
    console.log('BootScene: Loading assets...');
  }

  create(): void {
    console.log('BootScene: Assets loaded, transitioning to StartScene');
    this.scene.start('StartScene');
  }
}
```

Create `src/scenes/StartScene.ts`:
```typescript
import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create(): void {
    console.log('StartScene: Press any key to start');
    
    // Temporary: Auto-start after 2 seconds or on key press
    this.input.keyboard?.once('keydown', () => {
      this.scene.start('GameScene');
    });
    
    this.time.delayedCall(2000, () => {
      this.scene.start('GameScene');
    });
  }
}
```

Create `src/scenes/GameScene.ts`:
```typescript
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    console.log('GameScene: Game started!');
    
    // Temporary: Auto-complete after 3 seconds
    this.time.delayedCall(3000, () => {
      this.scene.start('CelebrationScene', {
        score: { totalCollectibles: 0, stars: 0, hearts: 0, circles: 0 },
        tricks: 0,
        timeElapsed: 3,
      });
    });
  }
}
```

Create `src/scenes/CelebrationScene.ts`:
```typescript
import Phaser from 'phaser';

export class CelebrationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CelebrationScene' });
  }

  create(data: any): void {
    console.log('CelebrationScene: You did it!', data);
    
    // Temporary: Restart after 3 seconds
    this.time.delayedCall(3000, () => {
      this.scene.start('StartScene');
    });
  }
}
```

---

## Running the Project

### Development Mode
```bash
# Start development server with hot reload
npm run dev

# Browser should auto-open to http://localhost:3000
# Changes to source files will trigger automatic reload
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Output will be in dist/ directory
# Preview production build locally
npm run preview
```

### Testing
```bash
# Run unit tests (once configured)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test -- --ui
```

---

## Development Workflow

### Typical Development Loop
1. **Start dev server**: `npm run dev`
2. **Edit files** in `src/` directory
3. **Save changes** - browser auto-reloads
4. **Check browser console** for logs and errors
5. **Iterate** on features

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/player-movement

# Make changes, stage, and commit
git add .
git commit -m "feat: implement player movement controls"

# Push to remote
git push origin feature/player-movement

# Merge to main when ready
git checkout main
git merge feature/player-movement
```

---

## Debugging

### Browser DevTools
- **Console**: View logs, errors, warnings
- **Sources**: Set breakpoints in TypeScript (via source maps)
- **Network**: Check asset loading times
- **Performance**: Profile frame rate and rendering

### Phaser Debug Mode
```typescript
// In gameConfig.ts
physics: {
  arcade: {
    debug: true, // Shows collision boxes, velocities
  }
}
```

### Common Issues

#### Port Already in Use
```bash
# If port 3000 is occupied, Vite will try next available port
# Or manually specify port in vite.config.ts
```

#### Type Errors
```bash
# Ensure Phaser types are recognized
npm install --save-dev @types/phaser
```

#### Assets Not Loading
- Check paths are relative to `public/` directory
- Phaser loads from `public/assets/`, not `src/`
- Verify assets exist in correct location

---

## Asset Preparation

### Sprite Assets
- **Format**: PNG with transparency
- **Size**: Optimize for web (<500KB per sprite sheet)
- **Naming**: Consistent convention (e.g., `player-idle.png`, `player-walk-01.png`)
- **Tools**: 
  - TexturePacker (sprite sheet packing)
  - Aseprite (pixel art creation)
  - GIMP/Photoshop (image editing)

### Audio Assets
- **Music Format**: MP3 (128kbps) or OGG
- **SFX Format**: MP3 (64kbps) or OGG  
- **Max Duration**: Music 30-60s loops, SFX <2s
- **Tools**:
  - Audacity (audio editing)
  - Bfxr (simple SFX generation)
  - FreeSound.org (free SFX library)

### Asset Organization
```
public/assets/
├── sprites/
│   ├── wyatt-sheet.png
│   ├── wyatt-sheet.json (atlas data)
│   ├── friends-sheet.png
│   └── collectibles-sheet.png
├── backgrounds/
│   ├── home.png
│   ├── neighborhood.png
│   └── park.png
└── audio/
    ├── music/
    │   ├── gameplay-loop.mp3
    │   └── celebration.mp3
    └── sfx/
        ├── jump.mp3
        ├── collect-star.mp3
        └── bump.mp3
```

---

## Deployment

### Deploy to GitHub Pages

1. **Build Production**:
```bash
npm run build
```

2. **Configure Repository**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` (or `main` with `/dist` folder)

3. **Automated Deployment** (GitHub Actions):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. **Access Deployed Game**:
   - URL: `https://<username>.github.io/<repo-name>/`

### Deploy to Netlify (Alternative)

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build and Deploy**:
```bash
npm run build
netlify deploy --prod --dir=dist
```

3. **Or Connect Repository** (Continuous Deployment):
   - Go to Netlify dashboard
   - New site from Git
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Next Steps

After setup is complete:

1. **Phase 1: Core Mechanics** (Week 1)
   - Implement `Player` entity with movement and jumping
   - Add basic scrolling background
   - Set up collision detection system

2. **Phase 2: Game Loop** (Week 1-2)
   - Add collectibles and obstacles
   - Implement scoring system
   - Create win condition (reach park)

3. **Phase 3: Polish** (Week 2)
   - Add audio (music and SFX)
   - Improve visuals and animations
   - Implement celebration screen

4. **Phase 4: Testing & Refinement** (Week 2-3)
   - User testing with 4-year-old
   - Bug fixes and adjustments
   - Customization features (if time permits)

5. **Phase 5: Deployment** (Week 3)
   - Final build and optimization
   - Deploy to GitHub Pages
   - Documentation and presentation

---

## Resources

### Documentation
- **Phaser 3**: https://photonstorm.github.io/phaser3-docs/
- **Phaser Examples**: https://phaser.io/examples
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/

### Tutorials
- **Phaser 3 + TypeScript**: https://ourcade.co/
- **Side-scrolling Games**: Phaser examples section
- **Audio in Phaser**: Official docs - Sound Manager

### Community
- **Phaser Discord**: https://discord.gg/phaser
- **Phaser Forum**: https://phaser.discourse.group/
- **Stack Overflow**: Tag `phaser-framework`

---

## Troubleshooting

### "Module not found: phaser"
```bash
npm install phaser
```

### "Cannot find type definition file for phaser"
```bash
npm install --save-dev @types/phaser
```

### Vite dev server not starting
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

### Performance issues in development
```typescript
// Disable debug mode to improve FPS
physics: {
  arcade: {
    debug: false
  }
}
```

---

## Summary

You should now have:
- ✅ Development environment installed (Node.js, npm)
- ✅ Project initialized with Phaser 3, TypeScript, Vite
- ✅ Directory structure created
- ✅ Basic scene scaffolding in place
- ✅ Development server running on `http://localhost:3000`
- ✅ Ready to implement game features

**Time to Complete Setup**: ~20-30 minutes

**Next Command**: `npm run dev` to start development!
