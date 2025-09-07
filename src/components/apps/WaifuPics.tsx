import React, { useState, useEffect, useCallback } from 'react';

interface WaifuPicsProps {
  onClose: () => void;
}

interface WaifuImage {
  id: string;
  url: string;
  title: string;
  category: string;
  isLoading?: boolean;
}

const WAIFU_SEARCH_TERMS = [
  'cute anime cats',
  'kawaii cats',
  'adorable kittens',
  'fluffy cats',
  'cute cat girls',
  'anime style cats',
  'pink cats',
  'pastel cats',
  'magical cats',
  'dreamy kittens'
];

const WAIFU_CATEGORIES = [
  'Popular',
  'Trending', 
  'Kawaii',
  'Magical',
  'Dreamy',
  'Pastel',
  'Adorable',
  'Fluffy'
];

export default function WaifuPics({ onClose }: WaifuPicsProps) {
  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [selectedImage, setSelectedImage] = useState<WaifuImage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Generate placeholder cat images using a cat API
  const generateCatImages = useCallback((count: number = 12): WaifuImage[] => {
    console.log('Generating cat images:', count);
    return Array.from({ length: count }, (_, index) => {
      const id = `waifu-${Date.now()}-${index}-${Math.random()}`;
      // Use different image services for better reliability
      const imageServices = [
        `https://picsum.photos/300/300?random=${Date.now()}-${index}`,
        `https://loremflickr.com/300/300/cat,kitten?random=${Date.now()}-${index}`,
        `https://placekitten.com/300/300?random=${Date.now()}-${index}`,
        // Fallback to a solid color if external services fail
        `data:image/svg+xml;base64,${btoa(`<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="300" fill="#ff6b9d"/><text x="150" y="140" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="white">WAIFU</text><text x="150" y="170" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">No. ${index + 1}</text></svg>`)}`
      ];
      const url = imageServices[index % imageServices.length];
      console.log('Generated image:', { id, url });
      return {
        id,
        url,
        title: `Cute Waifu ${index + 1}`,
        category: WAIFU_CATEGORIES[Math.floor(Math.random() * WAIFU_CATEGORIES.length)]
      };
    });
  }, []);

  // Search function
  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setCurrentSearch(searchTerm);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newImages = generateCatImages(16);
    setImages(newImages);
    setLoading(false);
    setCurrentPage(1);
  }, [generateCatImages]);

  // Load category
  const loadCategory = useCallback(async (category: string) => {
    console.log('Loading category:', category);
    setLoading(true);
    setSelectedCategory(category);
    setCurrentSearch('');
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newImages = generateCatImages(20);
    console.log('Generated images for category:', category, newImages);
    setImages(newImages);
    setLoading(false);
    setCurrentPage(1);
  }, [generateCatImages]);

  // Initialize with popular images
  useEffect(() => {
    loadCategory('Popular');
  }, [loadCategory]);

  // Handle random search suggestion
  const handleRandomSearch = () => {
    const randomTerm = WAIFU_SEARCH_TERMS[Math.floor(Math.random() * WAIFU_SEARCH_TERMS.length)];
    handleSearch(randomTerm);
  };

  // Load more images
  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const moreImages = generateCatImages(8);
      setImages(prev => [...prev, ...moreImages]);
      setLoading(false);
      setCurrentPage(prev => prev + 1);
    }, 500);
  }, [generateCatImages]);

  return (
    <div className="waifu-pics-browser">
      {/* Browser Header */}
      <div className="browser-header">
        <div className="browser-title-bar">
          <span className="browser-title">WaifuPics Browser - The Ultimate Waifu Gallery</span>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        {/* Navigation Bar */}
        <div className="browser-nav">
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => loadCategory('Popular')}>Back</button>
            <button className="nav-btn" onClick={() => window.location.reload()}>Forward</button>
            <button className="nav-btn" onClick={() => loadCategory(selectedCategory)}>Refresh</button>
            <button className="nav-btn" onClick={() => setImages([])}>Stop</button>
          </div>
          
          <div className="address-bar">
            <span className="protocol">https://</span>
            <span className="domain">waifupics.moe</span>
            <span className="path">
              {currentSearch ? `/search?q=${encodeURIComponent(currentSearch)}` : `/${selectedCategory.toLowerCase()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="browser-content">
        {/* Sidebar */}
        <div className="browser-sidebar">
          <div className="search-section">
            <h3>WaifuSearch</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for waifus..."
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(currentSearch)}
              />
              <button 
                className="search-btn"
                onClick={() => handleSearch(currentSearch)}
              >
                Go
              </button>
            </div>
            <button 
              className="random-btn"
              onClick={handleRandomSearch}
            >
              I'm Feeling Lucky
            </button>
          </div>

          <div className="categories-section">
            <h3>Categories</h3>
            <div className="category-list">
              {WAIFU_CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => loadCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h3>Gallery Stats</h3>
            <div className="stat-item">
              <span>Total Images:</span>
              <span>{images.length}</span>
            </div>
            <div className="stat-item">
              <span>Current Page:</span>
              <span>{currentPage}</span>
            </div>
            <div className="stat-item">
              <span>Category:</span>
              <span>{selectedCategory}</span>
            </div>
          </div>
        </div>

        {/* Main Gallery */}
        <div className="gallery-main">
          {/* Status Bar */}
          <div className="status-bar">
            <span>
              {loading ? 'Loading waifus...' : 
               currentSearch ? `Search results for "${currentSearch}"` :
               `${selectedCategory} waifus`}
            </span>
            <span>{images.length} images found</span>
          </div>

          {/* Image Grid */}
          <div className="image-grid">
            {console.log('Rendering image grid. Loading:', loading, 'Images length:', images.length, 'Images:', images)}
            {loading && images.length === 0 ? (
              // Loading placeholders
              Array.from({ length: 12 }).map((_, index) => (
                <div key={`loading-${index}`} className="image-card loading">
                  <div className="image-placeholder">
                    <div className="loading-spinner"></div>
                  </div>
                  <div className="image-info">
                    <div className="loading-text"></div>
                  </div>
                </div>
              ))
            ) : (
              images.map((image, index) => (
                <div 
                  key={image.id} 
                  className="image-card"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="image-container">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      loading="lazy"
                      onLoad={() => console.log('Image loaded:', image.url)}
                      onError={(e) => {
                        console.error('Image failed to load:', image.url, e);
                        // Fallback to a solid color image
                        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" /><stop offset="100%" style="stop-color:#e84393;stop-opacity:1" /></linearGradient></defs><rect width="300" height="300" fill="url(#grad)"/><text x="150" y="140" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="white">WAIFU</text><text x="150" y="170" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="white">${image.title}</text></svg>`)}`;
                        (e.target as HTMLImageElement).src = fallbackSvg;
                      }}
                      style={{ 
                        backgroundColor: '#f0f0f0',
                        minHeight: '120px',
                        minWidth: '100%'
                      }}
                    />
                    <div className="image-overlay">
                      <span>View Full Size</span>
                    </div>
                  </div>
                  <div className="image-info">
                    <span className="image-title">{image.title}</span>
                    <span className="image-category">{image.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
          {images.length > 0 && !loading && (
            <div className="load-more-section">
              <button className="load-more-btn" onClick={loadMore}>
                Load More Waifus
              </button>
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && images.length > 0 && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <span>Loading more waifus...</span>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedImage.title}</span>
              <button 
                className="modal-close"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-image">
              <img src={selectedImage.url} alt={selectedImage.title} />
            </div>
            <div className="modal-info">
              <div className="info-item">
                <span>Category:</span>
                <span>{selectedImage.category}</span>
              </div>
              <div className="info-item">
                <span>Resolution:</span>
                <span>300x300px</span>
              </div>
              <div className="info-item">
                <span>Type:</span>
                <span>Premium Waifu</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="action-btn download">Download</button>
              <button className="action-btn favorite">Add to Favorites</button>
              <button className="action-btn share">Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
