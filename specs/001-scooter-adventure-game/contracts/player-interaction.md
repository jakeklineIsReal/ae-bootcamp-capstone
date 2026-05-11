# Player Interaction Contract

**Version**: 1.0.0  
**Purpose**: Defines the external interface between the player and the game (inputs, outputs, feedback)

---

## Input Contract

### Keyboard Controls
```typescript
interface KeyboardControls {
  /**
   * Primary movement controls
   * REQUIREMENT: FR-002 - Simple movement controls
   */
  movement: {
    left: 'ArrowLeft' | 'A';
    right: 'ArrowRight' | 'D';
  };
  
  /**
   * Jump action
   * REQUIREMENT: FR-003 - Jump action with single button
   */
  jump: 'ArrowUp' | 'W' | 'Space';
  
  /**
   * Trick action (optional)
   * REQUIREMENT: FR-017 - Trick actions
   */
  trick: 'Shift' | 'T';
  
  /**
   * Pause/Menu (optional)
   * REQUIREMENT: FR-016 - Volume controls accessible
   */
  pause: 'Escape' | 'P';
}
```

**Guarantees**:
- ✅ All inputs respond within 100ms (performance requirement)
- ✅ No input combinations required (single key actions only)
- ✅ Multiple key options provided for accessibility
- ✅ Keys are age-appropriate (large, easy to find on keyboard)

---

### Touch Controls
```typescript
interface TouchControls {
  /**
   * Touch zones for tablet/mobile input
   * REQUIREMENT: FR-002, FR-003 - Touch-friendly controls
   */
  zones: {
    /**
     * Left third of screen - optional backward movement
     * (May be unused if auto-forward enabled)
     */
    leftZone: {
      bounds: 'x: 0 to width/3, y: 0 to height';
      action: 'move-left' | 'none';
    };
    
    /**
     * Right third of screen - jump action
     * Minimum touch target: 44x44px (WCAG guideline)
     */
    rightZone: {
      bounds: 'x: 2*width/3 to width, y: 0 to height';
      action: 'jump';
    };
    
    /**
     * Center zone - optional trick or forward boost
     */
    centerZone: {
      bounds: 'x: width/3 to 2*width/3, y: 0 to height';
      action: 'trick' | 'boost';
    };
  };
  
  /**
   * Optional: Virtual button overlay
   * For players who prefer explicit buttons
   */
  virtualButtons?: {
    jump: {
      position: 'bottom-right';
      size: '80x80px'; // Large for young children
      visible: boolean;
    };
    trick: {
      position: 'bottom-left';
      size: '80x80px';
      visible: boolean;
    };
  };
}
```

**Guarantees**:
- ✅ Touch targets meet minimum size (44x44px WCAG AA)
- ✅ No multi-touch gestures required (single tap only)
- ✅ Visual feedback on touch down (button highlight, ripple effect)
- ✅ Touch zones don't overlap (clear interaction regions)

---

### Auto-Forward Option
```typescript
interface AutoForwardConfig {
  /**
   * Enables automatic forward movement
   * REQUIREMENT: Age-First Design - reduce cognitive load
   */
  enabled: boolean;
  
  /**
   * Speed of auto-forward (pixels per second)
   */
  speed: number; // Default: 150
  
  /**
   * Can player still control left/right?
   * If false, only jump/trick controls active
   */
  allowManualControl: boolean;
}
```

**Guarantees**:
- ✅ When enabled, player focuses only on timing (jump, trick)
- ✅ Never moves so fast player can't react to obstacles
- ✅ Can be toggled in settings screen

---

## Output Contract

### Visual Feedback
```typescript
interface VisualFeedback {
  /**
   * Player character feedback
   * REQUIREMENT: FR-001, FR-014 - Character always visible with helmet
   */
  player: {
    /**
     * Player sprite always centered on screen
     * Large sprite (20-30% of screen height)
     */
    visibility: 'always-visible';
    size: 'large'; // 120-180px height
    helmet: 'always-shown'; // Safety messaging
    
    /**
     * State animations
     */
    animations: {
      idle: 'standing-on-scooter';
      walking: 'scooting-forward';
      jumping: 'in-air';
      trick: 'wheelie-or-jump-trick';
    };
  };
  
  /**
   * Collectible feedback
   * REQUIREMENT: FR-009 - Distinct shapes
   */
  collectibles: {
    /**
     * Each type has unique shape (accessibility)
     */
    shapes: {
      star: '5-pointed-star';
      heart: 'rounded-heart';
      circle: 'simple-circle';
    };
    
    /**
     * Collection animation
     */
    onCollect: {
      particle: 'sparkle-effect';
      animation: 'float-up-fade-out';
      duration: '500ms';
    };
  };
  
  /**
   * Obstacle feedback
   * REQUIREMENT: FR-007 - Gentle interaction
   */
  obstacles: {
    onCollision: {
      playerEffect: 'small-bounce' | 'slow-motion-brief';
      duration: '200-1000ms';
      obstacleEffect: 'splash' | 'bump-animation';
    };
  };
  
  /**
   * UI Elements
   * REQUIREMENT: FR-011 - Show collection count
   */
  ui: {
    score: {
      position: 'top-left';
      shows: 'total-collectibles + breakdown';
      updates: 'real-time-on-collect';
    };
    
    progress: {
      position: 'top-center';
      type: 'progress-bar' | 'distance-indicator';
      shows: 'percentage-to-park';
    };
  };
  
  /**
   * Celebration feedback
   * REQUIREMENT: FR-005 - Celebration on arrival
   */
  celebration: {
    friends: 'visible-and-celebrating';
    confetti: 'particle-effect';
    message: 'Great job! You made it!'; // Visual text OK in celebration
    duration: '3-5 seconds';
  };
}
```

