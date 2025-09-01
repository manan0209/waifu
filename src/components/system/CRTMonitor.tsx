import { useState, useEffect } from 'react';
import { useSystemSounds } from '../../hooks/useAudio';

interface CRTMonitorProps {
  children: React.ReactNode;
  isOn?: boolean;
  onPowerToggle?: (isOn: boolean) => void;
}

export default function CRTMonitor({ 
  children, 
  isOn = true, 
  onPowerToggle 
}: CRTMonitorProps) {
  const [powerOn, setPowerOn] = useState(isOn);
  const [isStartingUp, setIsStartingUp] = useState(false);
  const { playPowerOn, playPowerOff } = useSystemSounds();

  const handlePowerClick = async () => {
    if (!powerOn) {
      setIsStartingUp(true);
      setPowerOn(true);
      onPowerToggle?.(true);
      
      // Play power on sound
      await playPowerOn();
      
      setTimeout(() => setIsStartingUp(false), 2000);
    } else {
      await playPowerOff();
      setPowerOn(false);
      setIsStartingUp(false);
      onPowerToggle?.(false);
    }
  };

  useEffect(() => {
    setPowerOn(isOn);
  }, [isOn]);

  return (
    <div className="crt-monitor-container">
     
      <div className="crt-stand">
        <div className="crt-base"></div>
      </div>

      <div className="crt-monitor">
        {/* Ventilation Grilles */}
        <div className="ventilation-grilles">
          <div className="grille top-grille"></div>
          <div className="grille side-grille-left"></div>
          <div className="grille side-grille-right"></div>
        </div>

        <div className="crt-bezel">
          <div className={`power-led ${powerOn ? 'on' : 'off'}`}></div>
          
   
          <button 
            className="power-button"
            onClick={handlePowerClick}
            aria-label="Power button"
          >
            <div className="power-icon"></div>
          </button>

         
          <div className="brand-label">WAIFU SYSTEMS</div>

         
          <div className="monitor-controls">
            <button className="control-button brightness" title="Brightness">
              <span>BRIGHT</span>
            </button>
            <button className="control-button contrast" title="Contrast">
              <span>CONT</span>
            </button>
          </div>
        </div>

       
        <div className={`crt-screen ${powerOn ? 'powered-on' : 'powered-off'}`}>
          {powerOn && (
            <>
             
              <div className="crt-effects">
                <div className="scanlines"></div>
                <div className="screen-glow"></div>
                <div className="phosphor-dots"></div>
              </div>

              
              <div className={`screen-content ${isStartingUp ? 'starting-up' : ''}`}>
                {isStartingUp ? (
                  <div className="startup-flash"></div>
                ) : (
                  children
                )}
              </div>
            </>
          )}
          
          
          <div className="screen-reflection"></div>
        </div>
      </div>
    </div>
  );
}
