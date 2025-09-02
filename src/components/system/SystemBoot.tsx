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
  { text: '', delay: 50 }, 
  { text: 'WaifuSystems BIOS v2.4.1', delay: 50 }, 
  { text: 'Copyright (C) 1999-2003 WaifuSystems Inc.', delay: 30 }, 
  { text: '', delay: 40 }, 
  { text: 'CPU: Intel Pentium III 800MHz', delay: 25 }, 
  { text: 'Memory Test: ', delay: 20, isProgress: true, progressMax: 512 }, 
  { text: 'Memory: 512MB OK', delay: 50 }, 
  { text: '', delay: 30 }, 
  { text: 'Detecting IDE Drives...', delay: 60 }, 
  { text: '  Primary Master  : WaifuOS System Drive', delay: 40 }, 
  { text: '  Primary Slave   : CDROM Drive', delay: 30 },
  { text: '  Secondary Master: Love Letters Archive', delay: 40 }, 
  { text: '  Secondary Slave : None', delay: 30 }, 
  { text: '', delay: 40 }, 
  { text: 'Detecting USB Devices...', delay: 60 }, 
  { text: '  USB Mouse Found', delay: 30 }, 
  { text: '  USB Keyboard Found', delay: 30 }, 
  { text: '  Heart Monitor Connected', delay: 40 }, 
  { text: '', delay: 50 }, 
  { text: 'Loading WaifuOS...', delay: 80 },
  { text: 'Initializing Romance Drivers...', delay: 100 }, 
  { text: 'Loading Personality Modules...', delay: 120 },
  { text: 'Establishing Connection to Heart Server...', delay: 150 }, 
  { text: '', delay: 50 }, 
  { text: 'WaifuOS Ready.', delay: 80 }, 
  { text: '', delay: 100 }, 
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
      setTimeout(() => onBootComplete(), 100); // reduced from 300
      return;
    }

    const message = biosMessages[currentMessageIndex];
    
    if (message.isProgress) {
      
      setIsTyping(true);
      setDisplayedText(message.text);
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 40 + 20; // Increased speed from 20+5 to 40+20
        if (currentProgress >= (message.progressMax || 100)) {
          currentProgress = message.progressMax || 100;
          clearInterval(progressInterval);
          setProgress(0);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentMessageIndex(prev => prev + 1);
          }, 100); // Reduced from 300 to 100
        }
        setProgress(currentProgress);
      }, 25); // Reduced from 50 to 25
      
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
        }, 15 + Math.random() * 10); // Reduced from 30+20 to 15+10
        
        return () => clearInterval(typingInterval);
      }, 50); // Reduced from 100 to 50
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
