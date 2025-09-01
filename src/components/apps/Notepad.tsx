import { useState } from 'react';

export default function Notepad() {
  const [content, setContent] = useState('Welcome to Notepad!\n\nThis is a simple text editor where you can write notes, stories, or anything else you want to remember.\n\nEnjoy your retro computing experience!');
  const [fileName, setFileName] = useState('Untitled.txt');

  const handleSave = () => {
    // In a real app, this would save to a virtual file system
    alert(`Saved: ${fileName}`);
  };

  const handleNew = () => {
    if (content && confirm('Do you want to save changes?')) {
      handleSave();
    }
    setContent('');
    setFileName('Untitled.txt');
  };

  return (
    <div className="notepad-app">
      {/* Menu Bar */}
      <div className="notepad-menu">
        <div className="menu-items">
          <button className="menu-btn" onClick={handleNew}>New</button>
          <button className="menu-btn" onClick={handleSave}>Save</button>
          <button className="menu-btn">Open</button>
          <span className="separator">|</span>
          <button className="menu-btn">Cut</button>
          <button className="menu-btn">Copy</button>
          <button className="menu-btn">Paste</button>
          <span className="separator">|</span>
          <button className="menu-btn">Find</button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="notepad-status">
        <span className="file-name">{fileName}</span>
        <span className="char-count">{content.length} characters</span>
      </div>

      {/* Text Area */}
      <div className="notepad-content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="notepad-textarea"
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
