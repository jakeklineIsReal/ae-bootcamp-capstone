/**
 * Phaser Mock Utilities
 * Mock Phaser objects for unit testing
 */

import { vi } from 'vitest';

/**
 * Create a mock Phaser.Scene
 */
export function createMockScene(): any {
  const mockSoundManager = {
    add: vi.fn().mockReturnValue({
      play: vi.fn(),
      stop: vi.fn(),
      setVolume: vi.fn(),
    }),
    play: vi.fn(),
    pauseAll: vi.fn(),
    resumeAll: vi.fn(),
  };

  const mockPhysics = {
    add: {
      existing: vi.fn(),
      sprite: vi.fn().mockReturnValue(createMockPhysicsSprite()),
      staticGroup: vi.fn().mockReturnValue(createMockPhysicsGroup()),
      group: vi.fn().mockReturnValue(createMockPhysicsGroup()),
    },
    world: {
      gravity: { y: 800 },
    },
  };

  const mockAddFactory = {
    existing: vi.fn(),
    sprite: vi.fn().mockReturnValue(createMockSprite()),
    rectangle: vi.fn().mockReturnValue(createMockRectangle()),
    arc: vi.fn().mockReturnValue(createMockArc()),
    circle: vi.fn().mockReturnValue(createMockCircle()),
    graphics: vi.fn().mockReturnValue(createMockGraphics()),
    text: vi.fn().mockReturnValue(createMockText()),
    image: vi.fn().mockReturnValue(createMockImage()),
  };

  const mockTweens = {
    add: vi.fn().mockReturnValue({
      play: vi.fn(),
      stop: vi.fn(),
      pause: vi.fn(),
    }),
    killTweensOf: vi.fn(),
  };

  return {
    add: mockAddFactory,
    physics: mockPhysics,
    sound: mockSoundManager,
    tweens: mockTweens,
    scene: {
      get: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    },
    cameras: {
      main: createMockCamera(),
    },
    input: {
      keyboard: {
        createCursorKeys: vi.fn().mockReturnValue({
          up: { isDown: false },
          down: { isDown: false },
          left: { isDown: false },
          right: { isDown: false },
          space: { isDown: false },
          shift: { isDown: false },
        }),
        addKey: vi.fn().mockReturnValue({
          isDown: false,
        }),
      },
    },
    time: {
      delayedCall: vi.fn(),
      addEvent: vi.fn(),
    },
  };
}

/**
 * Create a mock Phaser.GameObjects.Sprite
 */
export function createMockSprite(): any {
  return {
    x: 0,
    y: 0,
    visible: true,
    active: true,
    setTexture: vi.fn().mockReturnThis(),
    setScale: vi.fn().mockReturnThis(),
    setOrigin: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setActive: vi.fn().mockReturnThis(),
    setFrame: vi.fn().mockReturnThis(),
    play: vi.fn().mockReturnThis(),
    anims: {
      play: vi.fn(),
    },
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.GameObjects.Rectangle
 */
export function createMockRectangle(): any {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fillColor: 0xffffff,
    visible: true,
    active: true,
    setFillStyle: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setSize: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setActive: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.GameObjects.Arc
 */
export function createMockArc(): any {
  return {
    x: 0,
    y: 0,
    radius: 0,
    visible: true,
    active: true,
    setFillStyle: vi.fn().mockReturnThis(),
    setStrokeStyle: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setActive: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.GameObjects.Circle
 */
export function createMockCircle(): any {
  return {
    x: 0,
    y: 0,
    radius: 0,
    fillColor: 0xffffff,
    visible: true,
    active: true,
    setFillStyle: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setActive: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.GameObjects.Graphics
 */
export function createMockGraphics(): any {
  return {
    clear: vi.fn().mockReturnThis(),
    fillStyle: vi.fn().mockReturnThis(),
    lineStyle: vi.fn().mockReturnThis(),
    fillRect: vi.fn().mockReturnThis(),
    strokeRect: vi.fn().mockReturnThis(),
    fillCircle: vi.fn().mockReturnThis(),
    strokeCircle: vi.fn().mockReturnThis(),
    lineBetween: vi.fn().mockReturnThis(),
    beginPath: vi.fn().mockReturnThis(),
    moveTo: vi.fn().mockReturnThis(),
    lineTo: vi.fn().mockReturnThis(),
    closePath: vi.fn().mockReturnThis(),
    fillPath: vi.fn().mockReturnThis(),
    strokePath: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.GameObjects.Text
 */
export function createMockText(): any {
  return {
    x: 0,
    y: 0,
    text: '',
    visible: true,
    active: true,
    setText: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setOrigin: vi.fn().mockReturnThis(),
    setStyle: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setActive: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.GameObjects.Image
 */
export function createMockImage(): any {
  return {
    x: 0,
    y: 0,
    visible: true,
    active: true,
    setTexture: vi.fn().mockReturnThis(),
    setScale: vi.fn().mockReturnThis(),
    setOrigin: vi.fn().mockReturnThis(),
    setPosition: vi.fn().mockReturnThis(),
    setVisible: vi.fn().mockReturnThis(),
    setActive: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
  };
}

/**
 * Create a mock Phaser.Physics.Arcade.Body
 */
export function createMockPhysicsBody(): any {
  return {
    velocity: { x: 0, y: 0 },
    touching: { up: false, down: false, left: false, right: false },
    blocked: { up: false, down: false, left: false, right: false },
    setSize: vi.fn().mockReturnThis(),
    setOffset: vi.fn().mockReturnThis(),
    setCollideWorldBounds: vi.fn().mockReturnThis(),
    setAllowGravity: vi.fn().mockReturnThis(),
    setVelocity: vi.fn().mockReturnThis(),
    setVelocityX: vi.fn().mockReturnThis(),
    setVelocityY: vi.fn().mockReturnThis(),
    setCircle: vi.fn().mockReturnThis(),
  };
}

/**
 * Create a mock Phaser.Physics.Arcade.Sprite
 */
export function createMockPhysicsSprite(): any {
  return {
    ...createMockSprite(),
    body: createMockPhysicsBody(),
  };
}

/**
 * Create a mock Phaser.Physics.Arcade.Group
 */
export function createMockPhysicsGroup(): any {
  return {
    children: {
      entries: [],
    },
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    getChildren: vi.fn().mockReturnValue([]),
  };
}

/**
 * Create a mock Phaser.Cameras.Scene2D.Camera
 */
export function createMockCamera(): any {
  return {
    scrollX: 0,
    scrollY: 0,
    startFollow: vi.fn(),
    stopFollow: vi.fn(),
    setLerp: vi.fn(),
    setBounds: vi.fn(),
    setZoom: vi.fn(),
  };
}

/**
 * Create a mock Phaser.Math utilities
 */
export const MockPhaserMath = {
  Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
};
