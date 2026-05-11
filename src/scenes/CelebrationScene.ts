import Phaser from 'phaser';
import { SCENES, FRIENDS } from '../config/constants';
import { Friend } from '../entities/Friend';
import { SynthAudioManager } from '../systems/SynthAudioManager';

/**
 * CelebrationScene
 * Shows friends celebrating at the park when player arrives
 * Requirement: FR-005 - Journey completes with friend celebration
 */
export class CelebrationScene extends Phaser.Scene {
  private friends!: Friend[];
  private synthAudio!: SynthAudioManager;

  constructor() {
    super({ key: SCENES.CELEBRATION });
  }

  create(data: { score?: number; stars?: number; hearts?: number; circles?: number }): void {
    console.log('CelebrationScene: create');
    
    // Initialize audio and play celebration sound
    this.synthAudio = new SynthAudioManager();
    this.synthAudio.resume();
    this.synthAudio.playCelebrationSound();
    
    // Fade in transition (T116)
    this.cameras.main.fadeIn(500, 0, 0, 0);
    
    const { width, height } = this.scale;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb);
    
    // Park ground
    this.add.rectangle(width / 2, height - 50, width, 100, 0x228b22);
    
    // Celebration message
    this.add.text(width / 2, 100, 'You Made It!', {
      fontSize: '64px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 180, 'Great job, Wyatt!', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Display collection summary (T074)
    if (data.score !== undefined) {
      this.add.text(width / 2, 230, `Total Items Collected: ${data.score}`, {
        fontSize: '28px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);
      
      // Breakdown by type
      const breakdown = `⭐ ${data.stars || 0}  ❤️ ${data.hearts || 0}  ⚪ ${data.circles || 0}`;
      this.add.text(width / 2, 270, breakdown, {
        fontSize: '24px',
        color: '#ffffff',
      }).setOrigin(0.5);
      
      // T075: Bonus confetti if collected many items
      if (data.score >= 10) {
        this.addConfetti();
      }
    }
    
    // Create friends at park
    this.createFriends();
    
    // Replay button
    this.add.text(width / 2, height - 100, 'Press ANY KEY to Play Again', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Restart on any key press
    this.input.keyboard?.once('keydown', () => {
      // Fade out transition (T116)
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.synthAudio.destroy();
        this.scene.start(SCENES.START);
      });
    });
  }

  private createFriends(): void {
    const { width, height } = this.scale;
    
    // Position friends across the screen
    const friendPositions = [
      { name: FRIENDS.NICO as 'Nico', x: width / 2 - 150 },
      { name: FRIENDS.MARCUS as 'Marcus', x: width / 2 },
      { name: FRIENDS.OTTO as 'Otto', x: width / 2 + 150 },
    ];
    
    // Create friends and store reference
    this.friends = friendPositions.map(pos => {
      const friend = new Friend(this, pos.x, height - 150, pos.name);
      friend.celebrate(); // Start celebration animation
      return friend;
    });
    
    // Suppress unused warning - friends list maintained for potential future use
    void this.friends;
  }

  private addConfetti(): void {
    // T075: Bonus confetti effect for collecting many items
    const { width, height } = this.scale;
    const colors = [0xffff00, 0xff1493, 0x00bfff, 0xff00ff, 0x00ff00];
    
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-100, 0);
      const color = Phaser.Utils.Array.GetRandom(colors);
      const confetti = this.add.circle(x, y, 5, color);
      
      this.tweens.add({
        targets: confetti,
        y: height + 100,
        x: x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.Between(0, 360),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 3000),
        ease: 'Cubic.easeIn',
        onComplete: () => {
          confetti.destroy();
        },
      });
    }
  }
}
