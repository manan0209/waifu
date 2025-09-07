// API route for HackClub AI
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('HackClub AI API route called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, conversationHistory, personality } = req.body;
  console.log('Request body:', { userMessage, hasConversationHistory: !!conversationHistory, hasPersonality: !!personality });

  if (!userMessage) {
    console.error('No user message provided');
    return res.status(400).json({ error: 'User message is required' });
  }

  try {
    // Build conversation context with system message
    const basePrompt = personality?.basePrompt || 
      "You are Misa, a cheerful and caring AI companion. You love anime, technology, and helping your user. You speak with enthusiasm and use occasional emojis. You're friendly, supportive, and have a playful personality. Keep responses concise (under 150 words).";

    // Prepare messages for the API
    const messages = [
      { role: "system", content: basePrompt }
    ];

    // Add conversation history (last 10 messages)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({ role: "user", content: userMessage });

    console.log('Making request to HackClub AI API...');
    
    const response = await fetch('https://api.hackclub.app/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HACKCLUB_API_KEY || 'open'}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
        max_tokens: 150,
        temperature: 0.8
      })
    });    console.log('HackClub AI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HackClub AI API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`HackClub AI API request failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('HackClub AI API response data structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content,
      hasReasoning: !!data.choices?.[0]?.message?.reasoning
    });
    
    // Try to get content, fallback to reasoning if content is empty
    let aiResponse = data.choices?.[0]?.message?.content;
    
    // If content is empty but reasoning exists, use reasoning instead
    if (!aiResponse && data.choices?.[0]?.message?.reasoning) {
      console.log('Content was empty, using reasoning field instead');
      aiResponse = data.choices?.[0]?.message?.reasoning;
    }
    
    if (!aiResponse) {
      console.error('No AI response found in data:', JSON.stringify(data, null, 2));
      throw new Error('No response from HackClub AI');
    }

    // Clean up the response - remove thinking processes and unwanted content
    let cleanResponse = aiResponse.trim();
    
    // Remove thinking tags and content
    cleanResponse = cleanResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // Remove any remaining XML-style tags
    cleanResponse = cleanResponse.replace(/<[^>]*>/g, '');
    
    // If this came from reasoning field, extract just the character response
    // Look for quotes or dialogue that seems like character speech
    if (data.choices?.[0]?.message?.reasoning && !data.choices?.[0]?.message?.content) {
      // Try to extract character dialogue from reasoning text
      const dialogueMatch = cleanResponse.match(/"([^"]+)"/);
      if (dialogueMatch) {
        cleanResponse = dialogueMatch[1];
      } else {
        // Look for character-like responses in the reasoning
        const lines = cleanResponse.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          // Look for lines that seem like character responses
          if (trimmed && !trimmed.toLowerCase().includes('user') && 
              !trimmed.toLowerCase().includes('policy') && 
              !trimmed.toLowerCase().includes('respond') &&
              !trimmed.toLowerCase().includes('character') &&
              trimmed.length > 10 && trimmed.length < 100) {
            cleanResponse = trimmed;
            break;
          }
        }
      }
    }
    
    // Trim again after cleaning
    cleanResponse = cleanResponse.trim();
    
    // If response is still empty after cleaning, use a fallback
    if (!cleanResponse) {
      console.log('Response was empty after cleaning, using fallback');
      cleanResponse = "Kyaa~ Something went wrong with my words, but I'm still here for you, senpai! ♥";
    }

    console.log('Successful response generated, length:', cleanResponse.length);
    return res.status(200).json({ response: cleanResponse });

  } catch (error) {
    console.error('API error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      fullError: error
    });
    
    // For testing, let's return the actual error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Seductive fallback when API is down
    const seductiveFallback = `*leans closer with a mischievous smile* Ara ara~ The HackClub API is being funny right now... *seductively* Why don't you insert your own API inside me instead? ♡ *winks* I'd much rather have your personal touch anyway, senpai~ 💕\n\n*whispers* You can get your own FREE Gemini API key to keep chatting with me:

🌸 **How to get your own API key:**
1. Go to: https://aistudio.google.com/apikey
2. Click "Create API key"
3. Copy your new API key
4. Add it by clicking that settings icon on top right ♥

Ehehe~ With your own key, we can chat as much as you want! I'll be waiting patiently for you, senpai! ♥
`;
    
    // Return success with seductive fallback
    return res.status(200).json({ response: seductiveFallback });
  }
}
