/**
 * Game Constants
 * Centralized values for speeds, sizes, colors, and gameplay parameters
 */

// Player Movement
export const PLAYER = {
  WALK_SPEED: 200,
  JUMP_VELOCITY: -400,
  MAX_VELOCITY_X: 300,
  MAX_VELOCITY_Y: 600,
  WIDTH: 64,
  HEIGHT: 96,
} as const;

// World and Camera
export const WORLD = {
  WIDTH: 4000, // Total journey distance
  HEIGHT: 576,
  GROUND_Y: 480, // Y position of ground level
  PARK_X: 3800, // X position where park begins (end point)
} as const;

export const CAMERA = {
  LERP_X: 0.1, // Smooth horizontal follow
  LERP_Y: 0.05, // Smoother vertical follow
} as const;

// Obstacle Parameters
export const OBSTACLE = {
  PUDDLE_SLOW: 0.5, // Multiply player speed by this
  ROCK_SLOW: 0.4,
  HILL_SLOW: 0.6,
  EFFECT_DURATION: 500, // ms
} as const;

// Collectible Parameters
export const COLLECTIBLE = {
  FLOAT_AMPLITUDE: 10, // Pixels up/down
  FLOAT_SPEED: 0.002, // Animation speed
  SIZE: 32,
} as const;

// Audio Settings
export const AUDIO = {
  MUSIC_VOLUME: 0.5,
  SFX_VOLUME: 0.6,
  VOICE_VOLUME: 0.7,
} as const;

// UI Colors (High Contrast for WCAG AA)
export const COLORS = {
  PRIMARY: 0x4a90e2,
  SECONDARY: 0xf39c12,
  SUCCESS: 0x27ae60,
  WARNING: 0xe74c3c,
  TEXT_LIGHT: 0xffffff,
  TEXT_DARK: 0x2c3e50,
  BACKGROUND: 0x87ceeb,
} as const;

// Collectible Types
export const COLLECTIBLE_TYPES = {
  STAR: 'star',
  HEART: 'heart',
  CIRCLE: 'circle',
} as const;

// Friend Names
export const FRIENDS = {
  NICO: 'Nico',
  MARCUS: 'Marcus',
  OTTO: 'Otto',
} as const;

// Scene Keys
export const SCENES = {
  BOOT: 'BootScene',
  START: 'StartScene',
  GAME: 'GameScene',
  CELEBRATION: 'CelebrationScene',
} as const;

// Input Keys
export const INPUT = {
  JUMP_KEYS: ['UP', 'W', 'SPACE'],
  TRICK_KEYS: ['SHIFT', 'T'],
  PAUSE_KEYS: ['ESC', 'P'],
} as const;

// Performance Targets
export const PERFORMANCE = {
  MIN_FPS: 30,
  TARGET_FPS: 60,
  LOAD_TIME_TARGET: 5000, // ms
} as const;
