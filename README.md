# Wyatt's Scooter Adventure 🛴

A web-based 2D scooter game designed for a 4-year-old player. Guide Wyatt on his scooter from home to Wallingford playfield to meet his friends Nico, Marcus, and Otto!

## � Play Now

**Live Demo**: [https://jakeklineisreal.github.io/ae-bootcamp-capstone/](https://jakeklineisreal.github.io/ae-bootcamp-capstone/)

The game is automatically deployed to GitHub Pages on every push to the `main` branch.

## �🎮 Features

### Core Gameplay (MVP - User Story 1) ✅
- **Simple Controls**: Arrow keys, WASD, or SPACE to jump
- **Auto-Runner Style**: Player moves forward automatically
- **Gentle Obstacles**: Puddles, rocks, and hills slow you down but never stop you
- **Progress Tracking**: Visual progress bar showing journey completion
- **Friend Celebration**: Nico, Marcus, and Otto celebrate when you reach the park
- **Replay Anytime**: Jump back in for another ride!

### Safety & Age-Appropriate Design
- ✅ **Helmet Always Visible**: Wyatt and all friends wear helmets (safety messaging)
- ✅ **No Failure States**: Purely positive experience - you always reach the park
- ✅ **Simple Controls**: Maximum 2-button input (move and jump)
- ✅ **Large Visual Elements**: Easy to see and understand
- ✅ **Encouraging Feedback**: "Great job!" and celebration animations

### Planned Features
- 🔲 **Collectibles** (User Story 2): Stars ⭐, hearts ❤️, circles ⚪ with distinct shapes
- 🔲 **Tricks** (User Story 3): Wheelies and jump tricks with "cool!" effects
- 🔲 **Customization** (User Story 4): Choose helmet color and scooter design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/jakeklineIsReal/ae-bootcamp-capstone.git
cd ae-bootcamp-capstone

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000/`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### GitHub Pages (Automatic)

The project is configured for automatic deployment to GitHub Pages:

1. **Automatic**: Every push to `main` triggers a deployment via GitHub Actions
2. **Manual**: Visit Actions tab → "Deploy to GitHub Pages" → "Run workflow"
3. **Live URL**: [https://jakeklineisreal.github.io/ae-bootcamp-capstone/](https://jakeklineisreal.github.io/ae-bootcamp-capstone/)

### Deploy Manually

```bash
# Build for production
npm run build

# The dist/ folder is ready for deployment to any static hosting service
```

### First-Time Setup

To enable GitHub Pages:
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. The workflow will deploy automatically on next push to main

## 🎯 How to Play

1. **Start Screen**: Press any key to begin
2. **Move**: Use Arrow Keys or WASD to control Wyatt
3. **Jump**: Press SPACE, W, or UP arrow to jump over obstacles
4. **Goal**: Ride to the park (100% on progress bar)
5. **Celebration**: Enjoy the celebration with your friends!
6. **Replay**: Press any key to play again

## 🏗️ Project Structure

```
.
├── src/
│   ├── scenes/          # Game scenes (Boot, Start, Game, Celebration)
│   ├── entities/        # Game objects (Player, Obstacle, Friend)
│   ├── systems/         # Game systems (Audio, Score, Collision)
│   ├── config/          # Configuration and constants
│   └── utils/           # Utility functions
├── public/
│   └── assets/          # Images, sounds, sprites (placeholder for now)
├── index.html           # Entry HTML
└── package.json         # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Game Framework**: [Phaser 3.70+](https://phaser.io/) - HTML5 game framework
- **Language**: TypeScript 5.x - Type-safe JavaScript
- **Build Tool**: Vite 5.x - Fast build and hot module replacement
- **Target**: Modern web browsers (desktop, tablet, mobile)

## 📋 Development Status

### Phase 1: Setup ✅
- [x] Project structure created
- [x] Dependencies installed (Phaser, TypeScript, Vite)
- [x] Build configuration complete

### Phase 2: Foundation ✅
- [x] Game configuration and constants
- [x] Core systems (AudioManager, ScoreManager, CollisionManager)
- [x] Scene templates (Boot, Start, Game, Celebration)
- [x] Main entry point

### Phase 3: User Story 1 (MVP) ✅
- [x] Player entity with helmet visibility
- [x] Obstacle system (puddles, rocks, hills)
- [x] Friend characters (Nico, Marcus, Otto)
- [x] Complete gameplay loop (start → ride → arrive → celebrate → replay)
- [x] Keyboard controls
- [x] Progress tracking
- [ ] Audio feedback (pending audio assets)
- [ ] Asset preparation (using colored shapes for now)

### Phase 4-7: Additional Features 🔲
- [ ] Collectibles (User Story 2)
- [ ] Tricks (User Story 3)
- [ ] Customization (User Story 4)
- [ ] Polish and optimization

## 🎨 Constitutional Principles

This project was built following strict age-appropriate design principles:

1. **Age-First Design**: Simple controls, large visuals, 2-5 minute sessions
2. **Safety-First Messaging**: Helmets always visible on all characters
3. **No Failure States**: Positive experience only - obstacles slow but never stop
4. **Accessibility-First**: Audio cues for all actions, distinct shapes for collectibles
5. **Personal Connection**: Wyatt and his real friends as characters

## 📝 License

ISC

## 🙏 Acknowledgments

- Built as a capstone project for GitHub's AE Bootcamp
- Designed with love for Wyatt and his scooter adventures
- Spec-driven development powered by GitHub Copilot and SpecKit