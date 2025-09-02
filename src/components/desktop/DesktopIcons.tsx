import { useState } from 'react';
import WaifuChat from '../apps/WaifuChat';
import Notepad from '../../applications/Notepad';
import Calculator from '../../applications/Calculator';
import FileExplorer from '../../applications/FileExplorer';
import Minesweeper from '../../applications/Minesweeper';

interface DesktopIconsProps {
  onOpenWindow: (appId: string, title: string, component: React.ReactNode) => void;
}

interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  appId: string;
}

export default function DesktopIcons({ onOpenWindow }: DesktopIconsProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const desktopIcons: DesktopIcon[] = [
    {
      id: 'waifu-chat',
      title: 'Waifu Chat',
      icon: '💬',
      x: 50,
      y: 50,
      appId: 'waifu-chat'
    },
    {
      id: 'notepad',
      title: 'Notepad',
      icon: '📝',
      x: 50,
      y: 150,
      appId: 'notepad'
    },
    {
      id: 'calculator',
      title: 'Calculator',
      icon: '🔢',
      x: 50,
      y: 250,
      appId: 'calculator'
    },
    {
      id: 'file-explorer',
      title: 'My Computer',
      icon: '💻',
      x: 50,
      y: 350,
      appId: 'file-explorer'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: '💣',
      x: 150,
      y: 50,
      appId: 'minesweeper'
    },
    {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      icon: '🗑️',
      x: 50,
      y: 450,
      appId: 'recycle-bin'
    }
  ];

  const handleIconClick = (icon: DesktopIcon) => {
    setSelectedIcon(icon.id);
  };

  const handleIconDoubleClick = (icon: DesktopIcon) => {
    let component;
    
    switch (icon.appId) {
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
      default:
        return;
    }

    onOpenWindow(icon.appId, icon.title, component);
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  };

  return (
    <div className="desktop-icons" onClick={handleDesktopClick}>
      {desktopIcons.map(icon => (
        <div
          key={icon.id}
          className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
          style={{
            left: icon.x,
            top: icon.y
          }}
          onClick={() => handleIconClick(icon)}
          onDoubleClick={() => handleIconDoubleClick(icon)}
        >
          <div className="icon-image">
            {icon.icon}
          </div>
          <div className="icon-label">
            {icon.title}
          </div>
        </div>
      ))}
    </div>
  );
}
