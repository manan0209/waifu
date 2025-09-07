import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import WaifuChat from '../apps/WaifuChat';
import WebApp from '../../applications/WebApp';
import Notepad from '../../applications/Notepad';
import Calculator from '../../applications/Calculator';
import FileExplorer from '../../applications/FileExplorer';
import RecycleBin from '../../applications/RecycleBin';
import Minesweeper from '../../applications/Minesweeper';
import TetrisGame from '../games/TetrisGame';
import Solitaire from '../games/Solitaire';
import WaifuTube from '../apps/VideoPlayer';
import WaifuPics from '../apps/WaifuPics';
import Settings from '../apps/Settings';
import { Icons } from '../ui/Icons';

interface DesktopIconsProps {
  onOpenWindow: (appId: string, title: string, component: React.ReactNode) => void;
  onUserInteraction?: () => void;
  onVirusActivation?: () => void;
}

interface DesktopIconsRef {
  resetPositions: () => void;
}

interface DesktopIcon {
  id: string;
  title: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  appId: string;
}

const DesktopIcons = forwardRef<DesktopIconsRef, DesktopIconsProps>(
  ({ onOpenWindow, onUserInteraction, onVirusActivation }, ref) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Improved default positions with better spacing
  const getDefaultPositions = () => {
    const spacing = 120;
    const startX = 30;
    const startY = 30;
    const iconsPerRow = 6;
    
    return {
      'waifu-chat': { x: startX, y: startY },
      'tetris': { x: startX + spacing, y: startY },
      'video-player': { x: startX + spacing * 2, y: startY },
      'waifu-pics': { x: startX + spacing * 3, y: startY },
      'gitroaster': { x: startX + spacing * 4, y: startY },
      'snippix': { x: startX + spacing * 5, y: startY },
      'notepad': { x: startX, y: startY + spacing },
      'calculator': { x: startX + spacing, y: startY + spacing },
      'file-explorer': { x: startX + spacing * 2, y: startY + spacing },
      'minesweeper': { x: startX + spacing * 3, y: startY + spacing },
      'solitaire': { x: startX + spacing * 4, y: startY + spacing },
      'recycle-bin': { x: startX, y: startY + spacing * 2 },
      'settings': { x: startX + spacing, y: startY + spacing * 2 }
    };
  };

  // Reset to default positions
  const resetToDefaults = () => {
    const defaultPositions = getDefaultPositions();
    setIconPositions(defaultPositions);
    localStorage.setItem('desktop-icon-positions', JSON.stringify(defaultPositions));
  };

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    resetPositions: resetToDefaults
  }), []);

  // Load saved positions from localStorage or use defaults
  useEffect(() => {
    const savedPositions = localStorage.getItem('desktop-icon-positions');
    if (savedPositions) {
      setIconPositions(JSON.parse(savedPositions));
    } else {
      setIconPositions(getDefaultPositions());
    }
  }, []);

  // Save positions to localStorage
  const savePositions = (positions: Record<string, { x: number; y: number }>) => {
    localStorage.setItem('desktop-icon-positions', JSON.stringify(positions));
    setIconPositions(positions);
  };

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
      title: 'WaifuTube',
      icon: <Icons.VideoPlayer size={32} />,
      x: 250,
      y: 50,
      appId: 'video-player'
    },
    // Temporarily disabled Waifu Browser - keeping code for future fixes
    // {
    //   id: 'waifu-pics',
    //   title: 'Waifu Browser',
    //   icon: <Icons.Browser size={32} />,
    //   x: 350,
    //   y: 50,
    //   appId: 'waifu-pics'
    // },
    {
      id: 'gitroaster',
      title: 'GitRoaster',
      icon: <img src="/roast.svg" alt="GitRoaster" style={{ width: 32, height: 32 }} />,
      x: 450,
      y: 50,
      appId: 'gitroaster'
    },
    {
      id: 'snippix',
      title: 'Snippix',
      icon: <img src="/snippix 512.png" alt="Snippix" style={{ width: 32, height: 32 }} />,
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
    }
  ];

  // Handle mouse down for drag start
  const handleMouseDown = (e: React.MouseEvent, iconName: string) => {
    if (e.button === 0) { // Left click only
      setSelectedIcon(iconName);
      setDraggedIcon(iconName);
      
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      e.preventDefault();
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedIcon && iconPositions[draggedIcon]) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to screen bounds
      const constrainedX = Math.max(0, Math.min(window.innerWidth - 80, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - 100, newY));
      
      const newPositions = {
        ...iconPositions,
        [draggedIcon]: { x: constrainedX, y: constrainedY }
      };
      
      setIconPositions(newPositions);
    }
  };

  // Handle mouse up to end drag
  const handleMouseUp = () => {
    if (draggedIcon && iconPositions[draggedIcon]) {
      savePositions(iconPositions);
    }
    setDraggedIcon(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Handle double click to open app
  const handleDoubleClick = (iconId: string) => {
    onUserInteraction?.(); // Trigger music on user interaction
    
    const componentMap: Record<string, React.ReactNode> = {
      'waifu-chat': <WaifuChat />,
      'tetris': <TetrisGame />,
      'video-player': <WaifuTube />,
      // 'waifu-pics': <WaifuPics onClose={() => {}} />, // Temporarily disabled
      'gitroaster': <WebApp title="GitRoaster - AI-powered code review and analysis tool" url="https://gitroaster.vercel.app" />,
      'snippix': <WebApp title="Snippix - Smart code snippet manager and organizer" url="https://snippixbymnn.vercel.app" />,
      'notepad': <Notepad />,
      'calculator': <Calculator />,
      'file-explorer': <FileExplorer />,
      'minesweeper': <Minesweeper />,
      'solitaire': <Solitaire />,
      'settings': <Settings />,
      'recycle-bin': <RecycleBin onVirusActivation={onVirusActivation} />
    };

    const icon = desktopIcons.find(icon => icon.id === iconId);
    const component = componentMap[iconId];
    
    if (icon && component) {
      onOpenWindow(iconId, icon.title, component);
    }
  };

  // Handle single click to select icon
  const handleIconClick = (iconId: string) => {
    if (draggedIcon) return; // Don't select while dragging
    setSelectedIcon(selectedIcon === iconId ? null : iconId);
    onUserInteraction?.(); // Trigger music on user interaction
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  };

  return (
    <div 
      className="desktop-icons" 
      onClick={handleDesktopClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {desktopIcons.map(icon => {
        const position = iconPositions[icon.id] || { x: icon.x, y: icon.y };
        return (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''} ${draggedIcon === icon.id ? 'dragging' : ''}`}
            style={{
              left: position.x,
              top: position.y,
              cursor: draggedIcon === icon.id ? 'grabbing' : 'grab'
            }}
            onMouseDown={(e) => handleMouseDown(e, icon.id)}
            onClick={() => handleIconClick(icon.id)}
            onDoubleClick={() => handleDoubleClick(icon.id)}
          >
            <div className="icon-image">
              {icon.icon}
            </div>
            <div className="icon-label">
              {icon.title}
            </div>
          </div>
        );
      })}
      
    </div>
  );
});

DesktopIcons.displayName = 'DesktopIcons';

export default DesktopIcons;