**Guarantees**:
- ✅ All feedback is immediate (<100ms from action)
- ✅ Visual clarity for 4-year-old (large, high contrast)
- ✅ No confusing or scary visuals (positive only)
- ✅ Helmet always visible (safety messaging)

---

### Audio Feedback
```typescript
interface AudioFeedback {
  /**
   * Music
   * REQUIREMENT: FR-008 - Audio for all actions
   */
  music: {
    gameplay: {
      file: 'upbeat-loop.mp3';
      tempo: 'moderate-fast';
      mood: 'cheerful-encouraging';
      volume: 'adjustable'; // FR-016
    };
    celebration: {
      file: 'victory-fanfare.mp3';
      duration: '3-5 seconds';
      volume: 'adjustable';
    };
  };
  
  /**
   * Sound effects
   * REQUIREMENT: FR-008, FR-010 - Audio cues for all actions
   */
  sfx: {
    /**
     * Player actions
     */
    playerActions: {
      jump: {
        file: 'jump.mp3';
        trigger: 'on-jump-key-press';
        volume: 'medium';
      };
      trick: {
        file: 'trick-whoosh.mp3';
        trigger: 'on-trick-start';
        volume: 'medium';
      };
      landing: {
        file: 'soft-landing.mp3';
        trigger: 'on-ground-contact';
        volume: 'low';
      };
    };
    
    /**
     * Collectibles (unique per type)
     * REQUIREMENT: FR-010 - Unique audio per collectible type
     */
    collectibles: {
      star: {
        file: 'twinkle.mp3';
        pitch: 'high';
        volume: 'medium';
      };
      heart: {
        file: 'chime.mp3';
        pitch: 'medium';
        volume: 'medium';
      };
      circle: {
        file: 'pop.mp3';
        pitch: 'low';
        volume: 'medium';
      };
    };
    
    /**
     * Obstacles
     * REQUIREMENT: FR-008 - Audio for obstacles
     */
    obstacles: {
      puddle: {
        file: 'splash.mp3';
        mood: 'friendly-playful';
      };
      rock: {
        file: 'bump.mp3';
        mood: 'gentle-oops';
      };
      hill: {
        file: 'whoosh.mp3';
        mood: 'exciting-boost';
      };
    };
    
    /**
     * Positive reinforcement
     * REQUIREMENT: FR-013 - Encouraging feedback
     */
    encouragement: {
      arrival: {
        file: 'great-job.mp3';
        text: 'Great job!';
        trigger: 'on-park-arrival';
      };
      milestone: {
        file: 'awesome.mp3';
        text: 'Awesome!';
        trigger: 'on-halfway-point';
      };
      tricksComplete: {
        file: 'cool.mp3';
        text: 'Cool!';
        trigger: 'on-trick-complete';
      };
    };
  };
  
  /**
   * Volume control
   * REQUIREMENT: FR-016 - Parent-adjustable volume
   */
  volumeControl: {
    music: 'range: 0.0 to 1.0, default: 0.6';
    sfx: 'range: 0.0 to 1.0, default: 0.8';
    mute: 'toggle for each category';
  };
}
```

**Guarantees**:
- ✅ Every player action has audio feedback (accessibility)
- ✅ Unique sounds for each collectible type (FR-010)
- ✅ All audio is age-appropriate (friendly, encouraging)
- ✅ Volume is adjustable and persistent (FR-016, FR-019)
- ✅ Game remains playable with audio muted (visual feedback sufficient)

---

## Feedback Timing Contract

### Response Times
```typescript
interface FeedbackTiming {
  /**
   * Maximum delay from player action to feedback
   * REQUIREMENT: Performance goal <100ms response
   */
  inputToFeedback: {
    visual: '<50ms'; // Immediate sprite animation
    audio: '<100ms'; // Sound effect playback
    uiUpdate: '<50ms'; // Score/UI update
  };
  
  /**
   * Animation durations (age-appropriate pacing)
   */
  animations: {
    collectAnimation: '300-500ms'; // Quick satisfaction
    obstacleReaction: '200-1000ms'; // Brief, recoverable
    trickAnimation: '800ms'; // Long enough to appreciate
    sceneTransition: '500ms'; // Smooth but not slow
  };
  
  /**
   * Audio timing
   */
  audio: {
    sfxLatency: '<50ms'; // Near-instant
    musicFadeIn: '500ms'; // Gentle start
    musicFadeOut: '300ms'; // Quick stop
  };
}
```

