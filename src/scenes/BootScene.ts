import Phaser from 'phaser';
import { SCENES } from '../config/constants';

/**
 * BootScene
 * Loads all game assets and initializes preferences
 * Requirement: Asset loading and initialization
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload(): void {
    // TODO: Load assets in Phase 3
    // For now, just a placeholder
    console.log('BootScene: preload');
  }

  create(): void {
    console.log('BootScene: create - transitioning to StartScene');
    
    // Transition to StartScene
    this.scene.start(SCENES.START);
  }
}
