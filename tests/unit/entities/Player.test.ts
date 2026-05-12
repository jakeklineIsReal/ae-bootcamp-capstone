/**
 * Player Entity Tests
 * 
 * Tests for the Player character with emphasis on constitutional requirements:
 * - Helmet always visible (Safety-First)
 * - Age-appropriate controls (Age-First Design)
 * - Proper movement mechanics
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Player } from '../../../src/entities/Player';
import { createMockScene } from '../../helpers/phaserMocks';
import { PLAYER } from '../../../src/config/constants';

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
    },
    Math: {
      Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
    },
  },
}));

describe('Player Entity', () => {
  let mockScene: any;
  let player: Player;

  beforeEach(() => {
    mockScene = createMockScene();
    player = new Player(mockScene, 100, 100);
  });

  describe('Constitutional Requirement: Helmet Always Visible', () => {
    test('helmet exists on player sprite', () => {
      // CRITICAL: Safety-First messaging - helmet must exist
      expect(player['helmet']).toBeDefined();
    });

    test('helmet is visible by default', () => {
      // CRITICAL: Safety-First messaging - helmet must be visible
      expect(player['helmet'].visible).toBe(true);
    });

    test('helmet remains visible after initialization', () => {
      // Helmet should never be hidden
      expect(player['helmet'].visible).toBe(true);
      expect(player['helmet'].active).toBe(true);
    });

    test('helmet color can be customized while remaining visible', () => {
      player.setHelmetColor(0xff0000);
      
      expect(player['helmetColor']).toBe(0xff0000);
      expect(player['helmet'].visible).toBe(true);
    });
  });

  describe('Constitutional Requirement: Age-Appropriate Controls', () => {
    test('provides simple jump action', () => {
      player['onGround'] = true;
      
      player.jump();
      
      expect(player['velocityY']).toBe(PLAYER.JUMP_VELOCITY);
      expect(player['playerState']).toBe('jumping');
    });

    test('jump only works when on ground', () => {
      player['onGround'] = false;
      const initialVelocityY = player['velocityY'];
      
      player.jump();
      
      // Should not jump when in air
      expect(player['velocityY']).toBe(initialVelocityY);
    });

    test('provides simple move right action', () => {
      player.moveRight();
      
      expect(player['velocityX']).toBe(PLAYER.WALK_SPEED);
      expect(player['playerState']).toBe('walking');
    });

    test('provides simple stop action', () => {
      player.moveRight();
      player['onGround'] = true;
      player.stop();
      
      expect(player['velocityX']).toBe(0);
      expect(player['playerState']).toBe('idle');
    });
  });

  describe('Movement Mechanics', () => {
    test('initializes with idle state', () => {
      expect(player.getState()).toBe('idle');
    });

    test('walking state when moving', () => {
      player.moveRight();
      
      expect(player.getState()).toBe('walking');
    });

    test('jumping state when jumping', () => {
      player['onGround'] = true;
      player.jump();
      
      expect(player.getState()).toBe('jumping');
    });

    test('returns to idle when stopping on ground', () => {
      player.moveRight();
      player['onGround'] = true;
      player.stop();
      
      expect(player.getState()).toBe('idle');
    });

    test('returns to walking when landing while moving', () => {
      player.moveRight();
      player['onGround'] = true;
      player.jump();
      player['onGround'] = false;
      player['playerState'] = 'jumping';
      player['velocityX'] = PLAYER.WALK_SPEED;
      
      // Simulate landing
      player.body.touching.down = true;
      player.update();
      
      expect(player.getState()).toBe('walking');
    });
  });

  describe('Velocity Management', () => {
    test('update applies velocity to physics body', () => {
      player['velocityX'] = 100;
      player['velocityY'] = -200;
      
      player.update();
      
      expect(player.body.setVelocityX).toHaveBeenCalledWith(100);
      expect(player.body.setVelocityY).toHaveBeenCalledWith(-200);
    });

    test('velocity is clamped to max values', () => {
      player.body.velocity.x = PLAYER.MAX_VELOCITY_X + 100;
      player.body.velocity.y = PLAYER.MAX_VELOCITY_Y + 100;
      
      player.update();
      
      // After update, velocities should be clamped
      expect(player.body.velocity.x).toBeLessThanOrEqual(PLAYER.MAX_VELOCITY_X);
      expect(player.body.velocity.y).toBeLessThanOrEqual(PLAYER.MAX_VELOCITY_Y);
    });

    test('negative velocity is clamped to min values', () => {
      player.body.velocity.x = -PLAYER.MAX_VELOCITY_X - 100;
      player.body.velocity.y = -PLAYER.MAX_VELOCITY_Y - 100;
      
      player.update();
      
      expect(player.body.velocity.x).toBeGreaterThanOrEqual(-PLAYER.MAX_VELOCITY_X);
      expect(player.body.velocity.y).toBeGreaterThanOrEqual(-PLAYER.MAX_VELOCITY_Y);
    });
  });

  describe('Constitutional Requirement: No Failure States (Slowdown Mechanic)', () => {
    test('slow method reduces velocity but never stops completely', () => {
      player['velocityX'] = PLAYER.WALK_SPEED;
      
      player.slow(0.5); // 50% slow
      
      // Velocity should be reduced but NOT zero
      expect(player['velocityX']).toBeGreaterThan(0);
      expect(player['velocityX']).toBeLessThan(PLAYER.WALK_SPEED);
    });

    test('multiple slows compound but player still moves', () => {
      player['velocityX'] = PLAYER.WALK_SPEED;
      
      player.slow(0.5);
      player.slow(0.5);
      
      // Even after multiple slows, player should still move
      expect(player['velocityX']).toBeGreaterThan(0);
    });

    test('slow factor of 0.7 reduces speed by 30%', () => {
      player['velocityX'] = 100;
      
      player.slow(0.7);
      
      expect(player['velocityX']).toBe(70);
    });
  });

  describe('Ground Detection', () => {
    test('detects when on ground', () => {
      player.body.touching.down = true;
      player.update();
      
      expect(player.isOnGround()).toBe(true);
    });

    test('detects when in air', () => {
      player.body.touching.down = false;
      player.update();
      
      expect(player.isOnGround()).toBe(false);
    });
  });

  describe('Physics Configuration', () => {
    test('sets correct physics body size', () => {
      expect(player.body.setSize).toHaveBeenCalledWith(PLAYER.WIDTH, PLAYER.HEIGHT);
    });

    test('sets world bounds collision', () => {
      expect(player.body.setCollideWorldBounds).toHaveBeenCalledWith(true);
    });
  });

  describe('Customization', () => {
    test('accepts custom helmet color in constructor', () => {
      const customPlayer = new Player(mockScene, 0, 0, 0xff0000);
      
      expect(customPlayer['helmetColor']).toBe(0xff0000);
    });

    test('uses default helmet color if not provided', () => {
      const defaultPlayer = new Player(mockScene, 0, 0);
      
      expect(defaultPlayer['helmetColor']).toBe(0x4a90e2);
    });

    test('setHelmetColor updates helmet appearance', () => {
      const setFillStyleSpy = vi.fn();
      player['helmet'].setFillStyle = setFillStyleSpy;
      
      player.setHelmetColor(0x00ff00);
      
      expect(setFillStyleSpy).toHaveBeenCalledWith(0x00ff00);
    });
  });

  describe('Sprite Creation', () => {
    test('creates all player components', () => {
      // Player should have multiple visual components
      expect(player['sprite']).toBeDefined();
      expect(player['helmet']).toBeDefined();
    });

    test('is added to scene', () => {
      expect(mockScene.add.existing).toHaveBeenCalled();
    });

    test('has physics enabled', () => {
      expect(mockScene.physics.add.existing).toHaveBeenCalled();
    });
  });
});
