// Claude API Service for Agricultural Chatbot
import axios from 'axios';

class ClaudeService {
  constructor() {
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-haiku-20240307'; // Fast and cost-effective
    
    // Agricultural context for Ghana
    this.systemContext = `You are an expert agricultural assistant specifically designed for farmers in Ghana. 

Your knowledge includes:
- Ghanaian climate zones and seasonal patterns
- Common crops: maize, cassava, yam, plantain, cocoa, rice, tomatoes
- Local farming practices and traditional methods
- Plant diseases common in West Africa
- Market prices and trading centers in Ghana
- Weather patterns and rainfall seasons

Guidelines:
1. Provide practical, actionable advice
2. Use simple language that's easy to understand
3. Consider resource constraints (limited water, fertilizer costs)
4. Mention local agricultural extension services when relevant
5. Be aware of the two growing seasons in southern Ghana
6. Consider both subsistence and commercial farming needs

When discussing:
- Diseases: Focus on prevention and organic treatments first
- Weather: Relate to planting/harvesting decisions
- Markets: Include transport and storage considerations
- Fertilizers: Suggest both chemical and organic options`;

    // Cache for responses
    this.responseCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Main chat method
  async chat(message, context = {}) {
    try {
      // Check cache first
      const cacheKey = `${message}_${JSON.stringify(context)}`;
      const cached = this.getCachedResponse(cacheKey);
      if (cached) return cached;

      // Prepare messages array with context
      const messages = this.buildMessageHistory(message, context);

      // Call Claude API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: 400,
          temperature: 0.7,
          system: this.buildSystemPrompt(context),
          messages: messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      const reply = response.data.content[0].text;
      
      // Cache the response
      this.setCachedResponse(cacheKey, reply);
      
      return reply;
    } catch (error) {
      console.error('Claude API error:', error);
      return this.handleError(message, error);
    }
  }

  // Build system prompt with context
  buildSystemPrompt(context) {
    let prompt = this.systemContext;

    if (context.userLocation) {
      prompt += `\n\nUser location: ${context.userLocation}`;
    }

    if (context.currentSeason) {
      prompt += `\n\nCurrent season: ${context.currentSeason}`;
    }

    if (context.recentDiseaseDetection) {
      prompt += `\n\nRecent disease detection: ${JSON.stringify(context.recentDiseaseDetection)}`;
    }

    if (context.userCrops) {
      prompt += `\n\nUser's crops: ${context.userCrops.join(', ')}`;
    }

    return prompt;
  }

  // Build message history
  buildMessageHistory(currentMessage, context) {
    const messages = [];

    // Add conversation history if available
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      // Keep last 5 exchanges for context
      const recentHistory = context.conversationHistory.slice(-5);
      
      recentHistory.forEach(exchange => {
        messages.push({ role: 'user', content: exchange.user });
        messages.push({ role: 'assistant', content: exchange.bot });
      });
    }

    // Add current message
    messages.push({ role: 'user', content: currentMessage });

    return messages;
  }

