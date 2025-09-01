import { useEffect, useCallback, useState } from 'react';
import { audioEngine, SYSTEM_SOUNDS } from '../system/audio/AudioEngine';

interface UseAudioReturn {
  playSound: (soundId: string, options?: { loop?: boolean; volume?: number }) => Promise<string | null>;
  stopSound: (playbackId: string) => void;
  stopAllSounds: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  volume: number;
  muted: boolean;
  isLoading: boolean;
}

export function useAudio(): UseAudioReturn {
  const [volume, setVolumeState] = useState(audioEngine.getMasterVolume());
  const [muted, setMutedState] = useState(audioEngine.isMuted());
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioEngine.ensureAudioContext();
        await audioEngine.preloadSounds(SYSTEM_SOUNDS);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        setIsLoading(false);
      }
    };

    // Wait for user interaction before initializing audio (browser autoplay policy)
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const playSound = useCallback(async (
    soundId: string, 
    options: { loop?: boolean; volume?: number } = {}
  ) => {
    try {
      await audioEngine.ensureAudioContext();
      return await audioEngine.playSound(soundId, options);
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
      return null;
    }
  }, []);

  const stopSound = useCallback((playbackId: string) => {
    audioEngine.stopSound(playbackId);
  }, []);

  const stopAllSounds = useCallback(() => {
    audioEngine.stopAllSounds();
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    audioEngine.setMasterVolume(newVolume);
    setVolumeState(newVolume);
  }, []);

  const setMuted = useCallback((newMuted: boolean) => {
    audioEngine.setMuted(newMuted);
    setMutedState(newMuted);
  }, []);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    setVolume,
    setMuted,
    volume,
    muted,
    isLoading
  };
}

export function useSystemSounds() {
  const { playSound } = useAudio();

  const playBootSound = useCallback(() => {
    return playSound('boot_start', { volume: 0.8 });
  }, [playSound]);

  const playPowerOn = useCallback(() => {
    return playSound('power_on', { volume: 0.6 });
  }, [playSound]);

  const playPowerOff = useCallback(() => {
    return playSound('power_off', { volume: 0.6 });
  }, [playSound]);

  const playBeep = useCallback(() => {
    return playSound('beep', { volume: 0.5 });
  }, [playSound]);

  const playError = useCallback(() => {
    return playSound('error', { volume: 0.8 });
  }, [playSound]);

  const playTyping = useCallback(() => {
    return playSound('typing', { volume: 0.3 });
  }, [playSound]);

  return {
    playBootSound,
    playPowerOn,
    playPowerOff,
    playBeep,
    playError,
    playTyping
  };
}
