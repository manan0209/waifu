import React from 'react';
import WebApp from '../../applications/WebApp';

interface SusAppProps {
  title?: string;
}

export default function SusApp({ title = "System Security Check" }: SusAppProps) {
  return (
    <div className="sus-app-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <WebApp url="https://sus.3kh0.net/" title={title} />
      
      {/* Credit overlay */}
      <div 
        className="sus-credit-overlay"
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          border: '1px solid #333',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>Sus App by</div>
          <div style={{ fontWeight: 'bold', color: '#ff6b6b' }}>Rowan</div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
            Used with permission ♡
          </div>
        </div>
      </div>
    </div>
  );
}
