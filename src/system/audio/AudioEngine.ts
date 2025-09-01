export interface AudioConfig {
  volume: number;
  muted: boolean;
}

export interface SoundEffect {
  id: string;
  url: string;
  loop?: boolean;
  volume?: number;
}

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private activeAudio: Map<string, AudioBufferSourceNode> = new Map();
  private masterVolume: number = 0.7;
  private muted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    // Skip initialization on server side
    if (typeof window === 'undefined') {
      console.warn('AudioEngine: Skipping initialization on server side');
      return;
    }

    try {
      // Create audio context (handle browser differences)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      // Resume context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;

      console.log('AudioEngine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error);
      this.audioContext = null;
      this.masterGain = null;
    }
  }

  async loadSound(soundEffect: SoundEffect): Promise<boolean> {
    if (!this.audioContext || !this.initialized) {
      await this.initializeAudioContext();
    }

    try {
      const response = await fetch(soundEffect.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(soundEffect.id, audioBuffer);
      console.log(`Sound loaded: ${soundEffect.id}`);
      return true;
    } catch (error) {
      console.error(`Failed to load sound ${soundEffect.id}:`, error);
      return false;
    }
  }

  async playSound(
    soundId: string, 
    options: { 
      loop?: boolean; 
      volume?: number; 
      fadeIn?: number;
      onEnded?: () => void;
    } = {}
  ): Promise<string | null> {
    if (!this.audioContext || !this.initialized || this.muted) {
      return null;
    }

    const audioBuffer = this.audioBuffers.get(soundId);
    if (!audioBuffer) {
      console.warn(`Sound not found: ${soundId}`);
      return null;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.loop = options.loop || false;
      
      
      const volume = (options.volume ?? 1) * this.masterVolume;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      
      
      if (options.fadeIn) {
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + options.fadeIn);
      }
      
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      
      const playbackId = `${soundId}_${Date.now()}`;
      source.onended = () => {
        this.activeAudio.delete(playbackId);
        options.onEnded?.();
      };
      
      
      source.start();
      this.activeAudio.set(playbackId, source);
      
      return playbackId;
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
      return null;
    }
  }

  stopSound(playbackId: string) {
    const source = this.activeAudio.get(playbackId);
    if (source) {
      try {
        source.stop();
        this.activeAudio.delete(playbackId);
      } catch (error) {
        console.error(`Failed to stop sound ${playbackId}:`, error);
      }
    }
  }

  stopAllSounds() {
    this.activeAudio.forEach((source, id) => {
      try {
        source.stop();
      } catch (error) {
        console.error(`Failed to stop sound ${id}:`, error);
      }
    });
    this.activeAudio.clear();
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopAllSounds();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  async ensureAudioContext() {
    if (!this.audioContext || this.audioContext.state === 'suspended') {
      await this.initializeAudioContext();
    }
  }

  
  async preloadSounds(sounds: SoundEffect[]): Promise<void> {
    const loadPromises = sounds.map(sound => this.loadSound(sound));
    await Promise.all(loadPromises);
  }

  dispose() {
    this.stopAllSounds();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioBuffers.clear();
    this.initialized = false;
  }
}


export const audioEngine = new AudioEngine();


export const SYSTEM_SOUNDS: SoundEffect[] = [
  {
    id: 'boot_start',
    url: '/sounds/system/boot-start.mp3',
    volume: 0.8
  },
  {
    id: 'boot_complete',
    url: '/sounds/system/boot-complete.mp3',
    volume: 0.7
  },
  {
    id: 'power_on',
    url: '/sounds/system/power-on.mp3',
    volume: 0.6
  },
  {
    id: 'power_off',
    url: '/sounds/system/power-off.mp3',
    volume: 0.6
  },
  {
    id: 'typing',
    url: '/sounds/ui/typing.mp3',
    volume: 0.3
  },
  {
    id: 'beep',
    url: '/sounds/system/beep.mp3',
    volume: 0.5
  },
  {
    id: 'error',
    url: '/sounds/system/error.mp3',
    volume: 0.8
  }
];

export default AudioEngine;
