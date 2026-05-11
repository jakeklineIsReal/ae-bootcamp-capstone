import Phaser from 'phaser';
import { SCENES, WORLD, CAMERA } from '../config/constants';
import { AudioManager } from '../systems/AudioManager';
import { ScoreManager } from '../systems/ScoreManager';
import { CollisionManager } from '../systems/CollisionManager';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';

/**
 * GameScene
 * Main gameplay scene with player movement, obstacles, and journey to park
 * Requirement: Core gameplay loop
 */
export class GameScene extends Phaser.Scene {
  // Managers
  private audioManager!: AudioManager;
  private scoreManager!: ScoreManager;
  private collisionManager!: CollisionManager;
  
  // Game objects
  private player!: Player;
  private obstacles!: Phaser.Physics.Arcade.Group;
  
  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  
  // UI
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressText!: Phaser.GameObjects.Text;
  
  // State
  private journeyDistance: number = 0;
  private isSlowed: boolean = false;
  private slowTimer: number = 0;

  constructor() {
    super({ key: SCENES.GAME });
  }

  create(): void {
    console.log('GameScene: create');
    
    // Initialize managers
    this.audioManager = new AudioManager(this);
    this.scoreManager = new ScoreManager();
    this.collisionManager = new CollisionManager(this);
    
    // Suppress audioManager unused warning - will be used for audio tasks
    void this.audioManager;
    
    // Setup world
    this.setupWorld();
    
    // Spawn player
    this.spawnPlayer();
    
    // Setup obstacles
    this.setupObstacles();
    
    // Setup input
    this.setupInput();
    
    // Setup UI
    this.setupUI();
    
    // Setup camera
    this.setupCamera();
    
    // Setup collision detection
    this.setupCollisions();
  }

  private setupWorld(): void {
    // Set world bounds
    this.physics.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
    
    // Create simple background (sky blue)
    this.add.rectangle(WORLD.WIDTH / 2, WORLD.HEIGHT / 2, WORLD.WIDTH, WORLD.HEIGHT, 0x87ceeb);
    
    // Create ground
    const ground = this.add.rectangle(WORLD.WIDTH / 2, WORLD.GROUND_Y, WORLD.WIDTH, 100, 0x228b22);
    this.physics.add.existing(ground, true); // Static body
  }

  private spawnPlayer(): void {
    // Spawn player at start position
    this.player = new Player(this, 100, WORLD.GROUND_Y - 100);
  }

  private setupObstacles(): void {
    this.obstacles = this.physics.add.group();
    
    // Place obstacles along the journey
    // Puddles, rocks, hills at various positions
    const obstaclePositions = [
      { x: 500, y: WORLD.GROUND_Y - 30, type: 'puddle' as const },
      { x: 800, y: WORLD.GROUND_Y - 50, type: 'rock' as const },
      { x: 1200, y: WORLD.GROUND_Y - 60, type: 'hill' as const },
      { x: 1600, y: WORLD.GROUND_Y - 30, type: 'puddle' as const },
      { x: 2000, y: WORLD.GROUND_Y - 50, type: 'rock' as const },
      { x: 2400, y: WORLD.GROUND_Y - 60, type: 'hill' as const },
      { x: 2800, y: WORLD.GROUND_Y - 30, type: 'puddle' as const },
      { x: 3200, y: WORLD.GROUND_Y - 50, type: 'rock' as const },
    ];
    
    obstaclePositions.forEach(pos => {
      const obstacle = new Obstacle(this, pos.x, pos.y, pos.type);
      this.obstacles.add(obstacle);
    });
  }

  private setupInput(): void {
    // Keyboard input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      
      // Jump on key press (audio feedback will be added)
      this.spaceKey.on('down', () => this.handleJump());
      this.wKey.on('down', () => this.handleJump());
      this.cursors.up?.on('down', () => this.handleJump());
    }
  }

  private setupUI(): void {
    const { width } = this.scale;
    
    // Progress bar background
    this.progressBar = this.add.graphics();
    this.progressBar.setScrollFactor(0); // Fixed to camera
    
    // Progress text
    this.progressText = this.add.text(width / 2, 30, '0%', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.progressText.setOrigin(0.5);
    this.progressText.setScrollFactor(0); // Fixed to camera
  }

  private setupCamera(): void {
    // Camera follows player with smooth lerp
    this.cameras.main.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
    this.cameras.main.startFollow(this.player, true, CAMERA.LERP_X, CAMERA.LERP_Y);
  }

  private setupCollisions(): void {
    // Player-obstacle overlap (not collision - obstacles don't block)
    this.collisionManager.setupOverlap(
      this.player,
      this.obstacles,
      this.handleObstacleHit.bind(this)
    );
  }

  private handleJump(): void {
    if (this.player.isOnGround()) {
      this.player.jump();
      // TODO: Play jump sound in audio implementation task
      console.log('Jump!');
    }
  }

  private handleObstacleHit(
    _playerObj: any,
    _obstacleObj: any
  ): void {
    const obstacle = _obstacleObj as Obstacle;
    
    // Slow player temporarily (no failure - just gentle feedback)
    this.isSlowed = true;
    this.slowTimer = 500; // 500ms slow duration
    
    // Apply slow effect
    const slowFactor = obstacle.getSlowFactor();
    this.player.slow(slowFactor);
    
    // TODO: Play obstacle sound based on type
    console.log(`Hit ${obstacle.type}! Slowed to ${slowFactor * 100}%`);
  }

  private updateMovement(): void {
    // Always try to move right (auto-runner style)
    // Player can optionally press D or Right to boost
    if (this.cursors.right?.isDown || this.dKey.isDown) {
      this.player.moveRight();
    } else {
      // Auto-move forward at base speed
      this.player.moveRight();
    }
  }

  private updateProgress(): void {
    // Calculate progress as percentage of journey
    this.journeyDistance = this.player.x;
    const progress = Math.min((this.journeyDistance / WORLD.PARK_X) * 100, 100);
    
    // Update progress UI
    this.progressText.setText(`${Math.floor(progress)}%`);
    
    // Draw progress bar
    this.progressBar.clear();
    this.progressBar.fillStyle(0x27ae60, 0.8);
    this.progressBar.fillRect(10, 10, (this.scale.width - 20) * (progress / 100), 20);
    
    // Check if reached park
    if (this.journeyDistance >= WORLD.PARK_X) {
      this.reachPark();
    }
  }

  private reachPark(): void {
    console.log('Reached the park!');
    // Transition to celebration scene
    this.scene.start(SCENES.CELEBRATION, {
      score: this.scoreManager.getTotal(),
    });
  }

  update(_time: number, delta: number): void {
    // Update player physics
    this.player.update();
    
    // Handle movement input
    this.updateMovement();
    
    // Update progress
    this.updateProgress();
    
    // Handle slow timer
    if (this.isSlowed) {
      this.slowTimer -= delta;
      if (this.slowTimer <= 0) {
        this.isSlowed = false;
      }
    }
  }
}
