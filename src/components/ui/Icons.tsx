// Professional SVG Icons for WaifuOS
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// File and Folder Icons
export const FolderIcon: React.FC<IconProps> = ({ size = 16, color = '#FFD700', className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path 
      fill={color} 
      d="M1 3h6l2 2h6v8H1V3z" 
      stroke="#8B7355" 
      strokeWidth="1"
    />
  </svg>
);

export const FileIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path 
      fill={color} 
      d="M2 1h8l4 4v10H2V1z" 
      stroke="#808080" 
      strokeWidth="1"
    />
    <path 
      fill="#E0E0E0" 
      d="M10 1v4h4l-4-4z"
    />
  </svg>
);

export const ExecutableIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#4A90E2" x="2" y="1" width="12" height="14" rx="1"/>
    <rect fill="#FFFFFF" x="4" y="3" width="8" height="1"/>
    <rect fill="#FFFFFF" x="4" y="5" width="6" height="1"/>
    <rect fill="#FFFFFF" x="4" y="7" width="8" height="1"/>
    <circle fill="#FF6B6B" cx="12" cy="12" r="2"/>
  </svg>
);

// Drive Icons
export const HardDriveIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#C0C0C0" x="1" y="4" width="14" height="8" rx="1" stroke="#808080"/>
    <rect fill="#404040" x="3" y="6" width="10" height="1"/>
    <rect fill="#404040" x="3" y="8" width="10" height="1"/>
    <circle fill="#00FF00" cx="13" cy="10" r="1"/>
  </svg>
);

export const FloppyDiskIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#000000" x="1" y="1" width="14" height="14" rx="1"/>
    <rect fill="#C0C0C0" x="2" y="2" width="12" height="12"/>
    <rect fill="#000000" x="3" y="3" width="10" height="6"/>
    <rect fill="#C0C0C0" x="5" y="10" width="6" height="3"/>
    <circle fill="#000000" cx="8" cy="11" r="1"/>
  </svg>
);

export const CDROMIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <circle fill="#E6E6FA" cx="8" cy="8" r="7" stroke="#8A2BE2" strokeWidth="1"/>
    <circle fill="#8A2BE2" cx="8" cy="8" r="2"/>
    <circle fill="#FFFFFF" cx="8" cy="8" r="1"/>
  </svg>
);

// Application Icons
export const NotepadIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#FFFFFF" x="2" y="1" width="12" height="14" stroke="#808080"/>
    <rect fill="#FF6B6B" x="2" y="1" width="12" height="3"/>
    <line stroke="#E0E0E0" x1="4" y1="6" x2="12" y2="6"/>
    <line stroke="#E0E0E0" x1="4" y1="8" x2="12" y2="8"/>
    <line stroke="#E0E0E0" x1="4" y1="10" x2="12" y2="10"/>
  </svg>
);

export const CalculatorIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#404040" x="1" y="1" width="14" height="14" rx="1"/>
    <rect fill="#000000" x="2" y="2" width="12" height="3"/>
    <rect fill="#C0C0C0" x="2" y="6" width="3" height="2"/>
    <rect fill="#C0C0C0" x="6" y="6" width="3" height="2"/>
    <rect fill="#C0C0C0" x="10" y="6" width="3" height="2"/>
    <rect fill="#C0C0C0" x="2" y="9" width="3" height="2"/>
    <rect fill="#C0C0C0" x="6" y="9" width="3" height="2"/>
    <rect fill="#C0C0C0" x="10" y="9" width="3" height="2"/>
    <rect fill="#C0C0C0" x="2" y="12" width="3" height="2"/>
    <rect fill="#C0C0C0" x="6" y="12" width="3" height="2"/>
    <rect fill="#4A90E2" x="10" y="12" width="3" height="2"/>
  </svg>
);

export const ComputerIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#C0C0C0" x="2" y="3" width="12" height="8" stroke="#808080"/>
    <rect fill="#000080" x="3" y="4" width="10" height="6"/>
    <rect fill="#C0C0C0" x="6" y="11" width="4" height="2"/>
    <rect fill="#808080" x="4" y="13" width="8" height="1"/>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <circle fill="#808080" cx="8" cy="8" r="3"/>
    <circle fill="#C0C0C0" cx="8" cy="8" r="2"/>
    <rect fill="#808080" x="7" y="1" width="2" height="3"/>
    <rect fill="#808080" x="7" y="12" width="2" height="3"/>
    <rect fill="#808080" x="1" y="7" width="3" height="2"/>
    <rect fill="#808080" x="12" y="7" width="3" height="2"/>
  </svg>
);

