import React, { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
  genre: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export default function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [selectedView, setSelectedView] = useState<'library' | 'playlists' | 'now-playing'>('library');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo tracks
  const demoTracks: Track[] = [
    {
      id: '1',
      title: 'Cyber Cafe Ambience',
      artist: 'Lo-Fi Collective',
      duration: '3:45',
      url: '/bgmusic.mp3',
      genre: 'Ambient'
    },
    {
      id: '2',
      title: 'Digital Dreams',
      artist: 'Synthwave Artist',
      duration: '4:12',
      url: '/sounds/boot.mp3',
      genre: 'Synthwave'
    },
    {
      id: '3',
      title: 'Nostalgic Bytes',
      artist: 'Retro Vibes',
      duration: '3:28',
      url: '/sounds/beep.mp3',
      genre: 'Chiptune'
    },
    {
      id: '4',
      title: 'Windows Vista',
      artist: 'System Sounds',
      duration: '0:05',
      url: '/tuturu.mp3',
      genre: 'System'
    }
  ];

  const demoPlaylists: Playlist[] = [
    {
      id: 'chill',
      name: '🎵 Chill Vibes',
      tracks: demoTracks.filter(t => t.genre === 'Ambient' || t.genre === 'Synthwave')
    },
    {
      id: 'retro',
      name: '🕹️ Retro Gaming',
      tracks: demoTracks.filter(t => t.genre === 'Chiptune' || t.genre === 'System')
    },
    {
      id: 'all',
      name: '📀 All Music',
      tracks: demoTracks
    }
  ];

  // Audio control functions
  const playTrack = (track: Track) => {
    if (audioRef.current) {
      setCurrentTrack(track);
      audioRef.current.src = track.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderLibrary = () => (
    <div className="library-view">
      <div className="library-header">
        <h3>🎵 Music Library</h3>
        <span className="track-count">{demoTracks.length} tracks</span>
      </div>
      <div className="track-list">
        {demoTracks.map(track => (
          <div 
            key={track.id} 
            className={`track-item ${currentTrack?.id === track.id ? 'playing' : ''}`}
            onDoubleClick={() => playTrack(track)}
          >
            <div className="track-icon">
              {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
            </div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>
            <div className="track-genre">{track.genre}</div>
            <div className="track-duration">{track.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlaylists = () => (
    <div className="playlists-view">
      <div className="playlists-header">
        <h3>📀 Playlists</h3>
      </div>
      <div className="playlist-list">
        {demoPlaylists.map(playlist => (
          <div 
            key={playlist.id} 
            className="playlist-item"
            onClick={() => {
              setCurrentPlaylist(playlist);
              setSelectedView('now-playing');
            }}
          >
            <div className="playlist-icon">📁</div>
            <div className="playlist-info">
              <div className="playlist-name">{playlist.name}</div>
              <div className="playlist-count">{playlist.tracks.length} tracks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNowPlaying = () => (
    <div className="now-playing-view">
      <div className="now-playing-header">
        <h3>🎧 Now Playing</h3>
        {currentPlaylist && (
          <span className="playlist-name">Playlist: {currentPlaylist.name}</span>
        )}
      </div>
      
      {currentTrack ? (
        <div className="current-track-display">
          <div className="track-artwork">🎵</div>
          <div className="track-details">
            <h4>{currentTrack.title}</h4>
            <p>{currentTrack.artist}</p>
            <div className="track-progress">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleTimeChange}
                className="progress-bar"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-track">
          <div className="no-track-icon">🎵</div>
          <p>No track selected</p>
          <p>Double-click a track to start playing</p>
        </div>
      )}
      
      {currentPlaylist && (
        <div className="playlist-tracks">
          <h4>Queue:</h4>
          <div className="queue-list">
            {currentPlaylist.tracks.map(track => (
              <div 
                key={track.id}
                className={`queue-item ${currentTrack?.id === track.id ? 'current' : ''}`}
                onDoubleClick={() => playTrack(track)}
              >
                <span className="queue-title">{track.title}</span>
                <span className="queue-artist">{track.artist}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="media-player">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="player-header">
        <div className="player-title">
          <span className="player-icon">🎵</span>
          <h2>Media Player</h2>
        </div>
        <div className="view-tabs">
          <button 
            className={selectedView === 'library' ? 'active' : ''}
            onClick={() => setSelectedView('library')}
          >
            Library
          </button>
          <button 
            className={selectedView === 'playlists' ? 'active' : ''}
            onClick={() => setSelectedView('playlists')}
          >
            Playlists
          </button>
          <button 
            className={selectedView === 'now-playing' ? 'active' : ''}
            onClick={() => setSelectedView('now-playing')}
          >
            Now Playing
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="player-content">
        {selectedView === 'library' && renderLibrary()}
        {selectedView === 'playlists' && renderPlaylists()}
        {selectedView === 'now-playing' && renderNowPlaying()}
      </div>

      {/* Controls */}
      <div className="player-controls">
        <div className="control-buttons">
          <button onClick={stopTrack} title="Stop">⏹️</button>
          <button onClick={togglePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
        
        <div className="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <span>{volume}%</span>
        </div>
        
        <div className="extra-controls">
          <button 
            onClick={() => setShowEqualizer(!showEqualizer)}
            className={showEqualizer ? 'active' : ''}
            title="Equalizer"
          >
            📊
          </button>
        </div>
      </div>

      {/* Equalizer */}
      {showEqualizer && (
        <div className="equalizer">
          <div className="eq-header">
            <h4>🎛️ Equalizer</h4>
          </div>
          <div className="eq-bars">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="eq-band">
                <input
                  type="range"
                  min="-20"
                  max="20"
                  defaultValue="0"
                  className="eq-slider"
                  style={{ transform: 'rotate(270deg)' }}
                />
                <span className="eq-label">
                  {['60', '170', '310', '600', '1K', '3K', '6K', '12K'][i]}Hz
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Status Bar */}
      <div className="player-status">
        <span className="status-text">
          {currentTrack ? `Playing: ${currentTrack.title}` : 'Ready'}
        </span>
        <span className="connection-status">♪ Audio System Ready</span>
      </div>
    </div>
  );
}
