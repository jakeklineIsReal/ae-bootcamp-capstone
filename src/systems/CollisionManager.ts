import Phaser from 'phaser';

/**
 * CollisionManager
 * Handles player collision with obstacles and collectibles
 * Implements forgiving collision (obstacles slow but never stop)
 * Requirement: FR-007 - Gentle obstacle interactions
 */
export class CollisionManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Handle player-obstacle collision
   * Obstacles slow the player but NEVER stop them (no failure states)
   * 
   * @param player - Player game object
   * @param obstacle - Obstacle game object with type property
   * @param onCollision - Callback with slow factor (0-1)
   */
  handleObstacleCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obstacle: Phaser.GameObjects.GameObject & { type?: string },
    onCollision: (slowFactor: number, obstacleType: string) => void
  ): void {
    // Determine slow factor based on obstacle type
    let slowFactor = 0.7; // Default slow
    const obstacleType = obstacle.type || 'unknown';

    switch (obstacleType) {
      case 'puddle':
        slowFactor = 0.5; // 50% speed
        break;
      case 'rock':
        slowFactor = 0.4; // 40% speed
        break;
      case 'hill':
        slowFactor = 0.6; // 60% speed
        break;
    }

    // Call the callback with slow factor
    onCollision(slowFactor, obstacleType);
  }

  /**
   * Handle player-collectible collision
   * 
   * @param player - Player game object
   * @param collectible - Collectible game object with type property
   * @param onCollect - Callback with collectible type
   */
  handleCollectibleCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    collectible: Phaser.GameObjects.GameObject & { type?: string },
    onCollect: (collectibleType: string) => void
  ): void {
    const collectibleType = collectible.type || 'unknown';
    
    // Hide the collectible (it's been collected)
    if ('setActive' in collectible && 'setVisible' in collectible) {
      (collectible as any).setActive(false);
      (collectible as any).setVisible(false);
    }

    // Call the callback
    onCollect(collectibleType);
  }

  /**
   * Setup collision between two physics groups
   */
  setupCollision(
    group1: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup | Phaser.Types.Physics.Arcade.GameObjectWithBody,
    group2: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup | Phaser.Types.Physics.Arcade.GameObjectWithBody,
    callback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
    processCallback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
  ): void {
    this.scene.physics.add.collider(group1, group2, callback, processCallback);
  }

  /**
   * Setup overlap detection (no physical collision, just detection)
   */
  setupOverlap(
    group1: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup | Phaser.Types.Physics.Arcade.GameObjectWithBody,
    group2: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup | Phaser.Types.Physics.Arcade.GameObjectWithBody,
    callback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
    processCallback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
  ): void {
    this.scene.physics.add.overlap(group1, group2, callback, processCallback);
  }
}
