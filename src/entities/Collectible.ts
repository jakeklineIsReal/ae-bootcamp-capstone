import Phaser from 'phaser';
import { COLLECTIBLE, COLLECTIBLE_TYPES } from '../config/constants';

/**
 * Collectible
 * Represents collectible items (stars, hearts, circles) along the journey
 * Requirements: FR-009 - Distinct shapes for accessibility
 */
export class Collectible extends Phaser.GameObjects.Container {
  public type: 'star' | 'heart' | 'circle';
  public collected: boolean = false;
  private shape!: Phaser.GameObjects.Graphics;
  private floatTween!: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: 'star' | 'heart' | 'circle'
  ) {
    super(scene, x, y);
    
    this.type = type;
    
    // Add to scene
    scene.add.existing(this);
    
    // Create visual shape
    this.createShape();
    
    // Add floating animation
    this.addFloatingAnimation();
    
    // Add physics body
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(COLLECTIBLE.SIZE / 2);
    body.setAllowGravity(false);
  }

  private createShape(): void {
    this.shape = this.scene.add.graphics();
    this.add(this.shape);
    
    const size = COLLECTIBLE.SIZE;
    
    switch (this.type) {
      case COLLECTIBLE_TYPES.STAR:
        // Star shape - bright yellow
        this.drawStar(this.shape, 0, 0, 5, size / 2, size / 4, 0xffff00);
        break;
        
      case COLLECTIBLE_TYPES.HEART:
        // Heart shape - red/pink
        this.drawHeart(this.shape, 0, 0, size / 2, 0xff1493);
        break;
        
      case COLLECTIBLE_TYPES.CIRCLE:
        // Circle shape - blue
        this.shape.fillStyle(0x00bfff, 1);
        this.shape.lineStyle(3, 0x0066cc, 1);
        this.shape.fillCircle(0, 0, size / 2);
        this.shape.strokeCircle(0, 0, size / 2);
        break;
    }
  }

  private drawStar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    points: number,
    outerRadius: number,
    innerRadius: number,
    fillColor: number
  ): void {
    const path: number[] = [];
    const step = Math.PI / points;
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2;
      path.push(x + Math.cos(angle) * radius);
      path.push(y + Math.sin(angle) * radius);
    }
    
    graphics.fillStyle(fillColor, 1);
    graphics.lineStyle(2, 0xffaa00, 1);
    graphics.beginPath();
    graphics.moveTo(path[0], path[1]);
    
    for (let i = 2; i < path.length; i += 2) {
      graphics.lineTo(path[i], path[i + 1]);
    }
    
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  private drawHeart(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    size: number,
    fillColor: number
  ): void {
    graphics.fillStyle(fillColor, 1);
    graphics.lineStyle(2, 0xc71585, 1);
    
    // Simplified heart shape using arcs and line
    const halfSize = size / 2;
    
    graphics.beginPath();
    
    // Draw left side (top-left circle + line to bottom point)
    graphics.arc(x - halfSize / 2, y - halfSize / 4, halfSize / 2, 0, Math.PI, true);
    graphics.lineTo(x, y + size);
    
    // Draw right side (top-right circle + line to bottom point)
    graphics.arc(x + halfSize / 2, y - halfSize / 4, halfSize / 2, 0, Math.PI, true);
    graphics.lineTo(x, y + size);
    
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  private addFloatingAnimation(): void {
    // Gentle up/down floating motion
    this.floatTween = this.scene.tweens.add({
      targets: this,
      y: this.y + COLLECTIBLE.FLOAT_AMPLITUDE,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Collect this item with particle effect
   */
  collect(): void {
    if (this.collected) return;
    
    this.collected = true;
    
    // Stop floating animation
    if (this.floatTween) {
      this.floatTween.stop();
    }
    
    // Particle sparkle effect
    this.addSparkleEffect();
    
    // Fade out and destroy
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  private addSparkleEffect(): void {
    // Create sparkle particles
    const colors = {
      star: 0xffff00,
      heart: 0xff1493,
      circle: 0x00bfff,
    };
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 30;
      const particle = this.scene.add.circle(
        this.x,
        this.y,
        3,
        colors[this.type]
      );
      
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * distance,
        y: particle.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  /**
   * Get point value for this collectible type
   */
  getPointValue(): number {
    switch (this.type) {
      case COLLECTIBLE_TYPES.STAR:
        return 10;
      case COLLECTIBLE_TYPES.HEART:
        return 5;
      case COLLECTIBLE_TYPES.CIRCLE:
        return 3;
      default:
        return 1;
    }
  }
}
