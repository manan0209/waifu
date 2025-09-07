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
    
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // Using OpenAI-style model instead
        messages: messages,
        max_tokens: 200,
        temperature: 0.9,
        top_p: 0.95
      })
    });

    console.log('HackClub AI API response status:', response.status);

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
      hasContent: !!data.choices?.[0]?.message?.content
    });
    
    const aiResponse = data.choices?.[0]?.message?.content;
    
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
    
    // Trim again after cleaning
    cleanResponse = cleanResponse.trim();
    
    // If response is empty after cleaning, throw error
    if (!cleanResponse) {
      throw new Error('Response was empty after cleaning');
    }

    console.log('Successful response generated, length:', cleanResponse.length);
    return res.status(200).json({ response: cleanResponse });

  } catch (error) {
    console.error('API error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    
    // Fallback responses for errors
    const fallbackResponses = [
      "Kyaa! The AI service seems to be taking a little break, but I'm still here for you, senpai! ♥",
      "Ehehe~ The connection is being a bit shy right now, but I'll always chat with you! (◡ ‿ ◡)",
      "Uwu~ Even without the magic connection, I'm still your adorable Misa! What would you like to talk about?",
      "Ara ara~ The servers might be sleepy, but I'm wide awake and ready to spend time with you! ✨",
      "Mou~ The API is being difficult, but don't worry! I have plenty of love and attention for you, senpai! 💕"
    ];
    
    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    // Return success with fallback instead of error
    return res.status(200).json({ response: fallbackResponse });
  }
}