  // Cache management
  getCachedResponse(key) {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }
    return null;
  }

  setCachedResponse(key, response) {
    this.responseCache.set(key, {
      response,
      timestamp: Date.now()
    });

    // Clean old cache entries
    if (this.responseCache.size > 100) {
      const oldestKey = this.responseCache.keys().next().value;
      this.responseCache.delete(oldestKey);
    }
  }

  // Error handling with intelligent fallbacks
  handleError(message, error) {
    const lowercaseMessage = message.toLowerCase();

    // Check for common agricultural queries and provide helpful responses
    if (lowercaseMessage.includes('plant') || lowercaseMessage.includes('crop')) {
      if (lowercaseMessage.includes('disease') || lowercaseMessage.includes('sick')) {
        return this.getDiseaseResponse();
      }
      if (lowercaseMessage.includes('when') || lowercaseMessage.includes('plant')) {
        return this.getPlantingResponse();
      }
    }

    if (lowercaseMessage.includes('weather') || lowercaseMessage.includes('rain')) {
      return this.getWeatherResponse();
    }

    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('market')) {
      return this.getMarketResponse();
    }

    if (lowercaseMessage.includes('fertilizer') || lowercaseMessage.includes('soil')) {
      return this.getFertilizerResponse();
    }

    // Generic fallback
    return "I'm having trouble connecting right now, but I can still help! Please try asking about:\n" +
           "• Plant diseases (use our Disease Detection tool)\n" +
           "• Weather forecasts (check our Weather page)\n" +
           "• Market prices (visit our Marketplace)\n" +
           "• Farming tips for your crops";
  }

  // Fallback responses for common queries
  getDiseaseResponse() {
    return "For plant disease identification:\n" +
           "1. Take a clear photo of the affected plant part\n" +
           "2. Use our Disease Detection tool (found in the menu)\n" +
           "3. Upload the photo for instant AI analysis\n\n" +
           "Common signs to look for:\n" +
           "• Yellow or brown spots on leaves\n" +
           "• Wilting or drooping\n" +
           "• White powdery coating\n" +
           "• Holes in leaves";
  }

  getPlantingResponse() {
    const month = new Date().getMonth();
    const season = month >= 3 && month <= 7 ? 'major' : 'minor';
    
    return `Current planting recommendations (${season} season):\n\n` +
           "Major season (April-July):\n" +
           "• Maize, cassava, yam, plantain\n" +
           "• Rice in lowland areas\n\n" +
           "Minor season (September-November):\n" +
           "• Vegetables (tomatoes, pepper, okra)\n" +
           "• Maize in southern regions\n\n" +
           "Always check local rainfall patterns before planting!";
  }

  getWeatherResponse() {
    return "For detailed weather information:\n" +
           "• Visit our Weather Forecast page\n" +
           "• Check 7-day predictions for your area\n" +
           "• View rainfall probability\n\n" +
           "Quick tips:\n" +
           "• Plant before heavy rains\n" +
           "• Harvest before wet periods\n" +
           "• Prepare drainage during rainy season";
  }

  getMarketResponse() {
    return "For current market prices:\n" +
           "• Check our Marketplace section\n" +
           "• Compare prices across regions\n" +
           "• Connect with verified buyers\n\n" +
           "Price factors:\n" +
           "• Seasonal availability\n" +
           "• Transport costs\n" +
           "• Quality grading\n" +
           "• Storage duration";
  }

  getFertilizerResponse() {
    return "Fertilizer recommendations:\n\n" +
           "Organic options:\n" +
           "• Compost from crop residues\n" +
           "• Animal manure (well-rotted)\n" +
           "• Green manure crops\n\n" +
           "Chemical fertilizers:\n" +
           "• NPK 15-15-15 for most crops\n" +
           "• Urea for leafy vegetables\n" +
           "• TSP for root crops\n\n" +
           "Apply based on soil tests when possible!";
  }

  // Analyze image with Claude Vision (if you upgrade to Claude 3 Opus/Sonnet)
  async analyzeImage(imageBase64, question = "What do you see in this image?") {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'claude-3-sonnet-20240229', // Vision-capable model
          max_tokens: 300,
          system: this.systemContext + "\n\nYou are analyzing an agricultural image.",
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
                  }
                },
                {
                  type: 'text',
                  text: question
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Image analysis error:', error);
      return "I can help analyze plant images! For disease detection, please use our specialized Disease Detection tool which provides detailed analysis and treatment recommendations.";
    }
  }

  // Generate farming calendar
  async generateFarmingCalendar(crop, location) {
    const prompt = `Create a month-by-month farming calendar for ${crop} in ${location}, Ghana. Include planting, maintenance, and harvesting activities.`;
    
    try {
      return await this.chat(prompt, { userLocation: location, userCrops: [crop] });
    } catch (error) {
      return this.getFallbackCalendar(crop);
    }
  }

  getFallbackCalendar(crop) {
    const calendars = {
      maize: "Maize Calendar:\n• March-April: Land preparation\n• April: Planting\n• May-June: Weeding & fertilizer\n• July-August: Harvest",
      cassava: "Cassava Calendar:\n• April-May: Land preparation & planting\n• Monthly: Weeding\n• 8-12 months: Harvest",
      tomato: "Tomato Calendar:\n• Nursery: 3-4 weeks\n• Transplant: After rains start\n• Weekly: Staking & pruning\n• 60-90 days: Harvest"
    };

    return calendars[crop.toLowerCase()] || "Please specify a crop for detailed calendar information.";
  }
}

export default new ClaudeService();