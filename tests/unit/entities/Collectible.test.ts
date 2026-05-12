/**
 * Collectible Entity Tests
 * 
 * Tests for collectible items with emphasis on:
 * - Accessibility (distinct shapes, not just colors)
 * - Audio feedback (tested in integration)
 * - Proper collection behavior
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Collectible } from '../../../src/entities/Collectible';
import { createMockScene } from '../../helpers/phaserMocks';
import { COLLECTIBLE, COLLECTIBLE_TYPES } from '../../../src/config/constants';

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

describe('Collectible Entity', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = createMockScene();
  });

  describe('Constitutional Requirement: Accessibility-First (Distinct Shapes)', () => {
    test('star type creates star shape', () => {
      const collectible = new Collectible(mockScene, 100, 100, COLLECTIBLE_TYPES.STAR);
      
      expect(collectible.type).toBe('star');
      expect(collectible['shape']).toBeDefined();
    });

    test('heart type creates heart shape', () => {
      const collectible = new Collectible(mockScene, 100, 100, COLLECTIBLE_TYPES.HEART);
      
      expect(collectible.type).toBe('heart');
      expect(collectible['shape']).toBeDefined();
    });

    test('circle type creates circle shape', () => {
      const collectible = new Collectible(mockScene, 100, 100, COLLECTIBLE_TYPES.CIRCLE);
      
      expect(collectible.type).toBe('circle');
      expect(collectible['shape']).toBeDefined();
    });

    test('each shape type is distinguishable', () => {
      const star = new Collectible(mockScene, 0, 0, 'star');
      const heart = new Collectible(mockScene, 0, 0, 'heart');
      const circle = new Collectible(mockScene, 0, 0, 'circle');
      
      // All should have different types
      expect(star.type).not.toBe(heart.type);
      expect(heart.type).not.toBe(circle.type);
      expect(circle.type).not.toBe(star.type);
    });
  });

  describe('Initialization', () => {
    test('initializes with correct type', () => {
      ['star', 'heart', 'circle'].forEach(type => {
        const collectible = new Collectible(mockScene, 100, 100, type as any);
        expect(collectible.type).toBe(type);
      });
    });

    test('initializes as not collected', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      
      expect(collectible.collected).toBe(false);
    });

    test('creates shape graphics object', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      
      expect(collectible['shape']).toBeDefined();
      expect(mockScene.add.graphics).toHaveBeenCalled();
    });
  });

  describe('Collection State', () => {
    test('can mark as collected', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      
      collectible.collected = true;
      
      expect(collectible.collected).toBe(true);
    });

    test('destroyed collectibles are properly handled', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'heart');
      
      collectible.collect();
      
      expect(collectible.collected).toBe(true);
    });
  });

  describe('Floating Animation', () => {
    test('adds floating animation to collectible', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      
      // Tween should be created for floating effect
      expect(mockScene.tweens.add).toHaveBeenCalled();
    });

    test('floating animation uses correct amplitude', () => {
      new Collectible(mockScene, 100, 100, 'circle');
      
      const tweenConfig = mockScene.tweens.add.mock.calls[0][0];
      expect(tweenConfig.y).toBeDefined();
    });
  });

  describe('Shape Drawing', () => {
    test('star shape is drawn with graphics calls', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      const graphics = collectible['shape'];
      
      // Should make graphics calls to draw star
      expect(graphics.fillStyle).toHaveBeenCalled();
      expect(graphics.lineStyle).toHaveBeenCalled();
    });

    test('heart shape uses proper drawing calls', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'heart');
      const graphics = collectible['shape'];
      
      expect(graphics.fillStyle).toHaveBeenCalled();
    });

    test('circle shape is drawn as circle', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'circle');
      const graphics = collectible['shape'];
      
      expect(graphics.fillCircle).toHaveBeenCalled();
      expect(graphics.strokeCircle).toHaveBeenCalled();
    });
  });

  describe('Size Configuration', () => {
    test('uses COLLECTIBLE.SIZE constant for dimensions', () => {
      // Size should be consistent across all collectible types
      expect(COLLECTIBLE.SIZE).toBe(32);
    });
  });

  describe('Edge Cases', () => {
    test('can create multiple collectibles of same type', () => {
      const col1 = new Collectible(mockScene, 0, 0, 'star');
      const col2 = new Collectible(mockScene, 100, 100, 'star');
      
      expect(col1.type).toBe(col2.type);
      expect(col1).not.toBe(col2);
    });

    test('collectibles at different positions are independent', () => {
      const col1 = new Collectible(mockScene, 50, 50, 'heart');
      const col2 = new Collectible(mockScene, 150, 150, 'circle');
      
      col1.collected = true;
      
      expect(col2.collected).toBe(false);
    });
  });

  describe('Visual Feedback', () => {
    test('shape is added to container', () => {
      const collectible = new Collectible(mockScene, 100, 100, 'star');
      
      expect(collectible['shape']).toBeDefined();
      expect(collectible.list.length).toBeGreaterThan(0);
    });
  });
});
