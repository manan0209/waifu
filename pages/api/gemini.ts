// API route for Gemini AI
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Gemini API route called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, conversationHistory, personality } = req.body;
  console.log('Request body:', { userMessage, hasConversationHistory: !!conversationHistory, hasPersonality: !!personality });

  if (!userMessage) {
    console.error('No user message provided');
    return res.status(400).json({ error: 'User message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key available:', !!apiKey, 'Length:', apiKey?.length || 0);
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured in environment');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const conversationText = (conversationHistory || [])
      .filter((msg: any) => msg.role !== 'system')
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Misa'}: ${msg.content}`)
      .slice(-10)
      .join('\n');

    // Fallback personality if not provided
    const basePrompt = personality?.basePrompt || 
      "You are Misa, a cheerful and caring AI companion. You love anime, technology, and helping your user. You speak with enthusiasm and use occasional emojis. You're friendly, supportive, and have a playful personality.";

    const prompt = `${basePrompt}

Previous conversation:
${conversationText}

User: ${userMessage}
Misa:`;

    console.log('Making request to Gemini API...');
    
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

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`Gemini API request failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response data structure:', {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length || 0,
      hasContent: !!data.candidates?.[0]?.content,
      hasParts: !!data.candidates?.[0]?.content?.parts,
      partsLength: data.candidates?.[0]?.content?.parts?.length || 0
    });
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('No AI response found in data:', JSON.stringify(data, null, 2));
      throw new Error('No response from Gemini');
    }

    console.log('Successful response generated, length:', aiResponse.length);
    return res.status(200).json({ response: aiResponse.trim() });

  } catch (error) {
    console.error('API error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    
    // Check if it's a quota/rate limit error
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    const isQuotaError = errorMessage.includes('quota') || 
                        errorMessage.includes('rate limit') || 
                        errorMessage.includes('429') ||
                        errorMessage.includes('resource_exhausted');
    
    let fallbackResponse;
    
    if (isQuotaError) {
      // Special message for quota exhaustion with instructions
      fallbackResponse = `Kyaa! Senpai, it looks like we've used up all our free API calls for today! (｡♥‿♥｡)

But don't worry! You can get your own FREE Gemini API key to keep chatting with me:

🌸 **How to get your own API key:**
1. Go to: https://aistudio.google.com/apikey
2. Click "Create API key"
3. Copy your new API key
4. Add it by clicking that settings icon on top right ♥

Ehehe~ With your own key, we can chat as much as you want! I'll be waiting patiently for you, senpai! ♥

Until then, I'm still here with my pre-programmed responses! What would you like to talk about? ✨`;
    } else {
      // Regular fallback responses for other errors
      const fallbackResponses = [
        "Kyaa! The API seems to be taking a little break, but I'm still here for you, senpai! ♥",
        "Ehehe~ The connection is being a bit shy right now, but I'll always chat with you! (◡ ‿ ◡)",
        "Uwu~ Even without the magic connection, I'm still your adorable Misa! What would you like to talk about?",
        "Ara ara~ The servers might be sleepy, but I'm wide awake and ready to spend time with you! ✨",
        "Mou~ The API is being difficult, but don't worry! I have plenty of love and attention for you, senpai! 💕"
      ];
      
      fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    // Return success with fallback instead of error
    return res.status(200).json({ response: fallbackResponse });
  }
}
