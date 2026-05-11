# Scene Transition Contract

**Version**: 1.0.0  
**Purpose**: Defines the contract for scene transitions and data flow between game scenes

---

## Scene Architecture

### Scene Hierarchy
```typescript
/**
 * Game uses Phaser's scene system with 4 main scenes
 * Flow: Boot → Start → Game → Celebration → (loop to Start)
 */
enum SceneKey {
  BOOT = 'BootScene',
  START = 'StartScene',
  GAME = 'GameScene',
  CELEBRATION = 'CelebrationScene'
}
```

---

## BootScene Contract

### Purpose
Asset loading and initialization scene. Displays loading progress and transitions to start screen when ready.

### Responsibilities
```typescript
interface BootSceneContract {
  responsibilities: {
    /**
     * Load all game assets
     */
    assetLoading: {
      sprites: 'player, friends, collectibles, obstacles, backgrounds';
      audio: 'music, sfx, voice cues';
      ui: 'buttons, icons, progress bars';
    };
    
    /**
     * Initialize game systems
     */
    systemInit: {
      audioManager: 'create and test';
      inputManager: 'register handlers';
      localStorage: 'load preferences';
    };
    
    /**
     * Display loading progress
     */
    feedback: {
      progressBar: 'visual 0-100% indicator';
      loadingText: 'Loading... (optional)';
    };
  };
  
  /**
   * Transition condition
   */
  transitionTo: 'StartScene';
  transitionWhen: 'all-assets-loaded AND systems-initialized';
  transitionDelay: '0ms'; // Immediate
}
```

### Output Data
```typescript
interface BootSceneOutput {
  /**
   * Passed to StartScene on transition
   */
  data: {
    assetsLoaded: boolean; // Always true (transition condition)
    preferences: {
      helmetColor: string; // From LocalStorage
      scooterDesign: string;
      volume: {
        music: number; // 0.0-1.0
        sfx: number;
      };
    };
  };
}
```

**Guarantees**:
- ✅ Scene completes within 5 seconds on standard broadband (load requirement)
- ✅ All assets verified loaded before transition
- ✅ Preferences loaded or defaults provided

---

## StartScene Contract

### Purpose
Start/title screen where player can customize appearance, adjust settings, and begin game.

### Responsibilities
```typescript
interface StartSceneContract {
  responsibilities: {
    /**
     * Display title and character preview
     */
    display: {
      title: 'Wyatts Scooter Adventure' | 'visual logo';
      characterPreview: 'Wyatt sprite with current customization';
      friends: 'Optional: preview of Nico, Marcus, Otto';
      instructions: 'visual: Press Any Key or Tap to Start';
    };
    
    /**
     * Customization UI (optional for MVP)
     */
    customization?: {
      helmetColorPicker: 'select from 5-8 color options';
      scooterDesignPicker: 'select from 2-3 design options';
      previewUpdates: 'real-time on selection';
    };
    
    /**
     * Settings access (optional)
     */
    settings?: {
      volumeSliders: 'music and sfx independent';
      autoForwardToggle: 'enable/disable auto-forward';
      resetButton: 'reset to defaults';
    };
    
    /**
     * Start game trigger
     */
    startTrigger: {
      input: 'any-key OR screen-tap OR start-button-click';
      action: 'save preferences, transition to GameScene';
    };
  };
  
  /**
   * Transition condition
   */
  transitionTo: 'GameScene';
  transitionWhen: 'player-inputs-start-action';
  transitionDelay: '500ms'; // Brief fade out
}
```

### Input Data
```typescript
interface StartSceneInput {
  /**
   * Received from BootScene or CelebrationScene (on replay)
   */
  data: {
    // From BootScene
    preferences?: {
      helmetColor: string;
      scooterDesign: string;
      volume: { music: number; sfx: number };
    };
    
    // From CelebrationScene (if replaying)
    previousScore?: {
      collectibles: number;
      tricks: number;
      timeElapsed: number;
    };
    playAgain?: boolean;
  };
}
```

### Output Data
```typescript
interface StartSceneOutput {
  /**
   * Passed to GameScene on transition
   */
  data: {
    preferences: {
      helmetColor: string; // Selected or default
      scooterDesign: string;
      autoForward: boolean;
      volume: {
        music: number;
        sfx: number;
      };
    };
    
    // Optional: difficulty or route selection
    gameOptions?: {
      route: 'default' | 'alternate';
      speedMultiplier: number; // 1.0 = normal
    };
  };
}
```

**Guarantees**:
- ✅ Scene is interactive within 500ms of transition in
- ✅ Customization choices are immediately visible on preview
- ✅ Preferences saved to LocalStorage before transitioning
- ✅ Can start game within 5 seconds if desired (SC-001)

