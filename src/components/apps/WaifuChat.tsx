import { useState, useRef, useEffect } from 'react';
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
  const [waifuAI] = useState(() => new WaifuAI());
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with Misa and welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: '*sultry smile* Well, well... look who decided to visit me~ *winks* I\'m Misa Misa, your delightfully naughty companion. I\'m powered by real AI now, so I can be even more... interactive~ *giggles playfully* Ready to have some fun, darling?',
      sender: 'waifu',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [waifuAI]);

  const saveApiKey = (service: string, apiKey: string) => {
    if (apiKey.trim()) {
      localStorage.setItem(`${service}_api_key`, apiKey.trim());
    } else {
      localStorage.removeItem(`${service}_api_key`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      return await waifuAI.generateResponse(userMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      return "Sorry darling, I'm having a bit of trouble thinking right now... *playful pout* Try again?";
    }
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

    // Generate AI response
    try {
      const responseText = await generateResponse(messageToSend);
      
      // Simulate typing delay for more natural feel
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

  return (
    <div className="waifu-chat-app">
      {/* Header */}
      <div className="chat-header">
        <div className="character-info">
          <div className="character-avatar">
            💕
          </div>
          <div className="character-details">
            <div className="character-name">Misa <span style={{fontSize: '12px', color: '#00ff00'}}>● AI Powered</span></div>
            <div className="character-status">Online</div>
          </div>
        </div>
        
        <div className="ai-settings">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="settings-button"
            style={{
              background: '#c0c0c0',
              border: '2px outset #c0c0c0',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ⚙️ AI Settings
          </button>
        </div>
      </div>

      {/* AI Settings Panel */}
      {showSettings && (
        <div className="ai-settings-panel" style={{
          background: '#c0c0c0',
          border: '2px inset #c0c0c0',
          padding: '10px',
          margin: '5px',
          fontSize: '12px'
        }}>
          <div style={{marginBottom: '8px', fontWeight: 'bold'}}>🤖 AI Configuration (Optional)</div>
          <div style={{marginBottom: '5px', color: '#006600'}}>
            ✅ HuggingFace: Free AI (No setup needed!)
          </div>
          <div style={{marginBottom: '5px', color: '#666'}}>
            📡 Groq API Key (Free tier): 
            <input 
              type="password" 
              placeholder="Optional: gsk_..." 
              style={{marginLeft: '5px', width: '200px', padding: '2px'}}
              onChange={(e) => saveApiKey('groq', e.target.value)}
              defaultValue={localStorage.getItem('groq_api_key') || ''}
            />
          </div>
          <div style={{marginBottom: '5px', color: '#666'}}>
            🧠 OpenAI API Key (Paid): 
            <input 
              type="password" 
              placeholder="Optional: sk-..." 
              style={{marginLeft: '5px', width: '200px', padding: '2px'}}
              onChange={(e) => saveApiKey('openai', e.target.value)}
              defaultValue={localStorage.getItem('openai_api_key') || ''}
            />
          </div>
          <div style={{fontSize: '10px', color: '#666', marginTop: '8px'}}>
            💡 Misa uses free AI by default! Add API keys for even better responses.
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message waifu">
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
    </div>
  );
}
