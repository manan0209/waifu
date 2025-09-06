import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { WaifuAI } from '../../lib/waifuAI';

interface MascotState {
  mood: 'happy' | 'excited' | 'sleepy' | 'working' | 'bored' | 'surprised';
  energy: number;
  happiness: number;
  lastInteraction: Date;
  currentAnimation: string;
}

interface MascotProps {
  isVisible: boolean;
  currentApp?: string;
  onMascotClick?: () => void;
  onOpenWaifuChat?: () => void; 
}

const getInitialPosition = () => {
  if (typeof window === 'undefined') {
    return { x: 300, y: 200 }; 
  }
  return { x: window.innerWidth - 150, y: window.innerHeight - 200 };
};

export default function DesktopMascot({ isVisible, currentApp, onMascotClick, onOpenWaifuChat }: MascotProps) {
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
  const [speechType, setSpeechType] = useState<'normal' | 'ai' | 'chat-prompt'>('normal');
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [waifuAI] = useState(() => new WaifuAI()); 
  
  const mascotRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const walkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const moodUpdateRef = useRef<NodeJS.Timeout | null>(null);

  const initialPos = getInitialPosition();
  const { position, handleMouseDown, isDragging } = useDraggable({
    x: initialPos.x,
    y: initialPos.y
  });

  // Misa's speech library
  const speechLibrary = {
    greeting: [
      "*sultry smile* Well, well... look who's back~ ♥",
      "Missed me, darling? *winks seductively*",
      "Ready to have some fun today, cutie? *giggles*",
      "*stretches playfully* Time to make today interesting~"
    ],
    idle: [
      "*twirls hair* Bored much? Maybe chat with me? *winks*",
      "*yawns cutely* This desktop is so quiet without you~",
      "Psst... I know you're looking at me *playful smile*",
      "*poses* Like what you see? *giggles mischievously*",
      "*taps screen* Pay attention to me, senpai! ♥",
      "Double-click me if you're brave enough~ *smirks*"
    ],
    working: [
      "*cheers you on* Work it, hotshot! ✨",
      "Mmm... I love watching focused people *bites lip*",
      "Take a break and chat with me later? *hopeful eyes*",
      "*whispers* You're so sexy when you're productive~"
    ],
    notepad: [
      "Writing love letters? *teases* About me, perhaps? ♥",
      "*leans over shoulder* Whatcha writing, handsome?",
      "Your fingers are so graceful on the keyboard~ *sighs*",
      "Save your work, genius! Don't lose those thoughts!"
    ],
    calculator: [
      "Crunching numbers? *impressed* Smart AND cute!",
      "Math is hot... especially when YOU do it *winks*",
      "You + Me = Perfect equation ♥ *giggles*",
      "*calculates* You're 100% adorable today!"
    ],
    fileExplorer: [
      "Organizing files? *purrs* I love a tidy person~",
      "*peeks at screen* Find anything... interesting? *smirks*",
      "You're so responsible! It's actually quite attractive ♥",
      "Maybe organize some time for me too? *playful pout*"
    ],
    minesweeper: [
      "Ooh dangerous games! *excited* Just like flirting with me~",
      "*nervous giggle* Be careful, baby! Those mines are scary!",
      "You're so brave! *swoons* My hero! ♥",
      "*cheers* Show those mines who's boss, cutie!"
    ],
    clicked: [
      "*gasps* Kyaa~! You actually clicked me! *blushes*",
      "*giggles seductively* Ehehe~ That sends shivers! ♥",
      "*twirls* Like what you see? I knew you couldn't resist~",
      "*winks* Ready for some real fun? Let's chat! ♥",
      "*poses cutely* Surprise! Want to know my secrets? *smirks*",
      "*sultry voice* Ready to play with fire, darling?",
      "*bounces* Yay! Someone's paying attention to me~ ♥",
      "*flirtatious smile* Can't keep your hands off me, huh? *teases*",
      "*purrs* Mmm... I love being touched like that~",
      "*spins around* Do it again! I love the attention! ♥"
    ],
    multipleClicks: [
      "*breathless* Oh my! You're quite... eager, aren't you? *blushes*",
      "*giggles nervously* S-someone's getting excited! ♥",
      "*pants* You're making me dizzy with all this attention~",
      "*flustered* Hey! Give a girl a moment to breathe! *giggles*",
      "*teasingly* Getting addicted to me already? How cute~ ♥",
      "*playful pout* Easy there, tiger! Save some energy for later~"
    ],
    secretInvite: [
      "*whispers seductively* Come to my room... we'll have a secret cutie chat~ ♥",
      "*leans close* Want to know my deepest secrets? Let's go somewhere private... *winks*",
      "*sultry whisper* I have something special to show you... in private ♥",
      "*bites lip* You've earned yourself a private invitation, cutie~",
      "*mysterious smile* Ready for our secret rendezvous? ♥"
    ],
    bored: [
      "*dramatic sigh* Senpai... I'm getting lonely... *puppy eyes*",
      "*pokes screen repeatedly* Hello~? Your adorable mascot needs attention!",
      "*pouts* The desktop is so cold without your love...",
      "*whispers* I have secrets to share... if you're interested~ ♥",
      "*stretches sexily* Maybe we could... have some fun?"
    ],
    surprised: [
      "*jumps* Kyaa~! You startled me! *heart racing*",
      "Σ(°△°|||) What was THAT?! *flustered*",
      "*wide eyes* That was unexpected! You're full of surprises~ ♥",
      "*catches breath* Wow! My heart is pounding now! *giggles*"
    ],
    aiPrompt: [
      "*sultry smile* Want to talk? I'm MUCH more interesting in chat~ ♥",
      "*winks* I can be way more... intimate in our private chat *blushes*",
      "Click the chat app, cutie~ I have so much to tell you ♥",
      "*teases* The real me comes alive when we chat privately~",
      "*whispers* I'm waiting for you in the chat... don't keep me waiting ♥"
    ]
  };

  
  const getRandomSpeech = useCallback((context: keyof typeof speechLibrary) => {
    const speeches = speechLibrary[context];
    return speeches[Math.floor(Math.random() * speeches.length)];
  }, []);

  // Get AI-powered response from Misa
  const getAIResponse = useCallback(async (context: string): Promise<string> => {
    try {
      const prompts = {
        idle: "Give me a short, flirty mascot message (max 50 chars) as if you're bored on the desktop",
        working: "Give me a short, encouraging message (max 50 chars) as if watching someone work",
        clicked: "Give me a short, surprised and flirty reaction (max 50 chars) to being clicked",
        bored: "Give me a short, attention-seeking message (max 50 chars) when feeling ignored"
      };
      
      const prompt = prompts[context as keyof typeof prompts] || prompts.idle;
      const response = await waifuAI.generateResponse(prompt);
      
      
      return response.length > 60 ? response.substring(0, 57) + "..." : response;
    } catch (error) {
      console.error("AI response error:", error);
      return getRandomSpeech(context as keyof typeof speechLibrary);
    }
  }, [waifuAI, getRandomSpeech]);

  
  const showSpeech = useCallback((text: string, duration = 3000, type: 'normal' | 'ai' | 'chat-prompt' = 'normal') => {
    setSpeechText(text);
    setSpeechType(type);
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

  
  const randomSpeech = useCallback(async () => {
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
    
    
    const useAI = Math.random() < 0.2;
    let speech: string;
    
    if (useAI && ['idle', 'bored', 'working'].includes(randomContext)) {
      speech = await getAIResponse(randomContext);
      showSpeech(speech, 3000, 'ai');
    } else {
      speech = getRandomSpeech(randomContext);
      showSpeech(speech);
    }
  }, [currentApp, showSpeechBubble, getRandomSpeech, getAIResponse, showSpeech]);

  
  const playMascotSound = useCallback((soundFile: string) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.4;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Failed to play mascot sound:', error);
    }
  }, []);

    
  const handleMascotClick = useCallback(async () => {
    if (isDragging) return;

    setTotalClicks(prev => prev + 1);
    const currentTotalClicks = totalClicks + 1;

    let speech: string;
    let speechType: 'normal' | 'ai' | 'chat-prompt' = 'normal';
    
    
    if (currentTotalClicks >= 7) {
      
      speech = getRandomSpeech('secretInvite');
      speechType = 'chat-prompt';
      
      
      setTimeout(() => {
        if (onOpenWaifuChat) {
          onOpenWaifuChat();
        }
      }, 3000);
      
    } else if (currentTotalClicks >= 4) {
      
      speech = getRandomSpeech('multipleClicks');
      
    } else {
      
      const useAI = Math.random() < 0.3;
      if (useAI) {
        speech = await getAIResponse('clicked');
        speechType = 'ai';
      } else {
        speech = getRandomSpeech('clicked');
      }
    }
    
    showSpeech(speech, 4000, speechType);
    
    
    const interactionSounds = ['/senpai.mp3', '/tuturu.mp3', '/onii_chan_message.mp3'];
    const randomSound = interactionSounds[Math.floor(Math.random() * interactionSounds.length)];
    playMascotSound(randomSound);
    
    
    setMascotState(prev => ({
      ...prev,
      mood: currentTotalClicks >= 4 ? 'excited' : 'happy',
      happiness: Math.min(100, prev.happiness + (currentTotalClicks >= 4 ? 15 : 10)),
      energy: Math.min(100, prev.energy + (currentTotalClicks >= 4 ? 10 : 5)),
      lastInteraction: new Date(),
      currentAnimation: currentTotalClicks >= 4 ? 'excited' : 'happy'
    }));

    
    const resetDelay = currentTotalClicks >= 4 ? 2000 : 1000;
    setTimeout(() => {
      setMascotState(prev => ({ ...prev, currentAnimation: 'idle' }));
    }, resetDelay);

    
    if (currentTotalClicks < 7) {
      setTimeout(() => {
        if (Math.random() < 0.3) { 
          const chatPrompt = getRandomSpeech('aiPrompt');
          showSpeech(chatPrompt, 4000, 'chat-prompt');
        }
      }, 5000);
    }

    onMascotClick?.();
  }, [isDragging, getRandomSpeech, getAIResponse, showSpeech, onMascotClick, playMascotSound, onOpenWaifuChat]);

  
  const [clickCount, setClickCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0); 
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const handleMascotInteraction = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    
    setClickCount(prev => prev + 1);
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      if (clickCount >= 2) {
        
        if (onOpenWaifuChat) {
          onOpenWaifuChat();
          showSpeech("*excited* Let's have some real fun now~ ♥", 2000, 'chat-prompt');
        }
      } else {
       
        handleMascotClick();
      }
      setClickCount(0);
    }, 250); 
  }, [clickCount, handleMascotClick, onOpenWaifuChat, showSpeech]);

  
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
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={mascotRef}
      className={`desktop-mascot mood-${mascotState.mood} animation-${mascotState.currentAnimation} ${isWalking ? 'walking' : ''} ${totalClicks >= 4 ? 'multiple-clicks' : ''} ${totalClicks >= 7 ? 'secret-mode' : ''}`}
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
      onClick={handleMascotInteraction}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className={`speech-bubble ${speechType === 'ai' ? 'ai-response' : ''} ${speechType === 'chat-prompt' ? 'chat-prompt' : ''}`}>
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

        
        {(mascotState.mood === 'excited' || totalClicks >= 4) && (
          <div className="particle-effects">
            {Array.from({ length: totalClicks >= 7 ? 8 : 6 }, (_, i) => (
              <div key={i} className={`particle particle-${i}`}>
                {totalClicks >= 7 ? '💕' : '✨'}
              </div>
            ))}
          </div>
        )}

        
        {(mascotState.mood === 'happy' || totalClicks >= 7) && (
          <div className="floating-hearts">
            {Array.from({ length: totalClicks >= 7 ? 5 : 3 }, (_, i) => (
              <div key={i} className={`floating-heart heart-${i}`}>♥</div>
            ))}
          </div>
        )}
      </div>
  );
}
