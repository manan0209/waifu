import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { useResizable } from '../../hooks/useResizable';
import { Icons } from '../ui/Icons';

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
  onUpdateSize?: (windowId: string, width: number, height: number) => void;
}

function WindowComponent({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onUpdatePosition,
  onUpdateSize 
}: {
  window: Window;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onUpdatePosition: (windowId: string, x: number, y: number) => void;
  onUpdateSize?: (windowId: string, width: number, height: number) => void;
}) {
  const { position, handleMouseDown, dragProps } = useDraggable({ 
    x: window.x, 
    y: window.y 
  });

  const { size, handleResizeStart, resizeProps } = useResizable(
    { width: window.width, height: window.height },
    {
      minWidth: 300,
      minHeight: 200,
      onResize: onUpdateSize ? (newSize) => onUpdateSize(window.id, newSize.width, newSize.height) : undefined
    }
  );

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
        width: window.isMaximized ? '100%' : size.width,
        height: window.isMaximized ? 'calc(100% - 40px)' : size.height,
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
            {window.appId === 'waifu-chat' && <Icons.Chat size={16} />}
            {window.appId === 'tetris' && <Icons.Tetris size={16} />}
            {window.appId === 'video-player' && <Icons.VideoPlayer size={16} />}
            {window.appId === 'waifu-browser' && <Icons.Browser size={16} />}
            {window.appId === 'gitroaster' && <Icons.Project size={16} color="#E74C3C" />}
            {window.appId === 'snippix' && <Icons.Project size={16} color="#3498DB" />}
            {window.appId === 'notepad' && <Icons.Notepad size={16} />}
            {window.appId === 'calculator' && <Icons.Calculator size={16} />}
            {window.appId === 'file-explorer' && <Icons.Computer size={16} />}
            {window.appId === 'minesweeper' && <Icons.Minesweeper size={16} />}
            {window.appId === 'settings' && <Icons.Settings size={16} />}
            {window.appId === 'solitaire' && <Icons.Solitaire size={16} />}
            {window.appId === 'media-player' && <Icons.MediaPlayer size={16} />}
          </div>
          <span>{window.title}</span>
        </div>
        
        <div className="window-controls">
          <button 
            className="control-btn minimize-btn"
            onClick={() => onMinimize(window.id)}
            title="Minimize"
          >
            <Icons.Minimize size={12} />
          </button>
          <button 
            className="control-btn maximize-btn"
            onClick={() => onMaximize(window.id)}
            title={window.isMaximized ? "Restore" : "Maximize"}
          >
            {window.isMaximized ? <Icons.Restore size={12} /> : <Icons.Maximize size={12} />}
          </button>
          <button 
            className="control-btn close-btn"
            onClick={() => onClose(window.id)}
            title="Close"
          >
            <Icons.Close size={12} />
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
          <div 
            className="resize-handle resize-n"
            onMouseDown={(e) => handleResizeStart(e, 'resize-n', position)}
          ></div>
          <div 
            className="resize-handle resize-s"
            onMouseDown={(e) => handleResizeStart(e, 'resize-s', position)}
          ></div>
          <div 
            className="resize-handle resize-e"
            onMouseDown={(e) => handleResizeStart(e, 'resize-e', position)}
          ></div>
          <div 
            className="resize-handle resize-w"
            onMouseDown={(e) => handleResizeStart(e, 'resize-w', position)}
          ></div>
          <div 
            className="resize-handle resize-ne"
            onMouseDown={(e) => handleResizeStart(e, 'resize-ne', position)}
          ></div>
          <div 
            className="resize-handle resize-nw"
            onMouseDown={(e) => handleResizeStart(e, 'resize-nw', position)}
          ></div>
          <div 
            className="resize-handle resize-se"
            onMouseDown={(e) => handleResizeStart(e, 'resize-se', position)}
          ></div>
          <div 
            className="resize-handle resize-sw"
            onMouseDown={(e) => handleResizeStart(e, 'resize-sw', position)}
          ></div>
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
  onUpdatePosition,
  onUpdateSize
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
          onUpdateSize={onUpdateSize}
        />
      ))}
    </div>
  );
}
