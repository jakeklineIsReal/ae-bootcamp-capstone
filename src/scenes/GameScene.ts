import Phaser from 'phaser';
import { SCENES, WORLD, CAMERA, COLLECTIBLE } from '../config/constants';
import { AudioManager } from '../systems/AudioManager';
import { SynthAudioManager } from '../systems/SynthAudioManager';
import { ScoreManager } from '../systems/ScoreManager';
import { CollisionManager } from '../systems/CollisionManager';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';
import { Collectible } from '../entities/Collectible';

/**
 * GameScene
 * Main gameplay scene with player movement, obstacles, and journey to park
 * Requirement: Core gameplay loop
 */
export class GameScene extends Phaser.Scene {
  // Managers
  private audioManager!: AudioManager;
  private synthAudio!: SynthAudioManager;
  private scoreManager!: ScoreManager;
  private collisionManager!: CollisionManager;
  
  // Game objects
  private player!: Player;
  private ground!: Phaser.GameObjects.Rectangle;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.Group;
  
  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  
  // UI
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  
  // State
  private journeyDistance: number = 0;
  private isSlowed: boolean = false;
  private slowTimer: number = 0;
  private debugFrameCount: number = 0;
  private hasMarkedReady: boolean = false;

  constructor() {
    super({ key: SCENES.GAME });
  }

  create(): void {
    console.log('GameScene: create');

    document.documentElement?.setAttribute('data-scene', SCENES.GAME);
    this.markGameReady();
    
    // Initialize managers
    this.audioManager = new AudioManager(this);
    this.synthAudio = new SynthAudioManager();
    this.scoreManager = new ScoreManager();
    this.collisionManager = new CollisionManager(this);
    
    // Suppress audioManager unused warning - will be used for asset-based audio later
    void this.audioManager;
    
    // Resume audio context after user interaction
    this.synthAudio.resume();
    
    // Fade in transition (T116) - temporarily disabled for debugging
    // this.cameras.main.fadeIn(500, 0, 0, 0);
    console.log('Camera setup, skipping fade for debug');
    
    // Setup world
    this.setupWorld();
    
    // Spawn player
    this.spawnPlayer();
    
    // Setup obstacles
    
    // Setup collectibles (T068)
    this.setupCollectibles();
    this.setupObstacles();
    
    // Setup input
    this.setupInput();
    
    // Setup UI
    this.setupUI();
    
    // Setup camera
    this.setupCamera();
    
    // Setup collision detection
    this.setupCollisions();
    
    // Start background music (T045)
    this.synthAudio.playBackgroundMusic();
    
    // Add volume control UI (T048)
    this.setupVolumeControls();
    
    console.log('GameScene: create complete!');
  }

  private setupWorld(): void {
    console.log('GameScene: setupWorld');
    // Set world bounds
    this.physics.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
    
    // Create simple background (sky blue)
    const bg = this.add.rectangle(WORLD.WIDTH / 2, WORLD.HEIGHT / 2, WORLD.WIDTH, WORLD.HEIGHT, 0x87ceeb);
    bg.setDepth(-2); // Ensure it's behind everything
    console.log('Background created at', bg.x, bg.y, 'size:', WORLD.WIDTH, WORLD.HEIGHT);
    
    // Create ground
    this.ground = this.add.rectangle(WORLD.WIDTH / 2, WORLD.GROUND_Y, WORLD.WIDTH, 100, 0x228b22);
    this.ground.setDepth(-1);
    this.physics.add.existing(this.ground, true); // Static body
    console.log('Ground created at', this.ground.x, this.ground.y);
  }

  private spawnPlayer(): void {
    console.log('GameScene: spawnPlayer');
    // Spawn player at start position
    this.player = new Player(this, 100, WORLD.GROUND_Y - 100);
    console.log('Player spawned at', this.player.x, this.player.y);
  }

