# Data Model: Wyatt's Scooter Adventure

**Date**: 2026-05-11  
**Purpose**: Phase 1 data model defining game entities, state, and relationships

---

## Core Game Entities

### 1. Player (Wyatt Character)

**Description**: The main playable character representing Wyatt, controllable by the player

**Properties**:
```typescript
interface Player {
  // Identification
  id: string;
  name: 'Wyatt';
  
  // Visual Appearance (FR-014)
  sprite: {
    hairColor: 'brown';
    hairStyle: 'shaggy';
    shirtType: 'ninja-turtles' | 'monster-truck';
    shoeColor: 'red';
    helmetColor: string; // Customizable (FR-018)
  };
  
  // Position & Physics
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number; // Horizontal speed
    y: number; // Vertical speed (for jumping)
  };
  acceleration: {
    x: number;
    y: number; // Gravity
  };
  
  // State
  state: 'idle' | 'walking' | 'jumping' | 'trick';
  facing: 'left' | 'right';
  onGround: boolean;
  
  // Scooter Customization (FR-018)
  scooter: {
    design: string; // Customizable design identifier
    color: string;
  };
  
  // Collision
  hitbox: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  };
  
  // Gameplay Stats
  collectiblesCollected: {
    stars: number;
    hearts: number;
    circles: number;
  };
  tricksPerformed: number;
  distanceTraveled: number;
}
```

**Validation Rules**:
- `position.x` must be >= 0 (world bounds)
- `position.y` must be >= 0 (ground level)
- `velocity.x` must be >= 0 (always moving forward or stopped)
- `collectiblesCollected` counts must be >= 0
- `helmetColor` must always be a valid color value (never null - safety messaging)

**State Transitions**:
```
idle → walking (on movement input)
walking → jumping (on jump input while onGround)
jumping → walking (on landing)
walking → trick (on trick input while onGround)
trick → walking (after trick animation completes)
```

**Relationships**:
- Collides with: Obstacles, Collectibles
- Followed by: Camera
- Controlled by: InputManager

---

### 2. Friend Characters

**Description**: Three friend characters (Nico, Marcus, Otto) at the park destination

**Properties**:
```typescript
interface Friend {
  // Identification
  id: string;
  name: 'Nico' | 'Marcus' | 'Otto';
  
  // Visual Appearance (FR-015)
  sprite: {
    height: 'taller' | 'shorter' | 'similar'; // Relative to Wyatt
    appearance: string; // Distinctive features
    helmetColor: string; // Always wearing helmet
  };
  
  // Position
  position: {
    x: number;
    y: number;
  };
  
  // State
  state: 'idle' | 'celebrating' | 'waving';
  
  // Animation
  currentAnimation: string;
}
```

**Specific Friend Attributes**:
```typescript
const FRIENDS = {
  Nico: {
    height: 'taller',
    appearance: 'latin',
    helmetColor: 'blue'
  },
  Marcus: {
    height: 'shorter',
    appearance: 'filipino-white',
    helmetColor: 'green'
  },
  Otto: {
    height: 'similar',
    appearance: 'curly-auburn-hair',
    helmetColor: 'yellow'
  }
} as const;
```

**Validation Rules**:
- Must be positioned at park destination (x >= parkStartX)
- Always rendered with helmet visible
- name must be one of three defined friends

**State Transitions**:
```
idle → waving (when player approaches)
waving → celebrating (when player arrives at park)
```

**Relationships**:
- Appears in: CelebrationScene
- Interacts with: None (non-playable, visual only)

---

### 3. Collectibles

**Description**: Items scattered throughout journey for player to collect (FR-009, FR-010)

