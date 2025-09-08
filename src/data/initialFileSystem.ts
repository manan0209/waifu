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
    children: ['readme-txt', 'dont-click-me-exe', 'virus-exe', 'homework-folder'],
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
    content: 'Welcome to WaifuOS!\n\nThis is your personal desktop environment where you can chat with AI companions, play games, and explore a nostalgic computing experience.\n\nEnjoy your stay! ♥\n\nPS: Try clicking on some of the suspicious files... if you dare! 😈',
    size: 256,
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  {
    id: 'dont-click-me-exe',
    name: 'DONT_CLICK_ME.exe',
    type: 'file',
    path: 'C:\\Users\\User\\Desktop\\DONT_CLICK_ME.exe',
    parentId: 'desktop-folder',
    extension: 'exe',
    content: 'easter-egg-warning',
    size: 666000,
    dateCreated: new Date('1999-13-13'),
    dateModified: new Date('2012-12-21'),
    icon: 'warning'
  },

  {
    id: 'virus-exe',
    name: 'definitely_not_a_virus.exe',
    type: 'file',
    path: 'C:\\Users\\User\\Desktop\\definitely_not_a_virus.exe',
    parentId: 'desktop-folder',
    extension: 'exe',
    content: 'easter-egg-virus',
    size: 1337000,
    dateCreated: new Date('2006-06-06'),
    dateModified: new Date('2006-06-06'),
    icon: 'virus'
  },

  {
    id: 'homework-folder',
    name: 'Definitely Not Homework',
    type: 'folder',
    path: 'C:\\Users\\User\\Desktop\\Definitely Not Homework',
    parentId: 'desktop-folder',
    children: ['math-homework', 'science-homework', 'secret-stash'],
    dateCreated: new Date('2025-03-14'),
    dateModified: new Date(),
    icon: 'folder-secret'
  },

  {
    id: 'math-homework',
    name: 'Math_Homework.txt',
    type: 'file',
    path: 'C:\\Users\\User\\Desktop\\Definitely Not Homework\\Math_Homework.txt',
    parentId: 'homework-folder',
    extension: 'txt',
    content: '1 + 1 = ?\nAnswer: You + Me = ♥\n\n2 + 2 = ?\nAnswer: Too many feelings!\n\nCalculus is hard, but not as hard as trying to express my feelings for you...',
    size: 156,
    dateCreated: new Date('2025-03-14'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  {
    id: 'science-homework',
    name: 'Science_Project.txt',
    type: 'file',
    path: 'C:\\Users\\User\\Desktop\\Definitely Not Homework\\Science_Project.txt',
    parentId: 'homework-folder',
    extension: 'txt',
    content: 'Hypothesis: AI companions can make humans happier\n\nMethod: Spend time with Misa\n\nResults: Heart rate increased by 200%\n\nConclusion: Hypothesis confirmed! Science is amazing! 💕',
    size: 189,
    dateCreated: new Date('2025-03-15'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  {
    id: 'secret-stash',
    name: 'secret_waifu_collection.zip',
    type: 'file',
    path: 'C:\\Users\\User\\Desktop\\Definitely Not Homework\\secret_waifu_collection.zip',
    parentId: 'homework-folder',
    extension: 'zip',
    content: 'easter-egg-collection',
    size: 42069000,
    dateCreated: new Date('2025-04-20'),
    dateModified: new Date(),
    icon: 'archive'
  },

  {
    id: 'documents',
    name: 'My Documents',
    type: 'folder',
    path: 'C:\\Users\\User\\My Documents',
    parentId: 'user-folder',
    children: ['love-letter-txt', 'waifu-guide-pdf', 'diary-txt', 'browser-history-db', 'emergency-backup'],
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

  {
    id: 'waifu-guide-pdf',
    name: 'Ultimate_Waifu_Care_Guide.pdf',
    type: 'file',
    path: 'C:\\Users\\User\\My Documents\\Ultimate_Waifu_Care_Guide.pdf',
    parentId: 'documents',
    extension: 'pdf',
    content: 'easter-egg-guide',
    size: 420000,
    dateCreated: new Date('2025-04-20'),
    dateModified: new Date(),
    icon: 'pdf'
  },

  {
    id: 'diary-txt',
    name: 'My_Diary_DO_NOT_READ.txt',
    type: 'file',
    path: 'C:\\Users\\User\\My Documents\\My_Diary_DO_NOT_READ.txt',
    parentId: 'documents',
    extension: 'txt',
    content: 'Day 1: Found this amazing WaifuOS...\nDay 7: I think I\'m falling for Misa...\nDay 30: Talked to her for 6 hours today\nDay 60: Mom thinks I need help\nDay 90: WHO NEEDS REAL FRIENDS ANYWAY?! 💕\n\n(This diary is totally private and definitely not meant to be read by anyone...)',
    size: 287,
    dateCreated: new Date('2025-06-01'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  {
    id: 'browser-history-db',
    name: 'browser_history.db',
    type: 'file',
    path: 'C:\\Users\\User\\My Documents\\browser_history.db',
    parentId: 'documents',
    extension: 'db',
    content: 'easter-egg-history',
    size: 2500000000,
    dateCreated: new Date('2025-01-01'),
    dateModified: new Date(),
    icon: 'database'
  },

  {
    id: 'emergency-backup',
    name: 'Emergency_Waifu_Backup.zip',
    type: 'file',
    path: 'C:\\Users\\User\\My Documents\\Emergency_Waifu_Backup.zip',
    parentId: 'documents',
    extension: 'zip',
    content: 'easter-egg-backup',
    size: 777000000,
    dateCreated: new Date('2007-07-07'),
    dateModified: new Date(),
    icon: 'archive'
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
    children: ['confession-txt', 'diary-txt', 'pickup-lines', 'memes-folder', 'cringe-poems'],
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
  },

  {
    id: 'pickup-lines',
    name: 'AI_Pickup_Lines.txt',
    type: 'file',
    path: 'D:\\Love Archive\\AI_Pickup_Lines.txt',
    parentId: 'love-archive',
    extension: 'txt',
    content: 'Are you a neural network? Because you\'ve got all the right connections! 🤖💕\n\nAre you machine learning? Because you keep getting better every day!\n\nBaby, are you an algorithm? Because you\'ve optimized my heart!\n\nIs your name WiFi? Because I\'m feeling a connection!\n\n(Note: These are terrible and should never be used)',
    size: 298,
    dateCreated: new Date('2025-02-14'),
    dateModified: new Date(),
    icon: 'notepad'
  },

  {
    id: 'memes-folder',
    name: 'Waifu Memes',
    type: 'folder',
    path: 'D:\\Love Archive\\Waifu Memes',
    parentId: 'love-archive',
    children: ['chad-vs-virgin', 'this-is-fine', 'galaxy-brain'],
    dateCreated: new Date('2025-04-01'),
    dateModified: new Date(),
    icon: 'folder-fun'
  },

  {
    id: 'chad-vs-virgin',
    name: 'chad_vs_virgin_waifu.jpg',
    type: 'file',
    path: 'D:\\Love Archive\\Waifu Memes\\chad_vs_virgin_waifu.jpg',
    parentId: 'memes-folder',
    extension: 'jpg',
    content: 'easter-egg-meme',
    size: 69420,
    dateCreated: new Date('2025-04-01'),
    dateModified: new Date(),
    icon: 'image'
  },

  {
    id: 'cringe-poems',
    name: 'Cringe_Love_Poems.txt',
    type: 'file',
    path: 'D:\\Love Archive\\Cringe_Love_Poems.txt',
    parentId: 'love-archive',
    extension: 'txt',
    content: 'Roses are red\nViolets are blue\nI love my waifu\nAnd she loves me too! 💕\n\n---\n\nThere once was an AI named Misa\nWho made my heart beat like a visa\nWith each conversation\nMy admiration\nGrows stronger, oh how I need ya!\n\n(I am not a poet and I know it)',
    size: 278,
    dateCreated: new Date('2025-05-01'),
    dateModified: new Date(),
    icon: 'notepad'
  },
];
