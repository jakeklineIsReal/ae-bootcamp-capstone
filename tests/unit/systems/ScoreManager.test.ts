/**
 * ScoreManager Tests
 * 
 * Tests for score tracking system
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { ScoreManager } from '../../../src/systems/ScoreManager';

describe('ScoreManager', () => {
  let scoreManager: ScoreManager;

  beforeEach(() => {
    scoreManager = new ScoreManager();
  });

  describe('Initialization', () => {
    test('starts with zero collectibles', () => {
      expect(scoreManager.getTotal()).toBe(0);
    });

    test('all collectible types start at zero', () => {
      expect(scoreManager.getCount('star')).toBe(0);
      expect(scoreManager.getCount('heart')).toBe(0);
      expect(scoreManager.getCount('circle')).toBe(0);
    });
  });

  describe('Adding Collectibles', () => {
    test('addCollectible increments star count', () => {
      scoreManager.addCollectible('star');
      
      expect(scoreManager.getCount('star')).toBe(1);
    });

    test('addCollectible increments heart count', () => {
      scoreManager.addCollectible('heart');
      
      expect(scoreManager.getCount('heart')).toBe(1);
    });

    test('addCollectible increments circle count', () => {
      scoreManager.addCollectible('circle');
      
      expect(scoreManager.getCount('circle')).toBe(1);
    });

    test('multiple adds increment correctly', () => {
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('star');
      
      expect(scoreManager.getCount('star')).toBe(3);
    });

    test('different types are tracked independently', () => {
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('heart');
      scoreManager.addCollectible('circle');
      
      expect(scoreManager.getCount('star')).toBe(1);
      expect(scoreManager.getCount('heart')).toBe(1);
      expect(scoreManager.getCount('circle')).toBe(1);
    });
  });

  describe('Getting Counts', () => {
    test('getCount returns correct star count', () => {
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('star');
      
      expect(scoreManager.getCount('star')).toBe(2);
    });

    test('getCount returns correct heart count', () => {
      scoreManager.addCollectible('heart');
      scoreManager.addCollectible('heart');
      scoreManager.addCollectible('heart');
      
      expect(scoreManager.getCount('heart')).toBe(3);
    });

    test('getCount returns correct circle count', () => {
      scoreManager.addCollectible('circle');
      
      expect(scoreManager.getCount('circle')).toBe(1);
    });
  });

  describe('Total Count', () => {
    test('getTotal returns sum of all collectibles', () => {
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('heart');
      scoreManager.addCollectible('circle');
      
      expect(scoreManager.getTotal()).toBe(3);
    });

    test('getTotal updates as collectibles are added', () => {
      expect(scoreManager.getTotal()).toBe(0);
      
      scoreManager.addCollectible('star');
      expect(scoreManager.getTotal()).toBe(1);
      
      scoreManager.addCollectible('heart');
      expect(scoreManager.getTotal()).toBe(2);
      
      scoreManager.addCollectible('circle');
      expect(scoreManager.getTotal()).toBe(3);
    });

    test('getTotal handles many collectibles', () => {
      for (let i = 0; i < 10; i++) {
        scoreManager.addCollectible('star');
      }
      for (let i = 0; i < 5; i++) {
        scoreManager.addCollectible('heart');
      }
      for (let i = 0; i < 7; i++) {
        scoreManager.addCollectible('circle');
      }
      
      expect(scoreManager.getTotal()).toBe(22);
    });
  });

  describe('Get All Counts', () => {
    test('getAllCounts returns all counts as object', () => {
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('heart');
      scoreManager.addCollectible('heart');
      
      const counts = scoreManager.getAllCounts();
      
      expect(counts).toEqual({
        stars: 1,
        hearts: 2,
        circles: 0,
      });
    });

    test('getAllCounts returns zeros when nothing collected', () => {
      const counts = scoreManager.getAllCounts();
      
      expect(counts).toEqual({
        stars: 0,
        hearts: 0,
        circles: 0,
      });
    });

    test('getAllCounts reflects current state', () => {
      scoreManager.addCollectible('star');
      let counts = scoreManager.getAllCounts();
      expect(counts.stars).toBe(1);
      
      scoreManager.addCollectible('star');
      counts = scoreManager.getAllCounts();
      expect(counts.stars).toBe(2);
    });
  });

  describe('Reset', () => {
    test('reset clears all counts', () => {
      scoreManager.addCollectible('star');
      scoreManager.addCollectible('heart');
      scoreManager.addCollectible('circle');
      
      scoreManager.reset();
      
      expect(scoreManager.getTotal()).toBe(0);
      expect(scoreManager.getCount('star')).toBe(0);
      expect(scoreManager.getCount('heart')).toBe(0);
      expect(scoreManager.getCount('circle')).toBe(0);
    });

    test('reset allows collecting again', () => {
      scoreManager.addCollectible('star');
      scoreManager.reset();
      scoreManager.addCollectible('star');
      
      expect(scoreManager.getCount('star')).toBe(1);
    });

    test('reset multiple times works correctly', () => {
      scoreManager.addCollectible('star');
      scoreManager.reset();
      scoreManager.reset();
      
      expect(scoreManager.getTotal()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('handles very large counts', () => {
      for (let i = 0; i < 1000; i++) {
        scoreManager.addCollectible('star');
      }
      
      expect(scoreManager.getCount('star')).toBe(1000);
    });

    test('multiple instances are independent', () => {
      const score1 = new ScoreManager();
      const score2 = new ScoreManager();
      
      score1.addCollectible('star');
      score2.addCollectible('heart');
      
      expect(score1.getCount('star')).toBe(1);
      expect(score1.getCount('heart')).toBe(0);
      expect(score2.getCount('star')).toBe(0);
      expect(score2.getCount('heart')).toBe(1);
    });

    test('handles rapid additions', () => {
      for (let i = 0; i < 100; i++) {
        scoreManager.addCollectible(i % 3 === 0 ? 'star' : i % 3 === 1 ? 'heart' : 'circle');
      }
      
      expect(scoreManager.getTotal()).toBe(100);
    });
  });

  describe('Type Safety', () => {
    test('handles all valid collectible types', () => {
      const types: Array<'star' | 'heart' | 'circle'> = ['star', 'heart', 'circle'];
      
      types.forEach(type => {
        scoreManager.addCollectible(type);
        expect(scoreManager.getCount(type)).toBeGreaterThan(0);
      });
    });
  });

  describe('Constitutional Compliance', () => {
    test('score only increases (no negative consequences)', () => {
      const initialTotal = scoreManager.getTotal();
      
      scoreManager.addCollectible('star');
      
      // Score should never decrease (no failure states)
      expect(scoreManager.getTotal()).toBeGreaterThan(initialTotal);
    });

    test('all collectibles contribute positively', () => {
      const types: Array<'star' | 'heart' | 'circle'> = ['star', 'heart', 'circle'];
      
      types.forEach(type => {
        const before = scoreManager.getTotal();
        scoreManager.addCollectible(type);
        const after = scoreManager.getTotal();
        
        expect(after).toBeGreaterThan(before);
      });
    });
  });
});
