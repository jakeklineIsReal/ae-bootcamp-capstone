# Implementation Plan: Wyatt's Scooter Adventure

**Branch**: `001-scooter-adventure-game` | **Date**: 2026-05-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-scooter-adventure-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

A web-based 2D side-scrolling game where a 4-year-old player controls Wyatt riding a scooter from home to Wallingford playfield to meet friends. Built with Phaser 3 + TypeScript + Vite, the game emphasizes age-appropriate design with simple controls, no failure states, positive reinforcement, and helmet safety messaging. All interactions provide audio and visual feedback for accessibility, with a target play time of 2-5 minutes per session.

## Technical Context

**Language/Version**: TypeScript 5.x with ES2020 target  
**Primary Dependencies**: Phaser 3.70+ (game framework), Vite 5.x (build tool)  
**Storage**: Browser LocalStorage for customization persistence (helmet color, scooter design)  
**Testing**: Vitest for unit tests, manual QA with target player (4-year-old)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari) on desktop, tablet, mobile  
**Project Type**: Web-based 2D game (side-scrolling)  
**Performance Goals**: 30+ FPS stable framerate, <100ms input response time, <5 second initial load  
**Constraints**: Single play session 2-5 minutes, playable on tablets with touch controls, works offline after initial load  
**Scale/Scope**: Single-player experience, 1-3 level routes, 4 character sprites + environment assets, ~15-20 sound effects

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Age-First Design (NON-NEGOTIABLE)
- ✅ **Controls**: Arrow keys or touch input (1-2 buttons max), optional auto-forward movement
- ✅ **Visual Communication**: Pre-reading design with large sprites (20-30% screen height), no text required for gameplay
- ✅ **Session Length**: 2-5 minute play sessions per requirement FR-012
- ✅ **Cognitive Load**: Simple mechanics (move, jump, collect) without complex decision-making
- ✅ **Understanding**: Game loop understandable within 30 seconds (SC-001)
- **STATUS**: ✅ PASS - All requirements aligned with 4-year-old capabilities

### II. Safety-First Messaging (NON-NEGOTIABLE)
- ✅ **Helmet Display**: Main character (Wyatt) and all friend characters wear helmets (FR-001, FR-014, FR-015)
- ✅ **Positive Reinforcement**: All feedback is encouraging, never punitive (FR-013)
- ✅ **Safe Behavior**: Gameplay on sidewalk/path only, no traffic scenarios
- ✅ **Visual Design**: Helmet-wearing characters designed to look "cool" and aspirational
- **STATUS**: ✅ PASS - Safety messaging woven into core gameplay and visuals

### III. No Failure States (NON-NEGOTIABLE)
- ✅ **Obstacle Interactions**: Puddles, rocks, hills slow but never stop progress (FR-007)
- ✅ **Player Journey**: All players reach the park and meet friends (FR-005)
- ✅ **Feedback System**: 100% positive, encouraging responses (FR-013, SC-010)
- ✅ **No Game Over**: Zero failure conditions throughout gameplay (SC-010)
- **STATUS**: ✅ PASS - Pure positive experience with guaranteed success

### IV. Accessibility-First (NON-NEGOTIABLE)
- ✅ **Audio Cues**: Sound effects for ALL actions - movement, jumping, collecting, obstacles, arrival (FR-008, FR-010)
- ✅ **Visual Distinction**: Collectibles use distinct shapes (stars ⭐, hearts ❤️, circles ⚪) beyond color (FR-009, SC-006)
- ✅ **Multi-Sensory**: Combined audio + visual feedback for every interaction
- ✅ **Volume Control**: Parent-adjustable volume controls (FR-016)
- ✅ **Device Testing**: Responsive design for desktop, tablet, mobile (SC-012)
- **STATUS**: ✅ PASS - Multi-sensory design supports diverse needs

### V. Personal Connection
- ✅ **Main Character**: Wyatt with brown shaggy hair, red shoes, Ninja Turtles/monster truck shirt (FR-014)
- ✅ **Friends**: Nico (taller, Latin), Marcus (shorter, Filipino/white), Otto (curly auburn hair) (FR-015, FR-004)
- ✅ **Setting**: Journey from home to Wallingford playfield (real location)
- ✅ **Celebration**: Friends celebrate Wyatt's arrival at park (FR-005)
- **STATUS**: ✅ PASS - Deep personalization throughout game

