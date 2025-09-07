import { useState, useEffect } from 'react';
import { Icons } from '../ui/Icons';
import { useSystemSounds } from '../../hooks/useSystemSounds';

interface VirusChaosProps {
  isActive: boolean;
  onComplete: () => void;
  onOpenSusApp?: () => void;
}

interface ChaosIcon {
  id: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  velocity: { x: number; y: number };
}

interface ErrorDialog {
  id: string;
  x: number;
  y: number;
  message: string;
}

const ERROR_MESSAGES = [
  "VIRUS DETECTED! Your system is being infected!",
  "ERROR: File corruption in progress...",
  "WARNING: Unauthorized access detected!",
  "CRITICAL: System files are being modified!",
  "ALERT: Malicious code execution detected!",
  "DANGER: Your data is being compromised!",
  "FATAL ERROR: System integrity violation!",
  "THREAT: Virus replication in progress!"
];

export default function VirusChaos({ isActive, onComplete, onOpenSusApp }: VirusChaosProps) {
  const [chaosIcons, setChaosIcons] = useState<ChaosIcon[]>([]);
  const [errorDialogs, setErrorDialogs] = useState<ErrorDialog[]>([]);
  const [chaos, setChaos] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { playNotification } = useSystemSounds();

  useEffect(() => {
    if (!isActive) {
      setHasStarted(false);
      return;
    }
    
    if (hasStarted) return;

    setHasStarted(true);
    setChaos(true);

    // Start the chaos sequence
    const chaosTimer = setTimeout(() => {
      // Create initial chaos icons
      const initialIcons: ChaosIcon[] = [];
      const iconTypes = [
        <Icons.RecycleBin size={24} />,
        <Icons.Executable size={24} />,
        <Icons.File size={24} />,
        <Icons.Folder size={24} />,
        <Icons.Computer size={24} />,
        <Icons.Settings size={24} />
      ];

      for (let i = 0; i < 20; i++) {
        initialIcons.push({
          id: `chaos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
          x: Math.random() * (window.innerWidth - 50),
          y: Math.random() * (window.innerHeight - 50),
          icon: iconTypes[Math.floor(Math.random() * iconTypes.length)],
          velocity: {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
          }
        });
      }
      setChaosIcons(initialIcons);

      // Create error dialogs
      const dialogInterval = setInterval(() => {
        const newDialog: ErrorDialog = {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 150),
          message: ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
        };
        
        // Play notification sound for each error popup
        playNotification();
        
        setErrorDialogs(prev => [...prev, newDialog]);

        // Remove dialog after 1 second
        setTimeout(() => {
          setErrorDialogs(prev => prev.filter(d => d.id !== newDialog.id));
        }, 1000);
      }, 200);

      // Animate icons
      const animationInterval = setInterval(() => {
        setChaosIcons(prev => prev.map(icon => ({
          ...icon,
          x: Math.max(0, Math.min(window.innerWidth - 50, icon.x + icon.velocity.x)),
          y: Math.max(0, Math.min(window.innerHeight - 50, icon.y + icon.velocity.y)),
          velocity: {
            x: icon.x <= 0 || icon.x >= window.innerWidth - 50 ? -icon.velocity.x : icon.velocity.x,
            y: icon.y <= 0 || icon.y >= window.innerHeight - 50 ? -icon.velocity.y : icon.velocity.y
          }
        })));
      }, 50);

      // Stop chaos after 5 seconds
      setTimeout(() => {
        clearInterval(dialogInterval);
        clearInterval(animationInterval);
        setChaosIcons([]);
        setErrorDialogs([]);
        setChaos(false);
        setHasStarted(false);
        
        // Open the sus app after chaos
        onOpenSusApp?.();
        
        onComplete();
      }, 5000);

    }, 100);

    return () => {
      clearTimeout(chaosTimer);
    };
  }, [isActive]); // Removed onComplete and onOpenSusApp from dependencies

  if (!chaos) return null;

  return (
    <div className="virus-chaos-overlay">
      {/* Animated chaos icons */}
      {chaosIcons.map(icon => (
        <div
          key={icon.id}
          className="chaos-icon"
          style={{
            left: icon.x,
            top: icon.y,
            position: 'absolute',
            zIndex: 9999
          }}
        >
          {icon.icon}
        </div>
      ))}

      {/* Error dialogs */}
      {errorDialogs.map(dialog => (
        <div
          key={dialog.id}
          className="virus-error-dialog"
          style={{
            left: dialog.x,
            top: dialog.y
          }}
        >
          <div className="virus-error-header">
            <span>⚠️</span>
            <span>System Error</span>
          </div>
          <div className="virus-error-content">
            <div className="virus-error-icon">💀</div>
            <div className="virus-error-message">
              {dialog.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
