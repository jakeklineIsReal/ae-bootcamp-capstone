# Tasks: Wyatt's Scooter Adventure

**Generated**: 2026-05-11  
**Input**: Design documents from `specs/001-scooter-adventure-game/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: No test tasks included (not requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single web project structure:
- Source: `src/` at repository root
- Public assets: `public/assets/`
- All paths relative to `/workspaces/ae-bootcamp-capstone/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling configuration

- [ ] T001 Create project directory structure per plan.md (src/, public/assets/, tests/)
- [ ] T002 Initialize Node.js project with package.json and install core dependencies (phaser, typescript, vite)
- [ ] T003 [P] Configure TypeScript with tsconfig.json (target ES2020, strict mode, Phaser types)
- [ ] T004 [P] Configure Vite build tool in vite.config.ts (GitHub Pages base path, Phaser chunking)
- [ ] T005 [P] Create public/index.html entry point with game container and basic styling
- [ ] T006 [P] Setup .gitignore for node_modules, dist, and IDE files

**Checkpoint**: Project structure ready, dependencies installed, builds successfully

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core game infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Game Configuration & Constants

- [ ] T007 [P] Create src/config/gameConfig.ts with Phaser game configuration (canvas size, physics, scenes)
- [ ] T008 [P] Create src/config/constants.ts with game constants (speeds, gravity, world bounds, colors)
- [ ] T009 [P] Create src/config/assetPaths.ts with asset loading path definitions

### Core Systems (Managers)

- [ ] T010 [P] Implement AudioManager class in src/systems/AudioManager.ts (volume control, play SFX, play music, mute)
- [ ] T011 [P] Implement ScoreManager class in src/systems/ScoreManager.ts (track collectibles by type, get totals)
- [ ] T012 [P] Implement CollisionManager class in src/systems/CollisionManager.ts (handle player-obstacle, player-collectible)
- [ ] T013 [P] Create LocalStorage utility in src/utils/localStorage.ts (save/load preferences with error handling)

### Scene Structure (Empty Templates)

- [ ] T014 [P] Create BootScene class in src/scenes/BootScene.ts with asset loading structure
- [ ] T015 [P] Create StartScene class in src/scenes/StartScene.ts with basic scene setup
- [ ] T016 [P] Create GameScene class in src/scenes/GameScene.ts with basic scene setup
- [ ] T017 [P] Create CelebrationScene class in src/scenes/CelebrationScene.ts with basic scene setup

### Main Entry Point

- [ ] T018 Create src/main.ts entry point that initializes Phaser game with all scenes

**Checkpoint**: Foundation ready - all scenes exist, systems available, game launches (empty black screen is OK)

---

## Phase 3: User Story 1 - Basic Journey to Park (Priority: P1) 🎯 MVP

**Goal**: Player can ride scooter from home to park with simple movement, obstacles provide gentle feedback, journey ends with friend celebration

**Independent Test**: Launch game, press right arrow or tap screen to move, pass through obstacles (slow/bump but never stop), reach park destination and see friends celebrating

**Acceptance Criteria**:
- Character (Wyatt) visible wearing helmet, moves forward with keyboard/touch controls
- Jump action works with single button press
- Obstacles (puddles, rocks, hills) provide gentle interaction with audio feedback
- Journey completes at Wallingford playfield with friends celebrating
- Can replay after completion

### BootScene Implementation (Assets & Loading)

- [ ] T019 [US1] Implement asset preloading in src/scenes/BootScene.ts (player sprite, backgrounds, basic SFX)
- [ ] T020 [US1] Add loading progress bar visual feedback in src/scenes/BootScene.ts
- [ ] T021 [US1] Load saved preferences from LocalStorage and transition to StartScene in src/scenes/BootScene.ts

### Player Entity

- [ ] T022 [P] [US1] Create Player class in src/entities/Player.ts with position, velocity, and state properties
- [ ] T023 [US1] Implement player movement methods in src/entities/Player.ts (moveRight, jump, applyGravity)
- [ ] T024 [US1] Add player sprite animations in src/entities/Player.ts (idle, walking, jumping)
- [ ] T025 [US1] Implement player collision hitbox configuration in src/entities/Player.ts
- [ ] T026 [US1] Add helmet visibility enforcement in src/entities/Player.ts sprite rendering

