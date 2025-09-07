import React, { useState, useRef, useEffect } from 'react';
import { WaifuAI } from '../../lib/waifuAI';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'waifu';
  timestamp: Date;
}

export default function WaifuChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState<'default' | 'gemini' | 'openai'>('default');
  const [waifuAI] = useState(() => new WaifuAI());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: '*sultry smile* Well, well... look who decided to visit me~ *winks* I\'m Misa Misa, your delightfully naughty companion. Ready to have some fun, darling?',
      sender: 'waifu',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Load saved API settings
    const savedApiKey = localStorage.getItem('user_api_key');
    const savedProvider = localStorage.getItem('api_provider') as 'default' | 'gemini' | 'openai';
    if (savedApiKey) setUserApiKey(savedApiKey);
    if (savedProvider) setApiProvider(savedProvider);
  }, [waifuAI]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      // Set user API key if provided
      if (userApiKey && apiProvider !== 'default') {
        waifuAI.setUserApiKey(userApiKey, apiProvider);
      }
      const response = await waifuAI.generateResponse(userMessage);
      
      
      return response
        .replace(/^Misa:\s*/i, '') 
        .replace(/^\*(.+?)\*\s*/, '*$1* ') 
        .trim();
    } catch (error) {
      console.error('Error generating response:', error);
      return "Sorry darling, I'm having a bit of trouble thinking right now... *playful pout* Try again?";
    }
  };

  const saveApiSettings = () => {
    if (userApiKey) {
      localStorage.setItem('user_api_key', userApiKey);
      localStorage.setItem('api_provider', apiProvider);
    } else {
      localStorage.removeItem('user_api_key');
      localStorage.removeItem('api_provider');
    }
    setShowSettings(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsTyping(true);

    
    try {
      const responseText = await generateResponse(messageToSend);
      
    
      setTimeout(() => {
        const waifuMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'waifu',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, waifuMessage]);
        setIsTyping(false);
      }, 800 + Math.random() * 1200);
    } catch (error) {
      console.error('Error in message handling:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string, buttonElement?: HTMLButtonElement) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Visual feedback
      if (buttonElement) {
        buttonElement.classList.add('copied');
        setTimeout(() => {
          buttonElement.classList.remove('copied');
        }, 600);
      }
      
      console.log('Message copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('Message copied to clipboard (fallback)!');
        
        // Visual feedback for fallback
        if (buttonElement) {
          buttonElement.classList.add('copied');
          setTimeout(() => {
            buttonElement.classList.remove('copied');
          }, 600);
        }
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="waifu-chat-app">
      
      
      <div className="chat-header">
        <div className="character-info">
          <div className="character-avatar">
            <img src="/mascot.png" alt="Misa" className="avatar-image" />
          </div>
          <div className="character-details">
            <div className="character-name">Misa</div>
            <div className="character-status">Online</div>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="settings-button"
          title="API Settings"
        >
          ⚙️
        </button>
      </div>      
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.sender === 'waifu' && (
              <div className="message-avatar">
                <img src="/mascot.png" alt="Misa" className="avatar-image" />
              </div>
            )}
            {message.sender === 'user' && (
              <div className="message-avatar">
                <img src="/useravtr.png" alt="User" className="avatar-image user-avatar" />
              </div>
            )}
            <div className="message-content">
              <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </div>
              <div className="message-actions">
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {message.sender === 'waifu' && (
                  <button
                    onClick={(e) => copyToClipboard(message.text, e.currentTarget)}
                    className="copy-button"
                    title="Copy Misa's message"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message waifu">
            <div className="message-avatar">
              <img src="/mascot.png" alt="Misa" className="avatar-image typing" />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Misa..."
            className="message-input"
            rows={1}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h3>API Settings</h3>
            <p>Default uses HackClub AI (free & unlimited)! Use your own API key for alternative providers.</p>
            
            <div className="setting-group">
              <label>API Provider:</label>
              <select 
                value={apiProvider} 
                onChange={(e) => setApiProvider(e.target.value as 'default' | 'gemini' | 'openai')}
              >
                <option value="default">HackClub AI (Free & Unlimited)</option>
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
              </select>
            </div>

            {apiProvider !== 'default' && (
              <div className="setting-group">
                <label>API Key:</label>
                <input
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder={`Enter your ${apiProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API key...`}
                />
                <small>
                  {apiProvider === 'gemini' && 'Get free API key from: https://aistudio.google.com/app/usage'}
                  {apiProvider === 'openai' && 'Get API key from: https://platform.openai.com/api-keys'}
                </small>
              </div>
            )}

            <div className="settings-buttons">
              <button onClick={() => setShowSettings(false)}>Cancel</button>
              <button onClick={saveApiSettings}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
