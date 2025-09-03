import { useState } from 'react';
import WaifuChat from '../apps/WaifuChat';
import Notepad from '../../applications/Notepad';
import Calculator from '../../applications/Calculator';
import FileExplorer from '../../applications/FileExplorer';
import Minesweeper from '../../applications/Minesweeper';
import TetrisGame from '../games/TetrisGame';
import WaifuTube from '../apps/WaifuTube';
import WaifuBrowser from '../apps/WaifuBrowser';
import { Icons } from '../ui/Icons';

interface DesktopIconsProps {
  onOpenWindow: (appId: string, title: string, component: React.ReactNode) => void;
}

interface DesktopIcon {
  id: string;
  title: string;
  icon: React.ReactNode;
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
      icon: <Icons.Notepad size={32} color="#FF69B4" />,
      x: 50,
      y: 50,
      appId: 'waifu-chat'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      icon: <span style={{fontSize: '32px'}}>🎮</span>,
      x: 150,
      y: 50,
      appId: 'tetris'
    },
    {
      id: 'waifutube',
      title: 'WaifuTube',
      icon: <span style={{fontSize: '32px'}}>📺</span>,
      x: 250,
      y: 50,
      appId: 'waifutube'
    },
    {
      id: 'waifu-browser',
      title: 'Waifu Browser',
      icon: <span style={{fontSize: '32px'}}>🌐</span>,
      x: 350,
      y: 50,
      appId: 'waifu-browser'
    },
    {
      id: 'notepad',
      title: 'Notepad',
      icon: <Icons.Notepad size={32} />,
      x: 50,
      y: 150,
      appId: 'notepad'
    },
    {
      id: 'calculator',
      title: 'Calculator',
      icon: <Icons.Calculator size={32} />,
      x: 150,
      y: 150,
      appId: 'calculator'
    },
    {
      id: 'file-explorer',
      title: 'My Computer',
      icon: <Icons.Computer size={32} />,
      x: 50,
      y: 250,
      appId: 'file-explorer'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: <Icons.Settings size={32} color="#8B0000" />,
      x: 150,
      y: 250,
      appId: 'minesweeper'
    },
    {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      icon: <Icons.Folder size={32} color="#654321" />,
      x: 50,
      y: 350,
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
      case 'tetris':
        component = <TetrisGame />;
        break;
      case 'waifutube':
        component = <WaifuTube />;
        break;
      case 'waifu-browser':
        component = <WaifuBrowser />;
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
