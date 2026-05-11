/**
 * Asset Path Definitions
 * Centralized asset loading paths for sprites, audio, and backgrounds
 */

export const ASSET_PATHS = {
  // Sprite Paths
  sprites: {
    wyatt: {
      idle: 'assets/sprites/wyatt/idle.png',
      walk: 'assets/sprites/wyatt/walk.png',
      jump: 'assets/sprites/wyatt/jump.png',
      trick: 'assets/sprites/wyatt/trick.png',
      helmet: 'assets/sprites/wyatt/helmet.png',
      scooter: 'assets/sprites/wyatt/scooter.png',
    },
    friends: {
      nico: 'assets/sprites/friends/nico.png',
      marcus: 'assets/sprites/friends/marcus.png',
      otto: 'assets/sprites/friends/otto.png',
    },
    collectibles: {
      star: 'assets/sprites/collectibles/star.png',
      heart: 'assets/sprites/collectibles/heart.png',
      circle: 'assets/sprites/collectibles/circle.png',
    },
    obstacles: {
      puddle: 'assets/sprites/obstacles/puddle.png',
      rock: 'assets/sprites/obstacles/rock.png',
      hill: 'assets/sprites/obstacles/hill.png',
    },
  },
  
  // Background Paths
  backgrounds: {
    home: 'assets/backgrounds/home.png',
    neighborhood: 'assets/backgrounds/neighborhood.png',
    park: 'assets/backgrounds/park.png',
    sky: 'assets/backgrounds/sky.png',
  },
  
  // Audio Paths
  audio: {
    music: {
      main: 'assets/audio/music/main-theme.mp3',
      celebration: 'assets/audio/music/celebration.mp3',
    },
    sfx: {
      jump: 'assets/audio/sfx/jump.mp3',
      land: 'assets/audio/sfx/land.mp3',
      collectStar: 'assets/audio/sfx/collect-star.mp3',
      collectHeart: 'assets/audio/sfx/collect-heart.mp3',
      collectCircle: 'assets/audio/sfx/collect-circle.mp3',
      obstaclePuddle: 'assets/audio/sfx/splash.mp3',
      obstacleRock: 'assets/audio/sfx/bump.mp3',
      obstacleHill: 'assets/audio/sfx/whoosh.mp3',
      trick: 'assets/audio/sfx/trick.mp3',
    },
    voice: {
      greatJob: 'assets/audio/voice/great-job.mp3',
      awesome: 'assets/audio/voice/awesome.mp3',
      cool: 'assets/audio/voice/cool.mp3',
    },
  },
} as const;

/**
 * Asset Keys for Phaser's cache system
 * Maps logical names to cache keys
 */
export const ASSET_KEYS = {
  // Sprite keys
  PLAYER_IDLE: 'player-idle',
  PLAYER_WALK: 'player-walk',
  PLAYER_JUMP: 'player-jump',
  PLAYER_TRICK: 'player-trick',
  HELMET: 'helmet',
  SCOOTER: 'scooter',
  
  // Friend keys
  FRIEND_NICO: 'friend-nico',
  FRIEND_MARCUS: 'friend-marcus',
  FRIEND_OTTO: 'friend-otto',
  
  // Collectible keys
  COLLECTIBLE_STAR: 'collectible-star',
  COLLECTIBLE_HEART: 'collectible-heart',
  COLLECTIBLE_CIRCLE: 'collectible-circle',
  
  // Obstacle keys
  OBSTACLE_PUDDLE: 'obstacle-puddle',
  OBSTACLE_ROCK: 'obstacle-rock',
  OBSTACLE_HILL: 'obstacle-hill',
  
  // Background keys
  BG_HOME: 'bg-home',
  BG_NEIGHBORHOOD: 'bg-neighborhood',
  BG_PARK: 'bg-park',
  BG_SKY: 'bg-sky',
  
  // Audio keys
  MUSIC_MAIN: 'music-main',
  MUSIC_CELEBRATION: 'music-celebration',
  SFX_JUMP: 'sfx-jump',
  SFX_LAND: 'sfx-land',
  SFX_COLLECT_STAR: 'sfx-collect-star',
  SFX_COLLECT_HEART: 'sfx-collect-heart',
  SFX_COLLECT_CIRCLE: 'sfx-collect-circle',
  SFX_SPLASH: 'sfx-splash',
  SFX_BUMP: 'sfx-bump',
  SFX_WHOOSH: 'sfx-whoosh',
  SFX_TRICK: 'sfx-trick',
  VOICE_GREAT_JOB: 'voice-great-job',
  VOICE_AWESOME: 'voice-awesome',
  VOICE_COOL: 'voice-cool',
} as const;
