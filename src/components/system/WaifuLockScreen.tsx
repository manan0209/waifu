import React, { useState, useEffect } from 'react';

interface WaifuLockScreenProps {
  onUnlock: () => void;
}

interface Notification {
  id: string;
  app: string;
  title: string;
  message: string;
  time: string;
  icon: string;
}

export default function WaifuLockScreen({ onUnlock }: WaifuLockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [unlockMethod, setUnlockMethod] = useState<'password' | 'pin' | 'pattern'>('password');
  const [pinInput, setPinInput] = useState('');
  const [currentQuote, setCurrentQuote] = useState(0);
  const [weather] = useState({ temp: 24, condition: 'Sunny', icon: '☀️' });
  const [batteryLevel] = useState(85);
  const [showNotifications, setShowNotifications] = useState(false);

  // Waifu quotes that rotate
  const waifuQuotes = [
    "Welcome back, Senpai~ ♡",
    "Ready for another adventure?",
    "Your desktop misses you!",
    "Let's make today kawaii together!",
    "Time to unlock your dreams~",
    "Waifu OS is waiting for you ☆"
  ];

  // Mock notifications
  const notifications: Notification[] = [
    {
      id: '1',
      app: 'WaifuTube',
      title: 'New video available!',
      message: 'Check out the latest lofi collection~',
      time: '5m ago',
      icon: '📺'
    },
    {
      id: '2',
      app: 'Tetris',
      title: 'High Score Alert!',
      message: 'You\'re so close to beating your record!',
      time: '1h ago',
      icon: '🎮'
    },
    {
      id: '3',
      app: 'System',
      title: 'Good morning!',
      message: 'Have a wonderful day ahead ♡',
      time: '8:00 AM',
      icon: '🌸'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % waifuQuotes.length);
    }, 4000);

    return () => clearInterval(quoteTimer);
  }, [waifuQuotes.length]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAvatarClick = () => {
    setShowPasswordField(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock();
  };

  const handlePinInput = (digit: string) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + digit;
      setPinInput(newPin);
      if (newPin.length === 4) {
        setTimeout(() => onUnlock(), 500);
      }
    }
  };

  const clearPin = () => {
    setPinInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUnlock();
    }
  };

  const handleQuickAction = (action: string) => {
    // Quick actions without unlocking
    switch (action) {
      case 'camera':
        console.log('Opening camera...');
        break;
      case 'flashlight':
        console.log('Toggling flashlight...');
        break;
      case 'calculator':
        console.log('Opening calculator...');
        break;
    }
  };

  return (
    <div className="windows-lock-screen">
      {/* Animated background particles */}
      <div className="background-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {['♡', '♪', '☆', '✨', '🌸'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Background with waifu2.jpg */}
      <div className="lock-background">
        <img src="/waifu2.jpg" alt="Background" className="background-image" />
        <div className="background-overlay"></div>
      </div>

      {/* Top status bar */}
      <div className="status-bar">
        <div className="status-left">
          <div className="weather-widget">
            <span className="weather-icon">{weather.icon}</span>
            <span className="weather-temp">{weather.temp}°C</span>
            <span className="weather-condition">{weather.condition}</span>
          </div>
        </div>
        <div className="status-right">
          <div className="battery-indicator">
            <div className="battery-level" style={{ width: `${batteryLevel}%` }}></div>
            <span className="battery-text">{batteryLevel}%</span>
          </div>
          <div className="wifi-strength">📶</div>
        </div>
      </div>

      {/* Main lock screen content */}
      <div className="lock-screen-content">
        {/* Time and greeting section */}
        <div className="time-section">
          <div className="greeting">{getGreeting()}</div>
          <div className="lock-time">{formatTime(currentTime)}</div>
          <div className="lock-date">{formatDate(currentTime)}</div>
        </div>

        {/* Center section with user profile */}
        <div className="user-profile-section">
          <div className="user-avatar" onClick={handleAvatarClick}>
            <img src="/useravtr.png" alt="User Avatar" className="avatar-image" />
            <div className="avatar-ring"></div>
            <div className="online-indicator"></div>
          </div>
          
          <div className="user-info">
            <div className="username">Waifu Master</div>
            <div className="waifu-quote">
              <span className="quote-text">{waifuQuotes[currentQuote]}</span>
            </div>

            {showPasswordField && (
              <div className="unlock-methods">
                <div className="method-tabs">
                  <button 
                    className={`tab ${unlockMethod === 'password' ? 'active' : ''}`}
                    onClick={() => setUnlockMethod('password')}
                  >
                    Password
                  </button>
                  <button 
                    className={`tab ${unlockMethod === 'pin' ? 'active' : ''}`}
                    onClick={() => setUnlockMethod('pin')}
                  >
                    PIN
                  </button>
                  <button 
                    className={`tab ${unlockMethod === 'pattern' ? 'active' : ''}`}
                    onClick={() => setUnlockMethod('pattern')}
                  >
                    Pattern
                  </button>
                </div>

                {unlockMethod === 'password' && (
                  <form onSubmit={handlePasswordSubmit} className="password-form">
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="password-input"
                      autoFocus
                    />
                    <button type="submit" className="login-button">
                      <span className="login-arrow">→</span>
                    </button>
                  </form>
                )}

                {unlockMethod === 'pin' && (
                  <div className="pin-input-section">
                    <div className="pin-display">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`pin-dot ${i < pinInput.length ? 'filled' : ''}`}></div>
                      ))}
                    </div>
                    <div className="pin-keypad">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                        <button 
                          key={digit}
                          className="pin-key"
                          onClick={() => handlePinInput(digit.toString())}
                        >
                          {digit}
                        </button>
                      ))}
                      <button className="pin-key clear-key" onClick={clearPin}>⌫</button>
                    </div>
                  </div>
                )}

                {unlockMethod === 'pattern' && (
                  <div className="pattern-section">
                    <div className="pattern-grid">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="pattern-dot" onClick={() => onUnlock()}></div>
                      ))}
                    </div>
                    <div className="pattern-hint">Draw your unlock pattern</div>
                  </div>
                )}
              </div>
            )}

            {!showPasswordField && (
              <div className="login-prompt" onClick={handleAvatarClick}>
                Tap to unlock ✨
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          <button className="quick-action" onClick={() => handleQuickAction('camera')}>
            <span className="action-icon">📷</span>
          </button>
          <button className="quick-action" onClick={() => handleQuickAction('flashlight')}>
            <span className="action-icon">🔦</span>
          </button>
          <button className="quick-action" onClick={() => handleQuickAction('calculator')}>
            <span className="action-icon">🧮</span>
          </button>
        </div>

        {/* Bottom section */}
        <div className="bottom-section">
          <div className="notifications-preview" onClick={() => setShowNotifications(!showNotifications)}>
            <div className="notification-indicator">
              <span className="notification-count">{notifications.length}</span>
            </div>
            <span className="notification-text">Notifications</span>
          </div>

          <div className="system-info">
            <div className="ease-of-access">
              <button className="accessibility-btn" title="Ease of Access">
                <span className="accessibility-icon">♿</span>
              </button>
            </div>
            <div className="power-options">
              <button className="power-btn" title="Power Options">
                <span className="power-icon">⏻</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications panel */}
      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>✕</button>
          </div>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon">{notification.icon}</div>
                <div className="notification-content">
                  <div className="notification-app">{notification.app}</div>
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
