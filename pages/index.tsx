

import { useState } from 'react';
import Head from 'next/head';
import BootScreen from '../components/BootScreen';
import Desktop from '../src/components/desktop/Desktop';
import WaifuLockScreen from '../src/components/system/WaifuLockScreen';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [systemState, setSystemState] = useState<'booting' | 'locked' | 'desktop' | 'shutdown'>('booting');
  const booted = router.query.booted === '1';
  
  const handleBootComplete = () => {
    setSystemState('locked');
  };

  const handleUnlock = () => {
    setSystemState('desktop');
  };

  const handleShutdown = () => {
    setSystemState('shutdown');
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const renderContent = () => {
    if (systemState === 'booting' && !booted) {
      return <BootScreen onBootComplete={handleBootComplete} />;
    }
    
    if (systemState === 'locked' && !booted) {
      return <WaifuLockScreen onUnlock={handleUnlock} />;
    }
    
    if (systemState === 'desktop' || booted) {
      return <Desktop onShutdown={handleShutdown} />;
    }
    
    if (systemState === 'shutdown') {
      return (
        <div className="shutdown-screen">
          <div className="shutdown-message">
            <div className="shutdown-icon">⏻</div>
            <div className="shutdown-text">System shutting down...</div>
            <div className="shutdown-subtext">Please wait</div>
          </div>
        </div>
      );
    }
    
    return <BootScreen onBootComplete={handleBootComplete} />;
  };
  
  return (
    <>
      <Head>
        <title>WaifuOS - Retro Desktop Experience</title>
        <meta name="description" content="Nostalgic retro OS experience with AI companions" />
      </Head>
      <div className="fullscreen-os">
        {renderContent()}
      </div>
    </>
  );
}