### Obstacle Entity

- [ ] T027 [P] [US1] Create Obstacle class in src/entities/Obstacle.ts with type, effect, and hitbox properties
- [ ] T028 [US1] Implement obstacle effect application in src/entities/Obstacle.ts (slow, bump, speed-change)
- [ ] T029 [US1] Add obstacle sprites and animations in src/entities/Obstacle.ts (puddle splash, rock bump, hill)

### Friend Characters

- [ ] T030 [P] [US1] Create Friend class in src/entities/Friend.ts with name, appearance, and state properties
- [ ] T031 [US1] Implement friend celebration animations in src/entities/Friend.ts (waving, celebrating)
- [ ] T032 [US1] Add distinct visual attributes for Nico, Marcus, Otto in src/entities/Friend.ts (height, appearance, helmet colors)

### StartScene Implementation

- [ ] T033 [US1] Implement title display and character preview in src/scenes/StartScene.ts
- [ ] T034 [US1] Add "Press Any Key to Start" visual instruction in src/scenes/StartScene.ts
- [ ] T035 [US1] Implement start trigger (keyboard/touch input) in src/scenes/StartScene.ts
- [ ] T036 [US1] Add transition to GameScene with basic preferences in src/scenes/StartScene.ts

### GameScene Implementation - World Setup

- [ ] T037 [US1] Create parallax scrolling background system in src/scenes/GameScene.ts (3 layers: background, midground, foreground)
- [ ] T038 [US1] Implement world bounds and camera follow in src/scenes/GameScene.ts (camera follows player with lerp)
- [ ] T039 [US1] Spawn player at start position in src/scenes/GameScene.ts
- [ ] T040 [US1] Setup obstacle spawning along journey path in src/scenes/GameScene.ts (puddles, rocks, hills at set positions)

### GameScene Implementation - Input & Physics

- [ ] T041 [US1] Implement keyboard input handling in src/scenes/GameScene.ts (arrow keys, WASD, Space for jump)
- [ ] T042 [US1] Implement touch input zones in src/scenes/GameScene.ts (left/right/center screen regions)
- [ ] T043 [US1] Add physics update loop in src/scenes/GameScene.ts (player movement, gravity, velocity)
- [ ] T044 [US1] Integrate CollisionManager for player-obstacle detection in src/scenes/GameScene.ts

### GameScene Implementation - Audio Feedback

- [ ] T045 [US1] Add AudioManager integration in src/scenes/GameScene.ts (background music starts)
- [ ] T046 [US1] Implement jump sound effect playback in src/scenes/GameScene.ts (triggered on jump action)
- [ ] T047 [US1] Add obstacle interaction sounds in src/scenes/GameScene.ts (splash, bump, whoosh)
- [ ] T048 [US1] Implement parent volume control access in src/scenes/GameScene.ts (pause menu or settings)

### GameScene Implementation - Journey Completion

- [ ] T049 [US1] Implement distance tracking and progress calculation in src/scenes/GameScene.ts (percentage to park)
- [ ] T050 [US1] Add progress bar UI element in src/scenes/GameScene.ts (top-center display)
- [ ] T051 [US1] Detect park arrival condition in src/scenes/GameScene.ts (player.x >= PARK_X)
- [ ] T052 [US1] Transition to CelebrationScene on journey completion in src/scenes/GameScene.ts

### CelebrationScene Implementation

- [ ] T053 [US1] Display friends (Nico, Marcus, Otto) at park in src/scenes/CelebrationScene.ts
- [ ] T054 [US1] Implement friend celebration animations in src/scenes/CelebrationScene.ts (waving, jumping)
- [ ] T055 [US1] Add celebration audio (victory music, congratulatory voice cue) in src/scenes/CelebrationScene.ts
- [ ] T056 [US1] Display "Great job! You made it!" message in src/scenes/CelebrationScene.ts
- [ ] T057 [US1] Implement replay button that returns to StartScene in src/scenes/CelebrationScene.ts

### Asset Preparation for US1

