import { useEffect, useRef, useState } from 'react';

interface BackgroundMusicOptions {
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export function useBackgroundMusic(audioSrc: string, options: BackgroundMusicOptions = {}) {
  const { volume = 0.3, loop = true, autoPlay = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.volume = currentVolume;
    audio.preload = 'auto';

    // Event listeners
    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc, loop]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const play = async () => {
    if (audioRef.current && isLoaded) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn('Failed to play background music:', error);
        
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setCurrentVolume(clampedVolume);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    isPlaying,
    isLoaded,
    volume: currentVolume,
    play,
    pause,
    stop,
    setVolume,
    togglePlayPause,
  };
}
