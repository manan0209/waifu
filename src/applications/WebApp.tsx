import React from 'react';

interface WebAppProps {
  title?: string;
  url: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function WebApp({ url, title }: WebAppProps) {
  return (
    <div className="web-app-container">
      <iframe
        src={url}
        title={title || 'Web Application'}
        className="web-app-iframe"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
