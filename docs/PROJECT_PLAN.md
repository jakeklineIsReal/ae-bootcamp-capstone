# Wyatt's Scooter Adventure - Project Plan

## Project Overview

A simple, engaging scooter-themed game designed for a 4-year-old child as a capstone project for the Accelerated Engineering with GitHub Copilot bootcamp.

**Project Goal:** Create an age-appropriate, educational, and entertaining game that allows a young child to virtually experience riding a scooter to the park while reinforcing safety concepts.

---

## Target Audience

- **Primary Player:** 4-year-old child (turning 4 on [date])
- **Skill Level:** Pre-reading age, familiar with video games
- **Requirements:** 
  - Simple, intuitive controls
  - Visual-based communication (minimal text)
  - Immediate, positive feedback
  - High replay value

---

## Game Concept

### Core Mechanic
The player controls a character riding a scooter through a neighborhood environment to reach the Wallingford playfield.

### Primary Gameplay Options

#### Option 1: Journey to the Park
- **Objective:** Ride from home to the playfield
- **Gameplay:** Side-scrolling or simple 3D navigation
- **Challenges:** Simple obstacles (puddles, cones, gentle slopes)
- **Safety Element:** Character wears a helmet (reinforcing real-world safety)
- **Victory Condition:** Arrive at the park and meet friends

#### Option 2: Scooter Race
- **Objective:** Race friends to the park or around a track
- **Gameplay:** Simple racing mechanics with boost/speed elements
- **Safety Element:** All racers wear helmets
- **Victory Condition:** Finish the race (emphasis on participation over winning)

#### Hybrid Approach (Recommended)
Combine both concepts:
- Main mode: Journey to the park with exploration
- Unlock racing mode after completing the journey
- Multiple routes/paths for replay value

---

## Game Features

### Must-Have Features (MVP)
1. **Simple Controls**
   - One or two button controls (arrow keys/WASD or simple gamepad)
   - Automatic forward movement option
   - Jump/trick button

2. **Visual Design**
   - Bright, colorful graphics
   - Large, clear character sprite
   - Friendly, inviting environment
   - Recognizable landmarks (house, park, playground)

3. **Safety Messaging**
   - Character always wears helmet
   - Positive reinforcement for safe riding
   - Avoid cars/traffic (stay on sidewalk/path)

4. **Progression & Rewards**
   - Collectibles along the route (stars, coins, stickers)
   - Simple sound effects and visual celebrations
   - Arrival celebration at park with friends

5. **Replay Value**
   - Quick play sessions (2-5 minutes)
   - Multiple collectible paths
   - Unlockable scooter colors/decorations
   - Friend characters to "race" against

### Nice-to-Have Features
1. **Customization**
   - Choose helmet color/design
   - Choose scooter color/stickers
   - Choose character appearance

2. **Multiple Levels**
   - Different routes to the park
   - Different parks/destinations
   - Seasonal variations (spring, summer, fall)

3. **Tricks System**
   - Simple trick button (makes character do wheelie or jump)
   - Visual "cool!" feedback
   - Optional trick points/collectibles

4. **Parent Dashboard**
   - Track play time
   - View achievements
   - Simple settings

---

## Technical Considerations

### Platform Options

#### Option A: Web-Based (Recommended for Scope)
**Technology Stack:**
- **Framework:** Phaser.js or p5.js
- **Language:** JavaScript/TypeScript
- **Deployment:** Static hosting (GitHub Pages, Netlify, Vercel)
- **Advantages:** 
  - Cross-platform (play on any device with browser)
  - No installation required
  - Quick iteration and deployment
  - Accessible via tablet (good for 4-year-old)
  - Easier to share with family/friends

#### Option B: Desktop Application
**Technology Stack:**
- **Framework:** Godot Engine (lightweight, easy to learn)
- **Language:** GDScript (Python-like)
- **Deployment:** Standalone executable
- **Advantages:**
  - Better performance
  - Richer game engine features
  - Offline play

#### Option C: Mobile App
**Technology Stack:**
- **Framework:** React Native + game library OR Unity
- **Language:** JavaScript/C#
- **Deployment:** iOS/Android
- **Advantages:**
  - Touch-friendly for young children
  - Portable
- **Disadvantages:**
  - More complex deployment process
  - Requires app store submission (or side-loading)
  - Longer development time

### Recommended Tech Stack

**Web-Based Game with Phaser.js:**
- **Frontend:** Phaser 3 (game framework)
- **Language:** TypeScript (type safety for development)
- **Build Tool:** Vite (fast development)
- **Styling:** CSS for UI elements
- **Assets:** Simple 2D sprites (can use free assets or create custom)
- **Audio:** Web Audio API (via Phaser)
- **Deployment:** GitHub Pages or Netlify
- **Version Control:** Git/GitHub

**Why This Stack:**
- Age-appropriate simplicity in final product
- Rapid development and iteration
- Copilot has strong support for web technologies
- Easy to demo and share
- Doable within bootcamp timeframe
- Can be played on desktop, tablet, or phone

---

## Game Design Specifications

### Visual Style
- **Art Style:** Cartoon/colorful 2D
- **Perspective:** Side-scrolling (endless runner style) or top-down view
- **Color Palette:** Bright, primary colors
- **Character Size:** Large enough for easy visibility (20-30% of screen height)

### Controls
- **Keyboard:** Arrow keys or WASD for movement
- **Mobile Touch:** Tap to jump, swipe to move
- **Gamepad:** D-pad/joystick support (optional)
- **Auto-forward:** Consider automatic forward movement with only jump/steer control

