import { useState } from 'react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  icon: string;
}

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('C:\\');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const fileItems: FileItem[] = [
    { name: 'My Documents', type: 'folder', modified: '12/25/2000', icon: '📁' },
    { name: 'Desktop', type: 'folder', modified: '12/25/2000', icon: '📁' },
    { name: 'Program Files', type: 'folder', modified: '12/25/2000', icon: '📁' },
    { name: 'Windows', type: 'folder', modified: '12/25/2000', icon: '📁' },
    { name: 'AUTOEXEC.BAT', type: 'file', size: '1 KB', modified: '12/25/2000', icon: '📄' },
    { name: 'CONFIG.SYS', type: 'file', size: '512 bytes', modified: '12/25/2000', icon: '📄' },
    { name: 'waifu.exe', type: 'file', size: '2.1 MB', modified: '12/25/2000', icon: '💬' },
    { name: 'readme.txt', type: 'file', size: '3 KB', modified: '12/25/2000', icon: '📝' },
  ];

  const handleItemClick = (itemName: string) => {
    setSelectedItem(selectedItem === itemName ? null : itemName);
  };

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(currentPath + item.name + '\\');
      setSelectedItem(null);
    }
  };

  const handleBackClick = () => {
    const pathParts = currentPath.split('\\').filter(Boolean);
    if (pathParts.length > 1) {
      pathParts.pop();
      setCurrentPath(pathParts.join('\\') + '\\');
    } else {
      setCurrentPath('C:\\');
    }
    setSelectedItem(null);
  };

  return (
    <div className="file-explorer-app">
      {/* Toolbar */}
      <div className="explorer-toolbar">
        <button className="toolbar-btn" onClick={handleBackClick} disabled={currentPath === 'C:\\'}>
          ← Back
        </button>
        <button className="toolbar-btn">Forward</button>
        <button className="toolbar-btn">Up</button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-btn">Cut</button>
        <button className="toolbar-btn">Copy</button>
        <button className="toolbar-btn">Paste</button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-btn">Delete</button>
        <button className="toolbar-btn">Properties</button>
      </div>

      {/* Address Bar */}
      <div className="address-bar">
        <span className="address-label">Address:</span>
        <input 
          type="text" 
          value={currentPath} 
          onChange={(e) => setCurrentPath(e.target.value)}
          className="address-input"
        />
      </div>

      {/* File List */}
      <div className="file-list">
        <div className="file-list-header">
          <div className="header-column name">Name</div>
          <div className="header-column size">Size</div>
          <div className="header-column type">Type</div>
          <div className="header-column modified">Modified</div>
        </div>

        <div className="file-list-content">
          {fileItems.map((item, index) => (
            <div
              key={index}
              className={`file-item ${selectedItem === item.name ? 'selected' : ''}`}
              onClick={() => handleItemClick(item.name)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <div className="file-column name">
                <span className="file-icon">{item.icon}</span>
                <span className="file-name">{item.name}</span>
              </div>
              <div className="file-column size">{item.size || ''}</div>
              <div className="file-column type">
                {item.type === 'folder' ? 'File Folder' : 'File'}
              </div>
              <div className="file-column modified">{item.modified}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="explorer-status">
        <span>{fileItems.length} object(s)</span>
        <span>{selectedItem ? `Selected: ${selectedItem}` : 'Ready'}</span>
      </div>
    </div>
  );
}
