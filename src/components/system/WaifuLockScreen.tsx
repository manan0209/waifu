import React, { useState, useEffect } from 'react';

interface WaifuLockScreenProps {
  onUnlock: () => void;
}

export default function WaifuLockScreen({ onUnlock }: WaifuLockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="clean-lock-screen" onClick={onUnlock}>
      {/* Background with waifu2.jpg */}
      <div className="lock-background">
        <img src="/waifu2.jpg" alt="Background" className="background-image" />
        <div className="background-overlay"></div>
      </div>

      {/* Main content */}
      <div className="lock-content">
        {/* Time display - left aligned */}
        <div className="time-display">
          <div className="greeting">{getGreeting()}</div>
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>

        {/* Simple unlock prompt */}
        <div className="unlock-prompt">
          <div className="unlock-text">Click anywhere to continue</div>
        </div>
      </div>
    </div>
  );
}
