import { describe, test, expect, vi, beforeEach } from 'vitest';
import { StartScene } from '../../../src/scenes/StartScene';
import { SCENES } from '../../../src/config/constants';

const synthAudioSpies = {
  resume: vi.fn(),
  playCollectSound: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('../../../src/entities/Player', () => ({
  Player: class Player {
    constructor() {}
  },
}));

vi.mock('../../../src/systems/SynthAudioManager', () => ({
  SynthAudioManager: class SynthAudioManager {
    resume = synthAudioSpies.resume;
    playCollectSound = synthAudioSpies.playCollectSound;
    destroy = synthAudioSpies.destroy;
  },
}));

describe('StartScene', () => {
  let scene: StartScene;
  let startSpy: ReturnType<typeof vi.fn>;
  let keydownHandler: (() => void) | null;

  beforeEach(() => {
    scene = new StartScene();
    startSpy = vi.fn();
    keydownHandler = null;

    const textObject = {
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn(),
      setText: vi.fn().mockReturnThis(),
    };

    (scene as any).scale = { width: 800, height: 600 };
    (scene as any).add = {
      rectangle: vi.fn().mockReturnValue({}),
      text: vi.fn().mockReturnValue(textObject),
    };
    (scene as any).tweens = { add: vi.fn() };
    (scene as any).input = {
      keyboard: {
        once: vi.fn((_event: string, cb: () => void) => {
          keydownHandler = cb;
        }),
      },
    };
    (scene as any).cameras = {
      main: {
        fadeOut: vi.fn(),
        once: vi.fn((_event: string, cb: () => void) => cb()),
      },
    };
    (scene as any).scene = { start: startSpy };
  });

  test('create wires keydown to start the game', () => {
    scene.create();

    expect(synthAudioSpies.resume).toHaveBeenCalled();
    expect(keydownHandler).toBeTypeOf('function');

    keydownHandler?.();

    expect(synthAudioSpies.playCollectSound).toHaveBeenCalledWith('star');
    expect(synthAudioSpies.destroy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalledWith(SCENES.GAME);
  });
});
