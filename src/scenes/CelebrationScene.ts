import Phaser from 'phaser';
import { SCENES, FRIENDS } from '../config/constants';
import { Friend } from '../entities/Friend';

/**
 * CelebrationScene
 * Shows friends celebrating at the park when player arrives
 * Requirement: FR-005 - Journey completes with friend celebration
 */
export class CelebrationScene extends Phaser.Scene {
  private friends!: Friend[];

  constructor() {
    super({ key: SCENES.CELEBRATION });
  }

  create(data: { score?: number }): void {
    console.log('CelebrationScene: create');
    
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
    
    // Display score if available
    if (data.score !== undefined) {
      this.add.text(width / 2, 230, `Items Collected: ${data.score}`, {
        fontSize: '24px',
        color: '#ffffff',
      }).setOrigin(0.5);
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
      this.scene.start(SCENES.START);
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
}
