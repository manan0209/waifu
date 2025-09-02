import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SystemSettings {
  
  brightness: number;
  resolution: string;
  colorQuality: string;
  crtEffect: boolean;
  scanlines: boolean;
  
  
  masterVolume: number;
  soundScheme: string;
  systemSounds: boolean;
  typingSounds: boolean;
  notificationSounds: boolean;
  ambientSounds: boolean;
  
  
  waifuPersonality: string;
  loveIntensity: number;
  autoCompliments: boolean;
  showHearts: boolean;
  morningGreetings: boolean;
  lateNightCare: boolean;
  
  
  wallpaperTheme: string;
  colorScheme: string;
  particleEffects: boolean;
  rainbowCursor: boolean;
  screenShake: boolean;
  autoNightMode: boolean;
  
  
  devMode: boolean;
  ultraKawaii: boolean;
  fartMode: boolean;
}

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
  applyBrightness: (value: number) => void;
  applyVolume: (value: number) => void;
  playSystemSound: (soundType: string) => void;
}

const defaultSettings: SystemSettings = {
  brightness: 80,
  resolution: '1024x768',
  colorQuality: '32-bit',
  crtEffect: false,
  scanlines: false,
  
  masterVolume: 75,
  soundScheme: 'kawaii',
  systemSounds: true,
  typingSounds: true,
  notificationSounds: true,
  ambientSounds: false,
  
  waifuPersonality: 'classic',
  loveIntensity: 75,
  autoCompliments: true,
  showHearts: true,
  morningGreetings: true,
  lateNightCare: true,
  
  wallpaperTheme: 'waifu-pink',
  colorScheme: 'kawaii-paradise',
  particleEffects: true,
  rainbowCursor: false,
  screenShake: false,
  autoNightMode: false,
  
  devMode: false,
  ultraKawaii: false,
  fartMode: false
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side rendering flag
  useEffect(() => {
    setIsClient(true);
    
    // Load settings from localStorage only on client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('waifuos-settings');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } catch (e) {
          console.log('Failed to parse saved settings, using defaults');
        }
      }
    }
  }, []);

  // Save settings to localStorage whenever they change (client-side only)
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('waifuos-settings', JSON.stringify(settings));
    }
  }, [settings, isClient]);

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyBrightness = (value: number) => {
    
    const overlay = document.getElementById('brightness-overlay') || document.createElement('div');
    overlay.id = 'brightness-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${(100 - value) / 200})`;
    overlay.style.transition = 'background-color 0.3s ease';
    
    if (!document.getElementById('brightness-overlay')) {
      document.body.appendChild(overlay);
    }
  };

  const applyVolume = (value: number) => {
    
    (window as any).waifuOSVolume = value / 100;
    
    
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = (window as any).waifuOSVolume || 1;
    });
  };

  const playSystemSound = (soundType: string) => {
    if (!settings.systemSounds) return;
    
    const volumeLevel = settings.masterVolume / 100;
    
    try {
      let audioFile = '';
      
      switch (soundType) {
        case 'click':
          audioFile = '/sounds/system/beep.mp3';
          break;
        case 'error':
          audioFile = settings.fartMode ? '/fart.mp3' : '/sounds/system/error.mp3';
          break;
        case 'notification':
          audioFile = '/sounds/system/beep.mp3';
          break;
        case 'waifu':
          audioFile = '/senpai.mp3';
          break;
        case 'kawaii':
          audioFile = '/tuturu.mp3';
          break;
        case 'typing':
          if (settings.typingSounds) {
            audioFile = '/sounds/ui/typing.mp3';
          }
          break;
        default:
          audioFile = '/sounds/system/beep.mp3';
      }
      
      if (audioFile) {
        const audio = new Audio(audioFile);
        audio.volume = volumeLevel * 0.5; 
        audio.play().catch(e => console.log('Sound playback failed:', e));
      }
    } catch (e) {
      console.log('Sound playback failed:', e);
    }
  };

  // Apply brightness and volume effects (client-side only)
  useEffect(() => {
    if (isClient) {
      applyBrightness(settings.brightness);
    }
  }, [settings.brightness, isClient]);

  useEffect(() => {
    if (isClient) {
      applyVolume(settings.masterVolume);
    }
  }, [settings.masterVolume, isClient]);

  // Apply color scheme (client-side only)
  useEffect(() => {
    if (isClient) {
      const root = document.documentElement;
      
      switch (settings.colorScheme) {
        case 'kawaii-paradise':
          root.style.setProperty('--primary-color', '#ff6b9d');
          root.style.setProperty('--secondary-color', '#c44569');
          root.style.setProperty('--accent-color', '#8e44ad');
          break;
        case 'cyber-neon':
          root.style.setProperty('--primary-color', '#00ffff');
          root.style.setProperty('--secondary-color', '#ff00ff');
          root.style.setProperty('--accent-color', '#ffff00');
          break;
        case 'classic-windows':
          root.style.setProperty('--primary-color', '#008080');
          root.style.setProperty('--secondary-color', '#c0c0c0');
          root.style.setProperty('--accent-color', '#000080');
          break;
        case 'dark-mode':
          root.style.setProperty('--primary-color', '#333333');
          root.style.setProperty('--secondary-color', '#666666');
          root.style.setProperty('--accent-color', '#999999');
          break;
      }
    }
  }, [settings.colorScheme, isClient]);

  // Apply particle effects (client-side only)
  useEffect(() => {
    if (isClient) {
      if (settings.particleEffects) {
        document.body.classList.add('particles-enabled');
      } else {
        document.body.classList.remove('particles-enabled');
      }
    }
  }, [settings.particleEffects, isClient]);

  // Apply rainbow cursor (client-side only)
  useEffect(() => {
    if (isClient) {
      if (settings.rainbowCursor) {
        document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M0 0l20 20\' stroke=\'%23ff0000\' stroke-width=\'2\'/%3E%3C/svg%3E"), auto';
      } else {
        document.body.style.cursor = 'auto';
      }
    }
  }, [settings.rainbowCursor, isClient]);

  // Apply CRT effect (client-side only)
  useEffect(() => {
    if (isClient) {
      if (settings.crtEffect) {
        document.body.classList.add('crt-effect');
      } else {
        document.body.classList.remove('crt-effect');
      }
    }
  }, [settings.crtEffect, isClient]);

  // Apply scanlines effect (client-side only)
  useEffect(() => {
    if (isClient) {
      if (settings.scanlines) {
        document.body.classList.add('scanlines-effect');
      } else {
        document.body.classList.remove('scanlines-effect');
      }
    }
  }, [settings.scanlines, isClient]);

  // Apply ultra kawaii mode (client-side only)
  useEffect(() => {
    if (isClient) {
      if (settings.ultraKawaii) {
        document.body.classList.add('ultra-kawaii-mode');
        
        if (!document.getElementById('floating-hearts')) {
          const heartsContainer = document.createElement('div');
          heartsContainer.id = 'floating-hearts';
          heartsContainer.innerHTML = `
            <div class="floating-heart">💖</div>
            <div class="floating-heart">💕</div>
            <div class="floating-heart">💗</div>
            <div class="floating-heart">💓</div>
            <div class="floating-heart">💝</div>
          `;
          document.body.appendChild(heartsContainer);
        }
      } else {
        document.body.classList.remove('ultra-kawaii-mode');
        const hearts = document.getElementById('floating-hearts');
        if (hearts) hearts.remove();
      }
    }
  }, [settings.ultraKawaii, isClient]);

  return (
    <SystemSettingsContext.Provider 
      value={{
        settings,
        updateSetting,
        applyBrightness,
        applyVolume,
        playSystemSound
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}
