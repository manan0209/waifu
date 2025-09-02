import { FileSystemNode, DriveInfo, FileSystemState, FileOperation } from '../../types/FileSystem';
import { initialFileSystem, initialDrives } from '../../data/initialFileSystem';

export class VirtualFileSystem {
  private state: FileSystemState;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.state = {
      nodes: new Map(),
      drives: new Map(),
      currentPath: 'C:\\',
      clipboard: {
        operation: null,
        nodeIds: []
      }
    };
    
    this.initialize();
  }

  private initialize() {
    // Initialize drives
    initialDrives.forEach(drive => {
      this.state.drives.set(drive.letter, drive);
    });

    // Initialize file system nodes
    initialFileSystem.forEach(node => {
      this.state.nodes.set(node.id, node);
    });

    // Load from localStorage if available
    this.loadFromStorage();
  }

  // Core file operations
  createFile(parentId: string, name: string, content: string = ''): FileSystemNode | null {
    const parent = this.state.nodes.get(parentId);
    if (!parent || parent.type !== 'folder') return null;

    const extension = name.split('.').pop() || '';
    const newNode: FileSystemNode = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      path: `${parent.path}\\${name}`,
      parentId,
      content,
      extension,
      size: content.length,
      dateCreated: new Date(),
      dateModified: new Date(),
      icon: this.getIconForExtension(extension)
    };

    this.state.nodes.set(newNode.id, newNode);
    
    // Update parent's children
    if (parent.children) {
      parent.children.push(newNode.id);
    } else {
      parent.children = [newNode.id];
    }

    this.saveToStorage();
    this.emit('nodeCreated', newNode);
    return newNode;
  }

  createFolder(parentId: string, name: string): FileSystemNode | null {
    const parent = this.state.nodes.get(parentId);
    if (!parent || parent.type !== 'folder') return null;

    const newNode: FileSystemNode = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      path: `${parent.path}\\${name}`,
      parentId,
      children: [],
      dateCreated: new Date(),
      dateModified: new Date(),
      icon: 'folder'
    };

    this.state.nodes.set(newNode.id, newNode);
    
    // Update parent's children
    if (parent.children) {
      parent.children.push(newNode.id);
    } else {
      parent.children = [newNode.id];
    }

    this.saveToStorage();
    this.emit('nodeCreated', newNode);
    return newNode;
  }

  deleteNode(nodeId: string): boolean {
    const node = this.state.nodes.get(nodeId);
    if (!node || node.isSystem) return false;

    // If it's a folder, delete all children recursively
    if (node.type === 'folder' && node.children) {
      node.children.forEach(childId => {
        this.deleteNode(childId);
      });
    }

    // Remove from parent's children
    if (node.parentId) {
      const parent = this.state.nodes.get(node.parentId);
      if (parent && parent.children) {
        parent.children = parent.children.filter(id => id !== nodeId);
      }
    }

    this.state.nodes.delete(nodeId);
    this.saveToStorage();
    this.emit('nodeDeleted', nodeId);
    return true;
  }

  renameNode(nodeId: string, newName: string): boolean {
    const node = this.state.nodes.get(nodeId);
    if (!node || node.isSystem) return false;

    const oldPath = node.path;
    node.name = newName;
    node.path = node.path.replace(/[^\\]+$/, newName);
    node.dateModified = new Date();

    // Update extension for files
    if (node.type === 'file') {
      node.extension = newName.split('.').pop() || '';
      node.icon = this.getIconForExtension(node.extension);
    }

    // Update paths of all children recursively
    this.updateChildrenPaths(node, oldPath);

    this.saveToStorage();
    this.emit('nodeRenamed', nodeId, newName);
    return true;
  }

  moveNode(nodeId: string, newParentId: string): boolean {
    const node = this.state.nodes.get(nodeId);
    const newParent = this.state.nodes.get(newParentId);
    
    if (!node || !newParent || node.isSystem || newParent.type !== 'folder') return false;
    if (node.parentId === newParentId) return false;

    // Remove from old parent
    if (node.parentId) {
      const oldParent = this.state.nodes.get(node.parentId);
      if (oldParent && oldParent.children) {
        oldParent.children = oldParent.children.filter(id => id !== nodeId);
      }
    }

    // Add to new parent
    if (newParent.children) {
      newParent.children.push(nodeId);
    } else {
      newParent.children = [nodeId];
    }

    // Update node's parent and path
    const oldPath = node.path;
    node.parentId = newParentId;
    node.path = `${newParent.path}\\${node.name}`;
    node.dateModified = new Date();

    // Update paths of all children recursively
    this.updateChildrenPaths(node, oldPath);

    this.saveToStorage();
    this.emit('nodeMoved', nodeId, newParentId);
    return true;
  }

  // Utility methods
  private updateChildrenPaths(node: FileSystemNode, oldPath: string) {
    if (node.type === 'folder' && node.children) {
      node.children.forEach(childId => {
        const child = this.state.nodes.get(childId);
        if (child) {
          child.path = child.path.replace(oldPath, node.path);
          this.updateChildrenPaths(child, oldPath);
        }
      });
    }
  }

  private getIconForExtension(extension: string): string {
    const iconMap: { [key: string]: string } = {
      'txt': 'notepad',
      'exe': 'application',
      'bat': 'batch',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'mp3': 'audio',
      'wav': 'audio',
      'avi': 'video',
      'mp4': 'video'
    };
    return iconMap[extension.toLowerCase()] || 'file';
  }

  // Query methods
  getNode(nodeId: string): FileSystemNode | undefined {
    return this.state.nodes.get(nodeId);
  }

  getNodeByPath(path: string): FileSystemNode | undefined {
    for (const node of this.state.nodes.values()) {
      if (node.path === path) return node;
    }
    return undefined;
  }

  getChildren(nodeId: string): FileSystemNode[] {
    const node = this.state.nodes.get(nodeId);
    if (!node || !node.children) return [];
    
    return node.children
      .map(childId => this.state.nodes.get(childId))
      .filter(child => child !== undefined) as FileSystemNode[];
  }

  getDrives(): DriveInfo[] {
    return Array.from(this.state.drives.values());
  }

  getDrive(letter: string): DriveInfo | undefined {
    return this.state.drives.get(letter);
  }

  getRootNode(driveLetter: string): FileSystemNode | undefined {
    const drive = this.state.drives.get(driveLetter);
    if (!drive) return undefined;
    return this.state.nodes.get(drive.rootFolderId);
  }

  // Path utilities
  parsePath(path: string): string[] {
    return path.split('\\').filter(part => part.length > 0);
  }

  joinPath(...parts: string[]): string {
    return parts.filter(part => part.length > 0).join('\\');
  }

  getParentPath(path: string): string {
    const parts = this.parsePath(path);
    parts.pop();
    return parts.length > 0 ? parts.join('\\') : '';
  }

  // Navigation
  getCurrentPath(): string {
    return this.state.currentPath;
  }

  setCurrentPath(path: string) {
    this.state.currentPath = path;
  }

  // Clipboard operations
  copyToClipboard(nodeIds: string[]) {
    this.state.clipboard = {
      operation: 'copy',
      nodeIds: [...nodeIds]
    };
  }

  cutToClipboard(nodeIds: string[]) {
    this.state.clipboard = {
      operation: 'cut',
      nodeIds: [...nodeIds]
    };
  }

  pasteFromClipboard(targetParentId: string): boolean {
    if (!this.state.clipboard.operation || this.state.clipboard.nodeIds.length === 0) {
      return false;
    }

    const targetParent = this.state.nodes.get(targetParentId);
    if (!targetParent || targetParent.type !== 'folder') return false;

    this.state.clipboard.nodeIds.forEach(nodeId => {
      if (this.state.clipboard.operation === 'copy') {
        this.copyNodeRecursive(nodeId, targetParentId);
      } else if (this.state.clipboard.operation === 'cut') {
        this.moveNode(nodeId, targetParentId);
      }
    });

    // Clear clipboard after cut operation
    if (this.state.clipboard.operation === 'cut') {
      this.state.clipboard = { operation: null, nodeIds: [] };
    }

    return true;
  }

  private copyNodeRecursive(nodeId: string, targetParentId: string): FileSystemNode | null {
    const originalNode = this.state.nodes.get(nodeId);
    if (!originalNode) return null;

    const targetParent = this.state.nodes.get(targetParentId);
    if (!targetParent) return null;

    // Create copy
    const copyNode: FileSystemNode = {
      ...originalNode,
      id: `${originalNode.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      parentId: targetParentId,
      path: `${targetParent.path}\\${originalNode.name}`,
      dateCreated: new Date(),
      dateModified: new Date(),
      children: originalNode.type === 'folder' ? [] : undefined
    };

    this.state.nodes.set(copyNode.id, copyNode);

    // Add to parent's children
    if (targetParent.children) {
      targetParent.children.push(copyNode.id);
    } else {
      targetParent.children = [copyNode.id];
    }

    // Recursively copy children if it's a folder
    if (originalNode.type === 'folder' && originalNode.children) {
      originalNode.children.forEach(childId => {
        this.copyNodeRecursive(childId, copyNode.id);
      });
    }

    this.saveToStorage();
    return copyNode;
  }

  // Persistence
  private saveToStorage() {
    try {
      const data = {
        nodes: Array.from(this.state.nodes.entries()),
        drives: Array.from(this.state.drives.entries()),
        currentPath: this.state.currentPath
      };
      localStorage.setItem('waifu-filesystem', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save filesystem to localStorage:', error);
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem('waifu-filesystem');
      if (data) {
        const parsed = JSON.parse(data);
        
        // Only load user-created nodes, keep system nodes as-is
        if (parsed.nodes) {
          parsed.nodes.forEach(([id, node]: [string, FileSystemNode]) => {
            if (!node.isSystem) {
              // Convert date strings back to Date objects
              node.dateCreated = new Date(node.dateCreated);
              node.dateModified = new Date(node.dateModified);
              this.state.nodes.set(id, node);
            }
          });
        }
        
        if (parsed.currentPath) {
          this.state.currentPath = parsed.currentPath;
        }
      }
    } catch (error) {
      console.warn('Failed to load filesystem from localStorage:', error);
    }
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(...args));
    }
  }

  // Search functionality
  search(query: string, searchPath?: string): FileSystemNode[] {
    const results: FileSystemNode[] = [];
    const searchRoot = searchPath ? this.getNodeByPath(searchPath) : undefined;
    
    const searchInNode = (node: FileSystemNode) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(node);
      }
      
      if (node.type === 'folder' && node.children) {
        node.children.forEach(childId => {
          const child = this.state.nodes.get(childId);
          if (child) searchInNode(child);
        });
      }
    };

    if (searchRoot) {
      searchInNode(searchRoot);
    } else {
      // Search all drives
      this.state.drives.forEach(drive => {
        const rootNode = this.state.nodes.get(drive.rootFolderId);
        if (rootNode) searchInNode(rootNode);
      });
    }

    return results;
  }
}
