// Enhanced Claude Service with Backend Proxy Support
import axios from 'axios';

class ClaudeServiceWithProxy {
  constructor() {
    // Check if we should use proxy (more secure) or direct API
    this.useProxy = import.meta.env.VITE_USE_CLAUDE_PROXY === 'true';
    this.proxyUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    // Service configuration
    this.model = 'claude-3-haiku-20240307';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async chat(message, context = {}) {
    try {
      // Check cache first
      const cacheKey = `${message}_${JSON.stringify(context)}`;
      const cached = this.getCachedResponse(cacheKey);
      if (cached) return cached;

      let response;

      if (this.useProxy) {
        // Use backend proxy (recommended for production)
        response = await this.chatViaProxy(message, context);
      } else {
        // Direct API call (development only)
        response = await this.chatDirectly(message, context);
      }

      // Cache the response
      this.setCachedResponse(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('Chat service error:', error);
      return this.getIntelligentFallback(message, context);
    }
  }

  async chatViaProxy(message, context) {
    const response = await axios.post(
      `${this.proxyUrl}/api/claude/chat`,
      {
        message,
        context,
        history: context.conversationHistory || []
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.fallback) {
      return response.data.fallback;
    }

    return response.data.response;
  }

  async chatDirectly(message, context) {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: this.model,
        max_tokens: 400,
        temperature: 0.7,
        system: this.buildSystemPrompt(context),
        messages: this.buildMessageHistory(message, context)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        timeout: 10000
      }
    );

    return response.data.content[0].text;
  }

  async analyzeImage(imageBase64, question = "What do you see in this agricultural image?") {
    try {
      if (this.useProxy) {
        // Use proxy for image analysis
        const response = await axios.post(
          `${this.proxyUrl}/api/claude/analyze-image`,
          {
            image: imageBase64,
            question
          },
          {
            timeout: 15000
          }
        );

        return response.data.analysis || response.data.fallback;
      } else {
        // Direct API call for vision
        return await this.analyzeImageDirectly(imageBase64, question);
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      return "For detailed plant disease analysis, please use our specialized Disease Detection tool. It provides instant diagnosis and treatment recommendations.";
    }
  }

  async analyzeImageDirectly(imageBase64, question) {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229', // Vision model
        max_tokens: 300,
        system: this.getVisionSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64.split(',')[1]
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
  }

  buildSystemPrompt(context) {
    let prompt = `You are an expert agricultural assistant for farmers in Ghana. 
    
    Your expertise includes:
    - Ghanaian crops: maize, cassava, yam, plantain, cocoa, rice, tomatoes
    - Local farming practices and climate zones
    - Plant diseases common in West Africa
    - Market information and trading centers
    - Seasonal patterns (major: April-July, minor: Sept-Nov)
    
    Provide practical, simple advice considering local resource constraints.`;

    if (context.location) {
      prompt += `\n\nUser is in: ${context.location}`;
    }

    if (context.recentDiseaseDetection) {
      prompt += `\n\nRecent detection: Plant: ${context.recentDiseaseDetection.plant}, Disease: ${context.recentDiseaseDetection.disease}`;
    }

    return prompt;
  }

  getVisionSystemPrompt() {
    return `You are an agricultural expert analyzing farm images from Ghana. 
    Focus on:
    - Identifying crops and plants
    - Detecting diseases, pests, or nutrient deficiencies
    - Assessing plant health
    - Suggesting immediate actions
    
    Provide practical advice suitable for Ghanaian farmers.`;
  }

  buildMessageHistory(currentMessage, context) {
    const messages = [];

    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-5);
      
      recentHistory.forEach(exchange => {
        messages.push({ role: 'user', content: exchange.user });
        messages.push({ role: 'assistant', content: exchange.bot });
      });
    }

    messages.push({ role: 'user', content: currentMessage });
    return messages;
  }

