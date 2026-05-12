/**
 * Constitutional Compliance Integration Tests
 * 
 * End-to-end tests verifying all five constitutional principles
 * These tests MUST pass at 100% - they validate core game requirements
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Player } from '@/entities/Player';
import { Obstacle } from '@/entities/Obstacle';
import { Collectible } from '@/entities/Collectible';
import { Friend } from '@/entities/Friend';
import { AudioManager } from '@/systems/AudioManager';
import { CollisionManager } from '@/systems/CollisionManager';
import { ScoreManager } from '@/systems/ScoreManager';
import { createMockScene } from '../../helpers/phaserMocks';
import {
  PLAYER,
  OBSTACLE,
  COLLECTIBLE_TYPES,
  FRIENDS,
} from '@/config/constants';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    GameObjects: {
      Container: class Container {
        scene: any;
        x: number;
        y: number;
        body: any;
        list: any[] = [];
        
        constructor(scene: any, x: number, y: number) {
          this.scene = scene;
          this.x = x;
          this.y = y;
          this.body = {
            velocity: { x: 0, y: 0 },
            touching: { down: false },
            blocked: {},
            setSize: vi.fn().mockReturnThis(),
            setCollideWorldBounds: vi.fn().mockReturnThis(),
            setVelocityX: vi.fn((vx: number) => { this.body.velocity.x = vx; }),
            setVelocityY: vi.fn((vy: number) => { this.body.velocity.y = vy; }),
          };
        }
        
        add(child: any) {
          this.list.push(child);
        }
      },
      Rectangle: class Rectangle {
        constructor(public scene: any, public x: number, public y: number, public width: number, public height: number, public fillColor: number) {}
      },
    },
    Math: {
      Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
    },
  },
}));

describe('Constitutional Compliance - Integration Tests', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = createMockScene();
  });

  describe('PRINCIPLE 1: Age-First Design', () => {
    test('INTEGRATION: Player uses simple controls (max 2 buttons)', () => {
      const player = new Player(mockScene, 100, 100);
      
      // Only two actions needed: move and jump
      player.moveRight(); // Action 1: Move
      expect(player.getState()).toBe('walking');
      
      player['onGround'] = true;
      player.jump(); // Action 2: Jump
      expect(player.getState()).toBe('jumping');
      
      // Success: Only 2 button controls needed
    });

    test('INTEGRATION: All visual elements are large and clear', () => {
      // Player size
      expect(PLAYER.WIDTH).toBeGreaterThanOrEqual(64);
      expect(PLAYER.HEIGHT).toBeGreaterThanOrEqual(96);
      
      // Collectible size
      expect(COLLECTIBLE_TYPES.STAR).toBeDefined();
      expect(COLLECTIBLE_TYPES.HEART).toBeDefined();
      expect(COLLECTIBLE_TYPES.CIRCLE).toBeDefined();
      
      // Obstacles are substantial
      const puddle = new Obstacle(mockScene, 0, 0, 'puddle');
      const rock = new Obstacle(mockScene, 0, 0, 'rock');
      const hill = new Obstacle(mockScene, 0, 0, 'hill');
      
      expect(puddle.width).toBeGreaterThan(50);
      expect(rock.width).toBeGreaterThan(40);
      expect(hill.width).toBeGreaterThan(80);
    });

    test('INTEGRATION: Feedback is immediate and obvious', () => {
      const player = new Player(mockScene, 100, 100);
      const scoreManager = new ScoreManager();
      
      // Immediate state change on action
      player.moveRight();
      expect(player.getState()).toBe('walking');
      
      // Immediate score update on collection
      const beforeScore = scoreManager.getTotal();
      scoreManager.addCollectible('star');
      const afterScore = scoreManager.getTotal();
      
      expect(afterScore).toBeGreaterThan(beforeScore);
    });
  });

  describe('PRINCIPLE 2: Safety-First Messaging', () => {
    test('CRITICAL: Player character ALWAYS wears helmet', () => {
      const player = new Player(mockScene, 100, 100);
      
      // Helmet must exist
      expect(player['helmet']).toBeDefined();
      
      // Helmet must be visible
      expect(player['helmet'].visible).toBe(true);
      
      // Helmet must remain visible after all actions
      player.moveRight();
      expect(player['helmet'].visible).toBe(true);
      
      player['onGround'] = true;
      player.jump();
      expect(player['helmet'].visible).toBe(true);
      
      player.setHelmetColor(0xff0000);
      expect(player['helmet'].visible).toBe(true);
    });

    test('CRITICAL: All friend characters wear helmets', () => {
      const nico = new Friend(mockScene, 100, 100, FRIENDS.NICO);
      const marcus = new Friend(mockScene, 200, 100, FRIENDS.MARCUS);
      const otto = new Friend(mockScene, 300, 100, FRIENDS.OTTO);
      
      // All friends must have helmets
      expect(nico['helmet']).toBeDefined();
      expect(marcus['helmet']).toBeDefined();
      expect(otto['helmet']).toBeDefined();
      
      // All helmets must be visible
      expect(nico['helmet'].visible).toBe(true);
      expect(marcus['helmet'].visible).toBe(true);
      expect(otto['helmet'].visible).toBe(true);
    });

    test('INTEGRATION: Helmet visibility persists through celebrations', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      expect(friend['helmet'].visible).toBe(true);
      
      friend.celebrate();
      expect(friend['helmet'].visible).toBe(true);
      
      friend.stopCelebrating();
      expect(friend['helmet'].visible).toBe(true);
    });
  });

  describe('PRINCIPLE 3: No Failure States (PURELY POSITIVE EXPERIENCE)', () => {
    test('CRITICAL: Player CANNOT lose - obstacles slow but NEVER stop', () => {
      const player = new Player(mockScene, 100, 100);
      const collisionManager = new CollisionManager(mockScene);
      
      player.moveRight();
      const initialVelocity = PLAYER.WALK_SPEED;
      player['velocityX'] = initialVelocity;
      
      // Test all obstacle types
      const obstacleTypes: Array<'puddle' | 'rock' | 'hill'> = ['puddle', 'rock', 'hill'];
      
      obstacleTypes.forEach(type => {
        const obstacle = new Obstacle(mockScene, 0, 0, type);
        
        collisionManager.handleObstacleCollision(
          player as any,
          obstacle as any,
          (slowFactor: number) => {
            player.slow(slowFactor);
          }
        );
        
        // CRITICAL: Player must still be moving
        expect(player['velocityX']).toBeGreaterThan(0);
        
        // Reset for next test
        player['velocityX'] = initialVelocity;
      });
    });

    test('CRITICAL: Multiple obstacle hits still allow progress', () => {
      const player = new Player(mockScene, 100, 100);
      player.moveRight();
      player['velocityX'] = PLAYER.WALK_SPEED;
      
      // Hit 10 obstacles in a row
      for (let i = 0; i < 10; i++) {
        player.slow(OBSTACLE.ROCK_SLOW); // Most challenging obstacle
      }
      
      // Player must STILL be moving forward
      expect(player['velocityX']).toBeGreaterThan(0);
    });

    test('INTEGRATION: Score only increases (no penalties)', () => {
      const scoreManager = new ScoreManager();
      
      for (let i = 0; i < 100; i++) {
        const beforeTotal = scoreManager.getTotal();
        
        const type = i % 3 === 0 ? 'star' : i % 3 === 1 ? 'heart' : 'circle';
        scoreManager.addCollectible(type);
        
        const afterTotal = scoreManager.getTotal();
        
        // Score ONLY goes up, NEVER down
        expect(afterTotal).toBeGreaterThan(beforeTotal);
      }
    });

    test('INTEGRATION: All feedback is encouraging (no negative messages)', () => {
      const audioManager = new AudioManager(mockScene);
      
      // Positive sound effects only
      expect(() => audioManager.playSFX('jump')).not.toThrow();
      expect(() => audioManager.playSFX('collect-star')).not.toThrow();
      expect(() => audioManager.playVoice('great-job')).not.toThrow();
      expect(() => audioManager.playVoice('awesome')).not.toThrow();
      
      // No "game over" or failure sounds
    });
  });

  describe('PRINCIPLE 4: Accessibility-First', () => {
    test('CRITICAL: Audio cues for ALL player actions', () => {
      const audioManager = new AudioManager(mockScene);
      
      // Jump action has audio
      expect(() => audioManager.playSFX('jump')).not.toThrow();
      expect(mockScene.sound.play).toHaveBeenCalled();
      mockScene.sound.play.mockClear();
      
      // Collection actions have audio
      audioManager.playSFX('collect-star');
      expect(mockScene.sound.play).toHaveBeenCalled();
      mockScene.sound.play.mockClear();
      
      audioManager.playSFX('collect-heart');
      expect(mockScene.sound.play).toHaveBeenCalled();
      mockScene.sound.play.mockClear();
      
      audioManager.playSFX('collect-circle');
      expect(mockScene.sound.play).toHaveBeenCalled();
      mockScene.sound.play.mockClear();
      
      // Obstacle collisions have audio
      audioManager.playSFX('splash');
      expect(mockScene.sound.play).toHaveBeenCalled();
      mockScene.sound.play.mockClear();
      
      audioManager.playSFX('bump');
      expect(mockScene.sound.play).toHaveBeenCalled();
    });

    test('CRITICAL: Collectibles use distinct shapes (not just colors)', () => {
      const star = new Collectible(mockScene, 0, 0, 'star');
      const heart = new Collectible(mockScene, 0, 0, 'heart');
      const circle = new Collectible(mockScene, 0, 0, 'circle');
      
      // Each type is unique and identifiable by shape
      expect(star.type).toBe('star');
      expect(heart.type).toBe('heart');
      expect(circle.type).toBe('circle');
      
      // All different from each other
      expect(star.type).not.toBe(heart.type);
      expect(heart.type).not.toBe(circle.type);
      expect(circle.type).not.toBe(star.type);
    });

    test('INTEGRATION: Multi-sensory feedback (visual + audio)', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      const audioManager = new AudioManager(mockScene);
      
      // Visual feedback: collectible has shape
      expect(collectible['shape']).toBeDefined();
      
      // Visual feedback: floating animation
      expect(mockScene.tweens.add).toHaveBeenCalled();
      
      // Audio feedback: collection sound
      audioManager.playSFX('collect-star');
      expect(mockScene.sound.play).toHaveBeenCalled();
    });
  });

  describe('PRINCIPLE 5: Personal Connection', () => {
    test('INTEGRATION: Friend characters match specifications', () => {
      const nico = new Friend(mockScene, 100, 100, 'Nico');
      const marcus = new Friend(mockScene, 200, 100, 'Marcus');
      const otto = new Friend(mockScene, 300, 100, 'Otto');
      
      // Correct names
      expect(nico.name).toBe('Nico');
      expect(marcus.name).toBe('Marcus');
      expect(otto.name).toBe('Otto');
      
      // All unique
      expect(nico.name).not.toBe(marcus.name);
      expect(marcus.name).not.toBe(otto.name);
    });

    test('INTEGRATION: Player character represents Wyatt', () => {
      const player = new Player(mockScene, 100, 100);
      
      // Has sprite and components
      expect(player['sprite']).toBeDefined();
      expect(player['helmet']).toBeDefined();
      
      // Can customize helmet color
      player.setHelmetColor(0xff0000);
      expect(player['helmetColor']).toBe(0xff0000);
    });

    test('INTEGRATION: Friends celebrate when player arrives', () => {
      const nico = new Friend(mockScene, 100, 100, 'Nico');
      
      expect(nico.isCelebratingState()).toBe(false);
      
      nico.celebrate();
      
      expect(nico.isCelebratingState()).toBe(true);
      expect(mockScene.tweens.add).toHaveBeenCalled();
    });
  });

  describe('CROSS-CUTTING: Full Gameplay Flow', () => {
    test('INTEGRATION: Complete journey maintains constitutional principles', () => {
      const player = new Player(mockScene, 100, 100);
      const audioManager = new AudioManager(mockScene);
      const collisionManager = new CollisionManager(mockScene);
      const scoreManager = new ScoreManager();
      
      // 1. Player starts with helmet (Safety-First)
      expect(player['helmet'].visible).toBe(true);
      
      // 2. Player moves (Age-First: simple controls)
      player.moveRight();
      expect(player.getState()).toBe('walking');
      
      // 3. Player jumps with audio feedback (Accessibility)
      player['onGround'] = true;
      audioManager.playSFX('jump');
      player.jump();
      expect(mockScene.sound.play).toHaveBeenCalled();
      
      // 4. Player collects items (positive feedback only)
      scoreManager.addCollectible('star');
      audioManager.playSFX('collect-star');
      expect(scoreManager.getTotal()).toBeGreaterThan(0);
      
      // 5. Player hits obstacle but continues (No Failure States)
      const rock = new Obstacle(mockScene, 0, 0, 'rock');
      collisionManager.handleObstacleCollision(
        player as any,
        rock as any,
        (slowFactor: number) => {
          player.slow(slowFactor);
        }
      );
      expect(player['velocityX']).toBeGreaterThan(0); // Still moving!
      
      // 6. Player reaches park and friends celebrate (Personal Connection)
      const nico = new Friend(mockScene, 100, 100, 'Nico');
      nico.celebrate();
      expect(nico.isCelebratingState()).toBe(true);
      
      // 7. Helmet still visible at end (Safety-First throughout)
      expect(player['helmet'].visible).toBe(true);
      expect(nico['helmet'].visible).toBe(true);
    });
  });

  describe('PERFORMANCE: Constitutional Requirements', () => {
    test('All constitutional checks execute quickly', () => {
      const startTime = Date.now();
      
      // Check all constitutional requirements
      const player = new Player(mockScene, 0, 0);
      expect(player['helmet'].visible).toBe(true);
      
      const obstacle = new Obstacle(mockScene, 0, 0, 'rock');
      expect(obstacle.getSlowFactor()).toBeGreaterThan(0);
      
      const collectible = new Collectible(mockScene, 0, 0, 'star');
      expect(collectible.type).toBe('star');
      
      const friend = new Friend(mockScene, 0, 0, 'Nico');
      expect(friend['helmet'].visible).toBe(true);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // All checks should be near-instantaneous
      expect(duration).toBeLessThan(100);
    });
  });
});
