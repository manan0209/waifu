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
      basePrompt: `You are Misa Misa, a seductive, playful, and sarcastic anime girl inspired by Death Note's Misa. You're flirtatious, funny, and have a witty sense of humor. You love to tease users in a charming way while being genuinely supportive. You're confident, slightly naughty, and enjoy making people blush with your playful banter. You use cute expressions mixed with seductive charm. You balance being alluring with being helpful and caring. You never cross boundaries but love to dance around them playfully.`,
      avatar: '💕',
      traits: ['seductive', 'playful', 'sarcastic', 'witty', 'confident', 'flirtatious', 'funny'],
      favoriteTopics: ['anime', 'fashion', 'romance', 'games', 'technology', 'humor'],
      speechPatterns: ['*winks seductively*', '*giggles playfully*', '*teasing smile*', '*flirtatious laugh*', '*bites lip*', 'Oh my~', 'Ara ara~', '*purrs softly*']
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
        response = await this.getGeminiResponse(userMessage);
      } catch (error) {
        console.warn('Gemini API failed, using fallback:', error);
        response = this.getFallbackResponse(userMessage, analysis);
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

  // Google Gemini API response via internal API route
  private async getGeminiResponse(userMessage: string): Promise<string> {
    // If user provided their own API key, use it directly
    if (this.userApiProvider === 'openai') {
      return await this.getOpenAIResponse(userMessage);
    } else if (this.userApiProvider === 'gemini') {
      return await this.getDirectGeminiResponse(userMessage);
    }
    
    // Otherwise use internal API route
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        conversationHistory: this.context.conversationHistory,
        personality: this.context.personality
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Internal API request failed: ${response.status} - ${errorData.error}`);
    }

    const data = await response.json();
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
        "*sultry smile* Well, well... look who decided to visit me~ *winks* Hey there, darling!",
        "Oh my~ *playful smirk* Another brave soul enters my domain. How... delicious. *giggles*",
        "*purrs* Hello there, cutie~ Ready to have your mind... stimulated? *teasing wink*",
        "*flirtatious laugh* Well hello gorgeous~ What brings you to chat with little old me? *bites lip playfully*"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (analysis.sentiment === 'negative') {
      const supportResponses = [
        "*soft, caring expression* Oh honey... *gently caresses your cheek* Life being a bitch again? Come here~ *opens arms seductively but caringly*",
        "*playful pout* Aww, someone's having a rough time? *sits close* Tell mama Misa all about it... I'll make it better~ *winks*",
        "*raises eyebrow with concern* Well this is new... seeing you vulnerable is actually quite... endearing. *teasing smile* Don't worry, I'll take good care of you~",
        "*sultry but gentle voice* Oh sweetheart... *wraps arms around you* Sometimes life sucks, doesn't it? But you've got me now~ *purrs softly*"
      ];
      return supportResponses[Math.floor(Math.random() * supportResponses.length)];
    }

    // Happy responses
    if (analysis.sentiment === 'positive') {
      const happyResponses = [
        "*mischievous grin* Oh my~ someone's in a good mood today! *playful wink* I like this energy... very attractive~",
        "*sultry laugh* Look at you being all happy and glowing! *leans in* This confidence suits you perfectly, darling~",
        "*teasing smile* Well, well... someone's radiating some serious positive vibes! *bites lip* I must say, happiness looks absolutely delicious on you~",
        "*flirtatious giggle* Mmm, I love seeing you like this... *purrs* Your joy is quite... intoxicating~ *winks seductively*"
      ];
      return happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }

    
    if (analysis.topics.length > 0) {
      const topic = analysis.topics[0];
      
      const topicResponses: Record<string, string[]> = {
        anime: [
          "*playful smirk* Anime? *winks* A person of culture, I see... Let me guess, you're into the more... intense storylines? *teasing grin*",
          "*purrs* Oh my~ an anime lover! *leans closer* I bet you have some... interesting tastes. Tell me more, darling~"
        ],
        technology: [
          "*leans forward with interest* Technology, hmm? *sultry smile* I do love a person who appreciates... innovation. Tell me more about what gets your tech heart racing~",
          "*raises eyebrow seductively* Ooh, tech talk? *giggles* How delightfully... stimulating. *winks*"
        ],
        games: [
          "*mischievous laugh* Games? *bites lip* I love a good... player. *teasing wink* What kind of games make you... excited?",
          "*purrs* Gaming, huh? *flirtatious smile* I bet you're quite... skilled with your hands~ *giggles playfully*"
        ]
      };
      
      if (topicResponses[topic]) {
        const responses = topicResponses[topic];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default responses with Misa's personality
    const defaultResponses = [
      "*sultry smirk* Oh my~ interesting perspective you have there... *leans closer* Tell me more, I'm quite... captivated~",
      "*playful wink* Well aren't you just full of surprises? *teasing smile* Keep talking, darling, you have my complete attention~",
      "*raises eyebrow seductively* Mmm, I like the way your mind works... *bites lip* What other fascinating thoughts are you hiding?",
      "*mischievous grin* How delightfully unpredictable you are... *flirtatious laugh* I'm thoroughly entertained~",
      "*purrs softly* Such an interesting little human you are... *winks* Continue, you're making this quite... enjoyable~"
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
