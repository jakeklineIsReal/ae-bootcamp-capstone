/**
 * Constants Tests
 * 
 * Tests for game constants to ensure constitutional compliance
 */

import { describe, test, expect } from 'vitest';
import {
  PLAYER,
  WORLD,
  CAMERA,
  OBSTACLE,
  COLLECTIBLE,
  AUDIO,
  COLORS,
  COLLECTIBLE_TYPES,
  FRIENDS,
  SCENES,
  INPUT,
  PERFORMANCE,
} from '../../../src/config/constants';

describe('Game Constants', () => {
  describe('Player Constants', () => {
    test('PLAYER has positive walk speed', () => {
      expect(PLAYER.WALK_SPEED).toBeGreaterThan(0);
    });

    test('PLAYER has negative jump velocity (upward)', () => {
      expect(PLAYER.JUMP_VELOCITY).toBeLessThan(0);
    });

    test('PLAYER has reasonable dimensions', () => {
      expect(PLAYER.WIDTH).toBeGreaterThan(0);
      expect(PLAYER.HEIGHT).toBeGreaterThan(0);
      expect(PLAYER.HEIGHT).toBeGreaterThan(PLAYER.WIDTH); // Taller than wide
    });

    test('PLAYER max velocities are positive', () => {
      expect(PLAYER.MAX_VELOCITY_X).toBeGreaterThan(0);
      expect(PLAYER.MAX_VELOCITY_Y).toBeGreaterThan(0);
    });

    test('PLAYER max velocity exceeds walk speed', () => {
      expect(PLAYER.MAX_VELOCITY_X).toBeGreaterThan(PLAYER.WALK_SPEED);
    });
  });

  describe('World Constants', () => {
    test('WORLD has positive dimensions', () => {
      expect(WORLD.WIDTH).toBeGreaterThan(0);
      expect(WORLD.HEIGHT).toBeGreaterThan(0);
    });

    test('WORLD ground is below top', () => {
      expect(WORLD.GROUND_Y).toBeGreaterThan(0);
      expect(WORLD.GROUND_Y).toBeLessThan(WORLD.HEIGHT);
    });

    test('WORLD park position is before end', () => {
      expect(WORLD.PARK_X).toBeGreaterThan(0);
      expect(WORLD.PARK_X).toBeLessThan(WORLD.WIDTH);
    });

    test('WORLD provides substantial journey distance', () => {
      expect(WORLD.WIDTH).toBeGreaterThan(2000); // Long enough for gameplay
    });
  });

  describe('Camera Constants', () => {
    test('CAMERA lerp values are in 0-1 range', () => {
      expect(CAMERA.LERP_X).toBeGreaterThan(0);
      expect(CAMERA.LERP_X).toBeLessThanOrEqual(1);
      expect(CAMERA.LERP_Y).toBeGreaterThan(0);
      expect(CAMERA.LERP_Y).toBeLessThanOrEqual(1);
    });

    test('CAMERA horizontal follow is faster than vertical', () => {
      expect(CAMERA.LERP_X).toBeGreaterThan(CAMERA.LERP_Y);
    });
  });

  describe('Constitutional Requirement: No Failure States (Obstacle Slow Factors)', () => {
    test('PUDDLE_SLOW allows forward progress', () => {
      // CRITICAL: Must be > 0 (player continues moving)
      expect(OBSTACLE.PUDDLE_SLOW).toBeGreaterThan(0);
      expect(OBSTACLE.PUDDLE_SLOW).toBeLessThan(1);
    });

    test('ROCK_SLOW allows forward progress', () => {
      // CRITICAL: Must be > 0
      expect(OBSTACLE.ROCK_SLOW).toBeGreaterThan(0);
      expect(OBSTACLE.ROCK_SLOW).toBeLessThan(1);
    });

    test('HILL_SLOW allows forward progress', () => {
      // CRITICAL: Must be > 0
      expect(OBSTACLE.HILL_SLOW).toBeGreaterThan(0);
      expect(OBSTACLE.HILL_SLOW).toBeLessThan(1);
    });

    test('all obstacle slows guarantee movement', () => {
      const slowFactors = [
        OBSTACLE.PUDDLE_SLOW,
        OBSTACLE.ROCK_SLOW,
        OBSTACLE.HILL_SLOW,
      ];
      
      slowFactors.forEach(factor => {
        const playerSpeed = 100;
        const resultSpeed = playerSpeed * factor;
        
        // Player must still move forward
        expect(resultSpeed).toBeGreaterThan(0);
      });
    });

    test('obstacle slow factors have different difficulties', () => {
      // Rock should be most challenging
      expect(OBSTACLE.ROCK_SLOW).toBeLessThan(OBSTACLE.PUDDLE_SLOW);
      expect(OBSTACLE.PUDDLE_SLOW).toBeLessThan(OBSTACLE.HILL_SLOW);
    });

    test('obstacle effect has positive duration', () => {
      expect(OBSTACLE.EFFECT_DURATION).toBeGreaterThan(0);
    });
  });

  describe('Collectible Constants', () => {
    test('COLLECTIBLE has positive size', () => {
      expect(COLLECTIBLE.SIZE).toBeGreaterThan(0);
    });

    test('COLLECTIBLE floating animation has positive amplitude', () => {
      expect(COLLECTIBLE.FLOAT_AMPLITUDE).toBeGreaterThan(0);
    });

    test('COLLECTIBLE floating speed is reasonable', () => {
      expect(COLLECTIBLE.FLOAT_SPEED).toBeGreaterThan(0);
      expect(COLLECTIBLE.FLOAT_SPEED).toBeLessThan(1);
    });
  });

  describe('Constitutional Requirement: Accessibility (Distinct Shapes)', () => {
    test('COLLECTIBLE_TYPES has star type', () => {
      expect(COLLECTIBLE_TYPES.STAR).toBe('star');
    });

    test('COLLECTIBLE_TYPES has heart type', () => {
      expect(COLLECTIBLE_TYPES.HEART).toBe('heart');
    });

    test('COLLECTIBLE_TYPES has circle type', () => {
      expect(COLLECTIBLE_TYPES.CIRCLE).toBe('circle');
    });

    test('all collectible types are unique', () => {
      const types = Object.values(COLLECTIBLE_TYPES);
      const uniqueTypes = new Set(types);
      
      expect(uniqueTypes.size).toBe(types.length);
    });
  });

  describe('Audio Constants', () => {
    test('AUDIO volumes are in 0-1 range', () => {
      expect(AUDIO.MUSIC_VOLUME).toBeGreaterThanOrEqual(0);
      expect(AUDIO.MUSIC_VOLUME).toBeLessThanOrEqual(1);
      expect(AUDIO.SFX_VOLUME).toBeGreaterThanOrEqual(0);
      expect(AUDIO.SFX_VOLUME).toBeLessThanOrEqual(1);
      expect(AUDIO.VOICE_VOLUME).toBeGreaterThanOrEqual(0);
      expect(AUDIO.VOICE_VOLUME).toBeLessThanOrEqual(1);
    });

    test('AUDIO has reasonable default volumes', () => {
      expect(AUDIO.MUSIC_VOLUME).toBeGreaterThan(0.3);
      expect(AUDIO.SFX_VOLUME).toBeGreaterThan(0.3);
      expect(AUDIO.VOICE_VOLUME).toBeGreaterThan(0.3);
    });
  });

  describe('Color Constants', () => {
    test('COLORS are valid hex values', () => {
      const colorNames = Object.keys(COLORS) as Array<keyof typeof COLORS>;
      
      colorNames.forEach(name => {
        const color = COLORS[name];
        expect(color).toBeGreaterThanOrEqual(0);
        expect(color).toBeLessThanOrEqual(0xffffff);
      });
    });

    test('COLORS has primary color', () => {
      expect(COLORS.PRIMARY).toBeDefined();
    });

    test('COLORS has background color', () => {
      expect(COLORS.BACKGROUND).toBeDefined();
    });
  });

  describe('Constitutional Requirement: Personal Connection (Friends)', () => {
    test('FRIENDS has Nico', () => {
      expect(FRIENDS.NICO).toBe('Nico');
    });

    test('FRIENDS has Marcus', () => {
      expect(FRIENDS.MARCUS).toBe('Marcus');
    });

    test('FRIENDS has Otto', () => {
      expect(FRIENDS.OTTO).toBe('Otto');
    });

    test('all friend names are unique', () => {
      const names = Object.values(FRIENDS);
      const uniqueNames = new Set(names);
      
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('Scene Constants', () => {
    test('SCENES has all required scenes', () => {
      expect(SCENES.BOOT).toBe('BootScene');
      expect(SCENES.START).toBe('StartScene');
      expect(SCENES.GAME).toBe('GameScene');
      expect(SCENES.CELEBRATION).toBe('CelebrationScene');
    });

    test('scene names follow naming convention', () => {
      const sceneNames = Object.values(SCENES);
      
      sceneNames.forEach(name => {
        expect(name).toMatch(/Scene$/); // All end with 'Scene'
      });
    });
  });

  describe('Constitutional Requirement: Age-First Design (Simple Controls)', () => {
    test('INPUT has jump keys defined', () => {
      expect(INPUTJUMP_KEYS).toBeDefined();
      expect(INPUT.JUMP_KEYS.length).toBeGreaterThan(0);
    });

    test('INPUT provides multiple jump options', () => {
      // Age-appropriate: multiple keys for same action
      expect(INPUT.JUMP_KEYS.length).toBeGreaterThanOrEqual(2);
    });

    test('INPUT has pause keys defined', () => {
      expect(INPUT.PAUSE_KEYS).toBeDefined();
    });

    test('INPUT has trick keys defined', () => {
      expect(INPUT.TRICK_KEYS).toBeDefined();
    });
  });

  describe('Performance Constants', () => {
    test('PERFORMANCE has minimum FPS target', () => {
      expect(PERFORMANCE.MIN_FPS).toBeGreaterThan(0);
    });

    test('PERFORMANCE target FPS is higher than minimum', () => {
      expect(PERFORMANCE.TARGET_FPS).toBeGreaterThan(PERFORMANCE.MIN_FPS);
    });

    test('PERFORMANCE target is 60 FPS', () => {
      expect(PERFORMANCE.TARGET_FPS).toBe(60);
    });

    test('PERFORMANCE has load time target', () => {
      expect(PERFORMANCE.LOAD_TIME_TARGET).toBeGreaterThan(0);
    });

    test('PERFORMANCE minimum FPS is playable', () => {
      expect(PERFORMANCE.MIN_FPS).toBeGreaterThanOrEqual(30);
    });
  });

  describe('Constant Immutability', () => {
    test('PLAYER is readonly', () => {
      expect(() => {
        (PLAYER as any).WALK_SPEED = 999;
      }).toThrow();
    });

    test('WORLD is readonly', () => {
      expect(() => {
        (WORLD as any).WIDTH = 999;
      }).toThrow();
    });

    test('OBSTACLE is readonly', () => {
      expect(() => {
        (OBSTACLE as any).PUDDLE_SLOW = 0;
      }).toThrow();
    });
  });

  describe('Constant Relationships', () => {
    test('player can reach park within world bounds', () => {
      expect(WORLD.PARK_X).toBeLessThan(WORLD.WIDTH);
    });

    test('player jump velocity can overcome gravity', () => {
      // Jump velocity should be significant
      expect(Math.abs(PLAYER.JUMP_VELOCITY)).toBeGreaterThan(200);
    });

    test('collectible size is age-appropriate', () => {
      // Large enough for 4-year-old to see
      expect(COLLECTIBLE.SIZE).toBeGreaterThanOrEqual(32);
    });
  });
});