### Technical Standards Compliance
- ✅ **Web-Based Stack**: Phaser 3 + TypeScript + Vite as required
- ✅ **Performance**: 30+ FPS target specified (SC-003)
- ✅ **Cross-Browser**: Modern browser support (Chrome, Firefox, Safari) (SC-007)
- ✅ **Deployment**: Static hosting ready (GitHub Pages/Netlify)
- **STATUS**: ✅ PASS - Matches constitutional technical standards

### Development Workflow Compliance
- ✅ **MVP-First**: Phased approach prioritizing P1/P2 user stories
- ✅ **Timeline**: 2-3 week bootcamp timeline with weekly milestones
- ✅ **Testing**: Iterative testing with target player built into phases
- ✅ **Quality Gates**: Performance, age-appropriateness, audio requirements defined
- **STATUS**: ✅ PASS - Follows prescribed development workflow

**OVERALL GATE STATUS**: ✅ **PASS** - All constitutional requirements met, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/001-scooter-adventure-game/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - technology and pattern research
├── data-model.md        # Phase 1 output - game entities and state model
├── quickstart.md        # Phase 1 output - setup and run instructions
├── contracts/           # Phase 1 output - external interfaces (game UI, audio API)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── scenes/              # Phaser game scenes
│   ├── BootScene.ts     # Asset loading and initialization
│   ├── StartScene.ts    # Start screen with character preview
│   ├── GameScene.ts     # Main gameplay scene
│   └── CelebrationScene.ts  # Park arrival celebration
├── entities/            # Game objects
│   ├── Player.ts        # Wyatt character with movement and collision
│   ├── Friend.ts        # Nico, Marcus, Otto characters
│   ├── Collectible.ts   # Stars, hearts, circles
│   └── Obstacle.ts      # Puddles, rocks, hills
├── systems/             # Game systems
│   ├── CollisionManager.ts    # Collision detection and response
│   ├── AudioManager.ts        # Sound effect and music management
│   ├── ScoreManager.ts        # Collection tracking
│   └── CustomizationManager.ts # Helmet/scooter preference storage
├── config/              # Game configuration
│   ├── gameConfig.ts    # Phaser configuration
│   ├── constants.ts     # Game constants (speeds, sizes, colors)
│   └── assetPaths.ts    # Asset loading paths
├── utils/               # Utilities
│   ├── localStorage.ts  # LocalStorage wrapper
│   └── helpers.ts       # Common helper functions
└── main.ts              # Entry point

public/
├── assets/
│   ├── sprites/         # Character and object sprites
│   │   ├── wyatt/       # Wyatt with helmet variations
│   │   ├── friends/     # Nico, Marcus, Otto sprites
│   │   ├── collectibles/  # Star, heart, circle sprites
│   │   └── obstacles/   # Puddle, rock, hill sprites
│   ├── backgrounds/     # Environment backgrounds
│   │   ├── home.png
│   │   ├── neighborhood.png
│   │   └── park.png
│   └── audio/           # Sound effects and music
│       ├── music/       # Background music
│       ├── sfx/         # Jump, collect, celebration sounds
│       └── voice/       # "Great job!", "Awesome!" audio cues
└── index.html           # Entry HTML

tests/
├── unit/                # Unit tests
│   ├── entities/        # Entity behavior tests
│   └── systems/         # System logic tests
└── integration/         # Integration tests
    └── gameplay/        # Full play session tests