**Properties**:
```typescript
interface Collectible {
  // Identification
  id: string;
  type: 'star' | 'heart' | 'circle';
  
  // Position
  position: {
    x: number;
    y: number;
  };
  
  // Visual
  sprite: {
    shape: 'star' | 'heart' | 'circle'; // Accessibility shape encoding
    color: string; // High contrast colors
    size: number;
  };
  
  // Audio
  soundKey: string; // Unique sound per type (FR-010)
  
  // State
  collected: boolean;
  visible: boolean;
  
  // Animation
  floatAmplitude: number; // Gentle floating animation
  floatSpeed: number;
  
  // Collision
  hitbox: {
    radius: number; // Circular hitbox for all types
  };
}
```

**Type-Specific Attributes**:
```typescript
const COLLECTIBLE_CONFIG = {
  star: {
    shape: 'star',
    color: '#FFD700', // Gold
    soundKey: 'collect-star',
    points: 5
  },
  heart: {
    shape: 'heart',
    color: '#FF69B4', // Pink
    soundKey: 'collect-heart',
    points: 3
  },
  circle: {
    shape: 'circle',
    color: '#00CED1', // Turquoise
    soundKey: 'collect-circle',
    points: 1
  }
} as const;
```

**Validation Rules**:
- `type` must be one of three defined types
- `collected` and `visible` cannot both be true (collected items are hidden)
- `position.x` must be within world bounds
- Each type must have distinct `soundKey` (accessibility requirement)

**State Transitions**:
```
visible=true, collected=false → collision detected
→ visible=false, collected=true, play sound, add to score
```

**Relationships**:
- Collides with: Player
- Managed by: ScoreManager
- Sound played by: AudioManager

---

### 4. Obstacles

**Description**: Environmental elements that provide gentle interaction feedback (FR-007)

**Properties**:
```typescript
interface Obstacle {
  // Identification
  id: string;
  type: 'puddle' | 'rock' | 'hill';
  
  // Position
  position: {
    x: number;
    y: number;
  };
  
  // Visual
  sprite: {
    texture: string;
    width: number;
    height: number;
  };
  
  // Interaction Effect (NO FAILURE STATES)
  effect: {
    type: 'slow' | 'bump' | 'speed-change';
    magnitude: number; // How much it affects player (gentle)
    duration: number; // How long effect lasts (milliseconds)
  };
  
  // Audio
  soundKey: string; // Friendly interaction sound
  
  // Collision
  hitbox: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  };
}
```

**Type-Specific Attributes**:
```typescript
const OBSTACLE_CONFIG = {
  puddle: {
    effect: { type: 'slow', magnitude: 0.7, duration: 1000 },
    soundKey: 'splash',
    visual: 'blue-puddle'
  },
  rock: {
    effect: { type: 'bump', magnitude: 0.5, duration: 200 },
    soundKey: 'bump',
    visual: 'gray-rock'
  },
  hill: {
    effect: { type: 'speed-change', magnitude: 1.2, duration: 2000 },
    soundKey: 'whoosh',
    visual: 'green-hill'
  }
} as const;
```

**Validation Rules**:
- `effect.magnitude` must never be 0 (would stop player - violates no-failure principle)
- All interactions must have associated `soundKey` (audio feedback requirement)
- `effect.type` must result in temporary, recoverable interaction

**State Transitions**:
```
idle → collision with player → apply effect, play sound
→ effect duration expires → return to idle
```

**Relationships**:
- Collides with: Player
- Managed by: CollisionManager
- Sound played by: AudioManager

---

## Game State Management

### 5. Game Session State

**Description**: Overall game session state tracking progress and configuration

**Properties**:
```typescript
interface GameSession {
  // Session Info
  sessionId: string;
  startTime: number; // Timestamp
  
  // Progress
  currentScene: 'Boot' | 'Start' | 'Game' | 'Celebration';
  playerPosition: number; // How far along journey (0-100%)
  
  // Score Tracking (FR-011)
  score: {
    totalCollectibles: number;
    stars: number;
    hearts: number;
    circles: number;
  };
  tricks: number;
  
  // Journey State
  journeyComplete: boolean;
  timeElapsed: number; // Seconds
  
  // Customization (FR-018, FR-019)
  preferences: {
    helmetColor: string;
    scooterDesign: string;
    volume: {
      music: number; // 0.0 to 1.0
      sfx: number; // 0.0 to 1.0
    };
  };
}
```