- [ ] T058 [P] [US1] Create or source Wyatt character sprite sheet in public/assets/sprites/wyatt/ (brown hair, red shoes, helmet)
- [ ] T059 [P] [US1] Create or source friend character sprites in public/assets/sprites/friends/ (Nico, Marcus, Otto with helmets)
- [ ] T060 [P] [US1] Create or source obstacle sprites in public/assets/sprites/obstacles/ (puddle, rock, hill)
- [ ] T061 [P] [US1] Create or source background images in public/assets/backgrounds/ (home, neighborhood, park)
- [ ] T062 [P] [US1] Source or create background music loop in public/assets/audio/music/ (upbeat, encouraging)
- [ ] T063 [P] [US1] Source or create SFX for jump, obstacles, celebration in public/assets/audio/sfx/

**Checkpoint**: User Story 1 complete - Full playthrough from start to celebration works, can replay, all audio feedback present

---

## Phase 4: User Story 2 - Collect Items During Journey (Priority: P2)

**Goal**: Player collects items (stars, hearts, circles) along journey with unique audio for each type, sees collection count, celebration shows totals

**Independent Test**: Play game, ride through collectibles, verify each type has distinct shape and sound, check score display updates, celebration shows collection summary

**Acceptance Criteria**:
- Collectibles spawn with distinct shapes (star ⭐, heart ❤️, circle ⚪)
- Each collectible type plays unique sound when collected
- Collection counter displays and updates in real-time
- Celebration shows total items collected

### Collectible Entity

- [ ] T064 [P] [US2] Create Collectible class in src/entities/Collectible.ts with type, shape, position, and collected state
- [ ] T065 [US2] Implement collectible floating animation in src/entities/Collectible.ts (gentle up/down movement)
- [ ] T066 [US2] Add collectible collection effect in src/entities/Collectible.ts (particle sparkle, fade out)
- [ ] T067 [US2] Configure distinct shapes and colors for star, heart, circle in src/entities/Collectible.ts

### GameScene Integration - Collectibles

- [ ] T068 [US2] Add collectible spawning along journey path in src/scenes/GameScene.ts (stars, hearts, circles at set positions)
- [ ] T069 [US2] Integrate CollisionManager for player-collectible detection in src/scenes/GameScene.ts (extends existing collision system)
- [ ] T070 [US2] Implement collectible collection handling in src/scenes/GameScene.ts (hide item, play sound, update score)
- [ ] T071 [US2] Add unique audio for each collectible type in src/scenes/GameScene.ts (twinkle, chime, pop)
- [ ] T072 [US2] Display score counter UI in src/scenes/GameScene.ts (top-left corner, shows total + breakdown)
- [ ] T073 [US2] Update ScoreManager integration in src/scenes/GameScene.ts (increment by type, track totals)

### CelebrationScene Enhancement

- [ ] T074 [US2] Add collection summary display in src/scenes/CelebrationScene.ts (stars: X, hearts: Y, circles: Z)
- [ ] T075 [US2] Enhance celebration based on collection count in src/scenes/CelebrationScene.ts (bonus confetti if collected many)

### Asset Preparation for US2

- [ ] T076 [P] [US2] Create or source collectible sprite sheet in public/assets/sprites/collectibles/ (star, heart, circle shapes)
- [ ] T077 [P] [US2] Create or source unique SFX for each collectible in public/assets/audio/sfx/ (twinkle, chime, pop)
- [ ] T078 [P] [US2] Create particle effect sprites in public/assets/sprites/ (sparkles for collection)

**Checkpoint**: User Story 2 complete - Collectibles spawn, distinct audio/visual feedback, score tracking works, celebration shows totals

---

## Phase 5: User Story 3 - Simple Trick Maneuvers (Priority: P3)

**Goal**: Player performs simple tricks (wheelie/jump trick) during ride, receives visual and audio celebration for each trick

**Independent Test**: Play game, press trick button (Shift/T or dedicated touch zone), verify trick animation plays with "cool!" effect and sound, celebration acknowledges tricks performed

**Acceptance Criteria**:
- Trick button triggers wheelie or jump trick animation
- Visual "cool!" effect appears on trick
- Positive audio cue plays for each trick
- Celebration mentions trick performance

### Player Entity Enhancement - Tricks

- [ ] T079 [US3] Add trick state and animation to Player class in src/entities/Player.ts (wheelie, jump-trick)
- [ ] T080 [US3] Implement performTrick method in src/entities/Player.ts (trigger animation, cooldown)
- [ ] T081 [US3] Add visual trick effect in src/entities/Player.ts (particle trail, star burst)

### GameScene Integration - Tricks

