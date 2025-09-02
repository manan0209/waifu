import { useState, useEffect, useCallback } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { FileSystemNode } from '../types/FileSystem';
import { Icons } from '../components/ui/Icons';
import { theme } from '../config/theme';

interface FileExplorerProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialPath?: string;
}

export default function FileExplorer({ 
  onClose, 
  onMinimize, 
  onMaximize, 
  initialPath = 'My Computer' 
}: FileExplorerProps) {
  const {
    currentPath,
    navigateTo,
    getCurrentChildren,
    getDrives,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    getNode,
    refreshTrigger
  } = useFileSystem();

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list');
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId?: string;
  } | null>(null);

  // Initialize with correct path
  useEffect(() => {
    if (initialPath === 'My Computer') {
      // For My Computer view, we'll handle this specially
      return;
    }
    if (initialPath !== currentPath) {
      navigateTo(initialPath);
    }
  }, [initialPath, currentPath, navigateTo]);

  // Get current content - either drives for My Computer or folder children
  const currentChildren = currentPath === 'My Computer' ? [] : getCurrentChildren();
  const drives = getDrives();
  const pathParts = currentPath === 'My Computer' ? [] : currentPath.split('\\').filter(part => part.length > 0);

  const handleNavigate = useCallback((path: string) => {
    navigateTo(path);
    setSelectedNodes([]);
  }, [navigateTo]);

  const handleNodeClick = useCallback((node: FileSystemNode, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      
      setSelectedNodes(prev => 
        prev.includes(node.id) 
          ? prev.filter(id => id !== node.id)
          : [...prev, node.id]
      );
    } else {
      setSelectedNodes([node.id]);
    }
  }, []);

  const handleNodeDoubleClick = useCallback((node: FileSystemNode) => {
    if (node.type === 'folder') {
      handleNavigate(node.path);
    } else {
      
      if (node.extension === 'txt') {
        
        console.log('Opening file in Notepad:', node.name);
      } else if (node.extension === 'exe') {
        
        console.log('Executing application:', node.name);
      }
    }
  }, [handleNavigate]);

  const handleCreateNew = useCallback((type: 'file' | 'folder') => {
    setIsCreating(type);
    setNewItemName(type === 'file' ? 'New File.txt' : 'New Folder');
    setContextMenu(null);
  }, []);

  const handleCreateConfirm = useCallback(() => {
    const currentNode = getNode(getCurrentChildren()[0]?.parentId || '');
    if (!currentNode && pathParts.length > 0) {
      
      const driveLetter = pathParts[0].replace(':', '');
      const drive = drives.find(d => d.letter === driveLetter);
      if (drive) {
        const rootNode = getNode(drive.rootFolderId);
        if (rootNode) {
          if (isCreating === 'file') {
            createFile(rootNode.id, newItemName);
          } else if (isCreating === 'folder') {
            createFolder(rootNode.id, newItemName);
          }
        }
      }
    } else if (currentNode) {
      if (isCreating === 'file') {
        createFile(currentNode.id, newItemName);
      } else if (isCreating === 'folder') {
        createFolder(currentNode.id, newItemName);
      }
    }
    
    setIsCreating(null);
    setNewItemName('');
  }, [isCreating, newItemName, getNode, getCurrentChildren, pathParts, drives, createFile, createFolder]);

  const handleDelete = useCallback(() => {
    selectedNodes.forEach(nodeId => {
      deleteNode(nodeId);
    });
    setSelectedNodes([]);
    setContextMenu(null);
  }, [selectedNodes, deleteNode]);

  const handleContextMenu = useCallback((event: React.MouseEvent, nodeId?: string) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId
    });
  }, []);

  const getFileIcon = (node: FileSystemNode) => {
    if (node.type === 'folder') {
      return <Icons.Folder size={16} />;
    }
    
    switch (node.extension) {
      case 'txt': return <Icons.File size={16} />;
      case 'exe': return <Icons.Executable size={16} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Icons.File size={16} color="#FFB6C1" />;
      case 'mp3':
      case 'wav': return <Icons.File size={16} color="#DDA0DD" />;
      case 'mp4':
      case 'avi': return <Icons.File size={16} color="#87CEEB" />;
      default: return <Icons.File size={16} />;
    }
  };

  const getDriveIcon = (drive: any) => {
    switch (drive.type) {
      case 'hard_disk': return <Icons.HardDrive size={16} />;
      case 'floppy': return <Icons.FloppyDisk size={16} />;
      case 'cdrom': return <Icons.CDROM size={16} />;
      default: return <Icons.HardDrive size={16} />;
    }
  };

  const getDriveType = (type: string) => {
    switch (type) {
      case 'hard_disk': return 'Local Disk';
      case 'floppy': return 'Floppy Disk';
      case 'cdrom': return 'CD-ROM Drive';
      default: return 'Unknown';
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / (1024 * 1024))} MB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="file-explorer">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-section">
          <button 
            onClick={() => {
              const parentPath = pathParts.slice(0, -1).join('\\') || 'C:';
              handleNavigate(parentPath);
            }}
            disabled={pathParts.length <= 1}
            title="Up"
          >
            ⬆️
          </button>
          <button onClick={() => handleNavigate('C:')} title="Home">
            🏠
          </button>
        </div>
        
        <div className="toolbar-section">
          <button 
            onClick={() => handleCreateNew('folder')}
            title="New Folder"
            className="toolbar-button"
          >
            <Icons.Folder size={16} />
            <span className="toolbar-button-text">New Folder</span>
          </button>
          <button 
            onClick={() => handleCreateNew('file')}
            title="New File"
            className="toolbar-button"
          >
            <Icons.File size={16} />
            <span className="toolbar-button-text">New File</span>
          </button>
        </div>
        
        <div className="toolbar-section">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'icons' : 'list')}
            title="Change View"
          >
            {viewMode === 'list' ? '⊞' : '☰'}
          </button>
        </div>
      </div>

      
      <div className="address-bar">
        <div className="breadcrumbs">
          <button
            className={`breadcrumb ${currentPath === 'My Computer' ? 'active' : ''}`}
            onClick={() => handleNavigate('My Computer')}
          >
            My Computer
          </button>
          
          {currentPath !== 'My Computer' && (
            <>
              <span className="separator">\\</span>
              {drives.map(drive => (
                <button
                  key={drive.letter}
                  className={`breadcrumb ${currentPath.startsWith(drive.letter + ':') ? 'active' : ''}`}
                  onClick={() => handleNavigate(drive.letter + ':')}
                >
                  {drive.letter}:
                </button>
              ))}
            </>
          )}
          {pathParts.length > 1 && (
            <>
              <span className="separator">\\</span>
              {pathParts.slice(1).map((part, index) => (
                <span key={index}>
                  <button
                    className="breadcrumb"
                    onClick={() => {
                      const targetPath = pathParts.slice(0, index + 2).join('\\');
                      handleNavigate(targetPath);
                    }}
                  >
                    {part}
                  </button>
                  {index < pathParts.length - 2 && <span className="separator">\\</span>}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      
      <div className="explorer-content" onContextMenu={(e) => handleContextMenu(e)}>
        {viewMode === 'list' ? (
          <div className="file-list">
            <div className="list-header">
              <div className="column-name">Name</div>
              <div className="column-size">Size</div>
              <div className="column-type">Type</div>
              <div className="column-modified">Date Modified</div>
            </div>
            <div className="list-body">
              {/* Show drives in My Computer view */}
              {currentPath === 'My Computer' && drives.map(drive => (
                <div
                  key={drive.letter}
                  className={`list-item`}
                  onClick={() => {}}
                  onDoubleClick={() => handleNavigate(drive.letter + ':')}
                >
                  <div className="column-name">
                    <span className="file-icon">{getDriveIcon(drive)}</span>
                    <span className="file-name">{drive.label}</span>
                  </div>
                  <div className="column-size">
                    {formatFileSize(drive.freeSpace)} free of {formatFileSize(drive.totalSpace)}
                  </div>
                  <div className="column-type">
                    {getDriveType(drive.type)}
                  </div>
                  <div className="column-modified">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {/* Show regular files/folders */}
              {currentPath !== 'My Computer' && currentChildren.map(node => (
                <div
                  key={node.id}
                  className={`list-item ${selectedNodes.includes(node.id) ? 'selected' : ''}`}
                  onClick={(e) => handleNodeClick(node, e)}
                  onDoubleClick={() => handleNodeDoubleClick(node)}
                  onContextMenu={(e) => handleContextMenu(e, node.id)}
                >
                  <div className="column-name">
                    <span className="file-icon">{getFileIcon(node)}</span>
                    <span className="file-name">{node.name}</span>
                  </div>
                  <div className="column-size">
                    {node.type === 'file' ? formatFileSize(node.size) : ''}
                  </div>
                  <div className="column-type">
                    {node.type === 'file' ? 
                      (node.extension ? `${node.extension.toUpperCase()} File` : 'File') : 
                      'Folder'
                    }
                  </div>
                  <div className="column-modified">
                    {formatDate(node.dateModified)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="icon-view">
            {/* Show drives in My Computer view */}
            {currentPath === 'My Computer' && drives.map(drive => (
              <div
                key={drive.letter}
                className="icon-item"
                onClick={() => {}}
                onDoubleClick={() => handleNavigate(drive.letter + ':')}
              >
                <div className="icon-large">{getDriveIcon(drive)}</div>
                <div className="icon-label">{drive.label}</div>
              </div>
            ))}
            
            {/* Show regular files/folders */}
            {currentPath !== 'My Computer' && currentChildren.map(node => (
              <div
                key={node.id}
                className={`icon-item ${selectedNodes.includes(node.id) ? 'selected' : ''}`}
                onClick={(e) => handleNodeClick(node, e)}
                onDoubleClick={() => handleNodeDoubleClick(node)}
                onContextMenu={(e) => handleContextMenu(e, node.id)}
              >
                <div className="icon-large">{getFileIcon(node)}</div>
                <div className="icon-label">{node.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-info">
          {currentChildren.length} item(s)
          {selectedNodes.length > 0 && ` | ${selectedNodes.length} selected`}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          {contextMenu.nodeId ? (
            <>
              <div className="context-item" onClick={() => handleNodeDoubleClick(getNode(contextMenu.nodeId!)!)}>
                Open
              </div>
              <div className="context-separator" />
              <div className="context-item" onClick={handleDelete}>
                Delete
              </div>
              <div className="context-item">
                Rename
              </div>
              <div className="context-item">
                Properties
              </div>
            </>
          ) : (
            <>
              <div className="context-item" onClick={() => handleCreateNew('folder')}>
                New Folder
              </div>
              <div className="context-item" onClick={() => handleCreateNew('file')}>
                New File
              </div>
              <div className="context-separator" />
              <div className="context-item">
                Paste
              </div>
            </>
          )}
        </div>
      )}

      {/* Create New Item Dialog */}
      {isCreating && (
        <div className="modal-overlay">
          <div className="create-dialog">
            <div className="dialog-title">
              Create New {isCreating === 'file' ? 'File' : 'Folder'}
            </div>
            <div className="dialog-content">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateConfirm();
                  if (e.key === 'Escape') setIsCreating(null);
                }}
                autoFocus
              />
            </div>
            <div className="dialog-buttons">
              <button onClick={handleCreateConfirm}>Create</button>
              <button onClick={() => setIsCreating(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
