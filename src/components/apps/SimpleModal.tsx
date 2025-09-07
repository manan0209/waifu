import React, { useState, useRef } from 'react';

interface SimpleModalProps {
  title: string;
  url: string;
  onClose: () => void;
}

export default function SimpleModal({ title, url, onClose }: SimpleModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const constrainedX = Math.max(0, Math.min(window.innerWidth - 600, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - 400, newY));
      
      setPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className="simple-modal-overlay"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={modalRef}
        className={`simple-modal ${isDragging ? 'dragging' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="simple-modal-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <span className="simple-modal-title">{title}</span>
          <button 
            className="simple-modal-close" 
            onClick={handleCloseClick}
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close
          >
            ×
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="simple-modal-content">
          <iframe
            src={url}
            title={title}
            className="simple-modal-iframe"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