- [ ] T082 [US3] Add trick input handling in src/scenes/GameScene.ts (Shift, T keys, or center touch zone)
- [ ] T083 [US3] Integrate trick triggering with Player entity in src/scenes/GameScene.ts
- [ ] T084 [US3] Add trick sound effect playback in src/scenes/GameScene.ts (whoosh, "cool!" voice cue)
- [ ] T085 [US3] Implement trick counter tracking in src/scenes/GameScene.ts (increment on each trick)
- [ ] T086 [US3] Display visual "Cool!" text on trick in src/scenes/GameScene.ts (tween animation, fade out)

### CelebrationScene Enhancement - Tricks

- [ ] T087 [US3] Add trick count display in src/scenes/CelebrationScene.ts (shows number of tricks performed)
- [ ] T088 [US3] Enhance celebration message for trick performance in src/scenes/CelebrationScene.ts ("You did X tricks!")

### Asset Preparation for US3

- [ ] T089 [P] [US3] Create or source trick animation sprites in public/assets/sprites/wyatt/ (wheelie, jump-trick frames)
- [ ] T090 [P] [US3] Create or source trick SFX in public/assets/audio/sfx/ (whoosh sound)
- [ ] T091 [P] [US3] Create or source trick voice cue in public/assets/audio/voice/ ("Cool!", "Awesome!")

**Checkpoint**: User Story 3 complete - Tricks perform with visual/audio feedback, tracking works, celebration acknowledges tricks

---

## Phase 6: User Story 4 - Customize Appearance (Priority: P4)

**Goal**: Player chooses helmet color and scooter design in start screen, choices persist across sessions via LocalStorage

**Independent Test**: Launch game, customize helmet and scooter in start screen, verify preview updates, start game and see customization applied, reload page and verify choices remembered

**Acceptance Criteria**:
- Customization UI in StartScene with color/design pickers
- Character preview updates in real-time
- Customization applied throughout gameplay
- Choices persist via LocalStorage across sessions

### Customization System

- [ ] T092 [US4] Create CustomizationManager class in src/systems/CustomizationManager.ts (manage helmet/scooter options)
- [ ] T093 [US4] Implement preference save/load with LocalStorage in src/systems/CustomizationManager.ts
- [ ] T094 [US4] Add default customization values in src/systems/CustomizationManager.ts (if no saved preferences)

### StartScene Enhancement - Customization UI

- [ ] T095 [US4] Add helmet color picker UI in src/scenes/StartScene.ts (5-8 color options displayed)
- [ ] T096 [US4] Add scooter design picker UI in src/scenes/StartScene.ts (2-3 design options)
- [ ] T097 [US4] Implement real-time preview update in src/scenes/StartScene.ts (on selection change)
- [ ] T098 [US4] Integrate CustomizationManager save on start in src/scenes/StartScene.ts (save before transition to GameScene)

### Player Entity Enhancement - Customization

- [ ] T099 [US4] Add helmet color customization support in src/entities/Player.ts (apply color to helmet sprite)
- [ ] T100 [US4] Add scooter design customization support in src/entities/Player.ts (swap scooter sprite based on design)

### BootScene Enhancement - Load Customization

- [ ] T101 [US4] Load saved customization from LocalStorage in src/scenes/BootScene.ts (pass to StartScene)
- [ ] T102 [US4] Pass customization preferences to GameScene in src/scenes/StartScene.ts (via scene data)
- [ ] T103 [US4] Apply customization to player in src/scenes/GameScene.ts (on player spawn)

### Asset Preparation for US4

- [ ] T104 [P] [US4] Create helmet color variations in public/assets/sprites/wyatt/ (5-8 color options)
- [ ] T105 [P] [US4] Create scooter design variations in public/assets/sprites/wyatt/ (2-3 design options)

**Checkpoint**: User Story 4 complete - Customization works, persists across sessions, applied throughout game

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality enhancements

### Performance & Optimization

- [ ] T106 [P] Optimize sprite sheet loading in src/scenes/BootScene.ts (use texture atlases)
- [ ] T107 [P] Implement audio sprite for SFX in src/systems/AudioManager.ts (combine multiple SFX into one file)
- [ ] T108 [P] Test and optimize frame rate in src/scenes/GameScene.ts (ensure 30+ FPS on target devices)

### Accessibility Enhancements

