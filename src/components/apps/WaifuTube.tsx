import React, { useState, useRef, useEffect } from 'react';

interface WaifuTubeProps {
  onClose?: () => void;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  views: string;
  description: string;
  category: 'anime' | 'music' | 'gaming' | 'tech';
}

const WAIFU_VIDEOS: Video[] = [
  {
    id: '1',
    title: '🎌 Lofi Hip Hop - Anime Study Beats',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    duration: '1:00:00',
    views: '5.2M',
    description: 'Perfect background music for coding and studying with anime aesthetics.',
    category: 'music'
  },
  {
    id: '2',
    title: '💻 Building a Retro Computer Interface',
    thumbnail: 'https://i.ytimg.com/vi/AaZ_RSt0KP8/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/AaZ_RSt0KP8',
    duration: '15:23',
    views: '850K',
    description: 'Learn how to create nostalgic Windows 98 style interfaces.',
    category: 'tech'
  },
  {
    id: '3',
    title: '🎮 Retro Gaming Music Mix',
    thumbnail: 'https://i.ytimg.com/vi/q76bMs-NwRk/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/q76bMs-NwRk',
    duration: '45:30',
    views: '2.1M',
    description: 'Classic 8-bit and 16-bit game soundtracks compilation.',
    category: 'gaming'
  },
  {
    id: '4',
    title: '✨ Anime Opening Compilation',
    thumbnail: 'https://i.ytimg.com/vi/63UcOrvNjLs/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/63UcOrvNjLs',
    duration: '30:45',
    views: '3.8M',
    description: 'Best anime openings from classic and modern series.',
    category: 'anime'
  },
  {
    id: '5',
    title: '🌸 Sakura Season in Japan 4K',
    thumbnail: 'https://i.ytimg.com/vi/9bE0W8bP3to/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/9bE0W8bP3to',
    duration: '12:34',
    views: '1.5M',
    description: 'Beautiful cherry blossom season footage from Japan.',
    category: 'anime'
  },
  {
    id: '6',
    title: '🎵 Synthwave / Retrowave Mix',
    thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/4xDzrJKXOOY',
    duration: '52:18',
    views: '4.2M',
    description: 'Neon-soaked synthwave music perfect for night coding sessions.',
    category: 'music'
  }
];

export default function WaifuTube({ onClose }: WaifuTubeProps) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const categories = ['all', 'anime', 'music', 'gaming', 'tech'];


  const filteredVideos = WAIFU_VIDEOS.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  
  const playVideo = (video: Video) => {
    setCurrentVideo(video);
  };

 
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

 
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'anime': return '🎌';
      case 'music': return '🎵';
      case 'gaming': return '🎮';
      case 'tech': return '💻';
      default: return '📺';
    }
  };

  return (
    <div className={`waifutube ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="waifutube-header">
        <div className="header-left">
          <h2>📺 WaifuTube</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="header-right">
          {currentVideo && (
            <button onClick={toggleFullscreen} className="fullscreen-btn">
              {isFullscreen ? '🗗' : '🗖'}
            </button>
          )}
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="waifutube-content">
        {currentVideo ? (
          <div className="video-player-section">
            <div className="video-container">
              <iframe
                ref={videoRef}
                src={currentVideo.url}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-player"
              />
            </div>
            
            <div className="video-info">
              <h3>{currentVideo.title}</h3>
              <div className="video-meta">
                <span className="views">{currentVideo.views} views</span>
                <span className="duration">{currentVideo.duration}</span>
                <span className="category">
                  {getCategoryIcon(currentVideo.category)} {currentVideo.category}
                </span>
              </div>
              <p className="description">{currentVideo.description}</p>
            </div>
            
            {!isFullscreen && (
              <div className="video-controls">
                <button onClick={() => setCurrentVideo(null)} className="back-btn">
                  ← Back to Videos
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="video-library">
            <div className="category-filter">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                >
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="video-grid">
              {filteredVideos.length > 0 ? (
                filteredVideos.map(video => (
                  <div
                    key={video.id}
                    className="video-card"
                    onClick={() => playVideo(video)}
                  >
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <div className="video-duration">{video.duration}</div>
                      <div className="play-overlay">▶</div>
                    </div>
                    <div className="video-info-card">
                      <h4>{video.title}</h4>
                      <div className="video-meta-card">
                        <span className="views">{video.views} views</span>
                        <span className="category">
                          {getCategoryIcon(video.category)} {video.category}
                        </span>
                      </div>
                      <p className="description-preview">
                        {video.description.substring(0, 80)}...
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No videos found matching your search.</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="waifutube-footer">
        <div className="stats">
          <span>{filteredVideos.length} videos</span>
          <span>Curated Collection</span>
          <span>Waifu Approved</span>
        </div>
      </div>
    </div>
  );
}
