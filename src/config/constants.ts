/**
 * Game Constants
 * Centralized values for speeds, sizes, colors, and gameplay parameters
 */

// Player Movement
const playerConstants = {
  WALK_SPEED: 200,
  JUMP_VELOCITY: -400,
  MAX_VELOCITY_X: 300,
  MAX_VELOCITY_Y: 600,
  WIDTH: 64,
  HEIGHT: 96,
} as const;
export const PLAYER = Object.freeze(playerConstants);

// World and Camera
const worldConstants = {
  WIDTH: 4000, // Total journey distance
  HEIGHT: 576,
  GROUND_Y: 480, // Y position of ground level
  PARK_X: 3800, // X position where park begins (end point)
} as const;
export const WORLD = Object.freeze(worldConstants);

const cameraConstants = {
  LERP_X: 0.1, // Smooth horizontal follow
  LERP_Y: 0.05, // Smoother vertical follow
} as const;
export const CAMERA = Object.freeze(cameraConstants);

// Obstacle Parameters
const obstacleConstants = {
  PUDDLE_SLOW: 0.5, // Multiply player speed by this
  ROCK_SLOW: 0.4,
  HILL_SLOW: 0.6,
  EFFECT_DURATION: 500, // ms
} as const;
export const OBSTACLE = Object.freeze(obstacleConstants);

// Collectible Parameters
const collectibleConstants = {
  FLOAT_AMPLITUDE: 10, // Pixels up/down
  FLOAT_SPEED: 0.002, // Animation speed
  SIZE: 32,
} as const;
export const COLLECTIBLE = Object.freeze(collectibleConstants);

// Audio Settings
const audioConstants = {
  MUSIC_VOLUME: 0.5,
  SFX_VOLUME: 0.6,
  VOICE_VOLUME: 0.7,
} as const;
export const AUDIO = Object.freeze(audioConstants);

// UI Colors (High Contrast for WCAG AA)
const colorConstants = {
  PRIMARY: 0x4a90e2,
  SECONDARY: 0xf39c12,
  SUCCESS: 0x27ae60,
  WARNING: 0xe74c3c,
  TEXT_LIGHT: 0xffffff,
  TEXT_DARK: 0x2c3e50,
  BACKGROUND: 0x87ceeb,
} as const;
export const COLORS = Object.freeze(colorConstants);

// Collectible Types
const collectibleTypeConstants = {
  STAR: 'star',
  HEART: 'heart',
  CIRCLE: 'circle',
} as const;
export const COLLECTIBLE_TYPES = Object.freeze(collectibleTypeConstants);

// Friend Names
const friendConstants = {
  NICO: 'Nico',
  MARCUS: 'Marcus',
  OTTO: 'Otto',
} as const;
export const FRIENDS = Object.freeze(friendConstants);

// Scene Keys
const sceneConstants = {
  BOOT: 'BootScene',
  START: 'StartScene',
  GAME: 'GameScene',
  CELEBRATION: 'CelebrationScene',
} as const;
export const SCENES = Object.freeze(sceneConstants);

// Input Keys
const inputConstants = {
  JUMP_KEYS: ['UP', 'W', 'SPACE'],
  TRICK_KEYS: ['SHIFT', 'T'],
  PAUSE_KEYS: ['ESC', 'P'],
} as const;
export const INPUT = Object.freeze(inputConstants);

// Performance Targets
const performanceConstants = {
  MIN_FPS: 30,
  TARGET_FPS: 60,
  LOAD_TIME_TARGET: 5000, // ms
} as const;
export const PERFORMANCE = Object.freeze(performanceConstants);
