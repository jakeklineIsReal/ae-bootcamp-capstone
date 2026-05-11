/**
 * LocalStorage Utility
 * Save and load player customization preferences
 * Requirement: FR-018 - Customize appearance with persistence
 */

const STORAGE_KEY_PREFIX = 'wyatt-scooter-';

export interface GamePreferences {
  helmetColor?: string;
  scooterDesign?: string;
  musicVolume?: number;
  sfxVolume?: number;
  voiceVolume?: number;
}

/**
 * Save preferences to LocalStorage
 */
export function savePreferences(preferences: GamePreferences): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}preferences`;
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save preferences to LocalStorage:', error);
  }
}

/**
 * Load preferences from LocalStorage
 */
export function loadPreferences(): GamePreferences {
  try {
    const key = `${STORAGE_KEY_PREFIX}preferences`;
    const data = localStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load preferences from LocalStorage:', error);
  }
  
  // Return default preferences
  return {
    helmetColor: 'blue',
    scooterDesign: 'default',
    musicVolume: 0.5,
    sfxVolume: 0.6,
    voiceVolume: 0.7,
  };
}

/**
 * Clear all saved preferences
 */
export function clearPreferences(): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}preferences`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear preferences from LocalStorage:', error);
  }
}

/**
 * Check if LocalStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}
