import Phaser from 'phaser';
import { PLAYER } from '../config/constants';

/**
 * Player Entity
 * Represents Wyatt character with helmet (always visible for safety messaging)
 * Requirements: FR-001, FR-014 - Player character with helmet
 */
export class Player extends Phaser.GameObjects.Container {
  declare body: Phaser.Physics.Arcade.Body;
  
  private sprite!: Phaser.GameObjects.Rectangle;
  private helmet!: Phaser.GameObjects.Arc;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private onGround: boolean = false;
  public playerState: 'idle' | 'walking' | 'jumping' = 'idle';
  
  // Customization
  private helmetColor: number = 0x4a90e2; // Default blue

  constructor(scene: Phaser.Scene, x: number, y: number, helmetColor?: number) {
    super(scene, x, y);
    
    if (helmetColor) {
      this.helmetColor = helmetColor;
    }
    
    this.createSprite();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Configure physics body
    this.body.setSize(PLAYER.WIDTH, PLAYER.HEIGHT);
    this.body.setCollideWorldBounds(true);
    // Use world gravity (800) - player will fall naturally
  }

  private createSprite(): void {
    // Scooter base (at bottom)
    const scooter = this.scene.add.graphics();
    scooter.fillStyle(0x888888, 1); // Gray scooter
    scooter.lineStyle(2, 0x444444, 1);
    // Deck
    scooter.fillRect(-25, PLAYER.HEIGHT / 2 - 15, 50, 8);
    scooter.strokeRect(-25, PLAYER.HEIGHT / 2 - 15, 50, 8);
    // Handle pole
    scooter.lineStyle(3, 0x444444, 1);
    scooter.lineBetween(15, PLAYER.HEIGHT / 2 - 15, 15, -PLAYER.HEIGHT / 2 + 10);
    // Wheels (circles)
    scooter.fillStyle(0x222222, 1);
    scooter.fillCircle(-15, PLAYER.HEIGHT / 2 - 5, 8); // Back wheel
    scooter.fillCircle(20, PLAYER.HEIGHT / 2 - 5, 8); // Front wheel
    this.add(scooter);
    
    // Player body (brown for Wyatt)
    this.sprite = this.scene.add.rectangle(0, -10, PLAYER.WIDTH - 10, PLAYER.HEIGHT - 20, 0x8b4513);
    this.add(this.sprite);
    
    // Ninja Turtles/Monster Truck shirt (green for turtles)
    const shirt = this.scene.add.rectangle(0, 5, PLAYER.WIDTH - 12, 25, 0x228b22);
    this.add(shirt);
    
    // Red shoes at bottom
    const shoes = this.scene.add.rectangle(0, PLAYER.HEIGHT / 2 - 15, PLAYER.WIDTH - 10, 12, 0xff0000);
    this.add(shoes);
    
    // Brown shaggy hair at top
    const hair = this.scene.add.graphics();
    hair.fillStyle(0x654321, 1);
    // Multiple circles for shaggy hair effect
    for (let i = 0; i < 5; i++) {
      const x = -15 + i * 8;
      const y = -PLAYER.HEIGHT / 2 + 5;
      hair.fillCircle(x, y, 6);
    }
    this.add(hair);
    
    // Helmet (ALWAYS VISIBLE - constitutional requirement)
    // Positioned at top of sprite covering hair
    this.helmet = this.scene.add.arc(0, -PLAYER.HEIGHT / 2 + 5, 22, 0, 180, false, this.helmetColor);
    this.helmet.setStrokeStyle(2, 0x000000);
    this.add(this.helmet);
    
    // Simple face (eyes)
    const leftEye = this.scene.add.circle(-8, -5, 3, 0x000000);
    const rightEye = this.scene.add.circle(8, -5, 3, 0x000000);
    this.add(leftEye);
    this.add(rightEye);
  }

  /**
   * Move right (forward)
   */
  moveRight(): void {
    this.velocityX = PLAYER.WALK_SPEED;
    this.playerState = 'walking';
  }

  /**
   * Jump action (single button press)
   */
  jump(): void {
    if (this.onGround) {
      this.velocityY = PLAYER.JUMP_VELOCITY;
      this.playerState = 'jumping';
      this.onGround = false;
    }
  }

  /**
   * Stop horizontal movement
   */
  stop(): void {
    this.velocityX = 0;
    if (this.onGround) {
      this.playerState = 'idle';
    }
  }

  /**
   * Apply velocity to physics body
   */
  update(): void {
    // Apply velocities
    this.body.setVelocityX(this.velocityX);
    this.body.setVelocityY(this.velocityY);
    
    // Check if on ground (for jump logic)
    this.onGround = this.body.touching.down;
    
    if (this.onGround && this.playerState === 'jumping') {
      this.playerState = this.velocityX > 0 ? 'walking' : 'idle';
    }
    
    // Clamp velocities
    this.body.velocity.x = Phaser.Math.Clamp(this.body.velocity.x, -PLAYER.MAX_VELOCITY_X, PLAYER.MAX_VELOCITY_X);
    this.body.velocity.y = Phaser.Math.Clamp(this.body.velocity.y, -PLAYER.MAX_VELOCITY_Y, PLAYER.MAX_VELOCITY_Y);
  }

  /**
   * Slow player (for obstacle interactions)
   */
  slow(factor: number): void {
    this.velocityX *= factor;
  }

  /**
   * Get current state
   */
  getState(): string {
    return this.playerState;
  }

  /**
   * Check if player is on ground
   */
  isOnGround(): boolean {
    return this.onGround;
  }

  /**
   * Set helmet color for customization
   */
  setHelmetColor(color: number): void {
    this.helmetColor = color;
    this.helmet.setFillStyle(color);
  }
}