**Validation Rules**:
- `playerPosition` must be 0-100 (percentage)
- `score` values must be >= 0
- `timeElapsed` must be >= 0
- `volume` values must be 0.0-1.0 (clamped)
- `currentScene` must be valid scene name

**Persistence**:
- `preferences` persisted to LocalStorage (FR-019)
- Session state reset on new game
- High score/collectibles tracked across sessions (optional)

---

### 6. Audio State

**Description**: Audio system state for managing sounds and music

**Properties**:
```typescript
interface AudioState {
  // Music
  currentMusic: string | null;
  musicPlaying: boolean;
  musicVolume: number; // 0.0 to 1.0
  
  // Sound Effects
  sfxVolume: number; // 0.0 to 1.0
  activeSounds: Map<string, Phaser.Sound.BaseSound>;
  
  // Mute State
  musicMuted: boolean;
  sfxMuted: boolean;
  
  // Loaded Assets
  loadedSounds: Set<string>;
  loadedMusic: Set<string>;
}
```

**Validation Rules**:
- Volume values clamped 0.0-1.0
- Cannot play unloaded sounds (check loadedSounds first)
- Mute state overrides volume settings
- Parent-adjustable via settings (FR-016)

**Operations**:
- `playMusic(key, loop)` - Start background music
- `playSFX(key, volume?)` - Play sound effect
- `setVolume(category, value)` - Adjust volume
- `mute(category)` / `unmute(category)` - Toggle mute
- `stopAll()` - Stop all audio

---

### 7. Input State

**Description**: Tracks player input across keyboard and touch

**Properties**:
```typescript
interface InputState {
  // Keyboard
  keys: {
    left: boolean;
    right: boolean;
    up: boolean; // Jump
    space: boolean; // Trick
  };
  
  // Touch/Mouse
  pointer: {
    isDown: boolean;
    x: number;
    y: number;
  };
  
  // Touch Zones
  touchZones: {
    leftZone: Phaser.Geom.Rectangle;
    rightZone: Phaser.Geom.Rectangle;
    jumpZone: Phaser.Geom.Rectangle;
  };
  
  // Input Mode
  inputMethod: 'keyboard' | 'touch' | 'auto';
  
  // Auto-forward (optional)
  autoForward: boolean;
}
```

**Validation Rules**:
- At most one movement key active at a time (left OR right, not both)
- Touch zones must not overlap (clear hit regions)
- Input processed every frame in update loop

---

## Scene Data Flow

### Boot Scene → Start Scene
```typescript
interface BootToStartData {
  assetsLoaded: boolean;
  loadProgress: number; // 0-100
}
```

### Start Scene → Game Scene
```typescript
interface StartToGameData {
  preferences: {
    helmetColor: string;
    scooterDesign: string;
    autoForward: boolean;
  };
}
```

### Game Scene → Celebration Scene
```typescript
interface GameToCelebrationData {
  score: {
    totalCollectibles: number;
    stars: number;
    hearts: number;
    circles: number;
  };
  tricks: number;
  timeElapsed: number; // Seconds
  distanceTraveled: number;
}
```

### Celebration Scene → Start Scene (Replay)
```typescript
interface CelebrationToStartData {
  playAgain: boolean;
  previousScore?: GameToCelebrationData;
}
```

---

