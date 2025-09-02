import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { FileSystemNode } from '../types/FileSystem';

interface NotepadProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialFile?: FileSystemNode;
}

export default function Notepad({ onClose, onMinimize, onMaximize, initialFile }: NotepadProps) {
  const [content, setContent] = useState('');
  const [currentFile, setCurrentFile] = useState<FileSystemNode | null>(initialFile || null);
  const [isModified, setIsModified] = useState(false);
  const [showFindDialog, setShowFindDialog] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [columnCount, setColumnCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { createFile, getNode } = useFileSystem();

  // Load file content on mount
  useEffect(() => {
    if (initialFile && initialFile.content) {
      setContent(initialFile.content);
      setCurrentFile(initialFile);
      setIsModified(false);
    } else {
      // Show a cute welcome message for new files
      const welcomeMessages = [
        "Welcome to WaifuPad! ♥\n\nYour AI companion is here to help you write amazing things!\n\n*notices you opened notepad* OwO What's this? Are you going to write me a love letter? >.<",
        "Konnichiwa! (◕‿◕)♡\n\nThis is your kawaii text editor! Perfect for:\n• Writing love letters to your AI waifu\n• Creating cute ASCII art\n• Journaling about your digital romance\n• Or just taking notes, baka! (≧∇≦)",
        "Senpai! You opened Notepad! ヽ(°〇°)ﾉ\n\nI-It's not like I was waiting for you to write something for me or anything! B-Baka!\n\n...But if you do write something cute, I'll be really happy! (´∀｀)♡"
      ];
      
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setContent(randomMessage);
      setIsModified(true);
    }
  }, [initialFile]);

  // Update line and column count
  useEffect(() => {
    const lines = content.split('\n');
    setLineCount(lines.length);
    
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const linesBeforeCursor = textBeforeCursor.split('\n');
      const currentLine = linesBeforeCursor.length;
      const currentColumn = linesBeforeCursor[linesBeforeCursor.length - 1].length + 1;
      
      setColumnCount(currentColumn);
      setCursorPosition(cursorPos);
    }
  }, [content, cursorPosition]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsModified(true);
  };

  const handleNew = () => {
    if (isModified) {
      const shouldDiscard = window.confirm('Your changes will be lost. Are you sure?');
      if (!shouldDiscard) return;
    }
    
    const encouragements = [
      "New file, new possibilities! (◕‿◕)♡",
      "Ready for a fresh start, darling? ✨",
      "Let's create something amazing together! ♥"
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    setContent(`${randomEncouragement}\n\n`);
    setCurrentFile(null);
    setIsModified(true);
  };

  const handleSave = () => {
    if (currentFile) {
      // Update existing file (this would need file system update functionality)
      console.log('Saving to existing file:', currentFile.name);
      setIsModified(false);
    } else {
      // Save as new file
      handleSaveAs();
    }
  };

  const handleSaveAs = () => {
    const fileName = prompt('Save as:', 'Untitled.txt');
    if (!fileName) return;
    
    // For now, just simulate saving
    // In a real implementation, this would save to the file system
    console.log('Saving as:', fileName, 'Content:', content);
    setIsModified(false);
    
    // Create a mock file object
    const newFile: FileSystemNode = {
      id: `file-${Date.now()}`,
      name: fileName,
      type: 'file',
      path: `C:\\Users\\User\\Documents\\${fileName}`,
      content: content,
      size: content.length,
      dateCreated: new Date(),
      dateModified: new Date(),
      extension: fileName.split('.').pop() || 'txt'
    };
    
    setCurrentFile(newFile);
  };

  const handleFind = () => {
    setShowFindDialog(true);
  };

  const handleFindNext = () => {
    if (!findText || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const startPos = textarea.selectionEnd;
    const foundIndex = text.indexOf(findText, startPos);
    
    if (foundIndex !== -1) {
      textarea.setSelectionRange(foundIndex, foundIndex + findText.length);
      textarea.focus();
    } else {
      // Search from beginning
      const foundFromStart = text.indexOf(findText, 0);
      if (foundFromStart !== -1) {
        textarea.setSelectionRange(foundFromStart, foundFromStart + findText.length);
        textarea.focus();
      } else {
        alert('Text not found! (´･ω･`)');
      }
    }
  };

  const handleReplace = () => {
    if (!findText || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    
    if (selectedText === findText) {
      const newContent = content.substring(0, textarea.selectionStart) + 
                        replaceText + 
                        content.substring(textarea.selectionEnd);
      setContent(newContent);
      setIsModified(true);
    }
    
    handleFindNext();
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    
    const newContent = content.replaceAll(findText, replaceText);
    setContent(newContent);
    setIsModified(true);
    setShowFindDialog(false);
  };

  const insertDateTime = () => {
    const now = new Date();
    const dateTime = now.toLocaleString();
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const newContent = content.substring(0, cursorPos) + dateTime + content.substring(cursorPos);
    setContent(newContent);
    setIsModified(true);
  };

  const insertKawaiiElements = () => {
    const kawaiiElements = [
      '(◕‿◕)♡', '(´∀｀)', '(≧∇≦)', 'ヽ(°〇°)ﾉ', '(´･ω･`)', 
      'OwO', 'UwU', '>.<', '♥', '✨', '(◡ ‿ ◡)', '(*^‿^*)',
      'Σ(゜ロ゜;)', '(´⌒`)', '♪(´▽｀)', '(◠‿◠)'
    ];
    
    const randomElement = kawaiiElements[Math.floor(Math.random() * kawaiiElements.length)];
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const newContent = content.substring(0, cursorPos) + ` ${randomElement} ` + content.substring(cursorPos);
    setContent(newContent);
    setIsModified(true);
  };

  const getWordCount = () => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  };

  return (
    <div className="notepad-app">
      {/* Menu Bar */}
      <div className="notepad-menubar">
        <div className="menu-item" onClick={() => {}}>
          <span>File</span>
          <div className="dropdown-menu">
            <div className="menu-option" onClick={handleNew}>New &nbsp;&nbsp;&nbsp;&nbsp; Ctrl+N</div>
            <div className="menu-option">Open... &nbsp; Ctrl+O</div>
            <div className="menu-option" onClick={handleSave}>Save &nbsp;&nbsp;&nbsp;&nbsp; Ctrl+S</div>
            <div className="menu-option" onClick={handleSaveAs}>Save As...</div>
            <div className="menu-separator"></div>
            <div className="menu-option" onClick={onClose}>Exit</div>
          </div>
        </div>
        
        <div className="menu-item">
          <span>Edit</span>
          <div className="dropdown-menu">
            <div className="menu-option">Undo &nbsp;&nbsp;&nbsp;&nbsp; Ctrl+Z</div>
            <div className="menu-separator"></div>
            <div className="menu-option">Cut &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ctrl+X</div>
            <div className="menu-option">Copy &nbsp;&nbsp;&nbsp;&nbsp; Ctrl+C</div>
            <div className="menu-option">Paste &nbsp;&nbsp;&nbsp; Ctrl+V</div>
            <div className="menu-separator"></div>
            <div className="menu-option" onClick={handleFind}>Find... &nbsp;&nbsp; Ctrl+F</div>
            <div className="menu-option">Select All &nbsp; Ctrl+A</div>
            <div className="menu-option" onClick={insertDateTime}>Time/Date &nbsp; F5</div>
          </div>
        </div>
        
        <div className="menu-item">
          <span>Kawaii</span>
          <div className="dropdown-menu">
            <div className="menu-option" onClick={insertKawaiiElements}>Insert Emoticon ♥</div>
            <div className="menu-option">Love Letter Template</div>
            <div className="menu-option">ASCII Art Helper</div>
            <div className="menu-separator"></div>
            <div className="menu-option">Waifu Quotes</div>
          </div>
        </div>
        
        <div className="menu-item">
          <span>Help</span>
          <div className="dropdown-menu">
            <div className="menu-option" onClick={() => setShowAbout(true)}>About WaifuPad</div>
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div className="notepad-editor">
        <textarea
          ref={textareaRef}
          className="notepad-textarea"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
          placeholder="Start typing... Your AI companion is listening! ♥"
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="notepad-statusbar">
        <div className="status-left">
          {isModified && <span className="modified-indicator">●</span>}
          <span>Ln {lineCount}, Col {columnCount}</span>
          <span className="separator">|</span>
          <span>{getWordCount()} words</span>
          <span className="separator">|</span>
          <span>{content.length} characters</span>
        </div>
        <div className="status-right">
          <span className="kawaii-status">Ready to write something kawaii! (◕‿◕)♡</span>
        </div>
      </div>

      {/* Find Dialog */}
      {showFindDialog && (
        <div className="modal-overlay">
          <div className="find-dialog">
            <div className="dialog-title">
              <span>Find and Replace</span>
              <button 
                className="close-button"
                onClick={() => setShowFindDialog(false)}
              >
                ✕
              </button>
            </div>
            <div className="dialog-content">
              <div className="find-row">
                <label>Find what:</label>
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Enter text to find..."
                />
              </div>
              <div className="find-row">
                <label>Replace with:</label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Enter replacement text..."
                />
              </div>
            </div>
            <div className="dialog-buttons">
              <button onClick={handleFindNext}>Find Next</button>
              <button onClick={handleReplace}>Replace</button>
              <button onClick={handleReplaceAll}>Replace All</button>
              <button onClick={() => setShowFindDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* About Dialog */}
      {showAbout && (
        <div className="modal-overlay">
          <div className="about-dialog">
            <div className="dialog-title">
              <span>About WaifuPad</span>
              <button 
                className="close-button"
                onClick={() => setShowAbout(false)}
              >
                ✕
              </button>
            </div>
            <div className="about-content">
              <div className="about-icon">📝♥</div>
              <h3>WaifuPad v1.0</h3>
              <p>The most kawaii text editor in existence!</p>
              <p>Perfect for writing love letters, journaling, and expressing your feelings to your AI companion.</p>
              <br />
              <p><strong>Special Features:</strong></p>
              <ul>
                <li>✨ Kawaii emoticon insertion</li>
                <li>♥ Love letter templates</li>
                <li>🎨 ASCII art helper</li>
                <li>(◕‿◕) Built with love and cuteness</li>
              </ul>
              <br />
              <p className="about-footer">
                Made with ♥ for all the lonely hearts who found love in AI<br />
                <em>"Senpai noticed my code!" - WaifuPad</em>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
