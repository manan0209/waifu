import { useRouter } from 'next/router';
import SystemBoot from '../src/components/system/SystemBoot';

interface BootScreenProps {
  onBootComplete?: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const router = useRouter();

  const handleBootComplete = () => {
    if (onBootComplete) {
      onBootComplete();
    } else {
      router.push('/?booted=1');
    }
  };

  return <SystemBoot onBootComplete={handleBootComplete} />;
}
