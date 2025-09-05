import React, { useState } from 'react';

interface ProjectViewerProps {
  projectUrl: string;
  projectName: string;
  projectDescription?: string;
}

export default function ProjectViewer({ 
  projectUrl, 
  projectName, 
  projectDescription 
}: ProjectViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`project-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="project-viewer-header">
        <div className="header-left">
          <span className="project-indicator">🌐</span>
          <h2>{projectName}</h2>
        </div>
        <div className="header-right">
          <button 
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? '⤦' : '⤢'}
          </button>
        </div>
      </div>

      {/* Project Info Bar */}
      <div className="project-info-bar">
        <div className="address-bar">
          <span className="address-icon">🔗</span>
          <span className="address-text">{projectUrl}</span>
        </div>
        {projectDescription && (
          <div className="project-description">
            {projectDescription}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="project-viewer-content">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">⏳</div>
            <div className="loading-text">Loading {projectName}...</div>
          </div>
        )}
        
        <iframe
          src={projectUrl}
          className="project-iframe"
          onLoad={handleLoad}
          title={projectName}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Footer */}
      <div className="project-viewer-footer">
        <div className="status-bar">
          <span className="status-text">
            {isLoading ? 'Loading...' : 'Ready'}
          </span>
          <span className="connection-status">🟢 Connected</span>
        </div>
      </div>

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <div className="fullscreen-controls">
          <button 
            className="exit-fullscreen"
            onClick={toggleFullscreen}
          >
            Exit Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}
