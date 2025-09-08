import React, { useState } from 'react';
import WaifuChat from '../apps/WaifuChat';
import WebApp from '../../applications/WebApp';
import Notepad from '../../applications/Notepad';
import Calculator from '../../applications/Calculator';
import FileExplorer from '../../applications/FileExplorer';
import Minesweeper from '../../applications/Minesweeper';
import Settings from '../apps/Settings';
import TetrisGame from '../games/TetrisGame';
import VideoPlayer from '../apps/VideoPlayer';
import WaifuPics from '../apps/WaifuPics';
import Solitaire from '../games/Solitaire';
import MediaPlayer from '../apps/MediaPlayer';
import { Icons } from '../ui/Icons';

interface StartMenuProps {
  onClose: () => void;
  onOpenWindow: (appId: string, title: string, component: React.ReactNode) => void;
  onShutdown?: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  appId: string;
  category: 'programs' | 'system';
}

export default function StartMenu({ onClose, onOpenWindow, onShutdown }: StartMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: 'waifu-chat',
      title: 'Waifu Chat',
      icon: <Icons.Chat size={16} />,
      appId: 'waifu-chat',
      category: 'programs'
    },
    {
      id: 'tetris',
      title: 'Tetris Game',
      icon: <Icons.Tetris size={16} />,
      appId: 'tetris',
      category: 'programs'
    },
    {
      id: 'video-player',
      title: 'Video Player',
      icon: <Icons.VideoPlayer size={16} />,
      appId: 'video-player',
      category: 'programs'
    },
    // Temporarily disabled Waifu Browser
    // {
    //   id: 'waifu-browser',
    //   title: 'Waifu Browser',
    //   icon: <Icons.Browser size={16} />,
    //   appId: 'waifu-browser',
    //   category: 'programs'
    // },
    {
      id: 'gitroaster',
      title: 'GitRoaster',
      icon: <img src="/roast.svg" alt="GitRoaster" style={{ width: 16, height: 16 }} />,
      appId: 'gitroaster',
      category: 'programs'
    },
    {
      id: 'snippix',
      title: 'Snippix',
      icon: <img src="/snippix 512.png" alt="Snippix" style={{ width: 16, height: 16 }} />,
      appId: 'snippix',
      category: 'programs'
    },
    {
      id: 'notepad',
      title: 'Notepad',
      icon: <Icons.Notepad size={16} />,
      appId: 'notepad',
      category: 'programs'
    },
    {
      id: 'calculator',
      title: 'Calculator',
      icon: <Icons.Calculator size={16} />,
      appId: 'calculator',
      category: 'programs'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: <Icons.Minesweeper size={16} />,
      appId: 'minesweeper',
      category: 'programs'
    },
    {
      id: 'solitaire',
      title: 'Solitaire',
      icon: <Icons.Solitaire size={16} />,
      appId: 'solitaire',
      category: 'programs'
    },
    {
      id: 'media-player',
      title: 'Media Player',
      icon: <Icons.MediaPlayer size={16} />,
      appId: 'media-player',
      category: 'programs'
    },
    {
      id: 'file-explorer',
      title: 'My Computer',
      icon: <Icons.Computer size={16} />,
      appId: 'file-explorer',
      category: 'system'
    }
    // Settings app removed from start menu - keeping code commented for future use
    // {
    //   id: 'settings',
    //   title: 'Control Panel',
    //   icon: <Icons.Settings size={16} />,
    //   appId: 'settings',
    //   category: 'system'
    // }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    let component;
    
    switch (item.appId) {
      case 'waifu-chat':
        component = <WaifuChat />;
        break;
      case 'tetris':
        component = <TetrisGame />;
        break;
      case 'video-player':
        component = <VideoPlayer />;
        break;
      case 'gitroaster':
        component = <WebApp title="GitRoaster - AI-powered code review and analysis tool" url="https://gitroaster.vercel.app" />;
        break;
      case 'snippix':
        component = <WebApp title="Snippix - Smart code snippet manager and organizer" url="https://snippixbymnn.vercel.app" />;
        break;
      // Temporarily disabled
      // case 'waifu-browser':
      //   component = <WaifuPics onClose={() => {}} />;
      //   break;
      case 'notepad':
        component = <Notepad />;
        break;
      case 'calculator':
        component = <Calculator />;
        break;
      case 'file-explorer':
        component = <FileExplorer />;
        break;
      case 'minesweeper':
        component = <Minesweeper />;
        break;
      case 'solitaire':
        component = <Solitaire />;
        break;
      case 'media-player':
        component = <MediaPlayer />;
        break;
      // case 'settings':
      //   component = <Settings />;
      //   break;
      default:
        return;
    }

    onOpenWindow(item.appId, item.title, component);
    onClose();
  };

  const programItems = menuItems.filter(item => item.category === 'programs');
  const systemItems = menuItems.filter(item => item.category === 'system');

  return (
    <>
      {/* Backdrop */}
      <div className="start-menu-backdrop" onClick={onClose}></div>
      
      {/* Start Menu */}
      <div className="start-menu">
        {/* User Section */}
        <div className="start-menu-header">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <div className="username">User</div>
            <div className="computer-name">WAIFU-PC</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="start-menu-content">
          {/* Programs Section */}
          <div className="menu-section">
            <div className="section-title">Programs</div>
            {programItems.map(item => (
              <div
                key={item.id}
                className={`menu-item ${hoveredItem === item.id ? 'hovered' : ''}`}
                onClick={() => handleMenuItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-title">{item.title}</div>
                <div className="menu-arrow">▶</div>
              </div>
            ))}
          </div>

          {/* System Section */}
          <div className="menu-section">
            <div className="section-title">System</div>
            {systemItems.map(item => (
              <div
                key={item.id}
                className={`menu-item ${hoveredItem === item.id ? 'hovered' : ''}`}
                onClick={() => handleMenuItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-title">{item.title}</div>
                <div className="menu-arrow">▶</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="start-menu-footer">
          <div className="footer-buttons">
            <button className="footer-btn help-btn" title="Help">
              <span className="btn-icon">❓</span>
              <span className="btn-text">Help</span>
            </button>
            <button className="footer-btn run-btn" title="Run">
              <span className="btn-icon">🏃</span>
              <span className="btn-text">Run...</span>
            </button>
            <button 
              className="footer-btn shutdown-btn" 
              title="Shut Down"
              onClick={onShutdown}
            >
              <span className="btn-icon">⏻</span>
              <span className="btn-text">Shut Down</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
