import { useCallback } from 'react';

export function useSystemSounds() {
  const playSound = useCallback((soundType: 'startup' | 'shutdown' | 'error' | 'notification' | 'button-click') => {
    try {
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const createBeep = (frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' = 'sine') => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      switch (soundType) {
        case 'startup':
          
          createBeep(523, 0.2); 
          setTimeout(() => createBeep(659, 0.2), 100); 
          setTimeout(() => createBeep(784, 0.3), 200); 
          break;
          
        case 'shutdown':
         
          createBeep(784, 0.2); 
          setTimeout(() => createBeep(659, 0.2), 150); 
          setTimeout(() => createBeep(523, 0.3), 300);
          break;
          
        case 'error':
          
          createBeep(300, 0.5, 'square');
          break;
          
        case 'notification':
          
          createBeep(800, 0.1);
          setTimeout(() => createBeep(1000, 0.1), 50);
          break;
          
        case 'button-click':
          
          createBeep(1200, 0.05);
          break;
      }
    } catch (error) {
      console.warn('Could not play system sound:', error);
    }
  }, []);

  return {
    playStartup: () => playSound('startup'),
    playShutdown: () => playSound('shutdown'),
    playError: () => playSound('error'),
    playNotification: () => playSound('notification'),
    playButtonClick: () => playSound('button-click')
  };
}
