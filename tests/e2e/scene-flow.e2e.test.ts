import { describe, test, expect, vi } from 'vitest';
import { BootScene } from '../../src/scenes/BootScene';
import { StartScene } from '../../src/scenes/StartScene';
import { GameScene } from '../../src/scenes/GameScene';
import { CelebrationScene } from '../../src/scenes/CelebrationScene';
import { SCENES, WORLD } from '../../src/config/constants';

vi.mock('../../src/entities/Player', () => ({
  Player: class Player {
    x = 0;
    y = 0;
    update = vi.fn();
    moveRight = vi.fn();
    jump = vi.fn();
    slow = vi.fn();
    isOnGround = vi.fn().mockReturnValue(true);
    constructor(_scene: any, x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  },
}));

vi.mock('../../src/entities/Obstacle', () => ({
  Obstacle: class Obstacle {
    type: 'puddle' | 'rock' | 'hill';
    constructor(_scene: any, _x: number, _y: number, type: 'puddle' | 'rock' | 'hill') {
      this.type = type;
    }
    getSlowFactor() {
      return 0.5;
    }
  },
}));

vi.mock('../../src/entities/Collectible', () => ({
  Collectible: class Collectible {
    type: 'star' | 'heart' | 'circle';
    collected = false;
    body = {
      setCircle: vi.fn(),
      setAllowGravity: vi.fn(),
    };
    constructor(_scene: any, _x: number, _y: number, type: 'star' | 'heart' | 'circle') {
      this.type = type;
    }
    collect() {
      this.collected = true;
    }
  },
}));

vi.mock('../../src/entities/Friend', () => ({
  Friend: class Friend {
    celebrate = vi.fn();
    constructor() {}
  },
}));

vi.mock('../../src/systems/SynthAudioManager', () => ({
  SynthAudioManager: class SynthAudioManager {
    resume = vi.fn();
    playCollectSound = vi.fn();
    playBackgroundMusic = vi.fn();
    playJumpSound = vi.fn();
    playSplashSound = vi.fn();
    playBumpSound = vi.fn();
    playCelebrationSound = vi.fn();
    toggleMute = vi.fn();
    isMuted = vi.fn().mockReturnValue(false);
    stopBackgroundMusic = vi.fn();
    destroy = vi.fn();
  },
}));

vi.mock('../../src/systems/AudioManager', () => ({
  AudioManager: class AudioManager {
    constructor() {}
  },
}));

vi.mock('../../src/systems/ScoreManager', () => ({
  ScoreManager: class ScoreManager {
    addCollectible = vi.fn();
    getTotal = vi.fn().mockReturnValue(0);
    getAllCounts = vi.fn().mockReturnValue({ stars: 0, hearts: 0, circles: 0 });
  },
}));

vi.mock('../../src/systems/CollisionManager', () => ({
  CollisionManager: class CollisionManager {
    setupOverlap = vi.fn();
  },
}));

describe('E2E Scene Flow', () => {
  test('boot to start to game to celebration flow executes', () => {
    const boot = new BootScene();
    const bootStart = vi.fn();
    (boot as any).scene = { start: bootStart };
    boot.preload();
    boot.create();
    expect(bootStart).toHaveBeenCalledWith(SCENES.START);

    const start = new StartScene();
    const startSceneStart = vi.fn();
    const startTextObject = {
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn(),
      setText: vi.fn().mockReturnThis(),
    };
    (start as any).scale = { width: 800, height: 600 };
    (start as any).add = {
      rectangle: vi.fn().mockReturnValue({}),
      text: vi.fn().mockReturnValue(startTextObject),
    };
    (start as any).tweens = { add: vi.fn() };
    (start as any).input = {
      keyboard: {
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (start as any).cameras = {
      main: {
        fadeOut: vi.fn(),
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (start as any).scene = { start: startSceneStart };
    start.create();
    expect(startSceneStart).toHaveBeenCalledWith(SCENES.GAME);

    const game = new GameScene();
    const gameSceneStart = vi.fn();
    const graphicsObject = {
      setScrollFactor: vi.fn().mockReturnThis(),
      clear: vi.fn().mockReturnThis(),
      fillStyle: vi.fn().mockReturnThis(),
      fillRect: vi.fn().mockReturnThis(),
    };
    const textObject = {
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn(),
    };
    const rectangleObject = {
      setDepth: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
    };
    (game as any).scale = { width: 1024, height: 576 };
    (game as any).add = {
      rectangle: vi.fn().mockReturnValue(rectangleObject),
      graphics: vi.fn().mockReturnValue(graphicsObject),
      text: vi.fn().mockReturnValue(textObject),
      circle: vi.fn().mockReturnValue({ destroy: vi.fn() }),
      existing: vi.fn(),
    };
    (game as any).physics = {
      world: { setBounds: vi.fn() },
      add: {
        existing: vi.fn(),
        staticGroup: vi.fn().mockReturnValue({ add: vi.fn() }),
        group: vi.fn().mockReturnValue({ add: vi.fn() }),
        collider: vi.fn(),
      },
    };
    (game as any).input = {
      keyboard: {
        createCursorKeys: vi.fn().mockReturnValue({
          up: { on: vi.fn() },
          right: { isDown: false },
        }),
        addKey: vi.fn().mockReturnValue({
          on: vi.fn(),
          isDown: false,
        }),
      },
    };
    (game as any).cameras = {
      main: {
        setBounds: vi.fn(),
        startFollow: vi.fn(),
        fadeOut: vi.fn(),
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (game as any).scene = { start: gameSceneStart };
    game.create();
    (game as any).player.x = WORLD.PARK_X;
    game.update(0, 16);
    expect(gameSceneStart).toHaveBeenCalledWith(
      SCENES.CELEBRATION,
      expect.objectContaining({ score: 0 })
    );

    const celebration = new CelebrationScene();
    const celebrationSceneStart = vi.fn();
    const celebrationTextObject = {
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
    };
    (celebration as any).scale = { width: 1024, height: 576 };
    (celebration as any).add = {
      rectangle: vi.fn().mockReturnValue({}),
      text: vi.fn().mockReturnValue(celebrationTextObject),
      circle: vi.fn().mockReturnValue({ destroy: vi.fn() }),
    };
    (celebration as any).tweens = {
      add: vi.fn((config: { onComplete?: () => void }) => {
        config.onComplete?.();
      }),
    };
    (celebration as any).cameras = {
      main: {
        fadeIn: vi.fn(),
        fadeOut: vi.fn(),
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (celebration as any).input = {
      keyboard: {
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (celebration as any).scene = { start: celebrationSceneStart };
    celebration.create({ score: 12, stars: 4, hearts: 4, circles: 4 });
    expect(celebrationSceneStart).toHaveBeenCalledWith(SCENES.START);
  });
});