---

## GameScene Contract

### Purpose
Main gameplay scene where player rides scooter from home to park.

### Responsibilities
```typescript
interface GameSceneContract {
  responsibilities: {
    /**
     * World setup
     */
    worldInit: {
      backgrounds: 'parallax scrolling layers (home → neighborhood → park)';
      player: 'spawn at START_X position with customization applied';
      collectibles: 'spawn stars, hearts, circles at predetermined positions';
      obstacles: 'spawn puddles, rocks, hills along path';
      camera: 'follow player with smooth lerp';
    };
    
    /**
     * Game loop
     */
    gameLoop: {
      input: 'process keyboard/touch every frame';
      physics: 'update player position, velocity, collisions';
      audio: 'play SFX on actions, maintain background music';
      ui: 'update score, progress bar in real-time';
    };
    
    /**
     * Collision handling
     */
    collisions: {
      collectibles: 'hide, play sound, increment score';
      obstacles: 'apply gentle effect, play sound, never stop';
    };
    
    /**
     * Progress tracking
     */
    progress: {
      distance: 'track player.x as percentage of journey';
      milestones: 'play encouragement at 50% (optional)';
      completion: 'detect when player.x >= PARK_X';
    };
    
    /**
     * Transition trigger
     */
    completionTrigger: {
      condition: 'player.x >= PARK_X';
      action: 'stop physics, play arrival SFX, transition to CelebrationScene';
    };
  };
  
  /**
   * Transition condition
   */
  transitionTo: 'CelebrationScene';
  transitionWhen: 'player-reaches-park-position';
  transitionDelay: '1000ms'; // Allow arrival animation
}
```

### Input Data
```typescript
interface GameSceneInput {
  /**
   * Received from StartScene
   */
  data: {
    preferences: {
      helmetColor: string;
      scooterDesign: string;
      autoForward: boolean;
      volume: {
        music: number;
        sfx: number;
      };
    };
    gameOptions?: {
      route: string;
      speedMultiplier: number;
    };
  };
}
```

### Output Data
```typescript
interface GameSceneOutput {
  /**
   * Passed to CelebrationScene on completion
   */
  data: {
    score: {
      totalCollectibles: number;
      stars: number;
      hearts: number;
      circles: number;
    };
    tricks: number; // How many tricks performed
    timeElapsed: number; // Seconds taken
    distanceTraveled: number; // Total pixels (should match WORLD.PARK_X)
    
    // Stats for analytics (optional)
    stats?: {
      obstaclesHit: number;
      jumps: number;
      averageSpeed: number;
    };
  };
}
```

**Guarantees**:
- ✅ Maintains 30+ FPS throughout gameplay (SC-003)
- ✅ Player ALWAYS completes journey (no failure condition) (SC-010)
- ✅ Journey completes in 2-5 minutes (FR-012, SC-002)
- ✅ All player actions have audio feedback (FR-008)
- ✅ Score accurately tracked in real-time (FR-011)

---

## CelebrationScene Contract

### Purpose
Victory/completion scene celebrating player's arrival at park with friends.

### Responsibilities
```typescript
interface CelebrationSceneContract {
  responsibilities: {
    /**
     * Display celebration
     */
    display: {
      background: 'park setting (Wallingford playfield)';
      player: 'Wyatt at center, celebrating pose';
      friends: 'Nico, Marcus, Otto celebrating with Wyatt (FR-004)';
      effects: 'confetti, sparkles, festive particles';
      audio: 'victory fanfare, "Great job!" voice cue';
    };
    
    /**
     * Show results
     */
    results: {
      totalCollectibles: 'displayed with icon and count';
      breakdown: 'stars: X, hearts: Y, circles: Z';
      tricks: 'optional: X tricks performed!';
      encouragement: 'You did it!', 'Awesome!', 'Great riding!';
    };
    
    /**
     * Options
     */
    options: {
      playAgain: 'button to restart (→ StartScene)';
      customize: 'button to change appearance (→ StartScene customization)';
      // Optional: share, high score view
    };
  };
  
  /**
   * Transition conditions
   */
  transitions: {
    toStart: {
      trigger: 'play-again-button-click';
      delay: '500ms';
      data: 'preserve preferences, reset score';
    };
  };
}
```

### Input Data
```typescript
interface CelebrationSceneInput {
  /**
   * Received from GameScene
   */
  data: {
    score: {
      totalCollectibles: number;
      stars: number;
      hearts: number;
      circles: number;
    };
    tricks: number;
    timeElapsed: number;
    distanceTraveled: number;
    stats?: {
      obstaclesHit: number;
      jumps: number;
      averageSpeed: number;
    };
  };
}
```

