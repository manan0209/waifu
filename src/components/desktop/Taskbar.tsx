import { useState } from 'react';

interface TaskbarProps {
  onStartClick: () => void;
  currentTime: Date;
  windows: any[];
  onWindowClick: (windowId: string) => void;
  startMenuOpen: boolean;
}

export default function Taskbar({ 
  onStartClick, 
  currentTime, 
  windows, 
  onWindowClick,
  startMenuOpen 
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
              {window.appId === 'waifu-chat' && '💬'}
              {window.appId === 'notepad' && '📝'}
              {window.appId === 'calculator' && '🔢'}
              {window.appId === 'file-explorer' && '📁'}
              {window.appId === 'settings' && '⚙️'}
            </div>
            <span className="task-title">{window.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="system-tray">
        {/* Volume Icon */}
        <div className="tray-icon volume-icon" title="Volume">
          🔊
        </div>

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
