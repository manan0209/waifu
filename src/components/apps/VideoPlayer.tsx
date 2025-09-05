import React, { useState, useRef } from 'react';

interface VideoPlayerProps {
  onClose?: () => void;
}

interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
}

// Curated video collection
const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Lofi Hip Hop - Study Beats',
    url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&autohide=1',
    description: 'Perfect background music for coding and studying sessions.'
  },
  {
    id: '2',
    title: 'Synthwave Retrowave Mix',
    url: 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&autohide=1',
    description: 'Neon-soaked synthwave for coding in the digital night.'
  },
  {
    id: '3',
    title: 'Anime Piano Collection',
    url: 'https://www.youtube.com/embed/9bE0W8bP3to?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&autohide=1',
    description: 'Beautiful piano covers of your favorite anime themes.'
  },
  {
    id: '4',
    title: 'Cyberpunk Ambience',
    url: 'https://www.youtube.com/embed/r7dSz6E8Lis?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&autohide=1',
    description: 'Immersive cyberpunk city sounds for deep focus.'
  }
];

export default function VideoPlayer({ onClose }: VideoPlayerProps) {
  const [currentVideo, setCurrentVideo] = useState<Video>(VIDEOS[0]); // Auto-load first video
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  return (
    <div className={`video-player ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="video-player-header">
        <div className="header-left">
          <h2>🎥 Video Player</h2>
        </div>
        <div className="header-right">
          <button onClick={toggleFullscreen} className="fullscreen-btn" title="Toggle Fullscreen">
            {isFullscreen ? '⛶' : '⛶'}
          </button>
          {!isFullscreen && (
            <button className="close-btn" onClick={onClose} title="Close">×</button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="video-player-content">
        {/* Video Container */}
        <div className="video-container">
          <iframe
            ref={playerRef}
            src={currentVideo.url}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="video-iframe"
          />
          
          {/* Fullscreen Controls */}
          {isFullscreen && (
            <div className="fullscreen-controls">
              <button onClick={() => setIsFullscreen(false)} className="exit-fullscreen">
                ✕ Exit Fullscreen
              </button>
            </div>
          )}
        </div>

        {/* Video Info & Playlist */}
        {!isFullscreen && (
          <div className="video-sidebar">
            <div className="current-video-info">
              <h3>{currentVideo.title}</h3>
              <p>{currentVideo.description}</p>
            </div>

            <div className="video-playlist">
              <h4>🎵 Playlist</h4>
              <div className="playlist-items">
                {VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className={`playlist-item ${currentVideo.id === video.id ? 'active' : ''}`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="playlist-icon">🎬</div>
                    <div className="playlist-info">
                      <div className="playlist-title">{video.title}</div>
                      <div className="playlist-desc">{video.description.slice(0, 50)}...</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isFullscreen && (
        <div className="video-player-footer">
          <div className="controls">
            <span>Now Playing: {currentVideo.title}</span>
          </div>
        </div>
      )}
    </div>
  );
}
