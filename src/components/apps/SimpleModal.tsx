import React, { useState, useRef, useEffect } from 'react';

interface SimpleModalProps {
  title: string;
  url: string;
  onClose: () => void;
}

export default function SimpleModal({ title, url, onClose }: SimpleModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && e.target instanceof HTMLElement && 
        e.target.closest('.simple-modal-header') && 
        !e.target.closest('.simple-modal-close')) {
      
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  // Handle global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Constrain to viewport with some padding
        const maxX = window.innerWidth - 800;
        const maxY = window.innerHeight - 600;
        const constrainedX = Math.max(0, Math.min(maxX, newX));
        const constrainedY = Math.max(0, Math.min(maxY, newY));
        
        setPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="simple-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`simple-modal ${isDragging ? 'dragging' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          position: 'fixed'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="simple-modal-header"
          onMouseDown={handleMouseDown}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >
          <span className="simple-modal-title">{title}</span>
          <button 
            className="simple-modal-close" 
            onClick={handleCloseClick}
            onMouseDown={(e) => e.stopPropagation()}
            type="button"
            aria-label="Close"
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
