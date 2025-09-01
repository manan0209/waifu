import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'waifu';
  timestamp: Date;
}

export default function WaifuChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to WaifuOS! I\'m your virtual companion. How are you feeling today?',
      sender: 'waifu',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('Akane');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const characters = [
    { name: 'Akane', personality: 'Cheerful and energetic' },
    { name: 'Yuki', personality: 'Calm and thoughtful' },
    { name: 'Rei', personality: 'Mysterious and cool' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - in production this would call OpenAI API
    const responses = [
      "That's really interesting! Tell me more about that.",
      "I understand how you feel. *gives a warm smile*",
      "You know, you're really thoughtful. I appreciate talking with you.",
      "Hmm, that reminds me of something... *looks thoughtful*",
      "I'm here for you, always. What else is on your mind?",
      "*tilts head curiously* That's a unique perspective!",
      "I love hearing your thoughts. You make my day brighter!"
    ];
    
    // Simple response selection based on message content
    if (userMessage.toLowerCase().includes('sad') || userMessage.toLowerCase().includes('down')) {
      return "*hugs gently* I'm sorry you're feeling that way. Want to talk about it?";
    }
    if (userMessage.toLowerCase().includes('happy') || userMessage.toLowerCase().includes('good')) {
      return "I'm so glad to hear that! Your happiness makes me happy too! *smiles brightly*";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
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
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const responseText = await generateResponse(inputText);
      const waifuMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'waifu',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, waifuMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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
            {selectedCharacter === 'Akane' && '🌸'}
            {selectedCharacter === 'Yuki' && '❄️'}
            {selectedCharacter === 'Rei' && '🌙'}
          </div>
          <div className="character-details">
            <div className="character-name">{selectedCharacter}</div>
            <div className="character-status">Online</div>
          </div>
        </div>
        
        <div className="character-selector">
          <select 
            value={selectedCharacter} 
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="character-select"
          >
            {characters.map(char => (
              <option key={char.name} value={char.name}>
                {char.name} - {char.personality}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            placeholder={`Message ${selectedCharacter}...`}
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