  getCachedResponse(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }
    return null;
  }

  setCachedResponse(key, response) {
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });

    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  getIntelligentFallback(message, context) {
    const msg = message.toLowerCase();
    
    // Context-aware responses
    if (context.recentDiseaseDetection) {
      return `Based on your recent ${context.recentDiseaseDetection.plant} disease detection, here are follow-up care tips:\n\n` +
             `1. Monitor the plant daily for changes\n` +
             `2. Apply the recommended treatment: ${context.recentDiseaseDetection.remedy || 'Check disease details'}\n` +
             `3. Isolate affected plants if possible\n` +
             `4. Ensure proper spacing for air circulation`;
    }

    // Query-specific fallbacks
    if (msg.includes('disease') || msg.includes('sick')) {
      return this.getDiseaseGuidance();
    } else if (msg.includes('weather') || msg.includes('rain')) {
      return this.getWeatherGuidance();
    } else if (msg.includes('price') || msg.includes('market')) {
      return this.getMarketGuidance();
    } else if (msg.includes('plant') || msg.includes('when')) {
      return this.getPlantingGuidance();
    } else if (msg.includes('harvest')) {
      return this.getHarvestGuidance();
    }

    // General fallback
    return "I'm here to help with your farming needs! You can ask about:\n\n" +
           "🌱 Plant diseases and treatments\n" +
           "🌤️ Weather forecasts and planning\n" +
           "💰 Market prices and buyers\n" +
           "🌾 Planting and harvesting tips\n" +
           "🔬 Soil and fertilizer advice\n\n" +
           "Try our tools: Disease Detection, Weather Forecast, or Marketplace.";
  }

  getDiseaseGuidance() {
    return "For plant disease help:\n\n" +
           "1. **Use Disease Detection Tool** - Upload a photo for instant diagnosis\n" +
           "2. **Common signs to check:**\n" +
           "   • Leaf discoloration (yellow, brown, black spots)\n" +
           "   • Wilting or drooping\n" +
           "   • Unusual growth patterns\n" +
           "   • Pest presence\n\n" +
           "3. **Immediate actions:**\n" +
           "   • Isolate affected plants\n" +
           "   • Remove diseased parts\n" +
           "   • Improve air circulation\n" +
           "   • Check water drainage";
  }

  getWeatherGuidance() {
    const month = new Date().getMonth();
    const season = (month >= 3 && month <= 6) ? 'major rainy' : 
                   (month >= 8 && month <= 10) ? 'minor rainy' : 'dry';
    
    return `Current season: ${season} season\n\n` +
           "**Weather Planning:**\n" +
           "• Check our 7-day forecast for your area\n" +
           "• Plan planting before heavy rains\n" +
           "• Harvest before wet periods\n\n" +
           "**Seasonal Tips:**\n" +
           "• Major rains (Apr-Jul): Plant staples\n" +
           "• Minor rains (Sep-Nov): Plant vegetables\n" +
           "• Dry season: Irrigate, prepare land";
  }

  getMarketGuidance() {
    return "**Market Information:**\n\n" +
           "📍 Check our Marketplace for:\n" +
           "• Current crop prices by region\n" +
           "• Verified buyers near you\n" +
           "• Price trends and forecasts\n\n" +
           "💡 **Selling Tips:**\n" +
           "• Clean and grade produce\n" +
           "• Compare prices across markets\n" +
           "• Consider transport costs\n" +
           "• Store properly to maintain quality";
  }

  getPlantingGuidance() {
    return "**Planting Calendar for Ghana:**\n\n" +
           "🌱 **Major Season (April-July):**\n" +
           "• Maize: April-May\n" +
           "• Cassava: April-June\n" +
           "• Yam: March-April\n" +
           "• Rice: April-May (lowlands)\n\n" +
           "🌿 **Minor Season (Sept-November):**\n" +
           "• Vegetables: September\n" +
           "• Maize: September (south)\n" +
           "• Tomatoes: August-September\n\n" +
           "Always check local rainfall before planting!";
  }

  getHarvestGuidance() {
    return "**Harvest Guidelines:**\n\n" +
           "📅 **Typical Harvest Times:**\n" +
           "• Maize: 90-120 days\n" +
           "• Tomatoes: 60-80 days\n" +
           "• Cassava: 8-18 months\n" +
           "• Yam: 8-10 months\n\n" +
           "✅ **Harvest Tips:**\n" +
           "• Check crop maturity signs\n" +
           "• Harvest in dry weather\n" +
           "• Handle carefully to avoid damage\n" +
           "• Store properly after harvest";
  }

  // Check service health
  async checkHealth() {
    try {
      if (this.useProxy) {
        const response = await axios.get(`${this.proxyUrl}/api/claude/health`);
        return response.data;
      } else {
        return {
          status: 'healthy',
          mode: 'direct',
          api_key_configured: !!this.apiKey
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

export default new ClaudeServiceWithProxy();