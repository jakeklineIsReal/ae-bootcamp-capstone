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
    this.body.setGravityY(0); // Gravity handled by physics world
  }

  private createSprite(): void {
    // Player body (brown hair, red shoes - representing Wyatt)
    // Placeholder: Simple colored rectangle
    this.sprite = this.scene.add.rectangle(0, 0, PLAYER.WIDTH, PLAYER.HEIGHT, 0x8b4513);
    this.add(this.sprite);
    
    // Red shoes at bottom
    const shoes = this.scene.add.rectangle(0, PLAYER.HEIGHT / 2 - 5, PLAYER.WIDTH - 10, 10, 0xff0000);
    this.add(shoes);
    
    // Helmet (ALWAYS VISIBLE - constitutional requirement)
    // Positioned at top of sprite
    this.helmet = this.scene.add.circle(0, -PLAYER.HEIGHT / 2, 20, this.helmetColor);
    this.add(this.helmet);
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
