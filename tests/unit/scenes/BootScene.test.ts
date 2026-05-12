import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BootScene } from '../../../src/scenes/BootScene';
import { SCENES } from '../../../src/config/constants';

describe('BootScene', () => {
  let scene: BootScene;
  let startSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scene = new BootScene();
    startSpy = vi.fn();
    (scene as any).scene = { start: startSpy };
  });

  test('preload logs and create transitions to StartScene', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    scene.preload();
    scene.create();

    expect(startSpy).toHaveBeenCalledWith(SCENES.START);
    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });
});
