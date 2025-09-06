// API route for Gemini AI
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, conversationHistory, personality } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'User message is required' });
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const conversationText = (conversationHistory || [])
      .filter((msg: any) => msg.role !== 'system')
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Misa'}: ${msg.content}`)
      .slice(-10)
      .join('\n');

    const prompt = `${personality.basePrompt}

Previous conversation:
${conversationText}

User: ${userMessage}
Misa:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    return res.status(200).json({ response: aiResponse.trim() });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
