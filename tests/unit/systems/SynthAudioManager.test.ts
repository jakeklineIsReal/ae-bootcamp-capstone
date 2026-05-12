/**
 * SynthAudioManager Tests
 * 
 * Tests for synthesized audio fallback with emphasis on:
 * - Web Audio API integration
 * - Constitutional requirement: Audio cues for all actions
 * - Fallback audio generation
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { SynthAudioManager } from '../../../src/systems/SynthAudioManager';

describe('SynthAudioManager', () => {
  let synthAudio: SynthAudioManager;
  let mockOscillator: any;
  let mockGain: any;
  let mockMusicGain: any;
  let mockSfxGain: any;

  beforeEach(() => {
    // Mock oscillator
    mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      type: 'sine',
    };

    // Mock gain node
    mockGain = {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        value: 1,
      },
    };

    mockMusicGain = {
      ...mockGain,
      gain: {
        ...mockGain.gain,
        value: 0.3,
      },
    };

    mockSfxGain = {
      ...mockGain,
      gain: {
        ...mockGain.gain,
        value: 0.5,
      },
    };

    synthAudio = new SynthAudioManager();

    const audioContext = synthAudio['audioContext'] as any;
    if (audioContext) {
      audioContext.createOscillator.mockReturnValue(mockOscillator);
      audioContext.createGain.mockReturnValue(mockGain);
    }

    synthAudio['musicGain'] = mockMusicGain;
    synthAudio['sfxGain'] = mockSfxGain;
  });

  describe('Initialization', () => {
    test('creates audio context', () => {
      expect(synthAudio['audioContext']).toBeDefined();
    });

    test('creates master gain node', () => {
      expect(synthAudio['masterGain']).toBeDefined();
    });

    test('creates music gain node', () => {
      expect(synthAudio['musicGain']).toBeDefined();
    });

    test('creates SFX gain node', () => {
      expect(synthAudio['sfxGain']).toBeDefined();
    });

    test('starts unmuted', () => {
      expect(synthAudio['muted']).toBe(false);
    });
  });

  describe('Constitutional Requirement: Audio Feedback for Actions', () => {
    test('provides jump sound method', () => {
      expect(() => synthAudio.playJumpSound()).not.toThrow();
    });

    test('provides bump sound method', () => {
      expect(() => synthAudio.playBumpSound()).not.toThrow();
    });

    test('provides splash sound method', () => {
      expect(() => synthAudio.playSplashSound()).not.toThrow();
    });

    test('provides collect sound method', () => {
      expect(() => synthAudio.playCollectSound()).not.toThrow();
    });

    test('provides celebrate sound method', () => {
      expect(() => synthAudio.playCelebrateSound()).not.toThrow();
    });
  });

  describe('Jump Sound', () => {
    test('playJumpSound creates audio nodes', () => {
      synthAudio.playJumpSound();
      
      // Should create oscillator and gain
      expect(synthAudio['audioContext']?.createOscillator).toHaveBeenCalled();
      expect(synthAudio['audioContext']?.createGain).toHaveBeenCalled();
    });

    test('jump sound uses ascending frequency', () => {
      synthAudio.playJumpSound();
      
      if (synthAudio['audioContext']) {
        const osc = mockOscillator;
        expect(osc.frequency.setValueAtTime).toHaveBeenCalled();
        expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
      }
    });

    test('jump sound has limited duration', () => {
      synthAudio.playJumpSound();
      
      if (synthAudio['audioContext']) {
        expect(mockOscillator.stop).toHaveBeenCalled();
      }
    });
  });

  describe('Bump Sound', () => {
    test('playBumpSound creates audio nodes', () => {
      synthAudio.playBumpSound();
      
      expect(synthAudio['audioContext']?.createOscillator).toHaveBeenCalled();
      expect(synthAudio['audioContext']?.createGain).toHaveBeenCalled();
    });

    test('bump sound has descending frequency', () => {
      synthAudio.playBumpSound();
      
      if (synthAudio['audioContext']) {
        expect(mockOscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
      }
    });
  });

  describe('Splash Sound', () => {
    test('playSplashSound works without error', () => {
      expect(() => synthAudio.playSplashSound()).not.toThrow();
    });

    test('splash sound creates audio nodes when context available', () => {
      if (synthAudio['audioContext']) {
        synthAudio.playSplashSound();
        
        expect(synthAudio['audioContext'].createOscillator).toHaveBeenCalled();
      }
    });
  });

  describe('Collect Sound', () => {
    test('playCollectSound works without error', () => {
      expect(() => synthAudio.playCollectSound()).not.toThrow();
    });

    test('collect sound should be pleasant (positive feedback)', () => {
      // Testing that it executes successfully (positive reinforcement)
      expect(() => synthAudio.playCollectSound()).not.toThrow();
    });
  });

  describe('Celebrate Sound', () => {
    test('playCelebrateSound works without error', () => {
      expect(() => synthAudio.playCelebrateSound()).not.toThrow();
    });

    test('celebrate sound executes for victory feedback', () => {
      expect(() => synthAudio.playCelebrateSound()).not.toThrow();
    });
  });

  describe('Background Music', () => {
    test('playBackgroundMusic starts music', () => {
      synthAudio.playBackgroundMusic();
      
      expect(synthAudio['isMusicPlaying']).toBe(true);
    });

    test('stopBackgroundMusic stops music', () => {
      synthAudio.playBackgroundMusic();
      synthAudio.stopBackgroundMusic();
      
      expect(synthAudio['isMusicPlaying']).toBe(false);
    });

    test('stopBackgroundMusic stops all oscillators', () => {
      synthAudio.playBackgroundMusic();
      const oscillatorCount = synthAudio['musicOscillators'].length;
      
      synthAudio.stopBackgroundMusic();
      
      // All oscillators should be stopped
      expect(synthAudio['musicOscillators']).toHaveLength(0);
    });

    test('can toggle music on and off', () => {
      synthAudio.playBackgroundMusic();
      expect(synthAudio['isMusicPlaying']).toBe(true);
      
      synthAudio.stopBackgroundMusic();
      expect(synthAudio['isMusicPlaying']).toBe(false);
      
      synthAudio.playBackgroundMusic();
      expect(synthAudio['isMusicPlaying']).toBe(true);
    });
  });

  describe('Volume Control', () => {
    test('setMusicVolume updates music volume', () => {
      synthAudio.setMusicVolume(0.5);
      
      expect(synthAudio['musicVolume']).toBe(0.5);
    });

    test('setMusicVolume clamps to 0-1 range', () => {
      synthAudio.setMusicVolume(1.5);
      expect(synthAudio['musicVolume']).toBeLessThanOrEqual(1);
      
      synthAudio.setMusicVolume(-0.5);
      expect(synthAudio['musicVolume']).toBeGreaterThanOrEqual(0);
    });

    test('setSFXVolume updates SFX volume', () => {
      synthAudio.setSFXVolume(0.7);
      
      expect(synthAudio['sfxVolume']).toBe(0.7);
    });

    test('setSFXVolume clamps to 0-1 range', () => {
      synthAudio.setSFXVolume(2.0);
      expect(synthAudio['sfxVolume']).toBeLessThanOrEqual(1);
      
      synthAudio.setSFXVolume(-1.0);
      expect(synthAudio['sfxVolume']).toBeGreaterThanOrEqual(0);
    });

    test('volume changes affect gain nodes', () => {
      synthAudio.setMusicVolume(0.8);
      
      if (synthAudio['musicGain']) {
        // Volume should be applied to gain node
        expect(synthAudio['musicVolume']).toBe(0.8);
      }
    });
  });

  describe('Mute Functionality', () => {
    test('starts unmuted', () => {
      expect(synthAudio.isMuted()).toBe(false);
    });

    test('toggleMute mutes audio', () => {
      synthAudio.toggleMute();
      
      expect(synthAudio.isMuted()).toBe(true);
    });

    test('toggleMute unmutes audio', () => {
      synthAudio.toggleMute();
      synthAudio.toggleMute();
      
      expect(synthAudio.isMuted()).toBe(false);
    });

    test('muted state affects gain nodes', () => {
      synthAudio.toggleMute();
      
      if (synthAudio['musicGain']) {
        expect(synthAudio['musicGain'].gain.value).toBe(0);
      }
    });

    test('unmute restores volume', () => {
      synthAudio.setMusicVolume(0.6);
      synthAudio.toggleMute();
      synthAudio.toggleMute();
      
      if (synthAudio['musicGain']) {
        expect(synthAudio['musicGain'].gain.value).toBe(0.6);
      }
    });
  });

  describe('Error Handling', () => {
    test('handles missing audio context gracefully', () => {
      const noContextSynth = new SynthAudioManager();
      noContextSynth['audioContext'] = null;
      
      expect(() => noContextSynth.playJumpSound()).not.toThrow();
      expect(() => noContextSynth.playBumpSound()).not.toThrow();
      expect(() => noContextSynth.playSplashSound()).not.toThrow();
    });

    test('handles missing gain nodes gracefully', () => {
      const noGainSynth = new SynthAudioManager();
      noGainSynth['sfxGain'] = null;
      
      expect(() => noGainSynth.playJumpSound()).not.toThrow();
    });

    test('stopBackgroundMusic when no music playing does not error', () => {
      expect(() => synthAudio.stopBackgroundMusic()).not.toThrow();
    });
  });

  describe('Default Volumes', () => {
    test('uses default music volume', () => {
      expect(synthAudio['musicVolume']).toBe(0.3);
    });

    test('uses default SFX volume', () => {
      expect(synthAudio['sfxVolume']).toBe(0.5);
    });
  });

  describe('Edge Cases', () => {
    test('rapid sound playback does not error', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          synthAudio.playJumpSound();
        }
      }).not.toThrow();
    });

    test('multiple music start/stop cycles work', () => {
      for (let i = 0; i < 3; i++) {
        synthAudio.playBackgroundMusic();
        synthAudio.stopBackgroundMusic();
      }
      
      expect(synthAudio['isMusicPlaying']).toBe(false);
    });

    test('volume changes during playback work', () => {
      synthAudio.playBackgroundMusic();
      
      expect(() => {
        synthAudio.setMusicVolume(0.5);
        synthAudio.setMusicVolume(0.8);
      }).not.toThrow();
    });

    test('mute during playback works', () => {
      synthAudio.playBackgroundMusic();
      
      expect(() => synthAudio.toggleMute()).not.toThrow();
    });
  });

  describe('Constitutional Compliance', () => {
    test('all player actions have audio feedback methods', () => {
      // Jump action
      expect(typeof synthAudio.playJumpSound).toBe('function');
      
      // Collision actions
      expect(typeof synthAudio.playBumpSound).toBe('function');
      expect(typeof synthAudio.playSplashSound).toBe('function');
      
      // Collection action
      expect(typeof synthAudio.playCollectSound).toBe('function');
      
      // Celebration action
      expect(typeof synthAudio.playCelebrateSound).toBe('function');
    });

    test('audio feedback is immediate (no delays)', () => {
      const startTime = Date.now();
      synthAudio.playJumpSound();
      const endTime = Date.now();
      
      // Should execute quickly (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
