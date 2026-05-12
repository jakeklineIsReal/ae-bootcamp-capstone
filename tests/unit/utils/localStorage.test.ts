/**
 * LocalStorage Utility Tests
 * 
 * Tests for localStorage utilities with emphasis on:
 * - Preference persistence
 * - Error handling
 * - Default values
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  savePreferences,
  loadPreferences,
  clearPreferences,
  isLocalStorageAvailable,
  type GamePreferences,
} from '../../../src/utils/localStorage';

describe('LocalStorage Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('LocalStorage Availability', () => {
    test('isLocalStorageAvailable returns true when available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    test('isLocalStorageAvailable handles localStorage errors', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });
      
      const result = isLocalStorageAvailable();
      
      localStorage.setItem = originalSetItem;
      expect(result).toBe(false);
    });
  });

  describe('Save Preferences', () => {
    test('savePreferences stores preferences in localStorage', () => {
      const prefs: GamePreferences = {
        helmetColor: 'red',
        scooterDesign: 'flames',
        musicVolume: 0.7,
      };
      
      savePreferences(prefs);
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('saves helmet color preference', () => {
      const prefs: GamePreferences = { helmetColor: 'blue' };
      
      savePreferences(prefs);
      const stored = JSON.parse(localStorage.getItem('wyatt-scooter-preferences') || '{}');
      
      expect(stored.helmetColor).toBe('blue');
    });

    test('saves scooter design preference', () => {
      const prefs: GamePreferences = { scooterDesign: 'racing' };
      
      savePreferences(prefs);
      const stored = JSON.parse(localStorage.getItem('wyatt-scooter-preferences') || '{}');
      
      expect(stored.scooterDesign).toBe('racing');
    });

    test('saves volume preferences', () => {
      const prefs: GamePreferences = {
        musicVolume: 0.5,
        sfxVolume: 0.6,
        voiceVolume: 0.7,
      };
      
      savePreferences(prefs);
      const stored = JSON.parse(localStorage.getItem('wyatt-scooter-preferences') || '{}');
      
      expect(stored.musicVolume).toBe(0.5);
      expect(stored.sfxVolume).toBe(0.6);
      expect(stored.voiceVolume).toBe(0.7);
    });

    test('saves empty preferences object', () => {
      savePreferences({});
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('overwrites previous preferences', () => {
      savePreferences({ helmetColor: 'red' });
      savePreferences({ helmetColor: 'blue' });
      
      const stored = JSON.parse(localStorage.getItem('wyatt-scooter-preferences') || '{}');
      expect(stored.helmetColor).toBe('blue');
    });

    test('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });
      
      expect(() => savePreferences({ helmetColor: 'red' })).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Load Preferences', () => {
    test('loadPreferences returns saved preferences', () => {
      const prefs: GamePreferences = {
        helmetColor: 'green',
        scooterDesign: 'default',
      };
      
      savePreferences(prefs);
      const loaded = loadPreferences();
      
      expect(loaded.helmetColor).toBe('green');
      expect(loaded.scooterDesign).toBe('default');
    });

    test('returns default preferences when nothing saved', () => {
      const prefs = loadPreferences();
      
      expect(prefs).toBeDefined();
      expect(prefs.helmetColor).toBe('blue');
      expect(prefs.scooterDesign).toBe('default');
      expect(prefs.musicVolume).toBe(0.5);
      expect(prefs.sfxVolume).toBe(0.6);
      expect(prefs.voiceVolume).toBe(0.7);
    });

    test('loads helmet color preference', () => {
      savePreferences({ helmetColor: 'yellow' });
      const loaded = loadPreferences();
      
      expect(loaded.helmetColor).toBe('yellow');
    });

    test('loads volume preferences', () => {
      savePreferences({
        musicVolume: 0.3,
        sfxVolume: 0.4,
        voiceVolume: 0.5,
      });
      const loaded = loadPreferences();
      
      expect(loaded.musicVolume).toBe(0.3);
      expect(loaded.sfxVolume).toBe(0.4);
      expect(loaded.voiceVolume).toBe(0.5);
    });

    test('handles corrupted data gracefully', () => {
      localStorage.setItem('wyatt-scooter-preferences', 'invalid-json{');
      
      const prefs = loadPreferences();
      
      // Should return defaults when data is corrupted
      expect(prefs.helmetColor).toBe('blue');
    });

    test('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.getItem = vi.fn(() => {
        throw new Error('Read error');
      });
      
      const prefs = loadPreferences();
      
      expect(prefs).toBeDefined();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Clear Preferences', () => {
    test('clearPreferences removes saved data', () => {
      savePreferences({ helmetColor: 'red' });
      clearPreferences();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('wyatt-scooter-preferences');
    });

    test('after clear, loadPreferences returns defaults', () => {
      savePreferences({ helmetColor: 'red' });
      clearPreferences();
      
      const prefs = loadPreferences();
      
      expect(prefs.helmetColor).toBe('blue'); // Default
    });

    test('clearPreferences works when nothing saved', () => {
      expect(() => clearPreferences()).not.toThrow();
    });

    test('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Remove error');
      });
      
      expect(() => clearPreferences()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Preference Types', () => {
    test('handles partial preferences', () => {
      const partial: GamePreferences = { helmetColor: 'purple' };
      
      savePreferences(partial);
      const loaded = loadPreferences();
      
      expect(loaded.helmetColor).toBe('purple');
    });

    test('preserves all valid preference fields', () => {
      const prefs: GamePreferences = {
        helmetColor: 'orange',
        scooterDesign: 'flames',
        musicVolume: 0.4,
        sfxVolume: 0.5,
        voiceVolume: 0.6,
      };
      
      savePreferences(prefs);
      const loaded = loadPreferences();
      
      expect(loaded).toEqual(prefs);
    });
  });

  describe('Storage Key', () => {
    test('uses correct storage key prefix', () => {
      savePreferences({ helmetColor: 'red' });
      
      const key = 'wyatt-scooter-preferences';
      expect(localStorage.setItem).toHaveBeenCalledWith(
        key,
        expect.any(String)
      );
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid save/load cycles', () => {
      for (let i = 0; i < 10; i++) {
        savePreferences({ helmetColor: `color${i}` });
        const loaded = loadPreferences();
        expect(loaded.helmetColor).toBe(`color${i}`);
      }
    });

    test('handles very large preference objects', () => {
      const large: GamePreferences = {
        helmetColor: 'a'.repeat(1000),
        scooterDesign: 'b'.repeat(1000),
      };
      
      expect(() => savePreferences(large)).not.toThrow();
    });

    test('multiple clear operations are safe', () => {
      clearPreferences();
      clearPreferences();
      clearPreferences();
      
      const prefs = loadPreferences();
      expect(prefs.helmetColor).toBe('blue');
    });
  });

  describe('Constitutional Compliance', () => {
    test('default preferences include safe helmet color', () => {
      const prefs = loadPreferences();
      
      // Helmet color should always be defined (Safety-First)
      expect(prefs.helmetColor).toBeDefined();
    });

    test('preferences persist across sessions', () => {
      savePreferences({ helmetColor: 'custom-red' });
      
      // Simulate new session by loading again
      const loaded = loadPreferences();
      
      expect(loaded.helmetColor).toBe('custom-red');
    });

    test('volume preferences have reasonable defaults', () => {
      const prefs = loadPreferences();
      
      // Volumes should be in 0-1 range
      expect(prefs.musicVolume).toBeGreaterThanOrEqual(0);
      expect(prefs.musicVolume).toBeLessThanOrEqual(1);
      expect(prefs.sfxVolume).toBeGreaterThanOrEqual(0);
      expect(prefs.sfxVolume).toBeLessThanOrEqual(1);
      expect(prefs.voiceVolume).toBeGreaterThanOrEqual(0);
      expect(prefs.voiceVolume).toBeLessThanOrEqual(1);
    });
  });
});
