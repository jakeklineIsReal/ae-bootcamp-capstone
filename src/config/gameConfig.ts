import Phaser from 'phaser';

/**
 * Phaser Game Configuration
 * Defines canvas size, physics, and scene registration
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 576,
  parent: 'game',
  backgroundColor: '#87CEEB', // Sky blue
  
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 }, // Gravity pulls down
      debug: true, // Set to true for development debugging
    },
  },
  
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  
  // Scenes will be registered in main.ts
  scene: [],
  
  // Performance settings
  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
  
  render: {
    pixelArt: false,
    antialias: true,
  },
  
  // Audio settings
  audio: {
    disableWebAudio: false,
  },
};
