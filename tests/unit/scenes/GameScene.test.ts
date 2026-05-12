import { describe, test, expect, vi, beforeEach } from 'vitest';
import { GameScene } from '../../../src/scenes/GameScene';
import { SCENES, WORLD } from '../../../src/config/constants';

const audioManagerSpy = { play: vi.fn() };
const synthAudioSpies = {
  resume: vi.fn(),
  playBackgroundMusic: vi.fn(),
  playJumpSound: vi.fn(),
  playSplashSound: vi.fn(),
  playBumpSound: vi.fn(),
  playCollectSound: vi.fn(),
  toggleMute: vi.fn(),
  isMuted: vi.fn().mockReturnValue(false),
  stopBackgroundMusic: vi.fn(),
};
const scoreManagerSpies = {
  addCollectible: vi.fn(),
  getTotal: vi.fn().mockReturnValue(0),
  getAllCounts: vi.fn().mockReturnValue({ stars: 0, hearts: 0, circles: 0 }),
};
const collisionManagerSpies = {
  setupOverlap: vi.fn(),
};

vi.mock('../../../src/systems/AudioManager', () => ({
  AudioManager: class AudioManager {
    constructor() {
      return audioManagerSpy;
    }
  },
}));

vi.mock('../../../src/systems/SynthAudioManager', () => ({
  SynthAudioManager: class SynthAudioManager {
    resume = synthAudioSpies.resume;
    playBackgroundMusic = synthAudioSpies.playBackgroundMusic;
    playJumpSound = synthAudioSpies.playJumpSound;
    playSplashSound = synthAudioSpies.playSplashSound;
    playBumpSound = synthAudioSpies.playBumpSound;
    playCollectSound = synthAudioSpies.playCollectSound;
    toggleMute = synthAudioSpies.toggleMute;
    isMuted = synthAudioSpies.isMuted;
    stopBackgroundMusic = synthAudioSpies.stopBackgroundMusic;
  },
}));

vi.mock('../../../src/systems/ScoreManager', () => ({
  ScoreManager: class ScoreManager {
    addCollectible = scoreManagerSpies.addCollectible;
    getTotal = scoreManagerSpies.getTotal;
    getAllCounts = scoreManagerSpies.getAllCounts;
  },
}));

vi.mock('../../../src/systems/CollisionManager', () => ({
  CollisionManager: class CollisionManager {
    setupOverlap = collisionManagerSpies.setupOverlap;
  },
}));

vi.mock('../../../src/entities/Player', () => ({
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

vi.mock('../../../src/entities/Obstacle', () => ({
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

vi.mock('../../../src/entities/Collectible', () => ({
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

describe('GameScene', () => {
  let scene: GameScene;
  let startSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scene = new GameScene();
    startSpy = vi.fn();

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

    (scene as any).scale = { width: 1024, height: 576 };
    (scene as any).add = {
      rectangle: vi.fn().mockReturnValue(rectangleObject),
      graphics: vi.fn().mockReturnValue(graphicsObject),
      text: vi.fn().mockReturnValue(textObject),
      circle: vi.fn().mockReturnValue({ destroy: vi.fn() }),
      existing: vi.fn(),
    };
    (scene as any).physics = {
      world: { setBounds: vi.fn() },
      add: {
        existing: vi.fn(),
        staticGroup: vi.fn().mockReturnValue({ add: vi.fn() }),
        group: vi.fn().mockReturnValue({ add: vi.fn() }),
        collider: vi.fn(),
      },
    };
    (scene as any).input = {
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
    (scene as any).cameras = {
      main: {
        setBounds: vi.fn(),
        startFollow: vi.fn(),
        fadeOut: vi.fn(),
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (scene as any).scene = { start: startSpy };
  });

  test('create initializes world and can reach park', () => {
    scene.create();

    const player = (scene as any).player;
    player.x = WORLD.PARK_X;

    scene.update(0, 16);

    expect(startSpy).toHaveBeenCalledWith(
      SCENES.CELEBRATION,
      expect.objectContaining({ score: 0 })
    );
    expect(synthAudioSpies.playBackgroundMusic).toHaveBeenCalled();
  });

  test('shutdown stops background music', () => {
    scene.create();
    scene.shutdown();

    expect(synthAudioSpies.stopBackgroundMusic).toHaveBeenCalled();
  });
});
