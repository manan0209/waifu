import type { NextApiRequest, NextApiResponse } from 'next';

// Basic bad word filter
const BAD_WORDS = ['badword1', 'badword2', 'badword3']; // Add more as needed
function containsBadWords(text: string) {
  return BAD_WORDS.some(word => text.toLowerCase().includes(word));
}


import fs from 'fs';
import path from 'path';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { characterId, message } = req.body;
  if (!characterId || !message) {
    return res.status(400).json({ error: 'Missing characterId or message' });
  }

  if (containsBadWords(message)) {
    return res.status(400).json({ error: 'Message contains inappropriate language.' });
  }


  // Load characters from JSON
  const filePath = path.join(process.cwd(), 'public', 'characters.json');
  let characters: any[] = [];
  try {
    const file = fs.readFileSync(filePath, 'utf8');
    characters = JSON.parse(file);
  } catch {
    // fallback to waifu persona
    characters = [{ id: 'waifu', persona: 'You are a cheerful anime waifu who calls the user “senpai”. Respond in a cute, friendly, and playful way.' }];
  }
  const character = characters.find(c => c.id === characterId) || characters[0];

  // OpenAI GPT-4o-mini API call
  try {
    const systemPrompt = character.persona;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 100
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, something went wrong.';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch response from LLM.' });
  }
}
