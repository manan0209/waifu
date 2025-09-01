import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const bootLines = [
  'Phoenix BIOS v4.0 Release 6.0.1',
  'Copyright (C) 1985-2001 Phoenix Technologies Ltd.',
  'CPU = Intel(R) Core(TM) i7, Speed = 2.80GHz',
  'Initializing memory...',
  'Memory Test: 65536K OK',
  'Detecting IDE drives...',
  'Primary Master: RETRO-WAIFU SSD',
  'Secondary Master: None',
  'Booting Retro Waifu Chat OS...',
  'Loading terminal interface...',
  'Ready.'
];

export default function BootScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (currentLine < bootLines.length) {
      let char = 0;
      setTyped('');
      const typeInterval = setInterval(() => {
        setTyped(bootLines[currentLine].slice(0, char + 1));
        char++;
        if (char === bootLines[currentLine].length) {
          clearInterval(typeInterval);
          setTimeout(() => setCurrentLine((l) => l + 1), 400);
        }
      }, 30);
      return () => clearInterval(typeInterval);
    } else {
      setTimeout(() => router.push('/?booted=1'), 700);
    }
  }, [currentLine, router]);

  return (
    <div className="bg-black text-green-400 font-mono min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-6 text-lg">
        {bootLines.slice(0, currentLine).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {currentLine < bootLines.length && <div>{typed}<span className="animate-pulse">_</span></div>}
      </div>
    </div>
  );
}