## Entity Relationships Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GameSession                          │
│  - currentScene, playerPosition, score, preferences     │
└───────────────┬─────────────────────────────────────────┘
                │
                ├── manages ──────────────────────┐
                │                                  │
                ▼                                  ▼
    ┌────────────────────┐              ┌──────────────────┐
    │      Player        │              │   AudioState     │
    │  - position        │              │  - music, sfx    │
    │  - velocity        │              └──────────────────┘
    │  - collectibles    │                       ▲
    └────────┬───────────┘                       │
             │                                   │
             │ collides with                     │ plays sounds
             │                                   │
    ┌────────▼───────────┐              ┌───────┴──────────┐
    │   Collectibles     │──triggers──► │  AudioManager    │
    │  - star/heart/circ │              │  - playSFX()     │
    └────────────────────┘              └──────────────────┘
             │                                   ▲
             │ collects via                      │
             ▼                                   │
    ┌────────────────────┐                      │
    │   ScoreManager     │──────────────────────┘
    │  - track counts    │
    └────────────────────┘

    ┌────────────────────┐              ┌──────────────────┐
    │    Obstacles       │──triggers──► │ CollisionManager │
    │  - puddle/rock/hill│              │  - handleHit()   │
    └────────────────────┘              └──────────────────┘
             │                                   │
             │                                   ▼
             │                          ┌──────────────────┐
             └─────collision with──────►│     Player       │
                                        └──────────────────┘

    ┌────────────────────┐              
    │     Friends        │              
    │  - Nico/Marcus/Otto│◄─── appears in CelebrationScene              
    └────────────────────┘              
```

---

## Persistence Schema (LocalStorage)

**Key**: `wyatt-scooter-adventure-prefs`

**Value Structure**:
```typescript
interface StoredPreferences {
  version: string; // Schema version for future compatibility
  preferences: {
    helmetColor: string;
    scooterDesign: string;
    volume: {
      music: number;
      sfx: number;
    };
  };
  stats: {
    totalPlays: number;
    totalCollectibles: number;
    bestTimeSeconds: number;
  };
  lastPlayed: number; // Timestamp
}
```

**Default Values** (if no saved data):
```typescript
const DEFAULT_PREFERENCES: StoredPreferences = {
  version: '1.0.0',
  preferences: {
    helmetColor: '#FF0000', // Red
    scooterDesign: 'default',
    volume: {
      music: 0.6,
      sfx: 0.8
    }
  },
  stats: {
    totalPlays: 0,
    totalCollectibles: 0,
    bestTimeSeconds: 0
  },
  lastPlayed: 0
};
```

---

## Constants & Configuration

### Game Physics
```typescript
const PHYSICS = {
  GRAVITY: 800, // Pixels per second squared
  PLAYER_SPEED: 200, // Horizontal pixels per second
  JUMP_VELOCITY: -400, // Negative = up
  MAX_FALL_SPEED: 600,
  TRICK_DURATION: 800, // Milliseconds
} as const;
```

### World Bounds
```typescript
const WORLD = {
  WIDTH: 8000, // Total journey distance
  HEIGHT: 600,
  START_X: 100, // Home position
  PARK_X: 7500, // Park arrival position
  GROUND_Y: 500,
} as const;
```

### Collectible Distribution
```typescript
const COLLECTIBLE_SPAWN = {
  STARS_COUNT: 15,
  HEARTS_COUNT: 10,
  CIRCLES_COUNT: 20,
  MIN_SPACING: 200, // Minimum pixels between collectibles
  HEIGHT_RANGE: { min: 200, max: 400 }, // Y position range
} as const;
```

### Obstacle Distribution
```typescript
const OBSTACLE_SPAWN = {
  PUDDLES_COUNT: 8,
  ROCKS_COUNT: 6,
  HILLS_COUNT: 4,
  MIN_SPACING: 300,
  TELEGRAPH_DISTANCE: 400, // Visible distance before reaching
} as const;
```

---

## Summary

This data model defines:
- **7 core entities**: Player, Friends, Collectibles, Obstacles, GameSession, AudioState, InputState
- **Clear validation rules** ensuring constitutional compliance (no failure states, audio feedback, accessibility)
- **State transitions** for dynamic game behavior
- **Entity relationships** showing interaction patterns
- **Persistence schema** for customization across sessions
- **Configuration constants** for tuning gameplay

**Next Steps**: Define external contracts (UI, audio API) and create quickstart guide.
