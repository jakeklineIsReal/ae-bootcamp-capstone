import Phaser from 'phaser';

/**
 * Obstacle Entity
 * Puddles, rocks, hills - slow but never stop player (no failure states)
 * Requirement: FR-007 - Gentle obstacle interactions
 */
export class Obstacle extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;
  public type: 'puddle' | 'rock' | 'hill';
  private slowFactor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: 'puddle' | 'rock' | 'hill'
  ) {
    // Different colors and sizes for different obstacle types
    let width = 60;
    let height = 30;
    let color = 0x6495ed;

    switch (type) {
      case 'puddle':
        width = 80;
        height = 20;
        color = 0x4169e1; // Blue
        break;
      case 'rock':
        width = 50;
        height = 50;
        color = 0x696969; // Gray
        break;
      case 'hill':
        width = 100;
        height = 60;
        color = 0x8b7355; // Brown
        break;
    }

    super(scene, x, y, width, height, color);
    this.type = type;
    
    // Set slow factor based on type
    switch (type) {
      case 'puddle':
        this.slowFactor = 0.5;
        break;
      case 'rock':
        this.slowFactor = 0.4;
        break;
      case 'hill':
        this.slowFactor = 0.6;
        break;
    }

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
  }

  /**
   * Get slow factor for this obstacle
   */
  getSlowFactor(): number {
    return this.slowFactor;
  }
}
