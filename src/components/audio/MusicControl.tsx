import React from 'react';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';

interface MusicControlProps {
  className?: string;
}

export default function MusicControl({ className = '' }: MusicControlProps) {
  const bgMusic = useBackgroundMusic('/bgmusic.mp3', {
    volume: 0.2,
    loop: true,
    autoPlay: false
  });

  const handleToggle = () => {
    bgMusic.togglePlayPause();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    bgMusic.setVolume(newVolume);
  };

  return (
    <div className={`music-control ${className}`}>
      <button 
        onClick={handleToggle}
        className="music-toggle-btn"
        title={bgMusic.isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {bgMusic.isPlaying ? '🎵' : '🔇'}
      </button>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={bgMusic.volume}
        onChange={handleVolumeChange}
        className="volume-slider"
        title="Volume"
      />
    </div>
  );
}
