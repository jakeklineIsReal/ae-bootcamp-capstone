---
description: "Wyatt's Scooter Adventure - Age-appropriate game development with Phaser.js"
---

# Wyatt's Scooter Adventure - Development Guidelines

## Project Overview

A web-based 2D scooter game for a 4-year-old child where the player rides from home to the park to meet friends. Built as a capstone project demonstrating spec-driven development with GitHub Copilot.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
specs/001-scooter-adventure-game/plan.md

Key technical context:
- Framework: Phaser 3 + TypeScript + Vite
- Architecture: Scene-based (Boot, Start, Game, Celebration)
- Design: Age-appropriate (4-year-old), no failure states, multi-sensory feedback
- Data model: specs/001-scooter-adventure-game/data-model.md
- Contracts: specs/001-scooter-adventure-game/contracts/
- Setup guide: specs/001-scooter-adventure-game/quickstart.md
<!-- SPECKIT END -->

## Constitutional Principles (NON-NEGOTIABLE)

When writing code, ALWAYS adhere to these five core principles from `.specify/constitution.md`:

### 1. Age-First Design
- Target audience is 4 years old
- Simple, intuitive controls (maximum 2 buttons)
- Large, clear visual elements
- Minimal or no text (visual communication preferred)
- Immediate, obvious feedback for all actions

### 2. Safety-First Messaging
- Player character MUST always wear a helmet
- Helmet must be visible in ALL scenes where the character appears
- No unsafe behaviors depicted
- Positive reinforcement for safe choices

### 3. No Failure States (Purely Positive Experience)
- Player CANNOT lose or fail
- Obstacles slow down but NEVER stop the player
- No "game over" screens
- All feedback is encouraging and supportive
- Progress is always forward

### 4. Accessibility-First
- Audio cues REQUIRED for ALL player actions
- Collectibles use distinct shapes (stars ⭐, hearts ❤️, circles ⚪) not just colors
- Support for color vision differences
- Multi-sensory feedback (visual + audio)

### 5. Personal Connection
- Main character represents Wyatt (brown shaggy hair, red shoes, ninja turtles/monster truck shirt)
- Friend characters: Nico (taller, Latin), Marcus (shorter, Filipino/white), Otto (curly auburn hair)
- All characters wear helmets when on scooters

## Technical Standards

### TypeScript
- Use strict typing (`strict: true`)
- No `any` types except where absolutely necessary
- Prefer interfaces for data contracts
- Use enums for constants
- Follow data model in `specs/001-scooter-adventure-game/data-model.md`

### Phaser 3 Patterns
- Scene-based architecture: Boot → Start → Game → Celebration
- Use Scene data passing for state management (see `contracts/scene-transitions.md`)
- Prefer Phaser's built-in physics over custom collision
- Use sprite sheets for animations
- Optimize asset loading in Boot scene

### Code Organization
```
src/
  scenes/          # Game scenes (Boot, Start, Game, Celebration)
  entities/        # Game objects (Player, Obstacle, Collectible, Friend)
  systems/         # Game systems (Audio, Input, Customization)
  config/          # Configuration and constants
  assets/          # Images, sounds, sprites
  types/           # TypeScript type definitions
```

### Performance Requirements
- Maintain 60 FPS on target devices (desktop browsers, tablets)
- Asset size budget: <10MB total
- Load time target: <3 seconds
- Memory usage: <100MB RAM

## Development Workflow

### MVP-First Approach
1. Core functionality before polish
2. Prioritize P1 user stories over P2/P3/P4
3. Test immediately after each feature
4. Iterate based on user (Wyatt) feedback

### Quality Gates
- Every feature must have audio feedback
- Every feature must work with keyboard controls
- Every scene must show helmet on character
- No feature can introduce a failure state

### Testing Requirements
- Manual playtest after each major feature
- Verify constitutional compliance before committing
- Test on target age group when possible
- Performance profiling for each scene

## Common Patterns

### Adding Audio Feedback
```typescript
// ALWAYS add audio for user actions
this.sound.play('jump', { volume: 0.5 });
this.sound.play('collectStar', { volume: 0.6 });
```

### Forgiving Collision Detection
```typescript
// Obstacles should slow, not stop
if (collision) {
  player.velocity *= 0.5; // Slow down
  this.sound.play('bump');
  // NO game over, NO failure state
}
```

### Helmet Visibility
```typescript
// Helmet must be part of player sprite or separate sprite
// ALWAYS visible when player is shown
player.helmet.setVisible(true);
```

## File Naming Conventions
- Use PascalCase for classes: `PlayerCharacter.ts`, `GameScene.ts`
- Use camelCase for files: `audioManager.ts`, `gameConfig.ts`
- Use kebab-case for assets: `player-sprite.png`, `jump-sound.mp3`

## What NOT to Do
- ❌ No failure states or "game over" screens
- ❌ No complex controls (keep it 1-2 buttons max)
- ❌ No small text or reading requirements
- ❌ No features without audio feedback
- ❌ No unsafe behaviors (character without helmet)
- ❌ No performance-intensive effects that drop below 30 FPS
- ❌ No tight timing requirements that frustrate young players

## Resources
- Constitution: `.specify/constitution.md`
- Specification: `specs/001-scooter-adventure-game/spec.md`
- Implementation Plan: `specs/001-scooter-adventure-game/plan.md`
- Development Tasks: `specs/001-scooter-adventure-game/tasks.md`
- Quickstart Guide: `specs/001-scooter-adventure-game/quickstart.md`
