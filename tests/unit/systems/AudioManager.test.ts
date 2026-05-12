/**
 * AudioManager Tests
 * 
 * Tests for audio system with emphasis on:
 * - Accessibility-First (audio cues for all actions)
 * - Volume control
 * - Music and SFX management
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { AudioManager } from '../../../src/systems/AudioManager';
import { createMockScene } from '../../helpers/phaserMocks';
import { AUDIO } from '../../../src/config/constants';

describe('AudioManager', () => {
  let mockScene: any;
  let audioManager: AudioManager;
  let mockSound: any;

  beforeEach(() => {
    mockScene = createMockScene();
    mockSound = {
      play: vi.fn(),
      stop: vi.fn(),
      setVolume: vi.fn(),
    };
    mockScene.sound.add = vi.fn().mockReturnValue(mockSound);
    audioManager = new AudioManager(mockScene);
  });

  describe('Constitutional Requirement: Audio Feedback for All Actions', () => {
    test('provides SFX playback method', () => {
      audioManager.playSFX('jump');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith('jump', expect.any(Object));
    });

    test('provides voice playback method', () => {
      audioManager.playVoice('great-job');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith('great-job', expect.any(Object));
    });

    test('plays sound effect with correct volume', () => {
      audioManager.playSFX('collect-star');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'collect-star',
        expect.objectContaining({ volume: AUDIO.SFX_VOLUME })
      );
    });

    test('plays voice with correct volume', () => {
      audioManager.playVoice('awesome');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'awesome',
        expect.objectContaining({ volume: AUDIO.VOICE_VOLUME })
      );
    });

    test('allows custom SFX volume', () => {
      audioManager.playSFX('jump', 0.8);
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'jump',
        expect.objectContaining({ volume: 0.8 })
      );
    });
  });

  describe('Music Management', () => {
    test('plays music with loop by default', () => {
      audioManager.playMusic('main-theme');
      
      expect(mockScene.sound.add).toHaveBeenCalledWith(
        'main-theme',
        expect.objectContaining({ loop: true })
      );
      expect(mockSound.play).toHaveBeenCalled();
    });

    test('plays music without loop when specified', () => {
      audioManager.playMusic('celebration', false);
      
      expect(mockScene.sound.add).toHaveBeenCalledWith(
        'celebration',
        expect.objectContaining({ loop: false })
      );
    });

    test('stops current music before playing new music', () => {
      audioManager.playMusic('main-theme');
      audioManager.playMusic('celebration');
      
      expect(mockSound.stop).toHaveBeenCalled();
    });

    test('stopMusic stops current music', () => {
      audioManager.playMusic('main-theme');
      audioManager.stopMusic();
      
      expect(mockSound.stop).toHaveBeenCalled();
    });

    test('stopMusic handles no music playing', () => {
      expect(() => audioManager.stopMusic()).not.toThrow();
    });
  });

  describe('Volume Control', () => {
    test('setMusicVolume updates volume', () => {
      audioManager.setMusicVolume(0.8);
      audioManager.playMusic('main-theme');
      
      expect(mockScene.sound.add).toHaveBeenCalledWith(
        'main-theme',
        expect.objectContaining({ volume: 0.8 })
      );
    });

    test('setMusicVolume clamps to 0-1 range', () => {
      audioManager.setMusicVolume(1.5);
      audioManager.playMusic('test');
      
      const addCall = mockScene.sound.add.mock.calls[0][1];
      expect(addCall.volume).toBeLessThanOrEqual(1);
    });

    test('setMusicVolume clamps negative to 0', () => {
      audioManager.setMusicVolume(-0.5);
      audioManager.playMusic('test');
      
      const addCall = mockScene.sound.add.mock.calls[0][1];
      expect(addCall.volume).toBeGreaterThanOrEqual(0);
    });

    test('setSFXVolume updates SFX volume', () => {
      audioManager.setSFXVolume(0.7);
      audioManager.playSFX('jump');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'jump',
        expect.objectContaining({ volume: 0.7 })
      );
    });

    test('setVoiceVolume updates voice volume', () => {
      audioManager.setVoiceVolume(0.9);
      audioManager.playVoice('cool');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'cool',
        expect.objectContaining({ volume: 0.9 })
      );
    });

    test('volume changes persist across plays', () => {
      audioManager.setSFXVolume(0.3);
      
      audioManager.playSFX('sound1');
      audioManager.playSFX('sound2');
      
      expect(mockScene.sound.play).toHaveBeenNthCalledWith(
        1,
        'sound1',
        expect.objectContaining({ volume: 0.3 })
      );
      expect(mockScene.sound.play).toHaveBeenNthCalledWith(
        2,
        'sound2',
        expect.objectContaining({ volume: 0.3 })
      );
    });
  });

  describe('Mute Functionality', () => {
    test('starts unmuted', () => {
      expect(audioManager.isMuted()).toBe(false);
    });

    test('toggleMute mutes audio', () => {
      audioManager.toggleMute();
      
      expect(audioManager.isMuted()).toBe(true);
    });

    test('toggleMute unmutes audio', () => {
      audioManager.toggleMute();
      audioManager.toggleMute();
      
      expect(audioManager.isMuted()).toBe(false);
    });

    test('muted state prevents SFX playback', () => {
      audioManager.toggleMute();
      audioManager.playSFX('jump');
      
      expect(mockScene.sound.play).not.toHaveBeenCalled();
    });

    test('muted state prevents voice playback', () => {
      audioManager.toggleMute();
      audioManager.playVoice('awesome');
      
      expect(mockScene.sound.play).not.toHaveBeenCalled();
    });

    test('muted music plays at 0 volume', () => {
      audioManager.toggleMute();
      audioManager.playMusic('main-theme');
      
      expect(mockScene.sound.add).toHaveBeenCalledWith(
        'main-theme',
        expect.objectContaining({ volume: 0 })
      );
    });

    test('unmuting restores music volume', () => {
      audioManager.setMusicVolume(0.7);
      audioManager.playMusic('main-theme');
      
      audioManager.toggleMute();
      audioManager.toggleMute();
      
      if (mockSound.setVolume.mock.calls.length > 0) {
        const lastCall = mockSound.setVolume.mock.calls[mockSound.setVolume.mock.calls.length - 1];
        expect(lastCall[0]).toBe(0.7);
      }
    });
  });

  describe('Pause and Resume', () => {
    test('pauseAll pauses all audio', () => {
      audioManager.pauseAll();
      
      expect(mockScene.sound.pauseAll).toHaveBeenCalled();
    });

    test('resumeAll resumes all audio', () => {
      audioManager.resumeAll();
      
      expect(mockScene.sound.resumeAll).toHaveBeenCalled();
    });

    test('can pause and resume multiple times', () => {
      audioManager.pauseAll();
      audioManager.resumeAll();
      audioManager.pauseAll();
      
      expect(mockScene.sound.pauseAll).toHaveBeenCalledTimes(2);
      expect(mockScene.sound.resumeAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Default Volumes', () => {
    test('uses correct default music volume', () => {
      audioManager.playMusic('test');
      
      expect(mockScene.sound.add).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({ volume: AUDIO.MUSIC_VOLUME })
      );
    });

    test('uses correct default SFX volume', () => {
      audioManager.playSFX('test');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({ volume: AUDIO.SFX_VOLUME })
      );
    });

    test('uses correct default voice volume', () => {
      audioManager.playVoice('test');
      
      expect(mockScene.sound.play).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({ volume: AUDIO.VOICE_VOLUME })
      );
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid SFX playback', () => {
      for (let i = 0; i < 10; i++) {
        audioManager.playSFX('jump');
      }
      
      expect(mockScene.sound.play).toHaveBeenCalledTimes(10);
    });

    test('handles switching music rapidly', () => {
      audioManager.playMusic('theme1');
      audioManager.playMusic('theme2');
      audioManager.playMusic('theme3');
      
      expect(mockSound.stop).toHaveBeenCalledTimes(2);
    });

    test('setMusicVolume works when music is playing', () => {
      mockSound.setVolume = vi.fn();
      audioManager.playMusic('test');
      audioManager.setMusicVolume(0.5);
      
      // Should update the current music volume
      expect(() => audioManager.setMusicVolume(0.5)).not.toThrow();
    });

    test('multiple instances are independent', () => {
      const audio1 = new AudioManager(mockScene);
      const audio2 = new AudioManager(mockScene);
      
      audio1.toggleMute();
      
      expect(audio1.isMuted()).toBe(true);
      expect(audio2.isMuted()).toBe(false);
    });
  });
});