- [ ] T109 Verify all interactions have audio feedback in src/scenes/GameScene.ts (100% audio coverage)
- [ ] T110 Test shape-based collectible distinction (star, heart, circle) with color blindness simulation
- [ ] T111 Verify high contrast colors meet WCAG AA standards in src/config/constants.ts

### Cross-Device Testing

- [ ] T112 Test desktop keyboard controls (Chrome, Firefox, Safari)
- [ ] T113 Test tablet touch controls (iPad Safari, Android Chrome)
- [ ] T114 Test mobile touch controls (iPhone Safari, Android Chrome)
- [ ] T115 Verify responsive canvas scaling on different screen sizes in src/config/gameConfig.ts

### UI/UX Polish

- [ ] T116 [P] Add smooth scene transitions with fade effects in all scenes
- [ ] T117 [P] Implement particle effects for celebration in src/scenes/CelebrationScene.ts (confetti)
- [ ] T118 Add visual feedback for touch zones in src/scenes/GameScene.ts (optional button overlays)

### Documentation & Deployment

- [ ] T119 [P] Create player-facing instructions in docs/HOW_TO_PLAY.md (parent guide with volume control info)
- [ ] T120 [P] Update README.md with project description, setup, and deployment instructions
- [ ] T121 Test complete playthrough following quickstart.md validation steps
- [ ] T122 Setup GitHub Pages deployment in .github/workflows/deploy.yml
- [ ] T123 Create production build and test deployed version
- [ ] T124 Prepare demo video or live demo for capstone presentation

### Code Quality

- [ ] T125 [P] Code cleanup and refactoring for clarity in all source files
- [ ] T126 [P] Add inline documentation comments for key systems (AudioManager, CollisionManager, ScoreManager)
- [ ] T127 Verify constitutional requirements met (helmet visible, no failure states, audio feedback, positive reinforcement)

**Checkpoint**: Game polished, tested across devices, deployed, ready for presentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP delivery point
- **User Story 2 (Phase 4)**: Depends on Foundational completion (can start in parallel with US1 but builds on US1 scenes)
- **User Story 3 (Phase 5)**: Depends on Foundational completion and US1 Player entity
- **User Story 4 (Phase 6)**: Depends on Foundational completion and US1 Player/Scene structure
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Depends only on Foundational phase - No dependencies on other stories
- **User Story 2 (P2)**: Depends on Foundational phase - Extends US1 GameScene and collision system
- **User Story 3 (P3)**: Depends on Foundational phase - Extends US1 Player entity and input system
- **User Story 4 (P4)**: Depends on Foundational phase - Extends US1 StartScene and Player entity

**Recommended Order**: US1 → US2 → US3 → US4 (sequential by priority)  
**Parallel Opportunity**: After Foundational, US2/US3/US4 can be worked on in parallel if team capacity allows (all extend US1)

### Within Each User Story

User Story 1:
1. BootScene + Asset loading first
2. Player, Obstacle, Friend entities (can be parallel)
3. StartScene implementation
4. GameScene world setup → Input/Physics → Audio → Completion
5. CelebrationScene implementation
6. Asset preparation (can be parallel with implementation)

User Story 2:
1. Collectible entity first
2. GameScene integration (spawning, collision, audio, UI)
3. CelebrationScene enhancement
4. Asset preparation (can be parallel)

User Story 3:
1. Player entity enhancement (trick methods)
2. GameScene integration (input, audio, visual effects)
3. CelebrationScene enhancement
4. Asset preparation (can be parallel)

User Story 4:
1. CustomizationManager system first
2. StartScene UI (pickers and preview)
3. Player entity customization support
4. BootScene/Scene data flow
5. Asset preparation (can be parallel)

### Parallel Opportunities by Phase

**Phase 1 - Setup**: Tasks T003, T004, T005, T006 can run in parallel (different config files)

**Phase 2 - Foundational**:
- Config files (T007, T008, T009) can run in parallel
- System managers (T010, T011, T012, T013) can run in parallel
- Scene templates (T014, T015, T016, T017) can run in parallel

**Phase 3 - User Story 1**:
- Player, Obstacle, Friend entities (T022, T027, T030) can run in parallel
- Asset preparation (T058-T063) can run in parallel with each other and with implementation

**Phase 4 - User Story 2**:
- Asset preparation (T076-T078) can run in parallel with implementation

