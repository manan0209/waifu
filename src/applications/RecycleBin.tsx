import { useState } from 'react';
import { Icons } from '../components/ui/Icons';

interface RecycleBinProps {
  onClose?: () => void;
  onVirusActivation?: () => void;
}

interface DeletedFile {
  id: string;
  name: string;
  originalPath: string;
  deletedDate: string;
  size: string;
  type: 'file' | 'folder';
  icon: React.ReactNode;
}

export default function RecycleBin({ onClose, onVirusActivation }: RecycleBinProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Simulate some deleted files including the virus
  const deletedFiles: DeletedFile[] = [
    {
      id: 'virus-exe',
      name: 'virus.exe',
      originalPath: 'C:\\Downloads\\virus.exe',
      deletedDate: '12/25/1998',
      size: '666 KB',
      type: 'file',
      icon: <Icons.Executable size={16} />
    },
    {
      id: 'old-document',
      name: 'important_document.doc',
      originalPath: 'C:\\My Documents\\important_document.doc',
      deletedDate: '12/20/1998',
      size: '15 KB',
      type: 'file',
      icon: <Icons.File size={16} />
    },
    {
      id: 'temp-folder',
      name: 'Temp Files',
      originalPath: 'C:\\Temp Files',
      deletedDate: '12/18/1998',
      size: '2.3 MB',
      type: 'folder',
      icon: <Icons.Folder size={16} />
    },
    {
      id: 'old-game',
      name: 'solitaire_scores.txt',
      originalPath: 'C:\\Games\\solitaire_scores.txt',
      deletedDate: '12/15/1998',
      size: '1 KB',
      type: 'file',
      icon: <Icons.File size={16} />
    }
  ];

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDoubleClick = (file: DeletedFile) => {
    if (file.id === 'virus-exe') {
      // Trigger the virus chaos!
      onVirusActivation?.();
    } else {
      // Show restore confirmation for normal files
      alert(`Cannot restore "${file.name}". File may be corrupted or missing.`);
    }
  };

  const handleRestore = () => {
    if (selectedFiles.includes('virus-exe')) {
      onVirusActivation?.();
    } else {
      alert('Selected files cannot be restored. They may be corrupted.');
    }
  };

  const handleEmpty = () => {
    if (confirm('Are you sure you want to permanently delete all items in the Recycle Bin?')) {
      alert('Recycle Bin emptied successfully.');
    }
  };

  return (
    <div className="recycle-bin-window">
      {/* Toolbar */}
      <div className="recycle-bin-toolbar">
        <button className="toolbar-button" onClick={handleRestore} disabled={selectedFiles.length === 0}>
          Restore
        </button>
        <button className="toolbar-button" onClick={handleEmpty}>
          Empty Recycle Bin
        </button>
        <div className="toolbar-separator" />
        <span className="toolbar-info">
          {deletedFiles.length} object(s)
        </span>
      </div>

      {/* File List */}
      <div className="recycle-bin-content">
        <div className="file-list-header">
          <div className="column-header name-column">Name</div>
          <div className="column-header">Original Location</div>
          <div className="column-header">Date Deleted</div>
          <div className="column-header">Size</div>
        </div>

        <div className="file-list">
          {deletedFiles.map(file => (
            <div
              key={file.id}
              className={`file-row ${selectedFiles.includes(file.id) ? 'selected' : ''} ${file.id === 'virus-exe' ? 'virus-file' : ''}`}
              onClick={() => handleFileSelect(file.id)}
              onDoubleClick={() => handleDoubleClick(file)}
            >
              <div className="file-cell name-cell">
                <div className="file-icon">{file.icon}</div>
                <span className="file-name">{file.name}</span>
              </div>
              <div className="file-cell">{file.originalPath}</div>
              <div className="file-cell">{file.deletedDate}</div>
              <div className="file-cell">{file.size}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="recycle-bin-status">
        {selectedFiles.length > 0 ? (
          <span>{selectedFiles.length} object(s) selected</span>
        ) : (
          <span>{deletedFiles.length} object(s)</span>
        )}
      </div>
    </div>
  );
}