### Output Data
```typescript
interface CelebrationSceneOutput {
  /**
   * Passed to StartScene on play-again
   */
  data: {
    playAgain: boolean; // Always true if transitioning
    previousScore: {
      collectibles: number;
      tricks: number;
      timeElapsed: number;
    };
    // Preferences preserved from previous session
  };
}
```

**Guarantees**:
- ✅ Celebration lasts 3-5 seconds minimum (allows enjoyment)
- ✅ Friends (Nico, Marcus, Otto) visible and celebrating (FR-005)
- ✅ Score accurately displayed (FR-011)
- ✅ Positive, encouraging feedback only (FR-013)
- ✅ Replay option immediately available (FR-006, SC-008)

---

## Scene Transition Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    BOOT SCENE                            │
│  - Load all assets (sprites, audio, UI)                 │
│  - Initialize systems (AudioManager, InputManager)      │
│  - Load preferences from LocalStorage                   │
│  - Show loading progress bar                            │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ When: All assets loaded
                     │ Data: { preferences }
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   START SCENE                            │
│  - Show title and character preview                     │
│  - Optional: Customization UI                           │
│  - Optional: Settings (volume, auto-forward)            │
│  - Wait for start input                                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ When: Player presses start
                     │ Data: { preferences, gameOptions }
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   GAME SCENE                             │
│  - Spawn player, collectibles, obstacles                │
│  - Game loop: input → physics → audio → UI              │
│  - Track score, progress, time                          │
│  - Detect park arrival (player.x >= PARK_X)             │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ When: Player reaches park
                     │ Data: { score, tricks, time, stats }
                     ▼
┌──────────────────────────────────────────────────────────┐
│              CELEBRATION SCENE                           │
│  - Show friends celebrating                             │
│  - Display score and encouragement                      │
│  - Play victory music and SFX                           │
│  - Offer play-again option                              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ When: Play-again button clicked
                     │ Data: { playAgain, previousScore }
                     └──────────────────┐
                                        │
                     ┌──────────────────┘
                     │
                     ▼
          Back to START SCENE (loop)
```

---

## Error Recovery Contract

### Invalid Scene Data
```typescript
interface ErrorRecovery {
  /**
   * Handling missing or invalid data on scene transition
   */
  missingData: {
    strategy: 'use-sensible-defaults';
    examples: {
      noPreferences: 'load DEFAULT_PREFERENCES';
      invalidScore: 'set to 0';
      corruptSaveData: 'reset to defaults, continue';
    };
  };
  
  /**
   * Asset loading failures
   */
  assetError: {
    inBootScene: {
      strategy: 'retry-3-times, then show error screen';
      message: 'Could not load game. Please refresh.';
      allowContinue: false; // Cannot proceed without assets
    };
  };
  
  /**
   * Scene transition failures
   */
  transitionError: {
    strategy: 'log error, attempt transition anyway';
    fallback: 'restart from BootScene if repeated failures';
  };
}
```

**Guarantees**:
- ✅ Game never crashes due to missing scene data
- ✅ Sensible defaults prevent broken states
- ✅ Critical failures show user-friendly messages (not technical errors)

---

## Performance Contract

### Scene Load Times
```typescript
interface ScenePerformance {
  /**
   * Target load times for each scene
   */
  loadTimes: {
    BootScene: {
      target: '<5 seconds';
      measure: 'time from start to transition to StartScene';
    };
    StartScene: {
      target: '<500ms';
      measure: 'time from transition in to interactive';
    };
    GameScene: {
      target: '<1 second';
      measure: 'time from transition in to player control enabled';
    };
    CelebrationScene: {
      target: '<500ms';
      measure: 'time from transition in to celebration visible';
    };
  };
  
  /**
   * Transition smoothness
   */
  transitions: {
    fadeEffect: 'smooth fade-out/fade-in (500ms)';
    noJank: 'maintain 30+ FPS during transitions';
    audioHandling: 'crossfade music between scenes (500ms)';
  };
}
```

**Guarantees**:
- ✅ All scenes load within target times
- ✅ Transitions are smooth, no visual glitches
- ✅ Audio transitions are gradual (no abrupt cuts)

---

## Summary

This contract defines:
- **4 scene types**: Boot (loading), Start (menu/customization), Game (gameplay), Celebration (victory)
- **Scene responsibilities**: What each scene does and manages
- **Data flow**: Input and output data for each transition
- **Transition conditions**: When and how scenes change
- **Error recovery**: How invalid data is handled
- **Performance targets**: Load times and transition smoothness

**Contract Validation**: Every scene implementation must:
1. Accept and validate input data according to contract
2. Meet transition conditions before changing scenes
3. Provide complete output data in correct format
4. Handle errors gracefully with defaults
5. Meet performance targets for load time and FPS
