<!--
SYNC IMPACT REPORT
==================
Version: 0.0.0 → 1.0.0 (Initial ratification)

Changes:
- Initial constitution established
- 5 core principles defined (Age-First Design, Safety-First Messaging, No Failure States, Accessibility-First, Personal Connection)
- Technical standards defined (Web-based stack, performance requirements)
- Development workflow established (MVP-first, iterative testing, timeboxed delivery)

Template Updates Required:
- ✅ plan-template.md: Verify alignment with age-appropriate design and no-failure principles
- ✅ spec-template.md: Verify accessibility and safety requirements sections
- ✅ tasks-template.md: Verify task categorization includes user testing and accessibility validation

Follow-up TODOs: None - all placeholders filled
-->

# Wyatt's Scooter Adventure Constitution

## Core Principles

### I. Age-First Design (NON-NEGOTIABLE)
All features MUST be designed for a 4-year-old player:
- Pre-reading age: Visual communication only, minimal or no text
- One or two button controls maximum (arrow keys, WASD, or simple gamepad)
- Automatic forward movement option to reduce cognitive load
- Large, clear visual elements (characters occupy 20-30% of screen height)
- Play sessions MUST complete within 2-5 minutes
- Every feature decision asks: "Can a 4-year-old understand and use this without adult help?"

**Rationale:** The game's sole purpose is to delight and engage a young child. Complexity kills joy at this age. If a feature requires explanation or reading, it violates this principle.

### II. Safety-First Messaging (NON-NEGOTIABLE)
Safety concepts MUST be woven into gameplay, never compromised:
- Main character (Wyatt) and all friend characters MUST wear helmets when on scooters
- Gameplay reinforces staying on sidewalk/path, avoiding traffic
- All safety-related feedback is positive and encouraging, never punitive
- Visual design makes helmet-wearing characters look "cool" and aspirational
- No mechanics that reward or encourage unsafe behavior

**Rationale:** This game teaches as it entertains. The helmet message is non-negotiable because it models real-world safety for the target player.

### III. No Failure States (NON-NEGOTIABLE)
The game MUST be purely positive—obstacles slow but never stop:
- No "game over" screens or failure conditions
- Obstacles (puddles, rocks, hills) may slow the player or affect collectibles, but never end the game
- All feedback is encouraging ("Great job!", "Awesome!", "You did it!")
- Player always reaches the park and meets friends
- Focus on exploration, collection, and celebration—never punishment

**Rationale:** At age 4, frustration destroys engagement. The goal is confidence-building and joy, not challenge mastery. Failure states would undermine the game's purpose as a gift of agency and fun.

### IV. Accessibility-First (NON-NEGOTIABLE)
Multi-sensory feedback and inclusive design are mandatory:
- Audio cues for ALL player actions (jumps, collectibles, obstacles, achievements)
- Distinct shapes for different collectible types (stars ⭐, hearts ❤️, circles ⚪) in addition to color
- Color palette choices MUST consider color blindness (use high-contrast patterns and shapes)
- Parent-adjustable volume controls
- Tested on multiple devices (desktop, tablet, phone) for input compatibility

**Rationale:** Accessibility isn't optional—it's foundational. Audio feedback aids young players' understanding and makes the game inclusive. Shape-based design ensures color blindness doesn't block enjoyment.

### V. Personal Connection
Characters and content MUST reflect the player's real world:
- Main character represents Wyatt: brown shaggy hair, red shoes, Ninja Turtles or monster truck shirt, helmet
- Friend characters based on real friends: Nico (taller, Latin), Marcus (shorter, Filipino/white), Otto (curly auburn hair)
- Setting represents familiar location: journey from home to Wallingford playfield
- Friends celebrate Wyatt's arrival at the park
- This personal touch is what transforms a generic game into a meaningful gift

**Rationale:** Personal representation creates emotional investment and recognition. The game's value comes from being specifically for this child, reflecting their world and friendships.

## Technical Standards

### Web-Based Stack (REQUIRED)
- **Framework:** Phaser 3 game framework
- **Language:** TypeScript (for development type safety and Copilot effectiveness)
- **Build Tool:** Vite (fast iteration during development)
- **Deployment:** Static hosting (GitHub Pages, Netlify, or Vercel)
- **Version Control:** Git/GitHub with meaningful commit messages