// Game Icons
export const TetrisIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#000000" x="1" y="1" width="14" height="14" stroke="#808080"/>
    <rect fill="#FF6B6B" x="3" y="3" width="2" height="2"/>
    <rect fill="#FF6B6B" x="5" y="3" width="2" height="2"/>
    <rect fill="#4ECDC4" x="3" y="5" width="2" height="2"/>
    <rect fill="#4ECDC4" x="5" y="5" width="2" height="2"/>
    <rect fill="#45B7D1" x="7" y="5" width="2" height="2"/>
    <rect fill="#45B7D1" x="9" y="5" width="2" height="2"/>
    <rect fill="#96CEB4" x="11" y="5" width="2" height="2"/>
    <rect fill="#96CEB4" x="3" y="7" width="2" height="2"/>
    <rect fill="#FECA57" x="5" y="7" width="2" height="2"/>
    <rect fill="#FECA57" x="7" y="7" width="2" height="2"/>
    <rect fill="#FECA57" x="9" y="7" width="2" height="2"/>
    <rect fill="#FF9FF3" x="11" y="7" width="2" height="2"/>
    <rect fill="#FF9FF3" x="3" y="9" width="2" height="2"/>
    <rect fill="#54A0FF" x="5" y="9" width="2" height="2"/>
    <rect fill="#54A0FF" x="7" y="9" width="2" height="2"/>
    <rect fill="#5F27CD" x="9" y="9" width="2" height="2"/>
    <rect fill="#5F27CD" x="11" y="9" width="2" height="2"/>
  </svg>
);

export const SolitaireIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#FFFFFF" x="2" y="3" width="4" height="6" rx="0.5" stroke="#000000" strokeWidth="0.5"/>
    <rect fill="#FF0000" x="3" y="4" width="2" height="1"/>
    <text x="4" y="7" fontSize="3" textAnchor="middle" fill="#FF0000">♥</text>
    
    <rect fill="#FFFFFF" x="6" y="4" width="4" height="6" rx="0.5" stroke="#000000" strokeWidth="0.5"/>
    <rect fill="#000000" x="7" y="5" width="2" height="1"/>
    <text x="8" y="8" fontSize="3" textAnchor="middle" fill="#000000">♠</text>
    
    <rect fill="#FFFFFF" x="10" y="5" width="4" height="6" rx="0.5" stroke="#000000" strokeWidth="0.5"/>
    <rect fill="#FF0000" x="11" y="6" width="2" height="1"/>
    <text x="12" y="9" fontSize="3" textAnchor="middle" fill="#FF0000">♦</text>
  </svg>
);

export const MinesweeperIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#C0C0C0" x="1" y="1" width="14" height="14" stroke="#808080"/>
    <rect fill="#808080" x="2" y="2" width="2" height="2" stroke="#404040"/>
    <rect fill="#808080" x="4" y="2" width="2" height="2" stroke="#404040"/>
    <rect fill="#FFFFFF" x="6" y="2" width="2" height="2" stroke="#404040"/>
    <text x="7" y="3.5" fontSize="2" textAnchor="middle" fill="#0000FF">1</text>
    <rect fill="#FFFFFF" x="8" y="2" width="2" height="2" stroke="#404040"/>
    <text x="9" y="3.5" fontSize="2" textAnchor="middle" fill="#008000">2</text>
    <rect fill="#808080" x="10" y="2" width="2" height="2" stroke="#404040"/>
    <rect fill="#808080" x="12" y="2" width="2" height="2" stroke="#404040"/>
    
    <rect fill="#FFFFFF" x="2" y="4" width="2" height="2" stroke="#404040"/>
    <text x="3" y="5.5" fontSize="2" textAnchor="middle" fill="#FF0000">3</text>
    <rect fill="#FF0000" x="4" y="4" width="2" height="2" stroke="#404040"/>
    <circle fill="#000000" cx="5" cy="5" r="0.8"/>
    <rect fill="#808080" x="6" y="4" width="2" height="2" stroke="#404040"/>
    <rect fill="#808080" x="8" y="4" width="2" height="2" stroke="#404040"/>
    <rect fill="#FFFFFF" x="10" y="4" width="2" height="2" stroke="#404040"/>
    <text x="11" y="5.5" fontSize="2" textAnchor="middle" fill="#800080">4</text>
    <rect fill="#808080" x="12" y="4" width="2" height="2" stroke="#404040"/>
  </svg>
);

// Media Icons
export const VideoPlayerIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#000000" x="1" y="3" width="14" height="10" rx="1"/>
    <rect fill="#1a1a1a" x="2" y="4" width="12" height="8"/>
    <polygon fill="#FFFFFF" points="6,6 6,10 10,8"/>
    <rect fill="#C0C0C0" x="2" y="12" width="3" height="1"/>
    <rect fill="#FF0000" x="5" y="12" width="1" height="1"/>
    <rect fill="#C0C0C0" x="6" y="12" width="8" height="1"/>
  </svg>
);

export const MediaPlayerIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#2C3E50" x="1" y="2" width="14" height="12" rx="1"/>
    <rect fill="#34495E" x="2" y="3" width="12" height="10"/>
    <circle fill="#E74C3C" cx="5" cy="6" r="1.5"/>
    <rect fill="#3498DB" x="3" y="8" width="4" height="1"/>
    <rect fill="#2ECC71" x="3" y="10" width="6" height="1"/>
    <rect fill="#F39C12" x="3" y="12" width="3" height="1"/>
    
    <polygon fill="#FFFFFF" points="10,5 10,9 13,7"/>
    <rect fill="#BDC3C7" x="9" y="10" width="1" height="1"/>
    <rect fill="#BDC3C7" x="11" y="10" width="1" height="1"/>
    <rect fill="#BDC3C7" x="13" y="10" width="1" height="1"/>
    
    <rect fill="#95A5A6" x="9" y="12" width="5" height="1"/>
  </svg>
);