### Sound Design
- **Music:** Upbeat, cheerful background music (loopable)
- **SFX:** 
  - Scooter sounds (rolling wheels)
  - Collectible pickup sounds
  - Jump/trick sounds
  - Arrival celebration
  - Positive reinforcement sounds ("Great job!", "Awesome!")
- **Volume:** Parent-adjustable

### Level Design
- **Environment:** Neighborhood setting
  - Start: Home/house
  - Middle: Sidewalk/path with simple obstacles
  - End: Playfield with playground equipment
- **Length:** 30-60 seconds of active play per run
- **Obstacles:** 
  - Puddles (jump over)
  - Small rocks (avoid)
  - Gentle hills (slow down/speed up)
  - Friendly NPCs to wave at
- **Collectibles:** Stars, stickers, or coins spread throughout

---

## Development Phases

### Phase 1: Core Mechanics (Week 1)
- Set up development environment
- Implement basic character movement
- Create simple scrolling background
- Add basic collision detection

### Phase 2: Game Loop (Week 1-2)
- Implement start screen
- Add obstacles and collectibles
- Create win condition (reach park)
- Add basic scoring/collection system

### Phase 3: Polish & Content (Week 2)
- Add sound effects and music
- Improve visuals/animations
- Add celebration/reward screens
- Implement replay/restart functionality

### Phase 4: Enhancement & Testing (Week 2-3)
- Add customization options
- Create additional content (if time permits)
- User testing with target audience
- Bug fixes and refinements

### Phase 5: Deployment (Week 3)
- Prepare for production deployment
- Deploy to web hosting
- Create simple instructions for parents
- Document project for capstone presentation

---

## Success Criteria

### Technical Success
- [ ] Game runs smoothly in modern web browsers
- [ ] Responsive to player input with minimal lag
- [ ] No game-breaking bugs
- [ ] Achieves target performance (30+ FPS)
- [ ] Deploys successfully to web hosting

### User Success
- [ ] 4-year-old can understand how to play without extensive instruction
- [ ] Player can complete one playthrough within 3-5 minutes
- [ ] Game is engaging enough for multiple replays
- [ ] Controls are responsive and age-appropriate
- [ ] Game reinforces positive safety message (helmet wearing)

### Educational Success
- [ ] Reinforces safety concepts (helmet use)
- [ ] Provides positive, encouraging feedback
- [ ] Supports child's confidence and agency

---

## Risk Mitigation

### Scope Creep
- **Risk:** Adding too many features and not finishing
- **Mitigation:** Stick to MVP features first, add nice-to-haves only if time permits

### Technical Complexity
- **Risk:** Choosing tools that are too complex for timeframe
- **Mitigation:** Use proven, well-documented frameworks (Phaser.js)

### Age Appropriateness
- **Risk:** Game being too difficult or too easy
- **Mitigation:** Early user testing with target player, adjustable difficulty

### Time Constraints
- **Risk:** Bootcamp deadline approaching
- **Mitigation:** Clear phase breakdown, daily progress tracking, MVP-first approach

---

## Next Steps

1. **Validate Concept:** Confirm game concept with stakeholders (parent approval!)
2. **Finalize Tech Stack:** Make final decision on platform and technologies
3. **Set Up Environment:** Initialize project repository and development environment
4. **Create Asset List:** Identify needed sprites, sounds, and visual assets
5. **Start Development:** Begin Phase 1 implementation
6. **Iterative Testing:** Regular playtesting with target audience

---

## Resources Needed

### Development
- Code editor (VS Code with GitHub Copilot)
- Web browser for testing
- Version control (Git/GitHub)

### Assets
- Free sprite resources (OpenGameArt, Kenney.nl, itch.io)
- Free sound effects (Freesound.org, OpenGameArt)
- Free music (incompetech.com, OpenGameArt)
- OR simple custom sprites (can use tools like Piskel or Aseprite)

### Testing
- Target player (4-year-old son)
- Various browsers/devices for compatibility testing
- Parent/guardian feedback

---

## Questions to Resolve

1. **Character Design:** Should the character represent your son, or be a generic character?
2. **Friends:** Should friend characters be specific (based on real friends) or generic?
3. **Customization Priority:** How important is character/scooter customization vs. core gameplay?
4. **Difficulty:** Should there be any failure state, or purely positive experience?
5. **Accessibility:** Any specific accessibility needs to consider?

---

## Project Timeline

**Total Duration:** 2-3 weeks (adjust based on bootcamp schedule)

- **Week 1:** Setup → Core gameplay working
- **Week 2:** Content → Polish → Testing
- **Week 3:** Final testing → Deployment → Documentation (if needed)

**Milestone Dates:**
- Project kickoff: [TBD]
- MVP completion: [TBD]
- User testing: [TBD]
- Final deployment: [TBD]
- Capstone presentation: [TBD]

---

## Conclusion

"Wyatt's Scooter Adventure" is a focused, achievable capstone project that combines technical learning with personal meaning. By creating a game for a 4-year-old, the project naturally enforces simplicity, accessibility, and thoughtful design—all valuable engineering principles.

The web-based approach with Phaser.js provides the right balance of capability and achievability within the bootcamp timeframe, while still offering opportunities to demonstrate GitHub Copilot's capabilities in accelerating development.

**Next Action:** Review this plan and begin environment setup and initial prototyping.
