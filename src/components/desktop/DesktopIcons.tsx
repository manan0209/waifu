import { useState } from 'react';
import WaifuChat from '../apps/WaifuChat';
import Notepad from '../../applications/Notepad';
import Calculator from '../../applications/Calculator';
import FileExplorer from '../../applications/FileExplorer';
import Minesweeper from '../../applications/Minesweeper';
import TetrisGame from '../games/TetrisGame';
import Solitaire from '../games/Solitaire';
import MediaPlayer from '../apps/MediaPlayer';
import VideoPlayer from '../apps/VideoPlayer';
import WaifuBrowser from '../apps/WaifuBrowser';
import ProjectViewer from '../apps/ProjectViewer';
import Settings from '../apps/Settings';
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
      icon: <Icons.Chat size={32} />,
      x: 50,
      y: 50,
      appId: 'waifu-chat'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      icon: <Icons.Tetris size={32} />,
      x: 150,
      y: 50,
      appId: 'tetris'
    },
    {
      id: 'video-player',
      title: 'Video Player',
      icon: <Icons.VideoPlayer size={32} />,
      x: 250,
      y: 50,
      appId: 'video-player'
    },
    {
      id: 'waifu-browser',
      title: 'Waifu Browser',
      icon: <Icons.Browser size={32} />,
      x: 350,
      y: 50,
      appId: 'waifu-browser'
    },
    {
      id: 'gitroaster',
      title: 'GitRoaster',
      icon: <Icons.Project size={32} color="#E74C3C" />,
      x: 450,
      y: 50,
      appId: 'gitroaster'
    },
    {
      id: 'snippix',
      title: 'Snippix',
      icon: <Icons.Project size={32} color="#3498DB" />,
      x: 550,
      y: 50,
      appId: 'snippix'
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
      icon: <Icons.Minesweeper size={32} />,
      x: 150,
      y: 250,
      appId: 'minesweeper'
    },
    {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      icon: <Icons.RecycleBin size={32} />,
      x: 50,
      y: 350,
      appId: 'recycle-bin'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Icons.Settings size={32} />,
      x: 150,
      y: 350,
      appId: 'settings'
    },
    {
      id: 'solitaire',
      title: 'Solitaire',
      icon: <Icons.Solitaire size={32} />,
      x: 250,
      y: 350,
      appId: 'solitaire'
    },
    {
      id: 'media-player',
      title: 'Media Player',
      icon: <Icons.MediaPlayer size={32} />,
      x: 350,
      y: 350,
      appId: 'media-player'
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
      case 'video-player':
        component = <VideoPlayer />;
        break;
      case 'waifu-browser':
        component = <WaifuBrowser />;
        break;
      case 'gitroaster':
        component = <ProjectViewer 
          projectUrl="https://gitroaster.vercel.app" 
          projectName="GitRoaster"
          projectDescription="AI-powered code review and analysis tool"
        />;
        break;
      case 'snippix':
        component = <ProjectViewer 
          projectUrl="https://snippix.vercel.app" 
          projectName="Snippix"
          projectDescription="Smart code snippet manager and organizer"
        />;
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
      case 'solitaire':
        component = <Solitaire />;
        break;
      case 'media-player':
        component = <MediaPlayer />;
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
