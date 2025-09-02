import { useState, useEffect } from 'react';
import { useSystemSounds } from '../../hooks/useAudio';

interface BootMessage {
  text: string;
  delay: number;
  color?: string;
  isProgress?: boolean;
  progressMax?: number;
  type?: 'bios' | 'post' | 'boot' | 'system';
}

// Professional BIOS POST sequence
const biosMessages: BootMessage[] = [
  // BIOS Header
  { text: '', delay: 100, type: 'bios' },
  { text: 'Phoenix BIOS 4.0 Release 6.0', delay: 200, color: '#00ffff', type: 'bios' },
  { text: 'Copyright 1985-2001 Phoenix Technologies Ltd.', delay: 100, color: '#00ffff', type: 'bios' },
  { text: 'All Rights Reserved', delay: 100, color: '#00ffff', type: 'bios' },
  { text: '', delay: 200, type: 'bios' },
  
  // System Information
  { text: 'WaifuTech P4X266A Rev 1.01', delay: 150, color: '#ffffff', type: 'bios' },
  { text: 'Pentium(R) 4 CPU 2.40GHz', delay: 100, color: '#ffffff', type: 'bios' },
  { text: 'Speed: 2400 MHz', delay: 100, color: '#ffffff', type: 'bios' },
  { text: '', delay: 150, type: 'bios' },
  
  // Memory Test
  { text: 'Memory Test: ', delay: 50, color: '#ffffff', isProgress: true, progressMax: 512, type: 'post' },
  { text: 'Memory: 512MB OK', delay: 200, color: '#00ff00', type: 'post' },
  { text: '', delay: 100, type: 'post' },
  
  // Hardware Detection
  { text: 'Detecting Primary Master  : QUANTUM FIREBALL EX10.2A', delay: 300, color: '#ffffff', type: 'post' },
  { text: 'Detecting Primary Slave   : PLEXTOR CD-R   PX-W1610A', delay: 250, color: '#ffffff', type: 'post' },
  { text: 'Detecting Secondary Master: MAXTOR 6Y080L0', delay: 250, color: '#ffffff', type: 'post' },
  { text: 'Detecting Secondary Slave : None', delay: 150, color: '#ffffff', type: 'post' },
  { text: '', delay: 200, type: 'post' },
  
  // System Services
  { text: 'Initializing USB Controllers...OK', delay: 300, color: '#00ff00', type: 'post' },
  { text: 'USB Device 1: Standard USB Mouse', delay: 150, color: '#ffffff', type: 'post' },
  { text: 'USB Device 2: Standard USB Keyboard', delay: 150, color: '#ffffff', type: 'post' },
  { text: '', delay: 200, type: 'post' },
  
  { text: 'Verifying DMI Pool Data...OK', delay: 250, color: '#00ff00', type: 'post' },
  { text: 'Detecting Floppy Drive A: 1.44MB', delay: 200, color: '#ffffff', type: 'post' },
  { text: '', delay: 300, type: 'post' },
  
  // Boot Sequence
  { text: 'Press DEL to enter SETUP, F12 for Boot Menu', delay: 500, color: '#ffff00', type: 'bios' },
  { text: '', delay: 200, type: 'bios' },
  { text: 'Booting from Hard Drive...', delay: 800, color: '#ffffff', type: 'boot' },
  { text: '', delay: 300, type: 'boot' },
  
  // OS Boot
  { text: 'WaifuOS Loading...', delay: 400, color: '#00ffff', type: 'system' },
  { text: '', delay: 200, type: 'system' },
  { text: 'Starting WaifuOS Professional...', delay: 500, color: '#ffffff', type: 'system' },
  { text: '', delay: 800, type: 'system' },
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
  const [bootPhase, setBootPhase] = useState<'bios' | 'post' | 'boot' | 'system'>('bios');
  const { playBootSound, playBeep } = useSystemSounds();

  // Play boot sound when component mounts
  useEffect(() => {
    playBootSound();
    
    // BIOS beep sequence
    setTimeout(() => playBeep(), 500);
  }, [playBootSound, playBeep]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Main boot sequence logic
  useEffect(() => {
    if (currentMessageIndex >= biosMessages.length) {
      setTimeout(() => onBootComplete(), 1000);
      return;
    }

    const message = biosMessages[currentMessageIndex];
    
    // Update boot phase
    if (message.type && message.type !== bootPhase) {
      setBootPhase(message.type);
    }
    
    if (message.isProgress) {
      // Memory test with realistic progress
      setIsTyping(true);
      setDisplayedText(message.text);
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 60 + 40;
        if (currentProgress >= (message.progressMax || 100)) {
          currentProgress = message.progressMax || 100;
          clearInterval(progressInterval);
          setProgress(0);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentMessageIndex(prev => prev + 1);
          }, 200);
        }
        setProgress(currentProgress);
      }, 30);
      
      return () => clearInterval(progressInterval);
    } else {
      // Regular text typing with realistic timing
      setTimeout(() => {
        setIsTyping(true);
        let charIndex = 0;
        setDisplayedText('');
        
        // Instant display for empty lines
        if (message.text === '') {
          setDisplayedText('');
          setIsTyping(false);
          setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
          }, message.delay);
          return;
        }
        
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
        }, 20 + Math.random() * 15);
        
        return () => clearInterval(typingInterval);
      }, 80);
    }
  }, [currentMessageIndex, onBootComplete, bootPhase]);

  const currentMessage = biosMessages[currentMessageIndex];
  const messageColor = currentMessage?.color || '#c0c0c0';

  return (
    <div className={`system-boot phase-${bootPhase}`}>
      <div className="boot-screen">
        {/* BIOS Header (always visible during BIOS phase) */}
        {bootPhase === 'bios' && (
          <div className="bios-header">
            <div className="bios-info">
              <div>Phoenix BIOS 4.0 Release 6.0</div>
              <div>Copyright 1985-2001 Phoenix Technologies Ltd.</div>
            </div>
            <div className="system-info">
              <div>WaifuTech P4X266A Rev 1.01</div>
              <div>CPU: Pentium(R) 4 2.40GHz</div>
              <div>Memory: 512MB</div>
            </div>
          </div>
        )}
        
        {/* Boot Messages */}
        <div className="boot-messages">
          {/* Previous messages */}
          {biosMessages.slice(0, currentMessageIndex).map((msg, index) => (
            <div 
              key={index} 
              className={`boot-line ${msg.type || 'bios'}`}
              style={{ color: msg.color || '#c0c0c0' }}
            >
              {msg.isProgress ? (
                <div className="progress-complete">
                  {msg.text}
                  <div className="progress-bar-complete">
                    [{'█'.repeat(40)}] {msg.progressMax}MB OK
                  </div>
                </div>
              ) : (
                msg.text
              )}
            </div>
          ))}
          
          {/* Current message */}
          {currentMessageIndex < biosMessages.length && (
            <div className={`boot-line current ${currentMessage?.type || 'bios'}`} style={{ color: messageColor }}>
              {currentMessage?.isProgress ? (
                <div className="progress-active">
                  {displayedText}
                  <div className="progress-bar">
                    [
                    {'█'.repeat(Math.floor(progress / 12.8))}
                    {'.'.repeat(40 - Math.floor(progress / 12.8))}
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
        
        {/* Status indicator */}
        <div className="boot-status">
          <div className={`status-led ${bootPhase}`}></div>
          <span className="status-text">{bootPhase.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