dist/                    # Build output (generated by Vite)
```

**Structure Decision**: Single web project structure using Phaser 3 game framework. The scene-based architecture follows Phaser conventions with clear separation of game scenes (Boot, Start, Game, Celebration), entities (Player, Friends, Collectibles, Obstacles), and systems (Collision, Audio, Score, Customization). Public assets are organized by type (sprites, backgrounds, audio) for easy asset management. This structure supports rapid iteration and is appropriate for a focused 2-3 week development timeline.

---

## Phase 0: Research & Technology Decisions

**Status**: ✅ COMPLETE  
**Output**: [research.md](research.md)

### Key Decisions Made

1. **Framework & Build Tools**
   - ✅ Phaser 3.70+ with TypeScript 5.x (best HTML5 game framework, strong typing)
   - ✅ Vite 5.x for build tooling (fast HMR, optimized production builds)
   - ✅ Vitest for unit testing (when needed)

2. **Game Architecture**
   - ✅ Side-scrolling auto-runner style with camera follow
   - ✅ Scene-based architecture: Boot → Start → Game → Celebration
   - ✅ Parallax scrolling for depth (background, midground, foreground layers)
   - ✅ Infinite scrolling with tile sprites for seamless journey

3. **Accessibility Implementation**
   - ✅ Multi-sensory feedback: Audio + Visual for every action
   - ✅ Shape-based collectibles (star ⭐, heart ❤️, circle ⚪) for color blindness support
   - ✅ High contrast colors (WCAG AA minimum)
   - ✅ Large touch targets (44x44px minimum) for mobile play

4. **Input System**
   - ✅ Dual keyboard + touch support
   - ✅ Auto-forward movement option to reduce cognitive load
   - ✅ Large touch zones (full screen thirds) for young children
   - ✅ Optional virtual buttons for explicit input preference

5. **Asset Management**
   - ✅ Sprite sheets for optimized loading (TexturePacker format)
   - ✅ Audio sprites to combine SFX (reduce latency)
   - ✅ WebP images for better compression
   - ✅ MP3/OGG dual format for cross-browser audio support

6. **Age-Appropriate Patterns**
   - ✅ Forgiving collision detection (large hitboxes favor player)
   - ✅ No failure states - obstacles slow but never stop
   - ✅ Flat difficulty curve (exploration-focused, not challenge-focused)
   - ✅ Positive-only feedback loop

7. **Persistence & Deployment**
   - ✅ LocalStorage for customization preferences (helmet, scooter)
   - ✅ GitHub Pages primary deployment (free, simple, integrated)
   - ✅ GitHub Actions CI/CD for automated deployment
   - ✅ Netlify as deployment alternative

### Research Artifacts
- Phaser 3 + TypeScript integration patterns documented
- Side-scrolling mechanics implementation approach defined
- Accessibility best practices identified and specified
- Touch control patterns for young children researched
- Asset optimization strategies documented
- Testing approach for 4-year-old users defined

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE  
**Outputs**: [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

### Data Model Summary

**Core Entities Defined** (7 total):
1. **Player** (Wyatt) - Main character with position, velocity, state, customization, collectibles tracking
2. **Friend Characters** - Nico, Marcus, Otto with distinct appearances and celebration states
3. **Collectibles** - Stars, hearts, circles with shapes, sounds, and collection state
4. **Obstacles** - Puddles, rocks, hills with gentle interaction effects
5. **Game Session State** - Progress tracking, score, preferences, journey state
6. **Audio State** - Music, SFX management with volume controls
7. **Input State** - Keyboard and touch input tracking

**Key Relationships**:
- Player collides with Collectibles → ScoreManager → AudioManager
- Player collides with Obstacles → CollisionManager → AudioManager
- Friends appear in CelebrationScene when journey complete
- Preferences persist via LocalStorage

**Validation Rules**:
- All entities enforce constitutional requirements (no failure states, audio feedback, accessibility)
- State transitions clearly defined for player, friends, collectibles
- Constants defined for physics, world bounds, spawn patterns

### Contracts Defined

**1. Player Interaction Contract** ([contracts/player-interaction.md](contracts/player-interaction.md))
- Input methods: Keyboard (arrows/WASD), Touch (zone-based), Auto-forward option
- Output feedback: Visual animations + Audio cues for 100% of actions
- Timing guarantees: <100ms response for all inputs
- Accessibility: Multi-sensory, shape-based encoding, large touch targets
- No failure states: Guaranteed journey completion with positive-only feedback

**2. Scene Transition Contract** ([contracts/scene-transitions.md](contracts/scene-transitions.md))
- 4 scenes: Boot → Start → Game → Celebration (with replay loop)
- Data flow contracts for each transition
- Performance targets: Boot <5s, others <1s load time
- Error recovery strategies for missing/invalid data
- Smooth transitions with audio crossfades

### Quickstart Guide Created
- Complete setup instructions from prerequisites to first run
- Development workflow documented
- Asset preparation guidance provided
- Deployment instructions for GitHub Pages and Netlify
- Troubleshooting section for common issues

### Constitution Re-Check Post-Design

**I. Age-First Design**: ✅ PASS
- Data model enforces simple states (idle, walking, jumping, trick)
- Input contract specifies 1-2 button controls maximum
- Session duration enforced at 2-5 minutes

**II. Safety-First Messaging**: ✅ PASS
- Player and Friend entities require helmet in sprite definition
- No mechanics that compromise helmet visibility

**III. No Failure States**: ✅ PASS
- Obstacle effects defined as temporary slowdown/bump (never stop)
- Journey completion guaranteed in session contract
- All feedback contracts specify positive/encouraging only

**IV. Accessibility-First**: ✅ PASS
- Collectible entities enforce shape-based encoding
- Audio feedback mandatory for all entity interactions
- Volume control in audio state with parent adjustment

**V. Personal Connection**: ✅ PASS
- Player and Friend entities capture specific appearance details
- Data model includes all required personal characteristics

**OVERALL**: ✅ All constitutional requirements maintained through design phase

---

## Implementation Roadmap

### Timeline: 2-3 Weeks (Bootcamp Capstone)

#### **Week 1: Core Mechanics & Game Loop**

**Phase 1.1: Core Mechanics** (Days 1-3)
- [ ] Set up project structure (npm, TypeScript, Vite, Phaser)
- [ ] Implement BootScene with asset loading progress bar
- [ ] Create Player entity with movement (keyboard + touch)
- [ ] Implement basic physics (gravity, velocity, jumping)
- [ ] Add simple scrolling background (single layer)
- [ ] Basic collision detection setup

**Deliverable**: Player character moves and jumps in test environment

---

**Phase 1.2: Game Loop** (Days 4-7)
- [ ] Implement StartScene with title and start button
- [ ] Create GameScene with world setup
- [ ] Add Collectible entities (stars, hearts, circles) with spawning
- [ ] Implement Obstacle entities (puddles, rocks, hills) with gentle effects
- [ ] Add CollisionManager for player interactions
- [ ] Create ScoreManager to track collectibles
- [ ] Implement journey completion detection (reach park)
- [ ] Transition to CelebrationScene on completion

**Deliverable**: Full playthrough from start to celebration works

---

#### **Week 2: Polish, Audio & Visual Enhancement**

**Phase 2.1: Audio System** (Days 8-10)
- [ ] Implement AudioManager with volume controls
- [ ] Add background music (gameplay loop, celebration)
- [ ] Add player action SFX (jump, trick, landing)
- [ ] Add unique collectible sounds (twinkle, chime, pop)
- [ ] Add obstacle interaction sounds (splash, bump, whoosh)
- [ ] Add voice encouragement cues ("Great job!", "Awesome!")
- [ ] Implement parent volume controls (music/SFX independent)

**Deliverable**: Audio feedback for 100% of player actions

---

**Phase 2.2: Visual Polish** (Days 11-13)
- [ ] Create or source character sprites (Wyatt, Nico, Marcus, Otto)
- [ ] Implement sprite animations (idle, walk, jump, trick)
- [ ] Add parallax scrolling (background, midground, foreground)
- [ ] Implement particle effects (collectible sparkles, celebration confetti)
- [ ] Polish UI (score display, progress bar)
- [ ] Create celebration scene visuals (friends celebrating)
- [ ] Add visual feedback for all interactions (bounce, slow-mo, effects)

**Deliverable**: Game has polished visual presentation

---

#### **Week 3: Enhancement, Testing & Deployment**

**Phase 3.1: Enhancement Features** (Days 14-16)
- [ ] Implement CustomizationManager for helmet/scooter preferences
- [ ] Add customization UI in StartScene (color picker, design selector)
- [ ] Implement LocalStorage persistence for preferences
- [ ] Add trick animations and visual "cool!" effects (optional)
- [ ] Create alternate route or additional content (time permitting)
- [ ] Implement replay functionality from CelebrationScene

**Deliverable**: Full feature set complete with customization

---

**Phase 3.2: Testing & Refinement** (Days 17-19)
- [ ] **User Testing**: Observe 4-year-old playing (no instruction given)
- [ ] Collect feedback: Can they understand? Complete journey? Enjoy it?
- [ ] Refine controls based on observations (too hard? too easy?)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Cross-device testing (desktop, tablet, mobile)
- [ ] Performance testing (verify 30+ FPS maintained)
- [ ] Accessibility validation (test with audio muted, check shapes)
- [ ] Bug fixes and adjustments

**Deliverable**: Confirmed playable by target audience

---

**Phase 3.3: Deployment & Documentation** (Days 20-21)
- [ ] Create production build (`npm run build`)
- [ ] Set up GitHub Pages deployment
- [ ] Configure GitHub Actions for CI/CD (automated deploy on push)
- [ ] Test deployed version on multiple devices
- [ ] Create simple parent instructions (how to launch, volume control)
- [ ] Document project for capstone presentation
- [ ] Prepare demo video or live demo

**Deliverable**: Game deployed and accessible via web URL

---

## Success Criteria Validation

### Technical Success
- ✅ Game architecture supports all requirements
- ✅ Performance targets defined (30+ FPS, <100ms input response)
- ✅ Cross-browser compatibility planned
- ✅ Deployment strategy established

### User Success
- ✅ Controls designed for 4-year-old (1-2 buttons, large touch targets)
- ✅ 2-5 minute play session length enforced in data model
- ✅ No failure states guaranteed by design
- ✅ Positive feedback enforced in all contracts
- ✅ Character recognition through detailed data models

### Educational Success
- ✅ Helmet requirement built into entity definitions
- ✅ Positive reinforcement in all feedback contracts
- ✅ Confidence-building through guaranteed success design

### Constitutional Compliance
- ✅ Age-First Design: Simple controls, pre-reading, 2-5 min sessions
- ✅ Safety-First Messaging: Helmet always visible, positive safety reinforcement
- ✅ No Failure States: Obstacles slow but never stop, journey guaranteed
- ✅ Accessibility-First: Audio + visual feedback, shape encoding, volume control
- ✅ Personal Connection: Wyatt and friends represented with specific details

---

## Risk Mitigation

### Scope Management
**Risk**: Too many features for timeline  
**Mitigation**: MVP-first approach with phases prioritized P1 → P2 → P3 features  
**Status**: ✅ Roadmap clearly defines must-have vs nice-to-have

### Technical Complexity
**Risk**: Phaser learning curve delays progress  
**Mitigation**: Research phase completed, patterns documented, Copilot assistance  
**Status**: ✅ Technology decisions made with confidence

### Age Appropriateness
**Risk**: Game too hard or too easy for 4-year-old  
**Mitigation**: User testing built into Week 3, forgiving design choices  
**Status**: ✅ Testing plan includes target player observation

### Performance
**Risk**: Game lags or loads slowly  
**Mitigation**: Asset optimization, performance targets defined, testing planned  
**Status**: ✅ Optimization strategies researched and documented

---

## Next Steps

### Immediate (Post-Planning)
1. ✅ Review this implementation plan for completeness
2. ✅ Confirm constitutional compliance maintained
3. ⏭️ **Generate development tasks** using `/speckit.tasks` command
4. ⏭️ Begin Phase 1.1 implementation (project setup)

### Development Start
1. Initialize project with quickstart.md instructions
2. Set up Git repository and branches
3. Install dependencies (Phaser, TypeScript, Vite)
4. Create basic scene structure
5. Implement first feature: Player movement

### Weekly Milestones
- **End of Week 1**: Playable core loop (move, jump, collect, finish)
- **End of Week 2**: Audio and visual polish complete
- **End of Week 3**: User tested, deployed, documented

---

## Artifacts Summary

This implementation plan includes:
- ✅ **Technical Context**: Language, dependencies, platform, constraints defined
- ✅ **Constitution Check**: All 5 core principles validated (pre and post design)
- ✅ **Project Structure**: Complete directory layout for web game
- ✅ **Phase 0 Research**: 10 key technology decisions documented in research.md
- ✅ **Phase 1 Design**: Data model (7 entities), contracts (2 interfaces), quickstart guide
- ✅ **Implementation Roadmap**: 3-week timeline with phases and deliverables
- ✅ **Success Criteria**: Technical, user, educational, constitutional validation
- ✅ **Risk Mitigation**: Scope, complexity, appropriateness, performance addressed

**Planning Complete**: Ready to proceed to task generation and implementation.

**Branch**: `001-scooter-adventure-game`  
**Plan Location**: `specs/001-scooter-adventure-game/plan.md`  
**Generated Files**: plan.md, research.md, data-model.md, contracts/, quickstart.md
