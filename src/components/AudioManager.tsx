import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Volume2, VolumeX } from 'lucide-react';

type SoundType = 'move' | 'capture' | 'win' | 'gameover' | 'select';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  detune = 0
) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available in this environment
  }
}

function playChord(notes: number[], duration: number, volume = 0.2) {
  notes.forEach(f => playTone(f, duration, 'sine', volume));
}

function playSoundType(type: SoundType) {
  switch (type) {
    case 'select':
      playTone(880, 0.08, 'sine', 0.15);
      break;
    case 'move':
      playTone(440, 0.12, 'sine', 0.18);
      setTimeout(() => playTone(550, 0.1, 'sine', 0.12), 60);
      break;
    case 'capture':
      playTone(330, 0.15, 'sawtooth', 0.2);
      setTimeout(() => playTone(220, 0.2, 'sawtooth', 0.15), 80);
      break;
    case 'win':
      playChord([523, 659, 784], 0.4, 0.18);
      setTimeout(() => playChord([523, 659, 784, 1047], 0.6, 0.2), 400);
      break;
    case 'gameover':
      playTone(330, 0.3, 'sine', 0.15);
      setTimeout(() => playTone(277, 0.3, 'sine', 0.12), 250);
      setTimeout(() => playTone(220, 0.5, 'sine', 0.1), 500);
      break;
  }
}

// Singleton audio manager for external calls
let currentVolume = 0.5;
let isMuted = false;

export function playSound(type: SoundType) {
  if (isMuted || currentVolume === 0) return;
  playSoundType(type);
}

export const AudioManager: React.FC = () => {
  const { theme, themeType } = useTheme();
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const isSovereign = themeType === 'sovereign';

  const handleMuteToggle = () => {
    const next = !muted;
    setMuted(next);
    isMuted = next;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    currentVolume = v;
    isMuted = v === 0;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleMuteToggle}
        className="p-1.5 rounded-lg transition-all hover:opacity-70"
        style={{ color: theme.colors.onSurface }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={muted ? 0 : volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 rounded appearance-none cursor-pointer"
        style={{
          accentColor: theme.colors.primary,
        }}
      />
    </div>
  );
};
