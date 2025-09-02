
export const theme = {
  
  colors: {
    
    windowBg: '#c0c0c0',
    windowBorder: '#808080',
    windowBorderLight: '#dfdfdf',
    windowBorderDark: '#404040',
    
    
    desktopBg: '#008080', 
    
    // Taskbar
    taskbarBg: '#c0c0c0',
    taskbarBorder: '#808080',
    
    // Controls
    buttonBg: '#c0c0c0',
    buttonBorderLight: '#dfdfdf',
    buttonBorderDark: '#808080',
    buttonPressed: '#a0a0a0',
    
    // Selection
    selectionBg: '#0078d4',
    selectionText: '#ffffff',
    
    // Text
    textPrimary: '#000000',
    textSecondary: '#666666',
    textDisabled: '#999999',
    
    // Status
    errorBg: '#ffcccc',
    warningBg: '#fff3cd',
    successBg: '#d4edda',
    infoBg: '#d1ecf1',
    
    // Title Bar
    titleBarBg: '#0078d4',
    titleBarBgInactive: '#7f7f7f',
    titleBarText: '#ffffff'
  },
  
  // Typography
  fonts: {
    system: "'MS Sans Serif', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    monospace: "'Courier New', Courier, monospace"
  },
  
  // Font Sizes
  fontSizes: {
    xs: '8px',
    sm: '9px',
    base: '11px',
    md: '12px',
    lg: '14px',
    xl: '16px',
    '2xl': '18px'
  },
  
  // Spacing
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px'
  },
  
  // Borders
  borders: {
    thin: '1px',
    thick: '2px',
    button: '1px outset #c0c0c0',
    buttonPressed: '1px inset #c0c0c0',
    window: '2px outset #c0c0c0',
    input: '1px inset #c0c0c0'
  },
  
  // Shadows
  shadows: {
    window: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    button: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    dropdown: '2px 2px 4px rgba(0, 0, 0, 0.4)'
  },
  
  // Z-Index Scale
  zIndex: {
    desktop: 1,
    window: 100,
    dialog: 1000,
    dropdown: 1100,
    notification: 9000,
    altTab: 10000
  }
};

// Icon definitions (replacing emojis)
export const icons = {
  // File Types
  file: '📄',
  folder: '📁',
  executable: '⚙️',
  image: '🖼️',
  audio: '♪',
  video: '🎬',
  
  // Drives
  hardDisk: '🖴',
  floppyDisk: '💾',
  cdrom: '💿',
  
  // Applications
  notepad: '📝',
  calculator: '🖩',
  fileExplorer: '🗂️',
  settings: '⚙️',
  minesweeper: '💣',
  chat: '💬',
  
  // UI Elements
  minimize: '—',
  maximize: '□',
  restore: '❐',
  close: '✕',
  menu: '☰',
  back: '←',
  forward: '→',
  up: '↑',
  home: '🏠',
  
  // System
  computer: '🖥️',
  network: '🌐',
  volume: '🔊',
  time: '🕐',
  user: '👤'
};

export type Theme = typeof theme;
export type Icons = typeof icons;
