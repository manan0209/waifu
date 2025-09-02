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
  Minimize: MinimizeIcon,
  Maximize: MaximizeIcon,
  Restore: RestoreIcon,
  Close: CloseIcon
};