// Web Icons
export const BrowserIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#E8F4FD" x="1" y="2" width="14" height="12" stroke="#5DADE2" strokeWidth="1"/>
    <rect fill="#2980B9" x="1" y="2" width="14" height="3"/>
    <circle fill="#E74C3C" cx="3" cy="3.5" r="0.5"/>
    <circle fill="#F39C12" cx="4.5" cy="3.5" r="0.5"/>
    <circle fill="#27AE60" cx="6" cy="3.5" r="0.5"/>
    <rect fill="#FFFFFF" x="8" y="3" width="6" height="1" rx="0.5"/>
    
    <rect fill="#FFFFFF" x="2" y="6" width="12" height="1"/>
    <rect fill="#FFFFFF" x="2" y="8" width="8" height="1"/>
    <rect fill="#FFFFFF" x="2" y="10" width="10" height="1"/>
    <rect fill="#3498DB" x="2" y="12" width="6" height="1"/>
  </svg>
);

export const ProjectIcon: React.FC<IconProps> = ({ size = 16, color = '#E74C3C', className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill={color} x="2" y="2" width="12" height="12" rx="1"/>
    <rect fill="#FFFFFF" x="3" y="3" width="10" height="10"/>
    <rect fill={color} x="4" y="4" width="8" height="1"/>
    <rect fill="#BDC3C7" x="4" y="6" width="6" height="1"/>
    <rect fill="#BDC3C7" x="4" y="8" width="8" height="1"/>
    <rect fill="#BDC3C7" x="4" y="10" width="5" height="1"/>
    <circle fill={color} cx="12" cy="12" r="1"/>
  </svg>
);

// Chat Icon
export const ChatIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#FF69B4" x="2" y="3" width="12" height="8" rx="2"/>
    <rect fill="#FFFFFF" x="3" y="4" width="10" height="6"/>
    <polygon fill="#FF69B4" points="6,11 6,13 8,11"/>
    
    <circle fill="#FF1493" cx="5" cy="6" r="0.5"/>
    <circle fill="#FF1493" cx="7" cy="6" r="0.5"/>
    <path fill="#FF1493" d="M4.5 8 Q6 9 7.5 8" stroke="#FF1493" strokeWidth="0.5" fill="none"/>
    
    <rect fill="#FFB6C1" x="9" y="5" width="4" height="1"/>
    <rect fill="#FFB6C1" x="9" y="7" width="3" height="1"/>
  </svg>
);

// Recycle Bin Icon
export const RecycleBinIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#654321" x="3" y="6" width="10" height="8" rx="1"/>
    <rect fill="#8B7355" x="4" y="7" width="8" height="6"/>
    <rect fill="#A0522D" x="2" y="5" width="12" height="1"/>
    <rect fill="#8B4513" x="6" y="3" width="4" height="2"/>
    <rect fill="#FFFFFF" x="5" y="8" width="1" height="4"/>
    <rect fill="#FFFFFF" x="7" y="8" width="1" height="4"/>
    <rect fill="#FFFFFF" x="9" y="8" width="1" height="4"/>
    <rect fill="#FFFFFF" x="11" y="8" width="1" height="4"/>
  </svg>
);

// Window Control Icons
export const MinimizeIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="#000000" x="4" y="7" width="8" height="2"/>
  </svg>
);

export const MaximizeIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="none" stroke="#000000" strokeWidth="2" x="3" y="3" width="10" height="10"/>
    <rect fill="#000000" x="3" y="3" width="10" height="2"/>
  </svg>
);

export const RestoreIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect fill="none" stroke="#000000" strokeWidth="1" x="2" y="4" width="8" height="8"/>
    <rect fill="none" stroke="#000000" strokeWidth="1" x="6" y="2" width="8" height="8"/>
    <rect fill="#000000" x="6" y="2" width="8" height="1"/>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path 
      fill="#000000" 
      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
);

// Export all icons
export const Icons = {
  Folder: FolderIcon,
  File: FileIcon,
  Executable: ExecutableIcon,
  HardDrive: HardDriveIcon,
  FloppyDisk: FloppyDiskIcon,
  CDROM: CDROMIcon,
  Notepad: NotepadIcon,
  Calculator: CalculatorIcon,
  Computer: ComputerIcon,
  Settings: SettingsIcon,
  Tetris: TetrisIcon,
  Solitaire: SolitaireIcon,
  Minesweeper: MinesweeperIcon,
  VideoPlayer: VideoPlayerIcon,
  MediaPlayer: MediaPlayerIcon,
  Browser: BrowserIcon,
  Project: ProjectIcon,
  Chat: ChatIcon,
  RecycleBin: RecycleBinIcon,
  Minimize: MinimizeIcon,
  Maximize: MaximizeIcon,
  Restore: RestoreIcon,
  Close: CloseIcon
};
