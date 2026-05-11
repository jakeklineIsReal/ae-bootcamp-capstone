import Phaser from 'phaser';
import { AUDIO } from '../config/constants';

/**
 * AudioManager
 * Centralized audio system for music and sound effects
 * Ensures 100% audio feedback for accessibility (FR-008, FR-010)
 */
export class AudioManager {
  private scene: Phaser.Scene;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private musicVolume: number = AUDIO.MUSIC_VOLUME;
  private sfxVolume: number = AUDIO.SFX_VOLUME;
  private voiceVolume: number = AUDIO.VOICE_VOLUME;
  private muted: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Play background music (looping)
   */
  playMusic(key: string, loop: boolean = true): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    this.currentMusic = this.scene.sound.add(key, {
      volume: this.muted ? 0 : this.musicVolume,
      loop,
    });

    this.currentMusic.play();
  }

  /**
   * Stop current music
   */
  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  /**
   * Play a sound effect
   */
  playSFX(key: string, volume?: number): void {
    if (this.muted) return;

    this.scene.sound.play(key, {
      volume: volume !== undefined ? volume : this.sfxVolume,
    });
  }

  /**
   * Play a voice cue
   */
  playVoice(key: string): void {
    if (this.muted) return;

    this.scene.sound.play(key, {
      volume: this.voiceVolume,
    });
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (this.currentMusic && 'setVolume' in this.currentMusic) {
      (this.currentMusic as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setVolume(this.muted ? 0 : this.musicVolume);
    }
  }

  /**
   * Set SFX volume (0-1)
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  /**
   * Set voice volume (0-1)
   */
  setVoiceVolume(volume: number): void {
    this.voiceVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  /**
   * Toggle mute on/off
   */
  toggleMute(): void {
    this.muted = !this.muted;
    if (this.currentMusic && 'setVolume' in this.currentMusic) {
      (this.currentMusic as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setVolume(this.muted ? 0 : this.musicVolume);
    }
  }

  /**
   * Get current mute state
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Pause all audio
   */
  pauseAll(): void {
    this.scene.sound.pauseAll();
  }

  /**
   * Resume all audio
   */
  resumeAll(): void {
    this.scene.sound.resumeAll();
  }
}
