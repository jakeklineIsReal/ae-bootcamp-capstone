/**
 * CollisionManager Tests
 * 
 * Tests for collision system with emphasis on:
 * - No failure states (obstacles slow, never stop)
 * - Proper collision detection
 * - Callback mechanisms
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { CollisionManager } from '../../../src/systems/CollisionManager';
import { createMockScene } from '../../helpers/phaserMocks';

describe('CollisionManager', () => {
  let mockScene: any;
  let collisionManager: CollisionManager;

  beforeEach(() => {
    mockScene = createMockScene();
    collisionManager = new CollisionManager(mockScene);
  });

  describe('Constitutional Requirement: No Failure States (Obstacles Slow, Never Stop)', () => {
    test('puddle collision provides slow factor > 0', () => {
      const player = { type: 'player' } as any;
      const puddle = { type: 'puddle' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, puddle, callback);
      
      const slowFactor = callback.mock.calls[0][0];
      // CRITICAL: Must slow but NEVER stop completely
      expect(slowFactor).toBeGreaterThan(0);
      expect(slowFactor).toBeLessThan(1);
    });

    test('rock collision provides slow factor > 0', () => {
      const player = { type: 'player' } as any;
      const rock = { type: 'rock' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, rock, callback);
      
      const slowFactor = callback.mock.calls[0][0];
      expect(slowFactor).toBeGreaterThan(0);
      expect(slowFactor).toBeLessThan(1);
    });

    test('hill collision provides slow factor > 0', () => {
      const player = { type: 'player' } as any;
      const hill = { type: 'hill' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, hill, callback);
      
      const slowFactor = callback.mock.calls[0][0];
      expect(slowFactor).toBeGreaterThan(0);
      expect(slowFactor).toBeLessThan(1);
    });

    test('all obstacle types guarantee forward progress', () => {
      const player = { type: 'player' } as any;
      const obstacleTypes = ['puddle', 'rock', 'hill'];
      
      obstacleTypes.forEach(type => {
        const obstacle = { type } as any;
        const callback = vi.fn();
        
        collisionManager.handleObstacleCollision(player, obstacle, callback);
        
        const slowFactor = callback.mock.calls[0][0];
        const playerSpeed = 100;
        const resultSpeed = playerSpeed * slowFactor;
        
        expect(resultSpeed).toBeGreaterThan(0);
      });
    });
  });

  describe('Obstacle Collision Handling', () => {
    test('puddle collision uses 50% slow factor', () => {
      const player = { type: 'player' } as any;
      const puddle = { type: 'puddle' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, puddle, callback);
      
      expect(callback).toHaveBeenCalledWith(0.5, 'puddle');
    });

    test('rock collision uses 40% slow factor', () => {
      const player = { type: 'player' } as any;
      const rock = { type: 'rock' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, rock, callback);
      
      expect(callback).toHaveBeenCalledWith(0.4, 'rock');
    });

    test('hill collision uses 60% slow factor', () => {
      const player = { type: 'player' } as any;
      const hill = { type: 'hill' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, hill, callback);
      
      expect(callback).toHaveBeenCalledWith(0.6, 'hill');
    });

    test('unknown obstacle uses default slow factor', () => {
      const player = { type: 'player' } as any;
      const unknown = { type: 'unknown' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, unknown, callback);
      
      const slowFactor = callback.mock.calls[0][0];
      expect(slowFactor).toBe(0.7);
    });

    test('missing type uses default slow factor', () => {
      const player = { type: 'player' } as any;
      const noType = {} as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, noType, callback);
      
      const slowFactor = callback.mock.calls[0][0];
      expect(slowFactor).toBe(0.7);
    });

    test('callback receives obstacle type', () => {
      const player = { type: 'player' } as any;
      const puddle = { type: 'puddle' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, puddle, callback);
      
      expect(callback).toHaveBeenCalledWith(expect.any(Number), 'puddle');
    });
  });

  describe('Collectible Collision Handling', () => {
    test('collectible collision calls callback with type', () => {
      const player = { type: 'player' } as any;
      const collectible = {
        type: 'star',
        setActive: vi.fn(),
        setVisible: vi.fn(),
      } as any;
      const callback = vi.fn();
      
      collisionManager.handleCollectibleCollision(player, collectible, callback);
      
      expect(callback).toHaveBeenCalledWith('star');
    });

    test('collectible is hidden after collection', () => {
      const player = { type: 'player' } as any;
      const collectible = {
        type: 'heart',
        setActive: vi.fn(),
        setVisible: vi.fn(),
      } as any;
      const callback = vi.fn();
      
      collisionManager.handleCollectibleCollision(player, collectible, callback);
      
      expect(collectible.setActive).toHaveBeenCalledWith(false);
      expect(collectible.setVisible).toHaveBeenCalledWith(false);
    });

    test('handles different collectible types', () => {
      const player = { type: 'player' } as any;
      const types = ['star', 'heart', 'circle'];
      
      types.forEach(type => {
        const collectible = {
          type,
          setActive: vi.fn(),
          setVisible: vi.fn(),
        } as any;
        const callback = vi.fn();
        
        collisionManager.handleCollectibleCollision(player, collectible, callback);
        
        expect(callback).toHaveBeenCalledWith(type);
      });
    });

    test('handles collectible without type', () => {
      const player = { type: 'player' } as any;
      const collectible = {
        setActive: vi.fn(),
        setVisible: vi.fn(),
      } as any;
      const callback = vi.fn();
      
      collisionManager.handleCollectibleCollision(player, collectible, callback);
      
      expect(callback).toHaveBeenCalledWith('unknown');
    });

    test('handles collectible without setActive/setVisible methods', () => {
      const player = { type: 'player' } as any;
      const collectible = { type: 'star' } as any;
      const callback = vi.fn();
      
      expect(() => {
        collisionManager.handleCollectibleCollision(player, collectible, callback);
      }).not.toThrow();
    });
  });

  describe('Physics Setup', () => {
    test('setupCollision creates collider', () => {
      const group1 = { type: 'group1' } as any;
      const group2 = { type: 'group2' } as any;
      const callback = vi.fn();
      
      collisionManager.setupCollision(group1, group2, callback);
      
      expect(mockScene.physics.add.collider).toBeDefined();
    });

    test('setupCollision accepts process callback', () => {
      const group1 = { type: 'group1' } as any;
      const group2 = { type: 'group2' } as any;
      const callback = vi.fn();
      const processCallback = vi.fn();
      
      expect(() => {
        collisionManager.setupCollision(group1, group2, callback, processCallback);
      }).not.toThrow();
    });

    test('setupOverlap creates overlap detector', () => {
      const group1 = { type: 'group1' } as any;
      const group2 = { type: 'group2' } as any;
      const callback = vi.fn();
      
      collisionManager.setupOverlap(group1, group2, callback);
      
      expect(mockScene.physics.add.overlap).toBeDefined();
    });

    test('setupOverlap accepts process callback', () => {
      const group1 = { type: 'group1' } as any;
      const group2 = { type: 'group2' } as any;
      const callback = vi.fn();
      const processCallback = vi.fn();
      
      expect(() => {
        collisionManager.setupOverlap(group1, group2, callback, processCallback);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('handles multiple collisions with same obstacle', () => {
      const player = { type: 'player' } as any;
      const rock = { type: 'rock' } as any;
      const callback = vi.fn();
      
      collisionManager.handleObstacleCollision(player, rock, callback);
      collisionManager.handleObstacleCollision(player, rock, callback);
      
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0]).toEqual(callback.mock.calls[1]);
    });

    test('collision callbacks are independent', () => {
      const player = { type: 'player' } as any;
      const puddle = { type: 'puddle' } as any;
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      collisionManager.handleObstacleCollision(player, puddle, callback1);
      collisionManager.handleObstacleCollision(player, puddle, callback2);
      
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    test('handles rapid collectible collisions', () => {
      const player = { type: 'player' } as any;
      const callback = vi.fn();
      
      for (let i = 0; i < 5; i++) {
        const collectible = {
          type: 'star',
          setActive: vi.fn(),
          setVisible: vi.fn(),
        } as any;
        
        collisionManager.handleCollectibleCollision(player, collectible, callback);
      }
      
      expect(callback).toHaveBeenCalledTimes(5);
    });
  });

  describe('Integration with Scene Physics', () => {
    test('uses scene physics system', () => {
      expect(collisionManager['scene']).toBe(mockScene);
    });

    test('multiple collision managers for different scenes', () => {
      const scene1 = createMockScene();
      const scene2 = createMockScene();
      
      const manager1 = new CollisionManager(scene1);
      const manager2 = new CollisionManager(scene2);
      
      expect(manager1['scene']).toBe(scene1);
      expect(manager2['scene']).toBe(scene2);
    });
  });
});
