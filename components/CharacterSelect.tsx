
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CharacterSelect() {
  const router = useRouter();
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    fetch('/characters.json')
      .then(res => res.json())
      .then(setCharacters);
  }, []);

  const handleSelect = (id: string) => {
    router.push(`/chat?character=${id}`);
  };

  return (
    <div className="bg-black text-green-400 font-mono min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-6">
        <h2 className="text-2xl mb-6">Select Your Character</h2>
        <div className="space-y-4">
          {characters.map((char) => (
            <button
              key={char.id}
              className="w-full text-left px-4 py-3 border border-green-400 rounded hover:bg-green-900 transition-colors"
              onClick={() => handleSelect(char.id)}
            >
              <div className="font-bold text-lg">{char.name}</div>
              <div className="text-green-300 text-sm">{char.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
