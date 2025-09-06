import React, { useState, useRef } from 'react';

interface WaifuTubeProps {
  onClose?: () => void;
}

interface Video {
  id: string;
  url: string;
  embedId: string;
}

// Your specified videos with clean embeds
const WAIFU_VIDEOS: Video[] = [
  {
    id: '1',
    url: 'https://www.youtube.com/embed/g_6OK9fznGI?enablejsapi=1&autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0',
    embedId: 'g_6OK9fznGI'
  },
  {
    id: '2', 
    url: 'https://www.youtube.com/embed/0C1Wolpxn9w?enablejsapi=1&autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0',
    embedId: '0C1Wolpxn9w'
  },
  {
    id: '3',
    url: 'https://www.youtube.com/embed/1kdlBZgcvcU?enablejsapi=1&autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0',
    embedId: '1kdlBZgcvcU'
  },
  {
    id: '4',
    url: 'https://www.youtube.com/embed/-pHfPJGatgE?enablejsapi=1&autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0',
    embedId: '-pHfPJGatgE'
  }
];

export default function WaifuTube({ onClose }: WaifuTubeProps) {
  const [currentVideo, setCurrentVideo] = useState<Video>(WAIFU_VIDEOS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`waifu-tube ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* QuickTime-style Header */}
      <div className="waifu-tube-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="qt-logo"></div>
            <span className="app-title">WaifuTube</span>
          </div>
          <div className="window-controls">
            <button className="control-btn minimize" title="Minimize">─</button>
            <button className="control-btn maximize" onClick={toggleFullscreen} title="Maximize">□</button>
            <button className="control-btn close" onClick={onClose} title="Close">×</button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-container">
            <iframe
              ref={playerRef}
              src={currentVideo.url}
              title="WaifuTube Video"
              className="video-frame"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Simple Control Bar */}
          <div className="control-bar">
            <div className="control-group left">
              <span className="video-info">Video {currentVideo.id} of {WAIFU_VIDEOS.length}</span>
            </div>

            <div className="control-group right">
              <button 
                className="playlist-toggle" 
                onClick={() => setShowPlaylist(!showPlaylist)}
                title="Toggle Playlist"
              >
                ≡
              </button>
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        {showPlaylist && !isFullscreen && (
          <div className="playlist-sidebar">
            <div className="playlist-header">
              <h3>Videos</h3>
              <span className="video-count">{WAIFU_VIDEOS.length} videos</span>
            </div>
            
            <div className="playlist-content">
              {WAIFU_VIDEOS.map((video, index) => (
                <div
                  key={video.id}
                  className={`playlist-item ${currentVideo.id === video.id ? 'active' : ''}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="video-thumbnail">
                    <img src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`} alt={`Video ${video.id}`} />
                  </div>
                  <div className="video-info">
                    <h4 className="video-title">Video {index + 1}</h4>
                    <div className="video-meta">
                      <span className="video-id">{video.embedId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Now Playing Info */}
      <div className="now-playing-bar">
        <div className="now-playing-info">
          <div className="current-title">Currently Playing: Video {currentVideo.id}</div>
          <div className="video-id-display">{currentVideo.embedId}</div>
        </div>
      </div>
    </div>
  );
}
