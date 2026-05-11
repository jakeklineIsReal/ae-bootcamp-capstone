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
   - Audio cues for all control actions

2. **Visual Design**
   - Bright, colorful graphics with shape/pattern support for accessibility
   - Large, clear character sprite (representing your son)
   - Friendly, inviting environment
   - Recognizable landmarks (house, park, playground)
   - Friend characters based on real friends

3. **Safety Messaging**
   - Character always wears helmet
   - Positive reinforcement for safe riding
   - Avoid cars/traffic (stay on sidewalk/path)
   - No failure states - purely encouraging

4. **Progression & Rewards**
   - Collectibles along the route (stars, coins, stickers) with distinctive audio
   - Simple sound effects and visual celebrations
   - Arrival celebration at park with friends
   - All feedback is positive and encouraging

5. **Replay Value**
   - Quick play sessions (2-5 minutes)
   - Multiple collectible paths
   - Friend characters to meet at the park
   - Different routes to discover

### Nice-to-Have Features
1. **Customization** (Medium Priority - Add After Core Gameplay)
   - Choose helmet color/design
   - Choose scooter color/stickers
   - Unlock new designs through play

2. **Multiple Levels**
   - Different routes to the park
   - Different parks/destinations
   - Seasonal variations (spring, summer, fall)

3. **Tricks System**
   - Simple trick button (makes character do wheelie or jump)
   - Visual "cool!" feedback with audio cue
   - Optional trick points/collectibles

4. **Social Features**
   - Share achievements (via screenshot or simple code)
   - Parent can see play stats
   - Simple congratulations messages

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

### Character Design

#### Main Character: Wyatt
- **Hair:** Brown, shortish but a bit shaggy
- **Clothing:** Sweatpants or shorts with either:
  - Ninja Turtles shirt, OR
  - Monster truck shirt
- **Distinctive Feature:** Red shoes (signature look!)
- **Safety Gear:** Always wearing a helmet
- **Transportation:** Riding a scooter
- **Sprite Design Notes:** Age-appropriate proportions (larger head, simpler features for 2D sprite)
  
#### Friend Characters at the Park

**Nico**
- A little taller and older than Wyatt
- Latin appearance
- Friendly, welcoming presence

**Marcus**
- A little shorter than Wyatt
- Filipino and white heritage
- Approachable and fun

**Otto** (The New Friend)
- Curly auburn hair (distinctive!)
- Similar height to Wyatt
- Excited to meet at the park

**Friend Character Notes:**
- All wearing helmets when shown on scooters
- Simple distinguishing features (height, hair, skin tone)
- Friendly, welcoming poses at the playfield
- Celebrating when Wyatt arrives

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
- **SFX (Critical for Accessibility):** 
  - Scooter sounds (rolling wheels)
  - Collectible pickup sounds (unique for each type)
  - Jump/trick sounds
  - Arrival celebration
  - Positive reinforcement sounds ("Great job!", "Awesome!", "You did it!")
  - Obstacle interaction sounds (friendly "bump" or "oops")
  - Audio cues for ALL player actions
- **Volume:** Parent-adjustable
- **Design Note:** Audio provides important feedback for young players and accessibility

### Level Design
- **Environment:** Neighborhood setting
  - Start: Home/house
  - Middle: Sidewalk/path with simple obstacles
  - End: Wallingford playfield with playground equipment and friends
- **Length:** 30-60 seconds of active play per run
- **Obstacles (No Failure State):** 
  - Puddles (jump over or slow down slightly)
  - Small rocks (avoid or bump gently)
  - Gentle hills (slow down/speed up)
  - Friendly NPCs to wave at
  - All interactions are forgiving - no "game over"
- **Collectibles:** Stars, stickers, or coins spread throughout
- **Color Accessibility:** Use distinct shapes for different items (stars ⭐, hearts ❤️, circles ⚪)

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
- [ ] No frustration from failure states - purely positive experience
- [ ] Character and friends are recognizable and meaningful
- [ ] Audio cues provide clear feedback for all actions

### Educational Success
- [ ] Reinforces safety concepts (helmet use)
- [ ] Provides positive, encouraging feedback
- [ ] Supports child's confidence and agency
- [ ] Creates a personal connection through character representation

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

1. ✅ **Gather Character Details** - COMPLETE
   - Main character: Wyatt with brown shaggy hair, red shoes, ninja turtles/monster truck shirt
   - Friends: Nico (taller, Latin), Marcus (shorter, Filipino/white), Otto (curly auburn hair)
   
2. **Set Up Development Environment**
   - Initialize Phaser.js project with TypeScript
   - Set up build tooling (Vite)
   - Configure version control
   
3. **Create Asset List & Gather Resources**
   - Character sprites (Wyatt + 3 friends)
   - Scooter sprite
   - Background elements (house, sidewalk, park)
   - Collectibles (stars, hearts, circles)
   - Sound effects and music
   
4. **Start Development - Phase 1**
   - Implement basic character movement
   - Create simple scrolling background
   - Add basic collision detection
   
5. **Iterative Testing:** Regular playtesting with Wyatt

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

## Design Decisions

### Character & Personalization
- **Main Character:** Will represent your son specifically for a more personal experience
- **Friend Characters:** Based on real friends for added meaning and recognition
- **Impact:** This makes the game a truly personal gift and increases engagement

### Customization Approach
- **Priority Level:** Medium priority
- **Implementation:** Add basic customization (helmet colors, scooter designs) after core gameplay is working
- **Rationale:** Balance between feature completeness and timely delivery

### Difficulty Philosophy
- **Approach:** No failure state - purely positive experience
- **Design:** Age-appropriate for 4-year-old, focuses on exploration and celebration
- **Mechanics:** Obstacles may slow player down but never cause "game over"
- **Feedback:** Always encouraging and supportive

### Accessibility Features
- **Color Blindness Support:** Use shapes and patterns in addition to colors for important elements
- **Audio Feedback:** Sound cues for all actions (jumps, collectibles, obstacles)
- **Benefits:** Makes game more inclusive and provides multi-sensory feedback for young players

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

**Key Design Principles Established:**
- ✅ Personal and meaningful (character based on your son, friends based on real friends)
- ✅ Purely positive experience (no failure states)
- ✅ Accessible design (color blindness support, audio cues for all actions)
- ✅ Safety-conscious (helmet messaging throughout)
- ✅ Customization available but not blocking core gameplay

**Next Action:** Gather character details and begin environment setup and initial prototyping.
