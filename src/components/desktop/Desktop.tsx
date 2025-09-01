import { useState, useEffect } from 'react';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import DesktopIcons from './DesktopIcons';
import StartMenu from './StartMenu';

interface DesktopProps {
  onShutdown?: () => void;
}

export default function Desktop({ onShutdown }: DesktopProps) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windows, setWindows] = useState<any[]>([]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu);
  };

  const openWindow = (appId: string, title: string, component: React.ReactNode) => {
    const newWindow = {
      id: Date.now().toString(),
      appId,
      title,
      component,
      x: 100 + (windows.length * 30),
      y: 100 + (windows.length * 30),
      width: 600,
      height: 400,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1
    };
    
    setWindows(prev => [...prev, newWindow]);
    setShowStartMenu(false);
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const focusWindow = (windowId: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0);
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w
    ));
  };

  return (
    <div className="desktop">
      
      <div className="desktop-background">
        
        <div className="wallpaper"></div>
        
        
        <DesktopIcons onOpenWindow={openWindow} />
      </div>

      
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
      />

      
      {showStartMenu && (
        <StartMenu
          onClose={() => setShowStartMenu(false)}
          onOpenWindow={openWindow}
          onShutdown={onShutdown}
        />
      )}

      
      <Taskbar
        onStartClick={handleStartClick}
        currentTime={currentTime}
        windows={windows}
        onWindowClick={minimizeWindow}
        startMenuOpen={showStartMenu}
      />
    </div>
  );
}
