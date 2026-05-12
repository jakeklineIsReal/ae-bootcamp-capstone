/**
 * Obstacle Entity Tests
 * 
 * Tests for obstacles with emphasis on:
 * - No failure states (obstacles slow but never stop player)
 * - Different obstacle types and behaviors
 * - Forgiving collision mechanics
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Obstacle } from '../../../src/entities/Obstacle';
import { createMockScene } from '../../helpers/phaserMocks';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    GameObjects: {
      Rectangle: class Rectangle {
        scene: any;
        x: number;
        y: number;
        width: number;
        height: number;
        fillColor: number;
        
        constructor(scene: any, x: number, y: number, width: number, height: number, color: number) {
          this.scene = scene;
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.fillColor = color;
        }
      },
    },
  },
}));

describe('Obstacle Entity', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = createMockScene();
  });

  describe('Constitutional Requirement: No Failure States (Obstacles Slow, Never Stop)', () => {
    test('puddle has slow factor greater than 0', () => {
      const puddle = new Obstacle(mockScene, 100, 100, 'puddle');
      
      // CRITICAL: Must slow but NEVER stop (factor > 0)
      expect(puddle.getSlowFactor()).toBeGreaterThan(0);
      expect(puddle.getSlowFactor()).toBeLessThan(1);
    });

    test('rock has slow factor greater than 0', () => {
      const rock = new Obstacle(mockScene, 100, 100, 'rock');
      
      // CRITICAL: Must slow but NEVER stop
      expect(rock.getSlowFactor()).toBeGreaterThan(0);
      expect(rock.getSlowFactor()).toBeLessThan(1);
    });

    test('hill has slow factor greater than 0', () => {
      const hill = new Obstacle(mockScene, 100, 100, 'hill');
      
      // CRITICAL: Must slow but NEVER stop
      expect(hill.getSlowFactor()).toBeGreaterThan(0);
      expect(hill.getSlowFactor()).toBeLessThan(1);
    });

    test('all obstacles allow forward progress', () => {
      const obstacles = [
        new Obstacle(mockScene, 0, 0, 'puddle'),
        new Obstacle(mockScene, 0, 0, 'rock'),
        new Obstacle(mockScene, 0, 0, 'hill'),
      ];
      
      obstacles.forEach(obstacle => {
        const slowFactor = obstacle.getSlowFactor();
        // Player velocity * slowFactor should always result in forward movement
        const playerSpeed = 100;
        const resultSpeed = playerSpeed * slowFactor;
        
        expect(resultSpeed).toBeGreaterThan(0);
      });
    });
  });

  describe('Obstacle Types', () => {
    test('puddle type creates puddle obstacle', () => {
      const puddle = new Obstacle(mockScene, 100, 100, 'puddle');
      
      expect(puddle.type).toBe('puddle');
    });

    test('rock type creates rock obstacle', () => {
      const rock = new Obstacle(mockScene, 100, 100, 'rock');
      
      expect(rock.type).toBe('rock');
    });

    test('hill type creates hill obstacle', () => {
      const hill = new Obstacle(mockScene, 100, 100, 'hill');
      
      expect(hill.type).toBe('hill');
    });
  });

  describe('Slow Factors', () => {
    test('puddle has 50% slow factor', () => {
      const puddle = new Obstacle(mockScene, 100, 100, 'puddle');
      
      expect(puddle.getSlowFactor()).toBe(0.5);
    });

    test('rock has 40% slow factor (most challenging)', () => {
      const rock = new Obstacle(mockScene, 100, 100, 'rock');
      
      expect(rock.getSlowFactor()).toBe(0.4);
    });

    test('hill has 60% slow factor (least challenging)', () => {
      const hill = new Obstacle(mockScene, 100, 100, 'hill');
      
      expect(hill.getSlowFactor()).toBe(0.6);
    });

    test('rock is more challenging than puddle', () => {
      const rock = new Obstacle(mockScene, 0, 0, 'rock');
      const puddle = new Obstacle(mockScene, 0, 0, 'puddle');
      
      expect(rock.getSlowFactor()).toBeLessThan(puddle.getSlowFactor());
    });

    test('puddle is more challenging than hill', () => {
      const puddle = new Obstacle(mockScene, 0, 0, 'puddle');
      const hill = new Obstacle(mockScene, 0, 0, 'hill');
      
      expect(puddle.getSlowFactor()).toBeLessThan(hill.getSlowFactor());
    });
  });

  describe('Obstacle Dimensions', () => {
    test('puddle has wide, flat dimensions', () => {
      const puddle = new Obstacle(mockScene, 100, 100, 'puddle');
      
      expect(puddle.width).toBe(80);
      expect(puddle.height).toBe(20);
    });

    test('rock has square-ish dimensions', () => {
      const rock = new Obstacle(mockScene, 100, 100, 'rock');
      
      expect(rock.width).toBe(50);
      expect(rock.height).toBe(50);
    });

    test('hill has large dimensions', () => {
      const hill = new Obstacle(mockScene, 100, 100, 'hill');
      
      expect(hill.width).toBe(100);
      expect(hill.height).toBe(60);
    });
  });

  describe('Obstacle Colors', () => {
    test('puddle is blue', () => {
      const puddle = new Obstacle(mockScene, 100, 100, 'puddle');
      
      expect(puddle.fillColor).toBe(0x4169e1);
    });

    test('rock is gray', () => {
      const rock = new Obstacle(mockScene, 100, 100, 'rock');
      
      expect(rock.fillColor).toBe(0x696969);
    });

    test('hill is brown', () => {
      const hill = new Obstacle(mockScene, 100, 100, 'hill');
      
      expect(hill.fillColor).toBe(0x8b7355);
    });
  });

  describe('Position and Placement', () => {
    test('obstacle is placed at specified coordinates', () => {
      const obstacle = new Obstacle(mockScene, 250, 350, 'rock');
      
      expect(obstacle.x).toBe(250);
      expect(obstacle.y).toBe(350);
    });

    test('can create multiple obstacles at different positions', () => {
      const obs1 = new Obstacle(mockScene, 100, 100, 'puddle');
      const obs2 = new Obstacle(mockScene, 500, 100, 'rock');
      
      expect(obs1.x).not.toBe(obs2.x);
    });
  });

  describe('Edge Cases', () => {
    test('different obstacle types are independent', () => {
      const puddle = new Obstacle(mockScene, 0, 0, 'puddle');
      const rock = new Obstacle(mockScene, 0, 0, 'rock');
      
      expect(puddle.getSlowFactor()).not.toBe(rock.getSlowFactor());
    });

    test('slow factors are consistent for same type', () => {
      const rock1 = new Obstacle(mockScene, 0, 0, 'rock');
      const rock2 = new Obstacle(mockScene, 100, 100, 'rock');
      
      expect(rock1.getSlowFactor()).toBe(rock2.getSlowFactor());
    });
  });

  describe('Gameplay Impact', () => {
    test('slowdown preserves player momentum direction', () => {
      const obstacle = new Obstacle(mockScene, 0, 0, 'rock');
      const slowFactor = obstacle.getSlowFactor();
      
      // Positive velocity stays positive
      expect(100 * slowFactor).toBeGreaterThan(0);
      
      // Negative velocity stays negative (if player could move backward)
      expect(-100 * slowFactor).toBeLessThan(0);
    });

    test('combined obstacles still allow movement', () => {
      // Simulate hitting multiple obstacles
      let playerVelocity = 200;
      
      const puddle = new Obstacle(mockScene, 0, 0, 'puddle');
      const rock = new Obstacle(mockScene, 0, 0, 'rock');
      
      playerVelocity *= puddle.getSlowFactor();
      playerVelocity *= rock.getSlowFactor();
      
      // Even after two obstacles, player still moves
      expect(playerVelocity).toBeGreaterThan(0);
    });
  });
});
