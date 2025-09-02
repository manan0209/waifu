import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '../../hooks/useDraggable';

interface Window {
  id: string;
  appId: string;
  title: string;
  component: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowManagerProps {
  windows: Window[];
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onUpdatePosition: (windowId: string, x: number, y: number) => void;
}

function WindowComponent({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onUpdatePosition 
}: {
  window: Window;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onUpdatePosition: (windowId: string, x: number, y: number) => void;
}) {
  const { position, handleMouseDown, dragProps } = useDraggable({ 
    x: window.x, 
    y: window.y 
  });

  // Update parent when position changes
  useEffect(() => {
    if (position.x !== window.x || position.y !== window.y) {
      onUpdatePosition(window.id, position.x, position.y);
    }
  }, [position.x, position.y, window.x, window.y, window.id, onUpdatePosition]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    onFocus(window.id);
    handleMouseDown(e);
  };

  return (
    <div
      className={`window ${window.isMaximized ? 'maximized' : ''} ${window.isMinimized ? 'minimized' : ''}`}
      style={{
        ...dragProps.style,
        left: window.isMaximized ? 0 : position.x,
        top: window.isMaximized ? 0 : position.y,
        width: window.isMaximized ? '100%' : window.width,
        height: window.isMaximized ? 'calc(100% - 40px)' : window.height,
        zIndex: window.zIndex
      }}
      onClick={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div 
        className="title-bar"
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="title-text">
          <div className="window-icon">
            {window.appId === 'waifu-chat' && '💬'}
            {window.appId === 'notepad' && '📝'}
            {window.appId === 'calculator' && '🔢'}
            {window.appId === 'file-explorer' && '📁'}
            {window.appId === 'settings' && '⚙️'}
          </div>
          <span>{window.title}</span>
        </div>
        
        <div className="window-controls">
          <button 
            className="control-btn minimize-btn"
            onClick={() => onMinimize(window.id)}
            title="Minimize"
          >
            ─
          </button>
          <button 
            className="control-btn maximize-btn"
            onClick={() => onMaximize(window.id)}
            title={window.isMaximized ? "Restore" : "Maximize"}
          >
            {window.isMaximized ? '❐' : '□'}
          </button>
          <button 
            className="control-btn close-btn"
            onClick={() => onClose(window.id)}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="window-content">
        {window.component}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          <div className="resize-handle resize-n"></div>
          <div className="resize-handle resize-s"></div>
          <div className="resize-handle resize-e"></div>
          <div className="resize-handle resize-w"></div>
          <div className="resize-handle resize-ne"></div>
          <div className="resize-handle resize-nw"></div>
          <div className="resize-handle resize-se"></div>
          <div className="resize-handle resize-sw"></div>
        </>
      )}
    </div>
  );
}

export default function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition
}: WindowManagerProps) {
  return (
    <div className="window-manager">
      {windows.map(window => (
        <WindowComponent
          key={window.id}
          window={window}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onFocus={onFocus}
          onUpdatePosition={onUpdatePosition}
        />
      ))}
    </div>
  );
}
