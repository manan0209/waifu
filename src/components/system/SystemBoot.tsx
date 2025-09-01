import { useState, useEffect } from 'react';
import { useSystemSounds } from '../../hooks/useAudio';

interface BootMessage {
  text: string;
  delay: number;
  color?: string;
  isProgress?: boolean;
  progressMax?: number;
}

const biosMessages: BootMessage[] = [
  { text: '', delay: 500 }, // Initial pause
  { text: 'WaifuSystems BIOS v2.4.1', delay: 300 },
  { text: 'Copyright (C) 1999-2003 WaifuSystems Inc.', delay: 200 },
  { text: '', delay: 300 },
  { text: 'CPU: Intel Pentium III 800MHz', delay: 150 },
  { text: 'Memory Test: ', delay: 100, isProgress: true, progressMax: 512 },
  { text: 'Memory: 512MB OK', delay: 300 },
  { text: '', delay: 200 },
  { text: 'Detecting IDE Drives...', delay: 400 },
  { text: '  Primary Master  : WaifuOS System Drive', delay: 250 },
  { text: '  Primary Slave   : CDROM Drive', delay: 200 },
  { text: '  Secondary Master: Love Letters Archive', delay: 250 },
  { text: '  Secondary Slave : None', delay: 200 },
  { text: '', delay: 300 },
  { text: 'Detecting USB Devices...', delay: 400 },
  { text: '  USB Mouse Found', delay: 200 },
  { text: '  USB Keyboard Found', delay: 200 },
  { text: '  Heart Monitor Connected', delay: 300 },
  { text: '', delay: 400 },
  { text: 'Loading WaifuOS...', delay: 500 },
  { text: 'Initializing Romance Drivers...', delay: 600 },
  { text: 'Loading Personality Modules...', delay: 700 },
  { text: 'Establishing Connection to Heart Server...', delay: 800 },
  { text: '', delay: 300 },
  { text: 'WaifuOS Ready.', delay: 400 },
  { text: '', delay: 1000 },
];

interface SystemBootProps {
  onBootComplete: () => void;
}

export default function SystemBoot({ onBootComplete }: SystemBootProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const { playBootSound, playBeep } = useSystemSounds();

  // Play boot sound when component mounts
  useEffect(() => {
    playBootSound();
  }, [playBootSound]);

  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  
  useEffect(() => {
    if (currentMessageIndex >= biosMessages.length) {
      setTimeout(() => onBootComplete(), 1000);
      return;
    }

    const message = biosMessages[currentMessageIndex];
    
    if (message.isProgress) {
      
      setIsTyping(true);
      setDisplayedText(message.text);
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 20 + 5;
        if (currentProgress >= (message.progressMax || 100)) {
          currentProgress = message.progressMax || 100;
          clearInterval(progressInterval);
          setProgress(0);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentMessageIndex(prev => prev + 1);
          }, 300);
        }
        setProgress(currentProgress);
      }, 50);
      
      return () => clearInterval(progressInterval);
    } else {
      
      setTimeout(() => {
        setIsTyping(true);
        let charIndex = 0;
        setDisplayedText('');
        
        const typingInterval = setInterval(() => {
          if (charIndex <= message.text.length) {
            setDisplayedText(message.text.slice(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            setTimeout(() => {
              setCurrentMessageIndex(prev => prev + 1);
            }, message.delay);
          }
        }, 30 + Math.random() * 20);
        
        return () => clearInterval(typingInterval);
      }, 100);
    }
  }, [currentMessageIndex, onBootComplete]);

  const currentMessage = biosMessages[currentMessageIndex];
  const messageColor = currentMessage?.color || '#ffffff';

  return (
    <div className="system-boot">
      <div className="boot-screen">
        
        {biosMessages.slice(0, currentMessageIndex).map((msg, index) => (
          <div 
            key={index} 
            className="boot-line"
            style={{ color: msg.color || '#ffffff' }}
          >
            {msg.isProgress ? (
              <div>
                {msg.text}
                <div className="progress-bar-complete">
                  [{'█'.repeat(20)}] {msg.progressMax}MB OK
                </div>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
        
        
        {currentMessageIndex < biosMessages.length && (
          <div className="boot-line current" style={{ color: messageColor }}>
            {currentMessage?.isProgress ? (
              <div>
                {displayedText}
                <div className="progress-bar">
                  [
                  {'█'.repeat(Math.floor(progress / 25.6))}
                  {'.'.repeat(20 - Math.floor(progress / 25.6))}
                  ] {Math.floor(progress)}MB
                </div>
              </div>
            ) : (
              <>
                {displayedText}
                {(isTyping || showCursor) && (
                  <span className="cursor">_</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
