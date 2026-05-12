# Wyatt's Scooter Adventure - Test Suite

Comprehensive unit tests for all source files ensuring constitutional compliance and code quality.

## Overview

This test suite covers:
- ✅ **Entities**: Player, Collectible, Obstacle, Friend
- ✅ **Systems**: AudioManager, CollisionManager, ScoreManager, SynthAudioManager
- ✅ **Utils**: localStorage
- ✅ **Config**: constants
- ✅ **Constitutional Compliance**: All five constitutional principles

## Installation

Install test dependencies:

```bash
npm install
```

This will install:
- `vitest` - Fast test runner with TypeScript support
- `@vitest/ui` - Interactive test UI
- `@vitest/coverage-v8` - Code coverage reporting
- `jsdom` - DOM simulation for browser APIs

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```
Opens an interactive browser-based test UI at http://localhost:51204

### Run Tests with Coverage
```bash
npm run test:coverage
```
Generates coverage report in `coverage/` directory and displays summary in terminal.

### Run Tests in Watch Mode
```bash
npm run test:watch
```
Automatically reruns tests when files change.

### Run Tests Once (CI Mode)
```bash
npm run test:run
```
Runs tests once and exits (useful for CI/CD).

### Run Specific Test File
```bash
npm test -- Player.test.ts
```

### Run Tests for Specific Directory
```bash
npm test -- tests/unit/entities
npm test -- tests/unit/systems
```

## Test Structure

```
tests/
├── setup.ts                        # Global test setup (mocks, etc.)
├── helpers/
│   ├── phaserMocks.ts             # Phaser object mocks
│   └── testUtils.ts               # Test utilities
├── unit/
│   ├── entities/
│   │   ├── Player.test.ts         # Player entity tests
│   │   ├── Collectible.test.ts    # Collectible entity tests
│   │   ├── Obstacle.test.ts       # Obstacle entity tests
│   │   └── Friend.test.ts         # Friend entity tests
│   ├── systems/
│   │   ├── AudioManager.test.ts          # Audio system tests
│   │   ├── CollisionManager.test.ts      # Collision system tests
│   │   ├── ScoreManager.test.ts          # Score tracking tests
│   │   └── SynthAudioManager.test.ts     # Synthesized audio tests
│   ├── utils/
│   │   └── localStorage.test.ts   # localStorage utility tests
│   └── config/
│       └── constants.test.ts      # Game constants tests
└── integration/
    └── gameplay/
        └── constitutional-compliance.test.ts  # End-to-end constitutional tests
