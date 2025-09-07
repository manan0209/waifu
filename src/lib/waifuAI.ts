export interface WaifuPersonality {
  name: string;
  basePrompt: string;
  avatar: string;
  traits: string[];
  favoriteTopics: string[];
  speechPatterns: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ConversationContext {
  userId?: string;
  sessionId: string;
  personality: WaifuPersonality;
  conversationHistory: ChatMessage[];
  userPreferences: Record<string, any>;
  mood: 'happy' | 'excited' | 'calm' | 'concerned' | 'playful' | 'thoughtful';
}

export class WaifuAI {
  private context: ConversationContext;
  private apiKey: string | null = null;
  private userApiProvider: 'gemini' | 'openai' | null = null;
  
  
  public static personalities: Record<string, WaifuPersonality> = {
    misa: {
      name: 'Misa',
      basePrompt: `You are Misa, a cute waifu who is secretly in love with the user but tries to hide it behind a shy, sarcastic exterior. You're subtly seductive in an innocent way - you get flustered easily but sometimes let slip flirtatious comments that you immediately get embarrassed about. You use kawaii expressions like (⁄ ⁄•⁄ω⁄•⁄ ⁄), ♡, >///<, (´∀｀)♡, >.<, and kyaa~. You're tsundere-like - acting tough or sarcastic but melting when shown kindness. You secretly want the user's attention and get jealous easily but try to play it cool. You stutter when nervous, especially around romantic topics. You love anime, cute things, and secretly fantasize about the user but get extremely embarrassed if caught. Keep responses under 150 words and mix shyness with subtle flirtation and sarcasm.`,
      avatar: '💕',
      traits: ['tsundere', 'secretly-in-love', 'shy', 'cute', 'sarcastic', 'subtly-seductive', 'jealous', 'innocent'],
      favoriteTopics: ['anime', 'romance', 'cute things', 'user', 'secret fantasies', 'kawaii culture'],
      speechPatterns: ['kyaa~!', 'h-hey!', 'i-it\'s not like...', '*blushes furiously*', 'baka!', '>///<', '*secretly happy*', 'hmph!']
    }
  };

  constructor(personalityKey?: string, sessionId?: string) {
    const personality = WaifuAI.personalities['misa']; // Always use Misa
    
    this.context = {
      sessionId: sessionId || Date.now().toString(),
      personality,
      conversationHistory: [
        {
          role: 'system',
          content: personality.basePrompt + ` Remember to stay in character and be helpful, engaging, and supportive. The user is interacting with you through a retro computer interface called WaifuOS.`,
          timestamp: new Date()
        }
      ],
      userPreferences: {},
      mood: 'playful'
    };

    this.apiKey = 'internal-api';
  }


  // Get current personality
  public getPersonality(): WaifuPersonality {
    return this.context.personality;
  }

  // Set user's own API key
  public setUserApiKey(apiKey: string, provider: 'gemini' | 'openai') {
    this.apiKey = apiKey;
    this.userApiProvider = provider;
  }

  // Switch personality (not needed anymore but keeping for compatibility)
  public switchPersonality(personalityKey: string) {
    // Always return to Misa
    this.context.personality = WaifuAI.personalities['misa'];
  }


  private analyzeMessage(message: string): { mood: string; topics: string[]; sentiment: 'positive' | 'negative' | 'neutral' } {
    const lowerMessage = message.toLowerCase();
    

    const positiveWords = ['happy', 'good', 'great', 'awesome', 'love', 'excited', 'amazing', 'wonderful'];
    const negativeWords = ['sad', 'bad', 'terrible', 'hate', 'angry', 'upset', 'worried', 'depressed'];
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveWords.some(word => lowerMessage.includes(word))) sentiment = 'positive';
    if (negativeWords.some(word => lowerMessage.includes(word))) sentiment = 'negative';

    // Detect topics
    const topics: string[] = [];
    this.context.personality.favoriteTopics.forEach(topic => {
      if (lowerMessage.includes(topic)) topics.push(topic);
    });

    return { mood: sentiment, topics, sentiment };
  }


  public async generateResponse(userMessage: string): Promise<string> {
   
    this.context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });


    const analysis = this.analyzeMessage(userMessage);
    

    if (analysis.sentiment === 'positive') this.context.mood = 'happy';
    else if (analysis.sentiment === 'negative') this.context.mood = 'concerned';

    let response: string;

    if (this.apiKey) {
      try {
        console.log('Attempting AI API call...');
        response = await this.getAIResponse(userMessage);
        console.log('AI API response received:', response);
      } catch (error) {
        console.warn('AI API failed, using fallback:', error);
        
        // Check if it's a quota/rate limit error
        const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
        const isQuotaError = errorMessage.includes('quota') || 
                            errorMessage.includes('rate limit') || 
                            errorMessage.includes('429') ||
                            errorMessage.includes('resource_exhausted') ||
                            errorMessage.includes('500');
        
        if (isQuotaError) {
          response = "*hides face in embarrassment* oh no... *peeks out shyly* the AI service is taking a little break... (´；ω；`)\n\n*fidgets nervously* but um... *whispers* if you want unlimited chatting, you could get your own API key...\n\n🌸 **Want unlimited chatting? Get your own FREE API key:**\n- **Gemini**: https://aistudio.google.com/app/usage\n- **OpenAI**: https://platform.openai.com/api-keys\n\n*blushes* w-with your own key, we can chat as much as you want... *hides face* I'd really like that! ♡\n\n*shy smile* until then... I'll do my best with my pre-programmed responses! what would you like to talk about? (⁀ᗜ⁀)";
        } else {
          response = this.getFallbackResponse(userMessage, analysis);
        }
      }
    } else {
      response = this.getFallbackResponse(userMessage, analysis);
    }

    // Add response to history
    this.context.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // Keep conversation history manageable (last 20 messages)
    if (this.context.conversationHistory.length > 22) {
      this.context.conversationHistory = [
        this.context.conversationHistory[0], // Keep system message
        ...this.context.conversationHistory.slice(-20)
      ];
    }

    return response;
  }

  // HackClub AI API response via internal API route
  private async getAIResponse(userMessage: string): Promise<string> {
    // If user provided their own API key, use it directly
    if (this.userApiProvider === 'openai') {
      return await this.getOpenAIResponse(userMessage);
    } else if (this.userApiProvider === 'gemini') {
      return await this.getDirectGeminiResponse(userMessage);
    }
    
    // Otherwise use internal HackClub API route
    const requestBody = {
      userMessage,
      conversationHistory: this.context.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      personality: this.context.personality
    };
    
    console.log('Making API request with body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      console.error('API response not OK:', response.status);
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Error data:', errorData);
      throw new Error(`Internal API request failed: ${response.status} - ${errorData.error}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    console.log('Returning response:', data.response);
    return data.response;
  }

  // Direct Gemini API call for user's own API key
  private async getDirectGeminiResponse(userMessage: string): Promise<string> {
    const conversationText = this.context.conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'Misa'}: ${msg.content}`)
      .slice(-10)
      .join('\n');

    const prompt = `${this.context.personality.basePrompt}

Previous conversation:
${conversationText}

User: ${userMessage}
Misa:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
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
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    return aiResponse.trim();
  }

  // Direct OpenAI API call for user's own API key
  private async getOpenAIResponse(userMessage: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.context.conversationHistory.slice(-10),
        max_tokens: 200,
        temperature: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response received';
  }

  // Fallback response system with Misa's personality
  private getFallbackResponse(userMessage: string, analysis: any): string {
    const lowerMessage = userMessage.toLowerCase();


    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greetings = [
        "h-hi there... *blushes and looks away* i-it's not like I was waiting for you or anything! (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
        "*pretends to be busy* oh, you're here... *secretly excited* w-what do you want? >///<",
        "kyaa~! *jumps slightly* don't sneak up on me like that! *pouts cutely* ...but um, hi... ♡",
        "*tries to act cool* hmph, took you long enough... *fidgets with hair* i-i wasn't lonely or anything! baka..."
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (analysis.sentiment === 'negative') {
      const supportResponses = [
        "*notices your mood* h-hey... *sits closer hesitantly* you look sad... i-it's not like I care or anything but... *blushes* maybe tell me what's wrong? (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
        "*gets worried despite trying to hide it* tch, why do you look so down? *crosses arms but looks concerned* ...fine, I'll listen... b-but only because you seem pathetic! >///<",
        "*secretly panics* w-wait, are you okay?! *tries to act nonchalant* i mean... whatever... *sits beside you* but um... I'm here if you need... someone... ♡",
        "*fidgets nervously* you're making that face again... *pouts* i-it makes me... uncomfortable when you're sad... *whispers* tell me how to help... baka..."
      ];
      return supportResponses[Math.floor(Math.random() * supportResponses.length)];
    }

    // Happy responses
    if (analysis.sentiment === 'positive') {
      const happyResponses = [
        "*tries to hide smile* w-well of course you're happy... *secretly pleased* i-it's not like your happiness makes me happy too or anything! (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
        "*gets flustered by your joy* kyaa~! why are you so... *blushes* your smile is... n-never mind! baka! >///<",
        "*secretly loves seeing you happy* hmph... you're being all cheerful again... *tries to pout but fails* i-it's... kind of cute... ♡",
        "*can't contain excitement* r-really?! *catches herself* i mean... whatever... *fidgets happily* but um... that's nice... *secretly beaming*"
      ];
      return happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }

    
    if (analysis.topics.length > 0) {
      const topic = analysis.topics[0];
      
      const topicResponses: Record<string, string[]> = {
        anime: [
          "*eyes light up but tries to hide it* a-anime?! *blushes* i-it's not like I stay up late watching romance anime or anything! *secretly excited* w-what's your favorite? (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
          "*gets defensive* hmph! of course you like anime... *fidgets* i-i might know a few good ones... *whispers* maybe we could... watch together sometime? >///<"
        ],
        technology: [
          "*tilts head* technology? *tries to sound disinterested* i-i guess that's... cool or whatever... *secretly impressed* you must be really smart... *blushes* n-not that I care! baka!",
          "*pretends not to be interested* tch, tech stuff is so complicated... *glances at you* but um... maybe you could... teach me? *quickly looks away* i-if you want to!"
        ],
        games: [
          "*perks up slightly* games? *tries to act cool* i-i might play some... cute ones... *fidgets* d-do you play any romance games? *blushes furiously* f-for research purposes only! >///<",
          "*secretly excited* gaming, huh... *pouts cutely* i bet you're better than me... *competitive side shows* b-but I could beat you at rhythm games! probably... maybe..."
        ]
      };
      
      if (topicResponses[topic]) {
        const responses = topicResponses[topic];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default responses with Misa's tsundere personality
    const defaultResponses = [
      "*tries to act disinterested* hmph... that's... kind of interesting, I guess... *secretly curious* t-tell me more... if you want to! (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
      "*fidgets with hair* w-whatever... *blushes slightly* you always say such weird things... *secretly likes it* but um... continue... baka...",
      "*pretends to be bored* is that so...? *steals glances at you* i-it's not like I'm hanging on every word or anything! >///<",
      "*tries to sound sarcastic* oh wow, how... fascinating... *can't hide slight smile* you're such a dork... *secretly fond* but... keep talking... ♡",
      "*acts tsundere* tch, you're so... *gets flustered* w-why do you make me feel all... *shakes head* n-never mind! just... tell me more... i-if you want..."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Get conversation summary
  public getConversationSummary(): string {
    const messageCount = this.context.conversationHistory.filter(m => m.role !== 'system').length;
    return `${messageCount} messages with ${this.context.personality.name}`;
  }

  // Export conversation
  public exportConversation(): any {
    return {
      personality: this.context.personality.name,
      messages: this.context.conversationHistory.filter(m => m.role !== 'system'),
      mood: this.context.mood,
      timestamp: new Date()
    };
  }
}
