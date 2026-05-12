/**
 * Friend Entity Tests
 * 
 * Tests for friend characters with emphasis on:
 * - Safety-First messaging (helmets always visible)
 * - Personal connection (correct character appearances)
 * - Celebration behavior
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Friend } from '../../../src/entities/Friend';
import { createMockScene } from '../../helpers/phaserMocks';
import { FRIENDS } from '../../../src/config/constants';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    GameObjects: {
      Container: class Container {
        scene: any;
        x: number;
        y: number;
        list: any[] = [];
        
        constructor(scene: any, x: number, y: number) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }
        
        add(child: any) {
          this.list.push(child);
        }
      },
    },
  },
}));

describe('Friend Entity', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = createMockScene();
  });

  describe('Constitutional Requirement: Safety-First (Helmets Always Visible)', () => {
    test('Nico has helmet visible', () => {
      const nico = new Friend(mockScene, 100, 100, FRIENDS.NICO);
      
      // CRITICAL: Safety-First - all friends must have helmets
      expect(nico['helmet']).toBeDefined();
      expect(nico['helmet'].visible).toBe(true);
    });

    test('Marcus has helmet visible', () => {
      const marcus = new Friend(mockScene, 100, 100, FRIENDS.MARCUS);
      
      expect(marcus['helmet']).toBeDefined();
      expect(marcus['helmet'].visible).toBe(true);
    });

    test('Otto has helmet visible', () => {
      const otto = new Friend(mockScene, 100, 100, FRIENDS.OTTO);
      
      expect(otto['helmet']).toBeDefined();
      expect(otto['helmet'].visible).toBe(true);
    });

    test('helmet remains visible throughout celebration', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      friend.celebrate();
      
      expect(friend['helmet'].visible).toBe(true);
    });
  });

  describe('Constitutional Requirement: Personal Connection (Character Appearances)', () => {
    test('Nico is created correctly', () => {
      const nico = new Friend(mockScene, 100, 100, FRIENDS.NICO);
      
      expect(nico.name).toBe('Nico');
    });

    test('Marcus is created correctly', () => {
      const marcus = new Friend(mockScene, 100, 100, FRIENDS.MARCUS);
      
      expect(marcus.name).toBe('Marcus');
    });

    test('Otto is created correctly', () => {
      const otto = new Friend(mockScene, 100, 100, FRIENDS.OTTO);
      
      expect(otto.name).toBe('Otto');
    });

    test('each friend has unique characteristics', () => {
      const nico = new Friend(mockScene, 0, 0, 'Nico');
      const marcus = new Friend(mockScene, 0, 0, 'Marcus');
      const otto = new Friend(mockScene, 0, 0, 'Otto');
      
      expect(nico.name).not.toBe(marcus.name);
      expect(marcus.name).not.toBe(otto.name);
      expect(otto.name).not.toBe(nico.name);
    });
  });

  describe('Celebration Behavior', () => {
    test('starts in non-celebrating state', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      expect(friend.isCelebratingState()).toBe(false);
    });

    test('celebrate() starts celebration', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      friend.celebrate();
      
      expect(friend.isCelebratingState()).toBe(true);
    });

    test('celebrate() creates animation tween', () => {
      const friend = new Friend(mockScene, 100, 100, 'Marcus');
      
      friend.celebrate();
      
      expect(mockScene.tweens.add).toHaveBeenCalled();
    });

    test('stopCelebrating() stops celebration', () => {
      const friend = new Friend(mockScene, 100, 100, 'Otto');
      
      friend.celebrate();
      friend.stopCelebrating();
      
      expect(friend.isCelebratingState()).toBe(false);
    });

    test('stopCelebrating() kills tweens', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      friend.celebrate();
      friend.stopCelebrating();
      
      expect(mockScene.tweens.killTweensOf).toHaveBeenCalledWith(friend);
    });

    test('can toggle celebration on and off', () => {
      const friend = new Friend(mockScene, 100, 100, 'Marcus');
      
      friend.celebrate();
      expect(friend.isCelebratingState()).toBe(true);
      
      friend.stopCelebrating();
      expect(friend.isCelebratingState()).toBe(false);
      
      friend.celebrate();
      expect(friend.isCelebratingState()).toBe(true);
    });
  });

  describe('Celebration Animation', () => {
    test('celebration uses vertical bounce', () => {
      const friend = new Friend(mockScene, 100, 100, 'Otto');
      const initialY = friend.y;
      
      friend.celebrate();
      
      const tweenConfig = mockScene.tweens.add.mock.calls[0][0];
      expect(tweenConfig.y).toBe(initialY - 20);
    });

    test('celebration animation is infinite loop', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      friend.celebrate();
      
      const tweenConfig = mockScene.tweens.add.mock.calls[0][0];
      expect(tweenConfig.repeat).toBe(-1);
    });

    test('celebration animation has yoyo effect', () => {
      const friend = new Friend(mockScene, 100, 100, 'Marcus');
      
      friend.celebrate();
      
      const tweenConfig = mockScene.tweens.add.mock.calls[0][0];
      expect(tweenConfig.yoyo).toBe(true);
    });
  });

  describe('Sprite Creation', () => {
    test('creates sprite body', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      expect(friend['sprite']).toBeDefined();
    });

    test('is added to scene', () => {
      new Friend(mockScene, 100, 100, 'Marcus');
      
      expect(mockScene.add.existing).toHaveBeenCalled();
    });
  });

  describe('Position and Placement', () => {
    test('friend is positioned at specified coordinates', () => {
      const friend = new Friend(mockScene, 300, 400, 'Otto');
      
      expect(friend.x).toBe(300);
      expect(friend.y).toBe(400);
    });

    test('multiple friends can be created at different positions', () => {
      const nico = new Friend(mockScene, 100, 100, 'Nico');
      const marcus = new Friend(mockScene, 200, 100, 'Marcus');
      const otto = new Friend(mockScene, 300, 100, 'Otto');
      
      expect(nico.x).toBe(100);
      expect(marcus.x).toBe(200);
      expect(otto.x).toBe(300);
    });
  });

  describe('Edge Cases', () => {
    test('celebrating friend does not break on stopCelebrating without celebration', () => {
      const friend = new Friend(mockScene, 100, 100, 'Nico');
      
      // Should not error when stopping celebration that hasn't started
      expect(() => friend.stopCelebrating()).not.toThrow();
    });

    test('multiple celebrate calls handle correctly', () => {
      const friend = new Friend(mockScene, 100, 100, 'Marcus');
      
      friend.celebrate();
      friend.celebrate(); // Second call
      
      expect(friend.isCelebratingState()).toBe(true);
    });

    test('friends are independent instances', () => {
      const friend1 = new Friend(mockScene, 0, 0, 'Nico');
      const friend2 = new Friend(mockScene, 100, 0, 'Nico');
      
      friend1.celebrate();
      
      expect(friend1.isCelebratingState()).toBe(true);
      expect(friend2.isCelebratingState()).toBe(false);
    });
  });
});