  private setupObstacles(): void {
    console.log('GameScene: setupObstacles');
    this.obstacles = this.physics.add.staticGroup();
    
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
      this.add.existing(obstacle);
      this.obstacles.add(obstacle);
    });
    console.log('Created', obstaclePositions.length, 'obstacles');
  }

  private setupCollectibles(): void {
    this.collectibles = this.physics.add.group({
      allowGravity: false,
    });
    
    // Place collectibles along the journey (T068)
    // Mix of stars, hearts, and circles
    const collectiblePositions = [
      { x: 400, y: WORLD.GROUND_Y - 150, type: 'star' as const },
      { x: 650, y: WORLD.GROUND_Y - 120, type: 'heart' as const },
      { x: 900, y: WORLD.GROUND_Y - 180, type: 'circle' as const },
      { x: 1100, y: WORLD.GROUND_Y - 100, type: 'star' as const },
      { x: 1400, y: WORLD.GROUND_Y - 160, type: 'heart' as const },
      { x: 1700, y: WORLD.GROUND_Y - 140, type: 'circle' as const },
      { x: 1900, y: WORLD.GROUND_Y - 190, type: 'star' as const },
      { x: 2200, y: WORLD.GROUND_Y - 110, type: 'heart' as const },
      { x: 2500, y: WORLD.GROUND_Y - 170, type: 'circle' as const },
      { x: 2700, y: WORLD.GROUND_Y - 130, type: 'star' as const },
      { x: 3000, y: WORLD.GROUND_Y - 150, type: 'heart' as const },
      { x: 3300, y: WORLD.GROUND_Y - 180, type: 'circle' as const },
      { x: 3500, y: WORLD.GROUND_Y - 120, type: 'star' as const },
      { x: 3700, y: WORLD.GROUND_Y - 160, type: 'heart' as const },
    ];
    
    collectiblePositions.forEach(pos => {
      const collectible = new Collectible(this, pos.x, pos.y, pos.type);
      this.add.existing(collectible);
      this.collectibles.add(collectible);
      // Configure physics body after adding to group
      const body = collectible.body as Phaser.Physics.Arcade.Body;
      if (body) {
        body.setCircle(COLLECTIBLE.SIZE / 2);
        body.setAllowGravity(false);
      }
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
    
    // Score text (T072 - top-left corner)
    this.scoreText = this.add.text(20, 70, this.getScoreText(), {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#00000080',
      padding: { x: 10, y: 5 },
    });
    this.scoreText.setScrollFactor(0);
  }

  private getScoreText(): string {
    const counts = this.scoreManager.getAllCounts();
    return `⭐ ${counts.stars}  ❤️ ${counts.hearts}  ⚪ ${counts.circles}  Total: ${this.scoreManager.getTotal()}`;
  }

  private setupCamera(): void {
    // Camera follows player with smooth lerp
    this.cameras.main.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
    this.cameras.main.startFollow(this.player, true, CAMERA.LERP_X, CAMERA.LERP_Y);
  }

  private setupCollisions(): void {
    // Player-ground collision (so player stands on ground)
    this.physics.add.collider(this.player, this.ground);
    
    // Player-obstacle overlap (not collision - obstacles don't block)
    this.collisionManager.setupOverlap(
      this.player,
      this.obstacles,
      this.handleObstacleHit.bind(this)
    );
    
    // Player-collectible overlap (T069)
    this.collisionManager.setupOverlap(
      this.player,
      this.collectibles,
      this.handleCollectiblePickup.bind(this)
    );
  }

  private handleJump(): void {
    if (this.player.isOnGround()) {
      this.player.jump();
      // T046: Play jump sound effect
      this.synthAudio.playJumpSound();
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
    
    // T047: Play obstacle interaction sounds based on type
    if (obstacle.type === 'puddle') {
      this.synthAudio.playSplashSound();
    } else {
      this.synthAudio.playBumpSound();
    }
    
    console.log(`Hit ${obstacle.type}! Slowed to ${slowFactor * 100}%`);
  }

  private handleCollectiblePickup(
    _playerObj: any,
    _collectibleObj: any
  ): void {
    const collectible = _collectibleObj as Collectible;
    
    // Skip if already collected
    if (collectible.collected) return;
    
    // Collect the item (T070)
    collectible.collect();
    
    // Update score (T073)
    this.scoreManager.addCollectible(collectible.type);
    this.scoreText.setText(this.getScoreText());
    
    // T071: Play unique audio for each collectible type
    this.synthAudio.playCollectSound(collectible.type);
    
    console.log(`Collected ${collectible.type}! Total: ${this.scoreManager.getTotal()}`);
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
    
    // Fade out transition (T116)
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Transition to celebration scene with collectible counts
      const counts = this.scoreManager.getAllCounts();
      this.scene.start(SCENES.CELEBRATION, {
        score: this.scoreManager.getTotal(),
        stars: counts.stars,
        hearts: counts.hearts,
        circles: counts.circles,
      });
    });
  }

  private setupVolumeControls(): void {
    console.log('GameScene: setupVolumeControls');
    try {
      const { width } = this.scale;
      
      // Mute/Unmute button (T048: Parent volume control)
      const muteButton = this.add.text(width - 100, 20, '🔊 Mute', {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#00000080',
        padding: { x: 10, y: 5 },
      });
      muteButton.setScrollFactor(0);
      muteButton.setInteractive({ useHandCursor: true });
      
      muteButton.on('pointerdown', () => {
        this.synthAudio.toggleMute();
        muteButton.setText(this.synthAudio.isMuted() ? '🔇 Unmute' : '🔊 Mute');
      });
      
      // Volume slider indicators (visual feedback)
      const volumeText = this.add.text(width - 230, 20, 'Volume', {
        fontSize: '16px',
        color: '#ffffff',
      });
      volumeText.setScrollFactor(0);
      console.log('Volume controls created');
    } catch (error) {
      console.error('Error in setupVolumeControls:', error);
    }
  }

  private markGameReady(): void {
    if (this.hasMarkedReady) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;

    root?.setAttribute('data-game-ready', 'true');
    body?.setAttribute('data-game-ready', 'true');

    if (root?.getAttribute('data-game-ready') === 'true' || body?.getAttribute('data-game-ready') === 'true') {
      this.hasMarkedReady = true;
    }
  }

  update(_time: number, delta: number): void {
    this.markGameReady();

    this.debugFrameCount += 1;
    if (this.debugFrameCount % 10 === 0) {
      document.documentElement?.setAttribute('data-game-tick', String(this.debugFrameCount));
    }

    // Update player physics
    this.player.update();

    document.documentElement?.setAttribute('data-player-y', String(Math.round(this.player.y)));
    document.documentElement?.setAttribute('data-player-on-ground', this.player.isOnGround() ? 'true' : 'false');
    
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
  
  shutdown(): void {
    // Stop music when leaving scene
    this.synthAudio.stopBackgroundMusic();
  }
}
