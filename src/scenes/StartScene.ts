import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { Player } from '../entities/Player';
import { SynthAudioManager } from '../systems/SynthAudioManager';

/**
 * StartScene
 * Start screen with character preview and instructions
 * Requirement: FR-018 - Customization UI (basic implementation)
 */
export class StartScene extends Phaser.Scene {
  private player!: Player;
  private synthAudio!: SynthAudioManager;

  constructor() {
    super({ key: SCENES.START });
  }

  create(): void {
    console.log('StartScene: create');

    document.documentElement?.setAttribute('data-scene', SCENES.START);
    
    // Initialize audio
    this.synthAudio = new SynthAudioManager();
    this.synthAudio.resume();
    
    const { width, height } = this.scale;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x667eea);
    
    // Title
    this.add.text(width / 2, 80, "Wyatt's Scooter Adventure", {
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);
    
    // Character preview with helmet
    this.add.text(width / 2, 200, 'Ready to ride to the park?', {
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Show player character preview
    this.player = new Player(this, width / 2, 300);
    
    // Suppress unused warning - player reference maintained for potential customization
    void this.player;
    
    // Instructions
    this.add.text(width / 2, 420, 'Controls:', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 460, 'RIGHT or D to scoot (auto-moves)', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 490, 'SPACE or W or UP to jump', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Start instruction
    const startText = this.add.text(width / 2, height - 80, 'Press ANY KEY to Start', {
      fontSize: '32px',
      color: '#ffff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Pulse animation for start text
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Start game on any key press
    this.input.keyboard?.once('keydown', () => {
      // Play start sound
      this.synthAudio.playCollectSound('star');
      
      // Fade out transition (T116)
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.synthAudio.destroy();
        this.scene.start(SCENES.GAME);
      });
    });
  }
}
