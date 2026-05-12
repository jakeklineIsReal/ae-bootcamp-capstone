/**
 * SynthAudioManager
 * Generates synthesized audio using Web Audio API
 * Provides fallback audio when no asset files are available
 * Ensures 100% audio feedback for accessibility (FR-008, FR-010)
 */
export class SynthAudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private muted: boolean = false;
  
  // Background music oscillators
  private musicOscillators: OscillatorNode[] = [];
  private isMusicPlaying: boolean = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      
      // Music gain node
      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = this.muted ? 0 : this.musicVolume;
      this.musicGain.connect(this.masterGain);
      
      // SFX gain node
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = this.muted ? 0 : this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Play jump sound (ascending pitch beep)
   */
  playJumpSound(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Play obstacle bump sound (lower pitch)
   */
  playBumpSound(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Play puddle splash sound
   */
  playSplashSound(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Play collectible pickup sound (pleasant chime)
   */
  playCollectSound(type: 'star' | 'heart' | 'circle' = 'star'): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const now = this.audioContext.currentTime;
    const frequencies = {
      star: [659, 880],      // E5, A5 (bright)
      heart: [523, 659],     // C5, E5 (warm)
      circle: [440, 554],    // A4, C#5 (neutral)
    };
    
    const [freq1, freq2] = frequencies[type];
    
    // Two-tone chime
    [freq1, freq2].forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      
      gain.gain.setValueAtTime(0.25, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.3);
    });
  }

  /**
   * Play celebration success fanfare
   */
  playCelebrationSound(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const now = this.audioContext.currentTime;
    const melody = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 0.15 },   // E5
      { freq: 784, time: 0.3 },    // G5
      { freq: 1047, time: 0.45 },  // C6
    ];
    
    melody.forEach(note => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      
      gain.gain.setValueAtTime(0.3, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.2);
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.start(now + note.time);
      osc.stop(now + note.time + 0.2);
    });
  }

  /**
   * Backwards-compatible alias for celebration sound
   */
  playCelebrateSound(): void {
    this.playCelebrationSound();
  }

  /**
   * Start simple background music (major chord progression)
   */
  playBackgroundMusic(): void {
    if (!this.audioContext || !this.musicGain || this.isMusicPlaying) return;
    
    this.isMusicPlaying = true;
    
    // Simple upbeat melody pattern (C major pentatonic)
    // Using quieter volume and pleasant sine waves
    const notes = [
      { freq: 261.63, start: 0, duration: 0.4 },    // C4
      { freq: 293.66, start: 0.4, duration: 0.4 },  // D4
      { freq: 329.63, start: 0.8, duration: 0.4 },  // E4
      { freq: 392.00, start: 1.2, duration: 0.4 },  // G4
      { freq: 329.63, start: 1.6, duration: 0.4 },  // E4
      { freq: 293.66, start: 2.0, duration: 0.4 },  // D4
      { freq: 261.63, start: 2.4, duration: 0.8 },  // C4 (longer)
    ];
    
    const now = this.audioContext.currentTime;
    const loopDuration = 3.2; // Total pattern duration
    
    // Play the pattern in a loop
    const playPattern = (offset: number = 0) => {
      notes.forEach(note => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + offset + note.start);
        
        // Envelope for each note
        gain.gain.setValueAtTime(0, now + offset + note.start);
        gain.gain.linearRampToValueAtTime(0.08, now + offset + note.start + 0.02);
        gain.gain.setValueAtTime(0.08, now + offset + note.start + note.duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, now + offset + note.start + note.duration);
        
        osc.connect(gain);
        gain.connect(this.musicGain!);
        
        osc.start(now + offset + note.start);
        osc.stop(now + offset + note.start + note.duration);
        
        this.musicOscillators.push(osc);
      });
    };
    
    // Play pattern 10 times (32 seconds of music)
    for (let i = 0; i < 10; i++) {
      playPattern(i * loopDuration);
    }
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic(): void {
    this.musicOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.musicOscillators = [];
    this.isMusicPlaying = false;
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.muted ? 0 : this.musicVolume;
    }
  }

  /**
   * Set SFX volume (0-1)
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.muted ? 0 : this.sfxVolume;
    }
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    this.muted = !this.muted;
    if (this.musicGain) {
      this.musicGain.gain.value = this.muted ? 0 : this.musicVolume;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.muted ? 0 : this.sfxVolume;
    }
  }

  /**
   * Get mute state
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Resume audio context (needed after user interaction in some browsers)
   */
  resume(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
