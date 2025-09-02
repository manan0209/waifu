import { useState } from 'react';
import WaifuChat from '../apps/WaifuChat';
import Notepad from '../../applications/Notepad';
import Calculator from '../../applications/Calculator';
import FileExplorer from '../../applications/FileExplorer';
import Minesweeper from '../../applications/Minesweeper';
import Settings from '../apps/Settings';
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
      icon: <Icons.Notepad size={16} color="#FF69B4" />,
      appId: 'waifu-chat',
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
      id: 'file-explorer',
      title: 'My Computer',
      icon: <Icons.Computer size={16} />,
      appId: 'file-explorer',
      category: 'system'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: <Icons.Settings size={16} color="#8B0000" />,
      appId: 'minesweeper',
      category: 'programs'
    },
    {
      id: 'settings',
      title: 'Control Panel',
      icon: <Icons.Settings size={16} />,
      appId: 'settings',
      category: 'system'
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    let component;
    
    switch (item.appId) {
      case 'waifu-chat':
        component = <WaifuChat />;
        break;
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
      case 'settings':
        component = <Settings />;
        break;
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
