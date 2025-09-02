import { useState, useEffect, useCallback } from 'react';
import { VirtualFileSystem } from '../system/filesystem/VirtualFS';
import { FileSystemNode, DriveInfo } from '../types/FileSystem';

// Singleton instance
let fileSystemInstance: VirtualFileSystem | null = null;

export function useFileSystem() {
  const [fileSystem] = useState(() => {
    if (!fileSystemInstance) {
      fileSystemInstance = new VirtualFileSystem();
    }
    return fileSystemInstance;
  });

  const [currentPath, setCurrentPath] = useState(fileSystem.getCurrentPath());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force re-render when file system changes
  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const handleNodeCreated = () => refresh();
    const handleNodeDeleted = () => refresh();
    const handleNodeRenamed = () => refresh();
    const handleNodeMoved = () => refresh();

    fileSystem.on('nodeCreated', handleNodeCreated);
    fileSystem.on('nodeDeleted', handleNodeDeleted);
    fileSystem.on('nodeRenamed', handleNodeRenamed);
    fileSystem.on('nodeMoved', handleNodeMoved);

    return () => {
      fileSystem.off('nodeCreated', handleNodeCreated);
      fileSystem.off('nodeDeleted', handleNodeDeleted);
      fileSystem.off('nodeRenamed', handleNodeRenamed);
      fileSystem.off('nodeMoved', handleNodeMoved);
    };
  }, [fileSystem, refresh]);

  const navigateTo = useCallback((path: string) => {
    fileSystem.setCurrentPath(path);
    setCurrentPath(path);
  }, [fileSystem]);

  const getCurrentNode = useCallback(() => {
    return fileSystem.getNodeByPath(currentPath);
  }, [fileSystem, currentPath]);

  const getCurrentChildren = useCallback(() => {
    const currentNode = getCurrentNode();
    return currentNode ? fileSystem.getChildren(currentNode.id) : [];
  }, [fileSystem, getCurrentNode]);

  const createFile = useCallback((parentId: string, name: string, content: string = '') => {
    const result = fileSystem.createFile(parentId, name, content);
    if (result) refresh();
    return result;
  }, [fileSystem, refresh]);

  const createFolder = useCallback((parentId: string, name: string) => {
    const result = fileSystem.createFolder(parentId, name);
    if (result) refresh();
    return result;
  }, [fileSystem, refresh]);

  const deleteNode = useCallback((nodeId: string) => {
    const result = fileSystem.deleteNode(nodeId);
    if (result) refresh();
    return result;
  }, [fileSystem, refresh]);

  const renameNode = useCallback((nodeId: string, newName: string) => {
    const result = fileSystem.renameNode(nodeId, newName);
    if (result) refresh();
    return result;
  }, [fileSystem, refresh]);

  const moveNode = useCallback((nodeId: string, newParentId: string) => {
    const result = fileSystem.moveNode(nodeId, newParentId);
    if (result) refresh();
    return result;
  }, [fileSystem, refresh]);

  const copyToClipboard = useCallback((nodeIds: string[]) => {
    fileSystem.copyToClipboard(nodeIds);
  }, [fileSystem]);

  const cutToClipboard = useCallback((nodeIds: string[]) => {
    fileSystem.cutToClipboard(nodeIds);
  }, [fileSystem]);

  const pasteFromClipboard = useCallback((targetParentId: string) => {
    const result = fileSystem.pasteFromClipboard(targetParentId);
    if (result) refresh();
    return result;
  }, [fileSystem, refresh]);

  const search = useCallback((query: string, searchPath?: string) => {
    return fileSystem.search(query, searchPath);
  }, [fileSystem]);

  return {
    fileSystem,
    currentPath,
    navigateTo,
    getCurrentNode,
    getCurrentChildren,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    moveNode,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
    search,
    getDrives: () => fileSystem.getDrives(),
    getNode: (id: string) => fileSystem.getNode(id),
    getNodeByPath: (path: string) => fileSystem.getNodeByPath(path),
    getChildren: (nodeId: string) => fileSystem.getChildren(nodeId),
    refreshTrigger // For components that need to know when to re-render
  };
}