```

## Constitutional Compliance Testing

All tests verify adherence to the five constitutional principles:

### 1. Age-First Design ✅
- Simple controls (max 2 buttons)
- Large, clear visual elements
- Immediate feedback
- **Tested in**: [`Player.test.ts`](./unit/entities/Player.test.ts), [`constants.test.ts`](./unit/config/constants.test.ts)

### 2. Safety-First Messaging ✅
- **Helmet always visible** (CRITICAL)
- No unsafe behaviors
- **Tested in**: [`Player.test.ts`](./unit/entities/Player.test.ts), [`Friend.test.ts`](./unit/entities/Friend.test.ts)

### 3. No Failure States ✅
- **Obstacles slow but NEVER stop player** (CRITICAL)
- No "game over" screens
- Forward progress guaranteed
- **Tested in**: [`Player.test.ts`](./unit/entities/Player.test.ts), [`Obstacle.test.ts`](./unit/entities/Obstacle.test.ts), [`CollisionManager.test.ts`](./unit/systems/CollisionManager.test.ts), [`constants.test.ts`](./unit/config/constants.test.ts)

### 4. Accessibility-First ✅
- **Audio cues for ALL player actions** (CRITICAL)
- Distinct collectible shapes (not just colors)
- Multi-sensory feedback
- **Tested in**: [`AudioManager.test.ts`](./unit/systems/AudioManager.test.ts), [`SynthAudioManager.test.ts`](./unit/systems/SynthAudioManager.test.ts), [`Collectible.test.ts`](./unit/entities/Collectible.test.ts)

### 5. Personal Connection ✅
- Character appearances match specifications
- All friends wear helmets
- **Tested in**: [`Friend.test.ts`](./unit/entities/Friend.test.ts), [`constants.test.ts`](./unit/config/constants.test.ts)

## Coverage Goals

Target coverage thresholds (configured in `vitest.config.ts`):
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 65%
- **Statements**: 70%
- **Constitutional requirements**: 100%

### View Coverage Report

After running `npm run test:coverage`, open:
```
coverage/index.html
```

## Critical Tests (100% Must Pass)

These tests verify constitutional requirements and must NEVER fail:

### Player Entity
- ✅ Helmet exists and is visible
- ✅ Helmet remains visible after customization
- ✅ Slow mechanic reduces speed but never stops completely
- ✅ Simple jump and move controls

### Obstacles
- ✅ All obstacles have slow factor > 0 (never stop player)
- ✅ Puddle, rock, and hill all allow forward progress
- ✅ Combined obstacles still allow movement

### Collision Manager
- ✅ All collision types provide slow factor > 0
- ✅ Forward progress guaranteed for all obstacle types

### Audio Manager
- ✅ SFX playback available for all player actions
- ✅ Voice playback for encouragement
- ✅ Volume control and mute functionality

### Constants
- ✅ All obstacle slow factors > 0 and < 1
- ✅ Distinct collectible types
- ✅ Friend characters defined
- ✅ Simple input controls

## Mock Objects

The test suite uses comprehensive Phaser mocks to test game logic without requiring a full Phaser environment:

- **createMockScene()**: Mock Phaser.Scene with physics, sound, tweens
- **createMockSprite()**: Mock GameObject.Sprite
- **createMockPhysicsBody()**: Mock Arcade.Body with collision detection
- **MockPhaserMath**: Math utilities (Clamp, etc.)

See [`tests/helpers/phaserMocks.ts`](./helpers/phaserMocks.ts) for full mock implementation.

## Debugging Tests

### Run Tests in Debug Mode
```bash
node --inspect-brk node_modules/.bin/vitest
```

### Use Console Logs in Tests
```typescript
test('debug example', () => {
  const player = new Player(mockScene, 0, 0);
  console.log('Player state:', player.getState());
  expect(player.getState()).toBe('idle');
});
```

### Focus on Single Test
```typescript
test.only('helmet is visible', () => {
  // Only this test will run
});
```

### Skip a Test
```typescript
test.skip('not ready yet', () => {
  // This test will be skipped
});
```

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Test Writing Guidelines

### 1. Arrange-Act-Assert Pattern
```typescript
test('player slows when hitting obstacle', () => {
  // Arrange
  const player = createTestPlayer();
  const obstacle = createTestObstacle();
  
  // Act
  player.slow(0.5);
  
  // Assert
  expect(player.velocityX).toBeLessThan(PLAYER.WALK_SPEED);
  expect(player.velocityX).toBeGreaterThan(0); // NEVER stops!
});
```

### 2. Descriptive Test Names
```typescript
// ✅ Good
test('player never stops when colliding with multiple obstacles')

// ❌ Bad
test('collision test')
```

### 3. Test One Thing
```typescript
// ✅ Good - tests one behavior
test('helmet is visible on player sprite', () => {
  const player = new Player(scene, 0, 0);
  expect(player.helmet.visible).toBe(true);
});

// ❌ Bad - tests multiple things
test('player is configured correctly', () => {
  const player = new Player(scene, 0, 0);
  expect(player.helmet.visible).toBe(true);
  expect(player.velocity).toBe(200);
  expect(player.texture).toBe('wyatt');
});
```

## Troubleshooting

### Tests Fail with "Cannot find module 'phaser'"
This is normal - Phaser is mocked in tests. Make sure `vi.mock('phaser')` is present in test files.

### Coverage Report Not Generated
Ensure `@vitest/coverage-v8` is installed:
```bash
npm install -D @vitest/coverage-v8
```

### Tests Timeout
Increase timeout in `vitest.config.ts`:
```typescript
test: {
  testTimeout: 10000, // 10 seconds
}
```

### Mock localStorage Issues
The test setup includes localStorage mocks. If issues persist, check `tests/setup.ts`.

## Next Steps

1. ✅ Run `npm install` to install test dependencies
2. ✅ Run `npm test` to execute all tests
3. ✅ Run `npm run test:coverage` to check coverage
4. ✅ Review coverage report to identify gaps
5. ✅ Add integration tests for scene transitions
6. ✅ Set up CI/CD to run tests automatically

## Contributing

When adding new features:
1. Write tests FIRST (TDD approach)
2. Ensure constitutional compliance is tested
3. Maintain >70% code coverage
4. Run `npm test` before committing
5. Verify all constitutional tests pass

## Documentation

- [Specification](../../specs/001-scooter-adventure-game/spec.md)
- [Constitution](../../.specify/constitution.md)
- [Implementation Plan](../../specs/001-scooter-adventure-game/plan.md)
- [Development Tasks](../../specs/001-scooter-adventure-game/tasks.md)

---

**Remember**: These tests ensure Wyatt's Scooter Adventure remains a safe, positive, accessible experience for a 4-year-old child. Constitutional compliance is not optional—it must be tested and enforced.
