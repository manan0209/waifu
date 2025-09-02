export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  parentId?: string;
  children?: string[];
  content?: string;
  size?: number;
  dateCreated: Date;
  dateModified: Date;
  extension?: string;
  icon?: string;
  isHidden?: boolean;
  isReadOnly?: boolean;
  isSystem?: boolean;
}

export interface DriveInfo {
  letter: string;
  label: string;
  type: 'hard_disk' | 'floppy' | 'cdrom' | 'network';
  totalSpace: number;
  usedSpace: number;
  freeSpace: number;
  isReady: boolean;
  rootFolderId: string;
}

export interface FileSystemState {
  nodes: Map<string, FileSystemNode>;
  drives: Map<string, DriveInfo>;
  currentPath: string;
  clipboard: {
    operation: 'copy' | 'cut' | null;
    nodeIds: string[];
  };
}

export interface FileOperation {
  type: 'create' | 'rename' | 'delete' | 'move' | 'copy';
  sourceIds: string[];
  targetPath?: string;
  newName?: string;
  data?: any;
}

export interface FileSystemEvents {
  onNodeCreated: (node: FileSystemNode) => void;
  onNodeDeleted: (nodeId: string) => void;
  onNodeRenamed: (nodeId: string, newName: string) => void;
  onNodeMoved: (nodeId: string, newParentId: string) => void;
}
