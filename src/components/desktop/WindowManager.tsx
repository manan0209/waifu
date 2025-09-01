import { useState, useRef } from 'react';

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
}

export default function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus
}: WindowManagerProps) {
  const [dragData, setDragData] = useState<{
    windowId: string | null;
    startX: number;
    startY: number;
    startWindowX: number;
    startWindowY: number;
  }>({
    windowId: null,
    startX: 0,
    startY: 0,
    startWindowX: 0,
    startWindowY: 0
  });

  const handleMouseDown = (e: React.MouseEvent, windowId: string, windowX: number, windowY: number) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    onFocus(windowId);
    setDragData({
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      startWindowX: windowX,
      startWindowY: windowY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragData.windowId) return;

    const deltaX = e.clientX - dragData.startX;
    const deltaY = e.clientY - dragData.startY;
    
    // Update window position (this would need to be passed back to parent)
    // For now, we'll handle this with CSS transforms
  };

  const handleMouseUp = () => {
    setDragData({
      windowId: null,
      startX: 0,
      startY: 0,
      startWindowX: 0,
      startWindowY: 0
    });
  };

  return (
    <div 
      className="window-manager"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {windows.map(window => (
        <div
          key={window.id}
          className={`window ${window.isMaximized ? 'maximized' : ''} ${window.isMinimized ? 'minimized' : ''}`}
          style={{
            left: window.isMaximized ? 0 : window.x,
            top: window.isMaximized ? 0 : window.y,
            width: window.isMaximized ? '100%' : window.width,
            height: window.isMaximized ? 'calc(100% - 40px)' : window.height,
            zIndex: window.zIndex
          }}
          onClick={() => onFocus(window.id)}
        >
          {/* Title Bar */}
          <div 
            className="title-bar"
            onMouseDown={(e) => handleMouseDown(e, window.id, window.x, window.y)}
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
      ))}
    </div>
  );
}