**Guarantees**:
- ✅ All timing values support fluid, responsive experience
- ✅ No delays that break cause-effect understanding
- ✅ Fast enough for 4-year-old to maintain connection between action and result

---

## Accessibility Contract

### Multi-Sensory Support
```typescript
interface AccessibilityRequirements {
  /**
   * Visual accessibility
   * REQUIREMENT: SC-006 - Distinct shapes for color blindness
   */
  visual: {
    colorBlindness: {
      strategy: 'shape-based-encoding';
      shapes: 'star, heart, circle are clearly distinct';
      contrast: 'high-contrast colors (WCAG AA minimum)';
    };
    visualClarity: {
      spriteSize: 'large (20-30% screen height for player)';
      uiText: 'minimal (pre-reading age)';
      animations: 'clear, exaggerated movements';
    };
  };
  
  /**
   * Audio accessibility
   * REQUIREMENT: FR-008 - Audio for all interactions
   */
  audio: {
    soundCues: 'every-action-has-unique-sound';
    spatialAudio: 'not-required (simple stereo or mono)';
    volumeControl: 'independent-music-and-sfx-control';
    playableWithoutAudio: 'visual-feedback-sufficient';
  };
  
  /**
   * Input accessibility
   * REQUIREMENT: Age-First Design
   */
  input: {
    keyboardAlternatives: 'multiple-keys-for-same-action';
    touchTargets: 'minimum-44x44px';
    noComplexGestures: 'single-tap-only';
    forgivingTiming: 'generous-input-windows';
  };
}
```

**Guarantees**:
- ✅ Game is playable with visual OR audio impairments
- ✅ Input methods accommodate different abilities
- ✅ No single sense required for full enjoyment

---

## Error Handling Contract

### No Failure States
```typescript
interface NoFailureStateGuarantee {
  /**
   * REQUIREMENT: Constitution Principle III - No Failure States
   */
  guarantees: {
    /**
     * Player ALWAYS reaches the park
     */
    journeyCompletion: 'guaranteed';
    
    /**
     * Obstacles never stop progress
     */
    obstacleInteraction: {
      result: 'slow-or-bump-never-stop';
      recovery: 'automatic-within-1-second';
      feedback: 'positive-or-neutral-only';
    };
    
    /**
     * No punitive mechanics
     */
    noPenalties: {
      noLives: true;
      noHealth: true;
      noTimers: true;
      noGameOver: true;
      noFailureScreens: true;
    };
    
    /**
     * All feedback is encouraging
     */
    positiveFeedback: {
      onObstacle: 'oops! keep going!';
      onMissedCollectible: 'no-comment (ignore)';
      onSlow progress: 'youre doing great!';
      onArrival: 'awesome! you made it!';
    };
  };
}
```

**Guarantees**:
- ✅ Zero failure conditions throughout entire game (SC-010)
- ✅ 100% of players complete journey on first attempt (SC-004)
- ✅ All feedback is positive or encouraging (FR-013)

---

## Session Contract

### Play Session Flow
```typescript
interface SessionFlow {
  /**
   * REQUIREMENT: FR-012 - 2-5 minute play sessions
   */
  duration: {
    minimum: '2 minutes'; // Speedrun path
    typical: '3-4 minutes'; // Normal pace with collectibles
    maximum: '5 minutes'; // Slow exploration
  };
  
  /**
   * Session lifecycle
   */
  lifecycle: {
    start: {
      scene: 'StartScene';
      playerAction: 'press-any-key or tap-screen';
      transition: 'immediate-to-GameScene';
    };
    gameplay: {
      scene: 'GameScene';
      endCondition: 'player-reaches-park-position';
      cannotFail: true;
    };
    celebration: {
      scene: 'CelebrationScene';
      shows: 'friends, score, encouragement';
      duration: '3-5 seconds';
      options: ['play-again', 'customize', 'exit'];
    };
  };
  
  /**
   * Replay support
   * REQUIREMENT: FR-006 - Replay option
   */
  replay: {
    available: 'immediately-after-celebration';
    preserves: 'customization-preferences';
    resets: 'score, position, collectibles';
  };
}
```

**Guarantees**:
- ✅ Session length appropriate for attention span (SC-002)
- ✅ Clear beginning, middle, end structure
- ✅ Easy to replay (encourages multiple playthroughs)

---

## Summary

This contract defines:
- **Input methods**: Keyboard, touch, auto-forward with clear controls
- **Output feedback**: Visual (animations, UI) + Audio (music, SFX, voice) for every interaction
- **Timing guarantees**: <100ms response, age-appropriate pacing
- **Accessibility**: Multi-sensory design, shape-based encoding, large targets
- **No failure states**: Guaranteed success, positive-only feedback
- **Session structure**: 2-5 minute play time with clear flow

**Contract Validation**: Every feature implementation must verify it provides both visual AND audio feedback, maintains <100ms response time, and never creates a failure condition.
