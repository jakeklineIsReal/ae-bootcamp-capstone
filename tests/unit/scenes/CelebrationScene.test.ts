import { describe, test, expect, vi, beforeEach } from 'vitest';
import { CelebrationScene } from '../../../src/scenes/CelebrationScene';
import { SCENES, FRIENDS } from '../../../src/config/constants';

const synthAudioSpies = {
  resume: vi.fn(),
  playCelebrationSound: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('../../../src/systems/SynthAudioManager', () => ({
  SynthAudioManager: class SynthAudioManager {
    resume = synthAudioSpies.resume;
    playCelebrationSound = synthAudioSpies.playCelebrationSound;
    destroy = synthAudioSpies.destroy;
  },
}));

vi.mock('../../../src/entities/Friend', () => ({
  Friend: class Friend {
    name: string;
    celebrate = vi.fn();
    constructor(_scene: any, _x: number, _y: number, name: typeof FRIENDS.NICO) {
      this.name = name;
    }
  },
}));

describe('CelebrationScene', () => {
  let scene: CelebrationScene;
  let startSpy: ReturnType<typeof vi.fn>;
  let keydownHandler: (() => void) | null;

  beforeEach(() => {
    scene = new CelebrationScene();
    startSpy = vi.fn();
    keydownHandler = null;

    const textObject = {
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
    };

    (scene as any).scale = { width: 1024, height: 576 };
    (scene as any).add = {
      rectangle: vi.fn().mockReturnValue({}),
      text: vi.fn().mockReturnValue(textObject),
      circle: vi.fn().mockReturnValue({ destroy: vi.fn() }),
    };
    (scene as any).tweens = {
      add: vi.fn((config: { onComplete?: () => void }) => {
        config.onComplete?.();
      }),
    };
    (scene as any).cameras = {
      main: {
        fadeIn: vi.fn(),
        fadeOut: vi.fn(),
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (scene as any).input = {
      keyboard: {
        once: vi.fn((_event: string, cb: () => void) => {
          keydownHandler = cb;
        }),
      },
    };
    (scene as any).scene = { start: startSpy };
  });

  test('create celebrates, spawns confetti, and restarts', () => {
    scene.create({ score: 12, stars: 4, hearts: 4, circles: 4 });

    expect(synthAudioSpies.playCelebrationSound).toHaveBeenCalled();
    expect((scene as any).add.circle).toHaveBeenCalled();

    keydownHandler?.();

    expect(synthAudioSpies.destroy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalledWith(SCENES.START);
  });
});
