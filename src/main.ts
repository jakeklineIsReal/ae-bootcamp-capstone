import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import { CelebrationScene } from './scenes/CelebrationScene';

/**
 * Main Entry Point
 * Initializes Phaser game with all scenes
 */

// Register all scenes
const config: Phaser.Types.Core.GameConfig = {
  ...gameConfig,
  scene: [
    BootScene,
    StartScene,
    GameScene,
    CelebrationScene,
  ],
};

// Create game instance
const game = new Phaser.Game(config);

// Hide loading text once game is ready
game.events.once('ready', () => {
  const loadingText = document.getElementById('loading-text');
  if (loadingText) {
    loadingText.style.display = 'none';
  }
});

// Log game initialization
console.log('Wyatt\'s Scooter Adventure - Game Initialized');
console.log('Press F12 to open Developer Console for debug info');

// Export for potential debugging
export default game;
