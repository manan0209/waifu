import { useState } from 'react';
import { Icons } from '../ui/Icons';
import MusicControl from '../audio/MusicControl';

interface TaskbarProps {
  onStartClick: () => void;
  currentTime: Date;
  windows: any[];
  onWindowClick: (windowId: string) => void;
  startMenuOpen: boolean;
  onOpenWindow?: (appId: string, title: string, component: React.ReactNode) => void;
}

export default function Taskbar({ 
  onStartClick, 
  currentTime, 
  windows, 
  onWindowClick,
  startMenuOpen,
  onOpenWindow 
}: TaskbarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const quickLaunchApps = [
    { id: 'file-explorer', icon: <Icons.Computer size={16} />, title: 'My Computer' },
    { id: 'waifu-chat', icon: <Icons.Chat size={16} />, title: 'Waifu Chat' },
    { id: 'notepad', icon: <Icons.Notepad size={16} />, title: 'Notepad' },
    { id: 'calculator', icon: <Icons.Calculator size={16} />, title: 'Calculator' }
  ];

  const handleQuickLaunch = (appId: string, title: string) => {
    if (onOpenWindow) {
      // Import components dynamically to avoid circular imports
      import('../apps/WaifuChat').then(module => {
        const WaifuChat = module.default;
        if (appId === 'waifu-chat') {
          onOpenWindow(appId, title, <WaifuChat />);
        }
      });
      import('../../applications/Notepad').then(module => {
        const Notepad = module.default;
        if (appId === 'notepad') {
          onOpenWindow(appId, title, <Notepad />);
        }
      });
      import('../../applications/Calculator').then(module => {
        const Calculator = module.default;
        if (appId === 'calculator') {
          onOpenWindow(appId, title, <Calculator />);
        }
      });
      import('../../applications/FileExplorer').then(module => {
        const FileExplorer = module.default;
        if (appId === 'file-explorer') {
          onOpenWindow(appId, title, <FileExplorer />);
        }
      });
    }
  };

  return (
    <div className="taskbar">
      {/* Start Button */}
      <button 
        className={`start-button ${startMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <div className="start-icon">
          <div className="waifu-logo"></div>
        </div>
        <span className="start-text">Start</span>
      </button>

      {/* Task Buttons */}
      <div className="task-buttons">
        {windows.filter(w => !w.isMinimized).map(window => (
          <button
            key={window.id}
            className="task-button"
            onClick={() => onWindowClick(window.id)}
            title={window.title}
          >
            <div className="task-icon">
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
            <span className="task-title">{window.title}</span>
          </button>
        ))}
      </div>

      {/* Quick Launch */}
      <div className="quick-launch">
        {quickLaunchApps.map(app => (
          <button
            key={app.id}
            className="quick-launch-btn"
            onClick={() => handleQuickLaunch(app.id, app.title)}
            title={app.title}
          >
            {app.icon}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="system-tray">
        {/* Music Control */}
        <MusicControl className="tray-music-control" />

        

        {/* Network Icon */}
        <div className="tray-icon network-icon" title="Network">
          🌐
        </div>

        {/* System Clock */}
        <div className="system-clock">
          <div className="clock-time">{formatTime(currentTime)}</div>
          <div className="clock-date">{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  );
}
