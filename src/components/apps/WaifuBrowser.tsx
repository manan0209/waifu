import React, { useState, useRef } from 'react';

interface WaifuBrowserProps {
  onClose?: () => void;
}

interface Website {
  id: string;
  title: string;
  url: string;
  favicon: string;
  description: string;
  category: 'portfolio' | 'project' | 'game' | 'tool' | 'social';
  tags: string[];
}

const WAIFU_SITES: Website[] = [
  {
    id: '1',
    title: 'Personal Portfolio',
    url: 'https://your-portfolio.vercel.app',
    favicon: '',
    description: 'My personal portfolio showcasing all my projects and skills.',
    category: 'portfolio',
    tags: ['react', 'portfolio', 'projects']
  },
  {
    id: '2',
    title: 'Anime Quote Generator',
    url: 'https://anime-quotes.vercel.app',
    favicon: '',
    description: 'Generate inspirational quotes from your favorite anime characters.',
    category: 'project',
    tags: ['anime', 'quotes', 'fun']
  },
  {
    id: '3',
    title: 'Retro Chat App',
    url: 'https://retro-chat.netlify.app',
    favicon: '💬',
    description: 'A nostalgic chat application with 90s styling.',
    category: 'project',
    tags: ['chat', 'retro', 'social']
  },
  {
    id: '4',
    title: 'Pixel Art Creator',
    url: 'https://pixel-art-maker.vercel.app',
    favicon: '',
    description: 'Create beautiful pixel art with this web-based editor.',
    category: 'tool',
    tags: ['pixel', 'art', 'creative']
  },
  {
    id: '5',
    title: 'Waifu Name Generator',
    url: 'https://waifu-names.netlify.app',
    favicon: '✨',
    description: 'Generate unique anime-style character names.',
    category: 'game',
    tags: ['anime', 'generator', 'names']
  },
  {
    id: '6',
    title: 'GitHub Profile',
    url: 'https://github.com/yourusername',
    favicon: '',
    description: 'Check out my open source projects and contributions.',
    category: 'social',
    tags: ['github', 'code', 'projects']
  },
  {
    id: '7',
    title: 'Todo App Deluxe',
    url: 'https://todo-deluxe.vercel.app',
    favicon: '',
    description: 'A feature-rich todo application with themes and categories.',
    category: 'tool',
    tags: ['productivity', 'todo', 'organize']
  },
  {
    id: '8',
    title: 'Music Player',
    url: 'https://waifu-music.netlify.app',
    favicon: '🎵',
    description: 'A beautiful music player with anime-themed UI.',
    category: 'project',
    tags: ['music', 'player', 'anime']
  }
];

export default function WaifuBrowser({ onClose }: WaifuBrowserProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [favorites, setFavorites] = useState<string[]>(['https://your-portfolio.vercel.app']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const categories = ['all', 'portfolio', 'project', 'game', 'tool', 'social'];

  
  const filteredSites = WAIFU_SITES.filter(site => {
    const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;
    const matchesSearch = site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

 
  const navigateToUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setCurrentUrl(url);
    
    
    const newHistory = [...history.slice(0, historyIndex + 1), url];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

 
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
    }
  };

 
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
    }
  };

  
  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // Home
  const goHome = () => {
    setCurrentUrl('');
  };

  
  const toggleFavorite = (url: string) => {
    if (favorites.includes(url)) {
      setFavorites(favorites.filter(fav => fav !== url));
    } else {
      setFavorites([...favorites, url]);
    }
  };

 
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'portfolio': return '👨‍💻';
      case 'project': return '🚀';
      case 'game': return '🎮';
      case 'tool': return '🛠️';
      case 'social': return '🌐';
      default: return '📄';
    }
  };

  return (
    <div className="waifu-browser">
      <div className="browser-header">
        <h2>🌐 Waifu Browser</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="browser-toolbar">
        <div className="navigation-buttons">
          <button 
            onClick={goBack} 
            disabled={historyIndex <= 0}
            className="nav-btn"
            title="Back"
          >
            ←
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIndex >= history.length - 1}
            className="nav-btn"
            title="Forward"
          >
            →
          </button>
          <button onClick={refresh} className="nav-btn" title="Refresh">
            ↻
          </button>
          <button onClick={goHome} className="nav-btn" title="Home">
            🏠
          </button>
        </div>

        <div className="address-bar">
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && navigateToUrl(currentUrl)}
            placeholder="Enter URL or search..."
            className="url-input"
          />
          <button onClick={() => navigateToUrl(currentUrl)} className="go-btn">
            Go
          </button>
        </div>

        <div className="browser-actions">
          {currentUrl && (
            <button 
              onClick={() => toggleFavorite(currentUrl)}
              className={`favorite-btn ${favorites.includes(currentUrl) ? 'active' : ''}`}
              title="Toggle Favorite"
            >
              ⭐
            </button>
          )}
        </div>
      </div>

      <div className="browser-content">
        {currentUrl ? (
          <div className="iframe-container">
            <iframe
              ref={iframeRef}
              src={currentUrl}
              title="Browser Content"
              className="browser-iframe"
              sandbox="allow-same-origin allow-scripts allow-forms allow-navigation allow-top-navigation"
            />
          </div>
        ) : (
          <div className="homepage">
            <div className="homepage-header">
              <h2>✨ Welcome to Waifu Browser!</h2>
              <p>Your gateway to awesome projects and websites</p>
            </div>

            <div className="search-section">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

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

            <div className="favorites-section">
              <h3>⭐ Favorites</h3>
              <div className="favorites-grid">
                {favorites.map((url, index) => {
                  const site = WAIFU_SITES.find(s => s.url === url);
                  return (
                    <div key={index} className="favorite-item" onClick={() => navigateToUrl(url)}>
                      <div className="favorite-favicon">
                        {site?.favicon || '🌐'}
                      </div>
                      <span>{site?.title || url}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sites-grid">
              {filteredSites.map(site => (
                <div 
                  key={site.id} 
                  className="site-card"
                  onClick={() => navigateToUrl(site.url)}
                >
                  <div className="site-favicon">{site.favicon}</div>
                  <div className="site-info">
                    <h4>{site.title}</h4>
                    <p>{site.description}</p>
                    <div className="site-tags">
                      {site.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="site-category">
                      {getCategoryIcon(site.category)} {site.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="browser-footer">
        <div className="status-bar">
          <span>🌐 {filteredSites.length} sites available</span>
          <span>⭐ {favorites.length} favorites</span>
          {currentUrl && <span>{currentUrl}</span>}
        </div>
      </div>
    </div>
  );
}
