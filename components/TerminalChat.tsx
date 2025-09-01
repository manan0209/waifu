import { useState, useEffect, useRef } from 'react';


function typewriterEffect(text: string, callback: (typed: string) => void) {
  let i = 0;
  const interval = setInterval(() => {
    callback(text.slice(0, i + 1));
    i++;
    if (i === text.length) clearInterval(interval);
  }, 30);
}


export default function TerminalChat({ character }: { character: string }) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const beepRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === 'bot') {
      beepRef.current?.play();
    }
  }, [messages]);

  // ASCII noise generator
  function asciiNoise(length: number) {
    const chars = '@#$%&*+=-';
    let out = '';
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    setInput('');
    setIsBotTyping(true);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId: character, message: input })
    })
      .then(res => res.json())
      .then(data => {
        let response = data.reply || 'Sorry, something went wrong.';
        if (glitch) {
          // Insert ASCII noise randomly in the response
          response = response.split(' ').map(word => Math.random() < 0.2 ? asciiNoise(6) : word).join(' ');
        }
        typewriterEffect(response, (typed) => {
          setTyping(typed);
          if (typed === response) {
            setMessages((msgs) => [...msgs, { sender: 'bot', text: response }]);
            setTyping('');
            setIsBotTyping(false);
          }
        });
      })
      .catch(() => {
        const response = 'Sorry, something went wrong.';
        setMessages((msgs) => [...msgs, { sender: 'bot', text: response }]);
        setTyping('');
        setIsBotTyping(false);
      });
  };

  return (
    <div className="bg-black text-green-400 font-mono min-h-screen flex flex-col items-center justify-center">
      <audio ref={beepRef} src="/sounds/beep.mp3" preload="auto" />
      <div className="w-full max-w-2xl p-6 border border-green-700 rounded-lg shadow-lg bg-black/90">
        <div className="mb-4 text-green-300 flex items-center justify-between">
          <span>Chatting as: <span className="font-bold">{character}</span></span>
          <button
            className={`ml-4 px-2 py-1 text-xs rounded border ${glitch ? 'bg-green-700 text-black' : 'bg-black text-green-400'} border-green-400`}
            onClick={() => setGlitch(g => !g)}
          >{glitch ? 'Glitch ON' : 'Glitch OFF'}</button>
        </div>
        <div className="h-64 overflow-y-auto mb-4 bg-black p-2 border border-green-700 rounded text-base" style={{fontFamily:'inherit'}}>
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === 'user' ? 'text-green-200' : 'text-green-400'}>
              <span className="font-bold">{msg.sender === 'user' ? 'You' : character}:</span> {msg.text}
            </div>
          ))}
          {isBotTyping && (
            <div className="text-green-400"><span className="font-bold">{character}:</span> {typing}<span className="animate-pulse">_</span></div>
          )}
        </div>
        <form
          className="flex gap-2"
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
        >
          <input
            className="flex-1 bg-black border border-green-700 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            placeholder="Type your message..."
            style={{fontFamily:'inherit'}}
          />
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-600 text-black font-bold px-4 py-2 rounded"
          >Send</button>
        </form>
      </div>
    </div>
  );
}
