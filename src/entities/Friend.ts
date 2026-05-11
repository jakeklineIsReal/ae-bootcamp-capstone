import Phaser from 'phaser';
import { FRIENDS } from '../config/constants';

/**
 * Friend Character Entity
 * Nico, Marcus, Otto - celebrating at the park
 * Requirement: FR-015 - Friend characters with helmets
 */
export class Friend extends Phaser.GameObjects.Container {
  public name: string;
  
  private sprite!: Phaser.GameObjects.Rectangle;
  private helmet!: Phaser.GameObjects.Arc;
  private isCelebrating: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: 'Nico' | 'Marcus' | 'Otto'
  ) {
    super(scene, x, y);
    this.name = name;
    
    this.createSprite();
    scene.add.existing(this);
  }

  private createSprite(): void {
    let height = 90; // Base height
    let bodyColor = 0x8b4513; // Brown
    let helmetColor = 0x4a90e2; // Blue

    // Customize based on friend
    switch (this.name) {
      case FRIENDS.NICO:
        height = 100; // Taller
        helmetColor = 0x0000ff; // Blue
        break;
      case FRIENDS.MARCUS:
        height = 80; // Shorter
        helmetColor = 0x00ff00; // Green
        break;
      case FRIENDS.OTTO:
        height = 90; // Similar
        bodyColor = 0xd2691e; // Auburn
        helmetColor = 0xffff00; // Yellow
        break;
    }

    // Friend body
    this.sprite = this.scene.add.rectangle(0, 0, 60, height, bodyColor);
    this.add(this.sprite);
    
    // Helmet (ALWAYS VISIBLE - constitutional requirement)
    this.helmet = this.scene.add.circle(0, -height / 2, 18, helmetColor);
    this.add(this.helmet);
  }

  /**
   * Start celebration animation
   */
  celebrate(): void {
    this.isCelebrating = true;
    
    // Simple bounce animation
    this.scene.tweens.add({
      targets: this,
      y: this.y - 20,
      duration: 300,
      yoyo: true,
      repeat: -1, // Infinite
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Stop celebration
   */
  stopCelebrating(): void {
    this.isCelebrating = false;
    this.scene.tweens.killTweensOf(this);
  }

  /**
   * Check if celebrating
   */
  isCelebratingState(): boolean {
    return this.isCelebrating;
  }
}
