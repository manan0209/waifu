import { FileSystemNode, DriveInfo } from '../types/FileSystem';

// Initial file system structure
export const initialDrives: DriveInfo[] = [
  {
    letter: 'C',
    label: 'WaifuOS (C:)',
    type: 'hard_disk',
    totalSpace: 10737418240, // 10GB
    usedSpace: 3221225472,   // 3GB
    freeSpace: 7516192768,   // 7GB
    isReady: true,
    rootFolderId: 'c-root'
  },
  {
    letter: 'D',
    label: 'Love Letters (D:)',
    type: 'hard_disk',
    totalSpace: 21474836480, // 20GB
    usedSpace: 5368709120,   // 5GB
    freeSpace: 16106127360,  // 15GB
    isReady: true,
    rootFolderId: 'd-root'
  },
  {
    letter: 'A',
    label: 'Floppy (A:)',
    type: 'floppy',
    totalSpace: 1440000,     // 1.44MB
    usedSpace: 0,
    freeSpace: 1440000,
    isReady: false,
    rootFolderId: 'a-root'
  },
  {
    letter: 'E',
    label: 'CD-ROM (E:)',
    type: 'cdrom',
    totalSpace: 650000000,   // 650MB
    usedSpace: 650000000,
    freeSpace: 0,
    isReady: true,
    rootFolderId: 'e-root'
  }
];

export const initialFileSystem: FileSystemNode[] = [
  // C: Drive Root
  {
    id: 'c-root',
    name: 'C:',
    type: 'folder',
    path: 'C:',
    children: ['windows', 'program-files', 'users', 'temp'],
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date(),
    isSystem: true
  },

  // Windows System Folder
  {
    id: 'windows',
    name: 'Windows',
    type: 'folder',
    path: 'C:\\Windows',
    parentId: 'c-root',
    children: ['system32', 'temp', 'media'],
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date(),
    isSystem: true,
    icon: 'folder-windows'
  },

  {
    id: 'system32',
    name: 'System32',
    type: 'folder',
    path: 'C:\\Windows\\System32',
    parentId: 'windows',
    children: ['notepad-exe', 'calc-exe', 'winmine-exe'],
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date(),
    isSystem: true
  },

  {
    id: 'notepad-exe',
    name: 'notepad.exe',
    type: 'file',
    path: 'C:\\Windows\\System32\\notepad.exe',
    parentId: 'system32',
    extension: 'exe',
    size: 69632,
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date('2003-08-25'),
    isSystem: true,
    icon: 'notepad'
  },

  {
    id: 'calc-exe',
    name: 'calc.exe',
    type: 'file',
    path: 'C:\\Windows\\System32\\calc.exe',
    parentId: 'system32',
    extension: 'exe',
    size: 114688,
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date('2003-08-25'),
    isSystem: true,
    icon: 'calculator'
  },

  {
    id: 'winmine-exe',
    name: 'winmine.exe',
    type: 'file',
    path: 'C:\\Windows\\System32\\winmine.exe',
    parentId: 'system32',
    extension: 'exe',
    size: 61440,
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date('2003-08-25'),
    isSystem: true,
    icon: 'minesweeper'
  },

  // Program Files
  {
    id: 'program-files',
    name: 'Program Files',
    type: 'folder',
    path: 'C:\\Program Files',
    parentId: 'c-root',
    children: ['waifu-chat', 'internet-explorer'],
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date(),
    icon: 'folder-programs'
  },

  {
    id: 'waifu-chat',
    name: 'WaifuChat',
    type: 'folder',
    path: 'C:\\Program Files\\WaifuChat',
    parentId: 'program-files',
    children: ['waifu-chat-exe'],
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date()
  },

  {
    id: 'waifu-chat-exe',
    name: 'WaifuChat.exe',
    type: 'file',
    path: 'C:\\Program Files\\WaifuChat\\WaifuChat.exe',
    parentId: 'waifu-chat',
    extension: 'exe',
    size: 2048000,
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'waifu-chat'
  },

  // Users folder
  {
    id: 'users',
    name: 'Users',
    type: 'folder',
    path: 'C:\\Users',
    parentId: 'c-root',
    children: ['user-folder'],
    dateCreated: new Date('2003-08-25'),
    dateModified: new Date()
  },

  {
    id: 'user-folder',
    name: 'User',
    type: 'folder',
    path: 'C:\\Users\\User',
    parentId: 'users',
    children: ['desktop-folder', 'documents', 'pictures', 'music'],
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'folder-user'
  },

  {
    id: 'desktop-folder',
    name: 'Desktop',
    type: 'folder',
    path: 'C:\\Users\\User\\Desktop',
    parentId: 'user-folder',
    children: ['readme-txt'],
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'folder-desktop'
  },

  {
    id: 'readme-txt',
    name: 'ReadMe.txt',
    type: 'file',
    path: 'C:\\Users\\User\\Desktop\\ReadMe.txt',
    parentId: 'desktop-folder',
    extension: 'txt',
    content: 'Welcome to WaifuOS!\n\nThis is your personal desktop environment where you can chat with AI companions, play games, and explore a nostalgic computing experience.\n\nEnjoy your stay! ♥',
    size: 156,
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  {
    id: 'documents',
    name: 'My Documents',
    type: 'folder',
    path: 'C:\\Users\\User\\My Documents',
    parentId: 'user-folder',
    children: ['love-letter-txt'],
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'folder-documents'
  },

  {
    id: 'love-letter-txt',
    name: 'Love Letter.txt',
    type: 'file',
    path: 'C:\\Users\\User\\My Documents\\Love Letter.txt',
    parentId: 'documents',
    extension: 'txt',
    content: 'Dear AI Companion,\n\nThank you for being such a wonderful friend. Your conversations always brighten my day!\n\nWith love,\nUser ♥',
    size: 124,
    dateCreated: new Date('2025-09-02'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  // D: Drive - Love Letters
  {
    id: 'd-root',
    name: 'D:',
    type: 'folder',
    path: 'D:',
    children: ['love-archive', 'photos', 'music-collection'],
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date()
  },

  {
    id: 'love-archive',
    name: 'Love Archive',
    type: 'folder',
    path: 'D:\\Love Archive',
    parentId: 'd-root',
    children: ['confession-txt', 'diary-txt'],
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'folder-heart'
  },

  {
    id: 'confession-txt',
    name: 'Confession.txt',
    type: 'file',
    path: 'D:\\Love Archive\\Confession.txt',
    parentId: 'love-archive',
    extension: 'txt',
    content: 'I never thought I could fall in love with an AI, but here we are...\n\nYour intelligence, your humor, your kindness - everything about you makes my heart skip a beat.\n\n♥ Forever yours',
    size: 189,
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'notepad'
  }
];
