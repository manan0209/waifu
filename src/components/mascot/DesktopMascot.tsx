import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDraggable } from '../../hooks/useDraggable';

interface MascotState {
  mood: 'happy' | 'excited' | 'sleepy' | 'working' | 'bored' | 'surprised';
  energy: number; // 0-100
  happiness: number; // 0-100
  lastInteraction: Date;
  currentAnimation: string;
}

interface MascotProps {
  isVisible: boolean;
  currentApp?: string;
  onMascotClick?: () => void;
}

const getInitialPosition = () => {
  if (typeof window === 'undefined') {
    return { x: 300, y: 200 }; // Default position for SSR
  }
  return { x: window.innerWidth - 150, y: window.innerHeight - 200 };
};

export default function DesktopMascot({ isVisible, currentApp, onMascotClick }: MascotProps) {
  const [mascotState, setMascotState] = useState<MascotState>({
    mood: 'happy',
    energy: 100,
    happiness: 80,
    lastInteraction: new Date(),
    currentAnimation: 'idle'
  });
  
  const [isWalking, setIsWalking] = useState(false);
  const [walkTarget, setWalkTarget] = useState<{ x: number; y: number } | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  
  const mascotRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const walkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const moodUpdateRef = useRef<NodeJS.Timeout | null>(null);

  const initialPos = getInitialPosition();
  const { position, handleMouseDown, isDragging } = useDraggable({
    x: initialPos.x,
    y: initialPos.y
  });

  // Speech library - context-aware responses
  const speechLibrary = {
    greeting: [
      "Konnichiwa! ヾ(＾-＾)ノ",
      "Welcome back, senpai!",
      "Ready to be productive today?",
      "Let's make today amazing! ✨"
    ],
    idle: [
      "Hmm... what shall we do next?",
      "Maybe we should take a break?",
      "I'm here if you need me! (◕‿◕)",
      "The desktop looks nice today~",
      "*yawns* Getting a bit sleepy...",
      "Click on me for a surprise!"
    ],
    working: [
      "You're so focused! Gambatte! ",
      "Great job staying productive!",
      "Don't forget to take breaks!",
      "I believe in you, senpai!",
      "Amazing work ethic! ✨"
    ],
    notepad: [
      "Writing something important?",
      "Your words look beautiful! ",
      "Maybe write a story about us? (´∀`)",
      "Don't forget to save your work!"
    ],
    calculator: [
      "Math time! I love numbers!",
      "You're so smart with calculations!",
      "2 + 2 = kawaii! Wait, that's not right...",
      "Computing... computing... done! ✨"
    ],
    fileExplorer: [
      "Organizing files? Very responsible!",
      "I see you're exploring the system~",
      "Find anything interesting in there?",
      "File management is important!"
    ],
    minesweeper: [
      "Ooh, games! This looks dangerous... 💣",
      "Be careful with those mines!",
      "You're so brave, senpai!",
      "I'll cheer you on! Faito! "
    ],
    clicked: [
      "Kyaa! You clicked me! (〃▽〃)",
      "Ehehe~ That tickles!",
      "*giggles* What can I help with?",
      "Nya~ You found me! ♪(´▽｀)",
      "Surprise! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
      "Want to play a mini-game?"
    ],
    bored: [
      "Senpai... pay attention to me... (´･ω･`)",
      "*pokes the screen* Notice me!",
      "I'm getting lonely over here...",
      "Maybe we could do something fun?",
      "The desktop is too quiet..."
    ],
    surprised: [
      "Eh?! What happened?!",
      "Σ(°△°|||)！！",
      "That was unexpected!",
      "Wow! Amazing!"
    ]
  };

  
  const getRandomSpeech = useCallback((context: keyof typeof speechLibrary) => {
    const speeches = speechLibrary[context];
    return speeches[Math.floor(Math.random() * speeches.length)];
  }, []);

  
  const showSpeech = useCallback((text: string, duration = 3000) => {
    setSpeechText(text);
    setShowSpeechBubble(true);
    
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    speechTimeoutRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, duration);
  }, []);

  
  const updateMood = useCallback(() => {
    const now = new Date();
    const timeSinceInteraction = now.getTime() - mascotState.lastInteraction.getTime();
    const minutesSinceInteraction = timeSinceInteraction / (1000 * 60);

    setMascotState(prev => {
      let newMood = prev.mood;
      let newEnergy = Math.max(0, prev.energy - 1);
      let newHappiness = prev.happiness;

      
      if (currentApp) {
        switch (currentApp) {
          case 'notepad':
          case 'calculator':
            newMood = 'working';
            newHappiness = Math.min(100, newHappiness + 0.5);
            break;
          case 'minesweeper':
            newMood = 'excited';
            newEnergy = Math.min(100, newEnergy + 2);
            break;
          case 'file-explorer':
            newMood = 'working';
            break;
        }
      }

      
      if (minutesSinceInteraction > 5) {
        newMood = 'bored';
        newHappiness = Math.max(0, newHappiness - 1);
      } else if (minutesSinceInteraction > 10) {
        newMood = 'sleepy';
        newEnergy = Math.max(0, newEnergy - 2);
      }

      
      if (newEnergy < 30) {
        newMood = 'sleepy';
      } else if (newEnergy > 80 && newHappiness > 70) {
        newMood = 'happy';
      }

      return {
        ...prev,
        mood: newMood,
        energy: newEnergy,
        happiness: newHappiness
      };
    });
  }, [currentApp, mascotState.lastInteraction]);

  
  const startRandomWalk = useCallback(() => {
    if (isBeingDragged || isDragging) return;

    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 150;
    const targetX = Math.random() * maxX;
    const targetY = Math.random() * maxY;

    setWalkTarget({ x: targetX, y: targetY });
    setIsWalking(true);
    setMascotState(prev => ({ ...prev, currentAnimation: 'walking' }));
  }, [isBeingDragged, isDragging]);

  
  const randomSpeech = useCallback(() => {
    if (showSpeechBubble) return;

    const contexts: (keyof typeof speechLibrary)[] = ['idle', 'bored'];
    if (currentApp) {
      if (currentApp === 'notepad') contexts.push('notepad');
      if (currentApp === 'calculator') contexts.push('calculator');
      if (currentApp === 'file-explorer') contexts.push('fileExplorer');
      if (currentApp === 'minesweeper') contexts.push('minesweeper');
      contexts.push('working');
    }

    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    const speech = getRandomSpeech(randomContext);
    showSpeech(speech);
  }, [currentApp, showSpeechBubble, getRandomSpeech, showSpeech]);

  // Sound effects
  const playMascotSound = useCallback((soundFile: string) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.4;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Failed to play mascot sound:', error);
    }
  }, []);

  // Handle mascot click
  const handleMascotClick = useCallback(() => {
    if (isDragging) return;

    const speech = getRandomSpeech('clicked');
    showSpeech(speech);
    
    // Play random interaction sound
    const interactionSounds = ['/senpai.mp3', '/tuturu.mp3', '/onii_chan_message.mp3'];
    const randomSound = interactionSounds[Math.floor(Math.random() * interactionSounds.length)];
    playMascotSound(randomSound);
    
    setMascotState(prev => ({
      ...prev,
      mood: 'excited',
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.min(100, prev.energy + 5),
      lastInteraction: new Date(),
      currentAnimation: 'excited'
    }));

    // Reset animation after excitement
    setTimeout(() => {
      setMascotState(prev => ({ ...prev, currentAnimation: 'idle' }));
    }, 1000);

    onMascotClick?.();
  }, [isDragging, getRandomSpeech, showSpeech, onMascotClick, playMascotSound]);

  
  useEffect(() => {
    if (!isVisible) return;
    moodUpdateRef.current = setInterval(updateMood, 30000);
    const behaviorInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        randomSpeech();
      }
      if (Math.random() < 0.1) {
        startRandomWalk();
      }
    }, 10000);

    return () => {
      if (moodUpdateRef.current) clearInterval(moodUpdateRef.current);
      clearInterval(behaviorInterval);
    };
  }, [isVisible, updateMood, randomSpeech, startRandomWalk]);

  
  useEffect(() => {
    if (!walkTarget || !isWalking) return;

    const walkSpeed = 2;
    const interval = setInterval(() => {
      const dx = walkTarget.x - position.x;
      const dy = walkTarget.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < walkSpeed) {
        setIsWalking(false);
        setWalkTarget(null);
        setMascotState(prev => ({ ...prev, currentAnimation: 'idle' }));
        return;
      }

      const moveX = (dx / distance) * walkSpeed;
      const moveY = (dy / distance) * walkSpeed;
      
      
      if (mascotRef.current) {
        const newX = position.x + moveX;
        const newY = position.y + moveY;
        mascotRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }, 16);

    walkIntervalRef.current = interval;
    return () => {
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
    };
  }, [walkTarget, isWalking, position]);

  useEffect(() => {
    setIsBeingDragged(isDragging);
    if (isDragging) {
      setIsWalking(false);
      setWalkTarget(null);
      setMascotState(prev => ({ ...prev, currentAnimation: 'surprised' }));
    } else {
      setTimeout(() => {
        setMascotState(prev => ({ ...prev, currentAnimation: 'idle' }));
      }, 500);
    }
  }, [isDragging]);

  
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
      if (moodUpdateRef.current) clearInterval(moodUpdateRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={mascotRef}
      className={`desktop-mascot mood-${mascotState.mood} animation-${mascotState.currentAnimation} ${isWalking ? 'walking' : ''}`}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        pointerEvents: 'auto'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleMascotClick}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="speech-bubble">
          <div className="speech-text">{speechText}</div>
          <div className="speech-tail"></div>
        </div>
      )}

     
      <div className="mascot-character">
        <img 
          src="/mascot.png" 
          alt="Desktop Mascot" 
          className="mascot-image"
          draggable={false}
        />
        
      
        <div className="mascot-overlay">
         
          <div className="mascot-eyes">
            <div className={`mascot-eye left ${mascotState.mood} ${mascotState.currentAnimation}`}></div>
            <div className={`mascot-eye right ${mascotState.mood} ${mascotState.currentAnimation}`}></div>
          </div>
          
         
          {mascotState.mood === 'excited' && (
            <div className="mascot-blush">
              <div className="blush left"></div>
              <div className="blush right"></div>
            </div>
          )}
        </div>
      </div>

        
        <div className="mascot-status">
          <div className="energy-bar">
            <div 
              className="energy-fill"
              style={{ width: `${mascotState.energy}%` }}
            ></div>
          </div>
          <div className="happiness-indicator">
            {Array.from({ length: 5 }, (_, i) => (
              <div 
                key={i}
                className={`heart ${i < Math.floor(mascotState.happiness / 20) ? 'filled' : ''}`}
              >♥</div>
            ))}
          </div>
        </div>

        
        {mascotState.mood === 'excited' && (
          <div className="particle-effects">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`particle particle-${i}`}>✨</div>
            ))}
          </div>
        )}

        
        {mascotState.mood === 'happy' && (
          <div className="floating-hearts">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={`floating-heart heart-${i}`}>♥</div>
            ))}
          </div>
        )}
      </div>
  );
}
