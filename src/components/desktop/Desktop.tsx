import { useState, useEffect } from 'react';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import DesktopIcons from './DesktopIcons';
import StartMenu from './StartMenu';
import AltTabSwitcher from './AltTabSwitcher';
import NotificationManager from '../system/NotificationManager';
import DesktopMascot from '../mascot/DesktopMascot';
import { useSystemSounds } from '../../hooks/useSystemSounds';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';

interface DesktopProps {
  onShutdown?: () => void;
}

export default function Desktop({ onShutdown }: DesktopProps) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windows, setWindows] = useState<any[]>([]);
  const [showAltTab, setShowAltTab] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasPlayedStartup, setHasPlayedStartup] = useState(false);
  
  const { playButtonClick, playNotification, playStartup } = useSystemSounds();
  
  // Background music
  const bgMusic = useBackgroundMusic('/bgmusic.mp3', {
    volume: 0.2,
    loop: true,
    autoPlay: false // We'll start it after user interaction
  });

  // Play startup sound when desktop loads (only once)
  useEffect(() => {
    if (!hasPlayedStartup) {
      const timer = setTimeout(() => {
        playStartup();
        addNotification('System', 'Welcome to WaifuOS!', 'success');
        setHasPlayedStartup(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array to run only once

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.altKey && !showAltTab) {
        e.preventDefault();
        if (windows.filter(w => !w.isMinimized).length > 1) {
          setShowAltTab(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAltTab, windows]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 5000) => {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      duration,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    playNotification();
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleStartClick = () => {
    playButtonClick();
    setShowStartMenu(!showStartMenu);
    
    // Start background music on first user interaction
    if (!bgMusic.isPlaying) {
      bgMusic.play();
    }
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

  const updateWindowPosition = (windowId: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, x, y } : w
    ));
  };

  const updateWindowSize = (windowId: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, width, height } : w
    ));
  };

  return (
    <div className="desktop">
      
      <div className="desktop-background">
        
        <div className="wallpaper"></div>
        
        
        <DesktopIcons onOpenWindow={openWindow} />
        
        {/* Desktop Mascot */}
        <DesktopMascot
          isVisible={true}
          currentApp={windows.find(w => !w.isMinimized)?.title || ''}
          onMascotClick={() => addNotification('Mascot', 'Hello! I\'m your desktop companion!', 'info')}
        />
      </div>

      
            {/* Window Manager */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
        onUpdatePosition={updateWindowPosition}
        onUpdateSize={updateWindowSize}
      />

      
      {showStartMenu && (
        <StartMenu
          onClose={() => setShowStartMenu(false)}
          onOpenWindow={openWindow}
          onShutdown={onShutdown}
        />
      )}

      
            {/* Alt+Tab Switcher */}
      {showAltTab && (
        <AltTabSwitcher
          windows={windows}
          onSelectWindow={focusWindow}
          onClose={() => setShowAltTab(false)}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        onStartClick={handleStartClick}
        currentTime={currentTime}
        windows={windows}
        onWindowClick={minimizeWindow}
        startMenuOpen={showStartMenu}
        onOpenWindow={openWindow}
      />

      {/* Notification Manager */}
      <NotificationManager
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </div>
  );
}
