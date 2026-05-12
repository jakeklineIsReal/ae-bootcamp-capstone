import { describe, test, expect } from 'vitest';
import { gameConfig } from '../../../src/config/gameConfig';

// Minimal smoke tests to cover config branches

describe('gameConfig', () => {
  test('includes expected canvas settings', () => {
    expect(gameConfig.width).toBe(1024);
    expect(gameConfig.height).toBe(576);
    expect(gameConfig.parent).toBe('game');
  });

  test('includes physics and scale settings', () => {
    expect(gameConfig.physics?.default).toBe('arcade');
    expect(gameConfig.scale?.mode).toBeDefined();
    expect(gameConfig.scale?.autoCenter).toBeDefined();
  });

  test('includes performance and audio settings', () => {
    expect(gameConfig.fps?.target).toBe(60);
    expect(gameConfig.audio?.disableWebAudio).toBe(false);
  });
});
