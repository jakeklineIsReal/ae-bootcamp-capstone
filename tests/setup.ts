/**
 * Vitest Test Setup
 * Global mocks and utilities for testing Phaser-based game
 */

import { vi } from 'vitest';

// Mock Phaser to avoid jsdom canvas issues
vi.mock('phaser', () => ({
  default: {
    Scene: class Scene {
      scene: any;
      add: any;
      physics: any;
      input: any;
      cameras: any;
      tweens: any;
      scale: any;
      constructor(_config?: any) {}
    },
    AUTO: 0,
    Scale: {
      FIT: 0,
      CENTER_BOTH: 1,
    },
    Input: {
      Keyboard: {
        KeyCodes: {
          W: 87,
          D: 68,
          SPACE: 32,
        },
      },
    },
    GameObjects: {
      Container: class Container {
        scene: any;
        x: number;
        y: number;
        list: any[] = [];
        body: any;
        constructor(scene: any, x: number, y: number) {
          this.scene = scene;
          this.x = x;
          this.y = y;
          this.body = {
            velocity: { x: 0, y: 0 },
            touching: { down: false },
            blocked: {},
            setSize: vi.fn().mockReturnThis(),
            setCollideWorldBounds: vi.fn().mockReturnThis(),
            setVelocityX: vi.fn().mockReturnThis(),
            setVelocityY: vi.fn().mockReturnThis(),
          };
        }
        add(child: any) {
          this.list.push(child);
        }
      },
      Rectangle: class Rectangle {
        constructor(
          public scene: any,
          public x: number,
          public y: number,
          public width: number,
          public height: number,
          public fillColor: number
        ) {}
      },
      Arc: class Arc {
        visible = true;
        active = true;
        setFillStyle = vi.fn().mockReturnThis();
        setStrokeStyle = vi.fn().mockReturnThis();
      },
    },
    Sound: {
      WebAudioSound: class WebAudioSound {},
      HTML5AudioSound: class HTML5AudioSound {},
    },
    Math: {
      Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
      Between: (min: number, max: number) => Math.floor((min + max) / 2),
    },
    Utils: {
      Array: {
        GetRandom: (items: any[]) => items[0],
      },
    },
    Physics: {
      Arcade: {
        Body: class Body {},
      },
    },
  },
}));

// Mock Web Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    type: 'sine',
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      value: 1,
    },
  }),
  destination: {},
  currentTime: 0,
  resume: vi.fn(),
  close: vi.fn(),
}));

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: global.AudioContext,
});
Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: global.AudioContext,
});

// Mock localStorage with in-memory persistence
const localStorageStore = new Map<string, string>();
const defaultGetItem = (key: string) => {
  return localStorageStore.has(key) ? localStorageStore.get(key) ?? null : null;
};
const defaultSetItem = (key: string, value: string) => {
  localStorageStore.set(key, String(value));
};
const defaultRemoveItem = (key: string) => {
  localStorageStore.delete(key);
};
const defaultClear = () => {
  localStorageStore.clear();
};
const localStorageMock = {
  getItem: vi.fn(defaultGetItem),
  setItem: vi.fn(defaultSetItem),
  removeItem: vi.fn(defaultRemoveItem),
  clear: vi.fn(defaultClear),
};
global.localStorage = localStorageMock as any;
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

// Mock window.matchMedia (for responsive design tests if needed)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem = vi.fn(defaultGetItem);
  localStorageMock.setItem = vi.fn(defaultSetItem);
  localStorageMock.removeItem = vi.fn(defaultRemoveItem);
  localStorageMock.clear = vi.fn(defaultClear);
  localStorageStore.clear();
  window.localStorage = localStorageMock as any;
});