**Phase 5 - User Story 3**:
- Asset preparation (T089-T091) can run in parallel with implementation

**Phase 6 - User Story 4**:
- Asset preparation (T104-T105) can run in parallel with implementation

**Phase 7 - Polish**:
- Performance tasks (T106, T107, T108) can run in parallel
- Documentation (T119, T120) can run in parallel
- Code quality (T125, T126) can run in parallel

---

## Parallel Example: Foundational Phase

Launch these tasks together to set up core infrastructure quickly:

```bash
# Config files (parallel group 1):
T007: "Create src/config/gameConfig.ts with Phaser game configuration"
T008: "Create src/config/constants.ts with game constants"
T009: "Create src/config/assetPaths.ts with asset loading path definitions"

# System managers (parallel group 2):
T010: "Implement AudioManager class in src/systems/AudioManager.ts"
T011: "Implement ScoreManager class in src/systems/ScoreManager.ts"
T012: "Implement CollisionManager class in src/systems/CollisionManager.ts"
T013: "Create LocalStorage utility in src/utils/localStorage.ts"

# Scene templates (parallel group 3):
T014: "Create BootScene class in src/scenes/BootScene.ts"
T015: "Create StartScene class in src/scenes/StartScene.ts"
T016: "Create GameScene class in src/scenes/GameScene.ts"
T017: "Create CelebrationScene class in src/scenes/CelebrationScene.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - RECOMMENDED

**Timeline**: Week 1 of capstone (5-7 days)

1. **Days 1-2**: Complete Phase 1 (Setup) + Phase 2 (Foundational)
2. **Days 3-6**: Complete Phase 3 (User Story 1 - Basic Journey)
3. **Day 7**: Test, deploy MVP, validate with 4-year-old
4. **STOP and VALIDATE**: Full playthrough works, all constitutional requirements met

**Deliverable**: Playable game from home to park with celebration - Complete core experience

### Incremental Delivery (Add Features After MVP)

**Timeline**: Weeks 2-3 of capstone

1. **Week 2, Days 1-2**: Add User Story 2 (Collectibles) → Test → Deploy
2. **Week 2, Days 3-4**: Add User Story 3 (Tricks) → Test → Deploy
3. **Week 2, Days 5-7**: Add User Story 4 (Customization) → Test → Deploy
4. **Week 3, Days 1-3**: Phase 7 (Polish) - Audio, visual, performance enhancements
5. **Week 3, Days 4-5**: Cross-device testing, user testing with 4-year-old
6. **Week 3, Days 6-7**: Final deployment, documentation, demo preparation

### Parallel Team Strategy

If working with multiple developers (not typical for capstone):

1. **Week 1**: Team completes Setup + Foundational together
2. **Week 2**: Once Foundational done:
   - Developer A: User Story 1 (blocking for others)
   - Developer B: User Story 2 (waits for US1 GameScene structure, then extends)
   - Developer C: User Story 4 (waits for US1 Player/StartScene, then extends)
3. **Week 3**: User Story 3 + Polish together

---

## Task Summary

### Total Tasks: 127

**By Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 12 tasks
- Phase 3 (User Story 1 - MVP): 45 tasks
- Phase 4 (User Story 2): 15 tasks
- Phase 5 (User Story 3): 13 tasks
- Phase 6 (User Story 4): 14 tasks
- Phase 7 (Polish): 22 tasks

**By User Story**:
- User Story 1 (P1): 45 tasks (35% of total)
- User Story 2 (P2): 15 tasks (12% of total)
- User Story 3 (P3): 13 tasks (10% of total)
- User Story 4 (P4): 14 tasks (11% of total)
- Setup + Foundation: 18 tasks (14% of total)
- Polish: 22 tasks (17% of total)

**Parallel Opportunities**: 47 tasks marked [P] for parallel execution (37% of total)

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (63 tasks) = Complete playable game in 1 week

---

## Notes

- All tasks follow the strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- [P] tasks address different files and can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story delivers an independently testable increment
- No test tasks included (not requested in specification)
- Asset preparation tasks can run in parallel with implementation
- Constitution checks embedded in task descriptions (helmet visibility, audio feedback, no failure states)
- Commit after each task or logical group for iterative progress
- Stop at any checkpoint to validate story independently before proceeding
