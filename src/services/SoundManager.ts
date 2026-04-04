/**
 * Sound Manager for Warp Board
 * Uses Web Audio API for sound effects
 */

export type SoundType = 'move' | 'capture' | 'king' | 'win' | 'click' | 'illegal';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    // Load settings from localStorage
    const saved = localStorage.getItem('warp-board-sound-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.enabled = settings.enabled ?? true;
      this.volume = settings.volume ?? 0.5;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a sound effect
   */
  play(type: SoundType) {
    if (!this.enabled) return;

    try {
      const ctx = this.getAudioContext();

      switch (type) {
        case 'move':
          this.playMoveSound(ctx);
          break;
        case 'capture':
          this.playCaptureSound(ctx);
          break;
        case 'king':
          this.playKingSound(ctx);
          break;
        case 'win':
          this.playWinSound(ctx);
          break;
        case 'click':
          this.playClickSound(ctx);
          break;
        case 'illegal':
          this.playIllegalSound(ctx);
          break;
      }
    } catch (err) {
      console.warn('Sound playback failed:', err);
    }
  }

  /**
   * Play move sound (short, soft click)
   */
  private playMoveSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 440;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  /**
   * Play capture sound (sharp, impactful)
   */
  private playCaptureSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 220;
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(this.volume * 0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  /**
   * Play king promotion sound (ascending tones)
   */
  private playKingSound(ctx: AudioContext) {
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(this.volume * 0.4, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }

  /**
   * Play win sound (celebratory)
   */
  private playWinSound(ctx: AudioContext) {
    const melody = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.15 },
      { freq: 783.99, time: 0.3 },
      { freq: 1046.5, time: 0.45 },
    ];

    melody.forEach((note) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + note.time;
      gainNode.gain.setValueAtTime(this.volume * 0.5, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  /**
   * Play UI click sound (very short)
   */
  private playClickSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 880;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  /**
   * Play illegal move sound (low buzz)
   */
  private playIllegalSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 110;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  /**
   * Toggle sound on/off
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings() {
    return {
      enabled: this.enabled,
      volume: this.volume,
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings() {
    localStorage.setItem(
      'warp-board-sound-settings',
      JSON.stringify({
        enabled: this.enabled,
        volume: this.volume,
      })
    );
  }
}

// Create singleton instance
export const soundManager = new SoundManager();
