import { useState, useEffect, useCallback } from 'react';

interface Window {
  id: string;
  title: string;
  appId: string;
  isMinimized: boolean;
}

interface AltTabSwitcherProps {
  windows: Window[];
  onSelectWindow: (windowId: string) => void;
  onClose: () => void;
}

export default function AltTabSwitcher({ windows, onSelectWindow, onClose }: AltTabSwitcherProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const visibleWindows = windows.filter(w => !w.isMinimized);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab' && e.altKey) {
      e.preventDefault();
      if (e.shiftKey) {
        
        setSelectedIndex(prev => 
          prev === 0 ? visibleWindows.length - 1 : prev - 1
        );
      } else {
        
        setSelectedIndex(prev => 
          prev === visibleWindows.length - 1 ? 0 : prev + 1
        );
      }
    } else if (e.key === 'Alt') {
      
      if (visibleWindows[selectedIndex]) {
        onSelectWindow(visibleWindows[selectedIndex].id);
      }
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [selectedIndex, visibleWindows, onSelectWindow, onClose]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Alt') {
      
      if (visibleWindows[selectedIndex]) {
        onSelectWindow(visibleWindows[selectedIndex].id);
      }
      onClose();
    }
  }, [selectedIndex, visibleWindows, onSelectWindow, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  if (visibleWindows.length === 0) {
    onClose();
    return null;
  }

  return (
    <div className="alt-tab-switcher">
      <div className="alt-tab-container">
        <div className="alt-tab-header">
          Select Window
        </div>
        <div className="alt-tab-windows">
          {visibleWindows.map((window, index) => (
            <div
              key={window.id}
              className={`alt-tab-window ${index === selectedIndex ? 'selected' : ''}`}
            >
              <div className="alt-tab-icon">
                {window.appId === 'waifu-chat' && '💬'}
                {window.appId === 'notepad' && '📝'}
                {window.appId === 'calculator' && '🔢'}
                {window.appId === 'file-explorer' && '📁'}
                {window.appId === 'settings' && '⚙️'}
              </div>
              <div className="alt-tab-title">{window.title}</div>
            </div>
          ))}
        </div>
        <div className="alt-tab-footer">
          Use Alt+Tab to cycle through windows
        </div>
      </div>
    </div>
  );
}