**Rationale:** Web-based deployment enables cross-platform play (desktop, tablet, phone) without installation barriers. TypeScript provides safety during rapid development. This stack is achievable within bootcamp timeframe and leverages Copilot's strengths.

### Performance Requirements
- MUST achieve 30+ FPS in modern browsers
- Responsive input with minimal lag (<100ms)
- Loads within 5 seconds on standard broadband
- No game-breaking bugs in release builds
- Works on Chrome, Firefox, Safari (desktop and mobile)

**Rationale:** Performance directly impacts enjoyment for young players. Lag destroys the sense of control. Cross-browser compatibility ensures the game reaches its audience regardless of device.

### Asset Standards
- Sprites: 2D cartoon style, bright primary colors
- Audio: Upbeat, cheerful music (loopable); distinct SFX for each action type
- File sizes: Optimize for web (compressed images, efficient audio formats)
- Licensing: Only use assets with appropriate licenses (free/open or properly purchased)

**Rationale:** Consistent visual style maintains immersion. Audio quality affects accessibility. Licensing compliance prevents future issues.

## Development Workflow

### MVP-First Approach (REQUIRED)
Development MUST proceed in priority order:
1. **Phase 1 (Week 1):** Core mechanics—character movement, scrolling, basic collision
2. **Phase 2 (Week 1-2):** Game loop—start screen, obstacles, collectibles, win condition
3. **Phase 3 (Week 2):** Polish—audio, visuals, celebrations, replay functionality
4. **Phase 4 (Week 2-3):** Enhancement—customization (if time), additional content, user testing, bug fixes
5. **Phase 5 (Week 3):** Deployment—production build, hosting, documentation

Nice-to-have features (customization, multiple levels, tricks system, social features) are added ONLY after MVP is playable and tested. Scope creep is the enemy of timely delivery.

**Rationale:** Bootcamp timeline is fixed. MVP-first ensures a complete, playable game even if advanced features are cut. Better to ship a polished simple game than an incomplete ambitious one.

### Iterative Testing (REQUIRED)
- Test with the target player (4-year-old) at end of each phase
- Observe play without instruction—if explanation is needed, controls are too complex
- Parent/guardian feedback on safety messaging and appropriateness
- Cross-browser and cross-device testing before deployment
- Bug fixes prioritized by impact on playability

**Rationale:** The target user cannot articulate feedback verbally but their behavior reveals usability issues. Early, frequent testing prevents building features the player can't use.

### Quality Gates
Every feature MUST pass before merge:
- Runs without errors in development build
- Maintains target framerate (30+ FPS)
- Adheres to age-appropriate design principle (could a 4-year-old use it?)
- Includes appropriate audio cues (accessibility requirement)
- Committed with descriptive message explaining what and why

**Rationale:** Quality gates prevent regression and ensure every change aligns with core principles.

## Governance

This constitution supersedes all other development preferences. When in doubt, refer to the core principles—especially Age-First Design and No Failure States.

### Amendment Procedure
- Amendments require documentation of: (1) what changed, (2) why it changed, (3) impact on existing features
- Version bumps follow semantic versioning:
  - **MAJOR:** Principle removed or redefined (backward incompatible change to project philosophy)
  - **MINOR:** New principle added or significant section expansion
  - **PATCH:** Clarifications, wording improvements, non-semantic refinements
- Amendments MUST propagate to dependent templates (plan-template.md, spec-template.md, tasks-template.md)

### Compliance Verification
- All feature specifications MUST reference which principles they satisfy
- Code reviews verify adherence to Technical Standards and accessibility requirements
- User testing validates Age-First Design and No Failure States principles
- Deployment checklist confirms performance requirements met

### Development Guidance
During active development, refer to this constitution when making design decisions. When choosing between complexity and simplicity, choose simplicity. When choosing between more features and timely delivery, choose delivery. When choosing between generic and personal, choose personal.

The mission: Create a joyful, safe, accessible scooter adventure that lets a 4-year-old experience the thrill of riding to the park to meet friends—and always, always wear that helmet.

**Version**: 1.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
