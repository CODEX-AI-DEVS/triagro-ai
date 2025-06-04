import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, Volume2, ChevronDown, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import translationService from '../services/translationService';
import { ghanaianLanguages } from '../data/ghanaianLanguages';

const AgriculturalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your agricultural assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Context about user's session
  const [userContext, setUserContext] = useState({
    lastDiseaseDetection: null,
    location: null,
    preferredCrops: [],
    conversationHistory: []
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API status on mount
  useEffect(() => {
    const checkAPIStatus = async () => {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      if (!apiKey || apiKey === 'your_claude_api_key_here') {
        setApiStatus('offline');
        return;
      }
      
      try {
        // Simple test to check if API key is valid
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }]
          })
        });
        
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        setApiStatus('offline');
      }
    };
    
    checkAPIStatus();
    // Check again every 5 minutes
    const interval = setInterval(checkAPIStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick action buttons
  const quickActions = [
    { id: 'weather', label: 'Weather Forecast', icon: '🌤️' },
    { id: 'disease', label: 'Disease Help', icon: '🌱' },
    { id: 'market', label: 'Market Prices', icon: '💰' },
    { id: 'farming', label: 'Farming Tips', icon: '🚜' }
  ];

  // Predefined responses for offline mode
  const offlineResponses = {
    greeting: {
      en: "Hello! I can help with farming questions, disease detection, weather, and market prices.",
      tw: "Maakye! Metumi aboa wo wɔ akuafo nsɛm, yare a ɛba nnɔbae so, wim tebea ne gua boɔ ho.",
    },
    weather: {
      en: "I'll check the weather forecast for your area. You can also visit the Weather page for detailed information.",
      tw: "Mɛhwɛ wim nsakrae a ɛbɛba wɔ wo mpɔtam hɔ. Wobetumi nso akɔ Weather page no so ahwɛ nsɛm pii.",
    },
    disease: {
      en: "I can help identify plant diseases. Please upload a photo of the affected plant or describe the symptoms.",
      tw: "Metumi aboa wo ma woahu yare a aba wo afifide so. Mesrɛ wo fa ɔfifide a yare aba so no mfonini anaa ka nsɛnkyerɛnne a wuhu no kyerɛ me.",
    }
  };

  // Handle sending messages
  const handleSendMessage = async (content = inputValue, type = 'text', attachments = null) => {
    if (!content.trim() && !attachments) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      attachments,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let response;
      
      // Handle image uploads with Claude Vision
      if (attachments && attachments.type === 'image') {
        response = await handleImageAnalysis(content, attachments);
      } else {
        // Regular text message
        let translatedContent = content;
        if (selectedLanguage !== 'en') {
          translatedContent = await translationService.translate(content, 'en', selectedLanguage);
        }
        response = await callClaudeAPI(translatedContent, attachments);
      }
      
      // Translate response back to user's language if needed
      let finalResponse = response;
      if (selectedLanguage !== 'en' && !response.includes('**')) {
        try {
          finalResponse = await translationService.translate(response, selectedLanguage, 'en');
        } catch (translationError) {
          console.error('Translation error:', translationError);
          // Keep original response if translation fails
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: finalResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update conversation history (limit to last 10 exchanges)
      setUserContext(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory.slice(-9), { user: content, bot: finalResponse }]
      }));

    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Use intelligent fallback
      const fallbackResponse = getIntelligentFallback(content);
      const fallbackMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image analysis with Claude Vision
  const handleImageAnalysis = async (userText, attachment) => {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey || apiKey === 'your_claude_api_key_here') {
      return "To analyze images, I need the Claude API to be configured. For now, please use our Disease Detection tool for plant disease identification.";
    }

    try {
      const imageData = attachment.data.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Haiku supports vision
          max_tokens: 500,
          system: `You are an agricultural expert analyzing plant images from Ghana. Focus on:
- Identifying the plant/crop
- Detecting any diseases, pests, or nutrient deficiencies
- Assessing overall plant health
- Providing specific, actionable recommendations

Always provide practical advice suitable for Ghanaian farmers with limited resources.`,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: imageData
                  }
                },
                {
                  type: 'text',
                  text: userText || "Please analyze this plant image. Identify any diseases or issues and provide treatment recommendations."
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.content[0].text;
      
      // Add suggestion to use Disease Detection tool for detailed analysis
      return analysis + "\n\n💡 **Tip**: For more detailed disease identification with specific confidence scores, try our Disease Detection tool in the menu!";
      
    } catch (error) {
      console.error('Image analysis error:', error);
      return "I couldn't analyze the image at the moment. Please use our Disease Detection tool for accurate plant disease identification. You can find it in the main menu.";
    }
  };

  // Claude API integration with enhanced error handling
  const callClaudeAPI = async (message, attachments) => {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    // Check if API key exists
    if (!apiKey || apiKey === 'your_claude_api_key_here') {
      console.error('Claude API key not configured');
      return getIntelligentFallback(message);
    }
    
    // Build context-aware prompt
    const systemPrompt = `You are an expert agricultural assistant specifically designed for farmers in Ghana. 

Your knowledge includes:
- Ghanaian climate zones and seasonal patterns (major season: April-July, minor season: September-November)
- Common crops in Ghana: maize, cassava, yam, plantain, cocoa, rice, tomatoes, pepper, onions
- Local farming practices and traditional methods
- Plant diseases common in West Africa
- Market prices and major trading centers (Accra, Kumasi, Tamale, etc.)
- Weather patterns specific to Ghana's regions

Guidelines:
1. Provide practical, actionable advice
2. Use simple language that's easy to understand
3. Consider resource constraints (limited water, fertilizer costs)
4. Reference local agricultural extension services when relevant
5. Be aware of Ghana's diverse agricultural zones
6. Consider both subsistence and commercial farming needs

When users ask about:
- Weather: Reference the Weather Forecast page but also provide immediate seasonal advice
- Disease: Guide to Disease Detection tool but offer immediate first-aid advice
- Markets: Direct to Marketplace but share current season price trends
- Planting: Consider current month and rainfall patterns

${userContext.lastDiseaseDetection ? `Recent disease detection:
- Plant: ${userContext.lastDiseaseDetection.plant}
- Disease: ${userContext.lastDiseaseDetection.disease}
- Confidence: ${userContext.lastDiseaseDetection.confidence}%
- Previous remedy suggested: ${userContext.lastDiseaseDetection.remedy}` : ''}

${userContext.location ? `User location: ${userContext.location}` : ''}

Keep responses concise but informative. Always be encouraging and supportive.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 400,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            // Include last 5 exchanges for context
            ...userContext.conversationHistory.slice(-5).flatMap(h => [
              { role: 'user', content: h.user },
              { role: 'assistant', content: h.bot }
            ]),
            { role: 'user', content: message }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Claude API error:', response.status, errorData);
        
        // Handle specific error cases
        if (response.status === 401) {
          return "I'm having trouble connecting to my knowledge base. Please check that the API key is correctly configured. Meanwhile, you can use our Disease Detection tool or check the Weather Forecast page.";
        } else if (response.status === 429) {
          return "I'm receiving too many requests right now. Please try again in a moment. You can also check our Disease Detection tool or Weather Forecast page.";
        }
        
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format');
      }
      
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      return getIntelligentFallback(message);
    }
  };

  // Enhanced fallback responses
  const getIntelligentFallback = (message) => {
    const msg = message.toLowerCase();
    const currentMonth = new Date().getMonth();
    const currentSeason = (currentMonth >= 3 && currentMonth <= 6) ? 'major rainy' : 
                         (currentMonth >= 8 && currentMonth <= 10) ? 'minor rainy' : 'dry';
    
    // Disease-related queries
    if (msg.includes('disease') || msg.includes('sick') || msg.includes('yellow') || msg.includes('brown') || msg.includes('spots')) {
      return `I can help with plant diseases! Here's what you can do:\n\n` +
             `1. **Use our Disease Detection tool** - Upload a clear photo for instant AI diagnosis\n` +
             `2. **Common diseases in Ghana:**\n` +
             `   • Tomato: Early/Late blight, Bacterial wilt\n` +
             `   • Maize: Leaf spot, Rust, Stem borer\n` +
             `   • Cassava: Mosaic virus, Bacterial blight\n\n` +
             `3. **Immediate actions:**\n` +
             `   • Remove affected leaves\n` +
             `   • Improve air circulation\n` +
             `   • Avoid overhead watering\n` +
             `   • Apply organic fungicide if available`;
    }
    
    // Weather queries
    if (msg.includes('weather') || msg.includes('rain') || msg.includes('forecast')) {
      return `Current season: ${currentSeason} season\n\n` +
             `**Weather Information:**\n` +
             `• Check our Weather Forecast page for 7-day predictions\n` +
             `• View seasonal forecasts for planning\n\n` +
             `**Seasonal Tips:**\n` +
             `• Major rains (Apr-Jul): Best for planting staples\n` +
             `• Minor rains (Sep-Nov): Ideal for vegetables\n` +
             `• Dry season: Focus on irrigation, land preparation\n\n` +
             `Plan your activities based on rainfall patterns!`;
    }
    
    // Market/price queries
    if (msg.includes('price') || msg.includes('market') || msg.includes('sell') || msg.includes('buy')) {
      return `**Market Information:**\n\n` +
             `Visit our Marketplace for:\n` +
             `• Current prices by region\n` +
             `• Connect with verified buyers\n` +
             `• Price trends and forecasts\n\n` +
             `**Current season prices (${currentSeason}):**\n` +
             `• High demand: Tomatoes, Pepper, Onions\n` +
             `• Good prices: Maize, Cassava\n` +
             `• Store well: Yam, Beans\n\n` +
             `Tip: Clean and grade produce for better prices!`;
    }
    
    // Planting queries
    if (msg.includes('plant') || msg.includes('when') || msg.includes('sow') || msg.includes('seed')) {
      const plantingAdvice = currentMonth >= 2 && currentMonth <= 4 ? 
        "It's planting season! Start with maize, cassava, and yam." :
        currentMonth >= 7 && currentMonth <= 9 ?
        "Minor season planting time! Focus on vegetables and short-duration crops." :
        "Prepare your land for the upcoming season.";
        
      return `**Planting Guide for Ghana:**\n\n${plantingAdvice}\n\n` +
             `**Major Season (April-July):**\n` +
             `• Maize: April-May\n` +
             `• Cassava: April-June  \n` +
             `• Yam: March-April\n` +
             `• Plantain: April-May\n\n` +
             `**Minor Season (Sept-Nov):**\n` +
             `• Vegetables: September\n` +
             `• Maize (South): September\n` +
             `• Tomatoes: August-September\n\n` +
             `Check rainfall before planting!`;
    }
    
    // Fertilizer queries
    if (msg.includes('fertilizer') || msg.includes('manure') || msg.includes('soil') || msg.includes('npk')) {
      return `**Fertilizer Recommendations:**\n\n` +
             `**Organic Options:**\n` +
             `• Compost from crop residues\n` +
             `• Well-rotted animal manure\n` +
             `• Green manure (legume cover crops)\n\n` +
             `**Chemical Fertilizers:**\n` +
             `• NPK 15-15-15: General purpose\n` +
             `• Urea: For leafy growth\n` +
             `• TSP: For root development\n\n` +
             `**Application Tips:**\n` +
             `• Test soil if possible\n` +
             `• Apply before rains\n` +
             `• Keep away from plant stems\n` +
             `• Use recommended rates`;
    }
    
    // Harvest queries
    if (msg.includes('harvest') || msg.includes('ready') || msg.includes('ripe')) {
      return `**Harvest Guidelines:**\n\n` +
             `**Maturity Periods:**\n` +
             `• Maize: 90-120 days\n` +
             `• Tomatoes: 60-80 days\n` +
             `• Pepper: 60-90 days\n` +
             `• Cassava: 8-18 months\n` +
             `• Yam: 8-10 months\n\n` +
             `**Harvest Tips:**\n` +
             `• Harvest in dry weather\n` +
             `• Use clean tools\n` +
             `• Handle carefully\n` +
             `• Sort and grade immediately`;
    }
    
    // Default response
    return `I'm your agricultural assistant! I can help with:\n\n` +
           `🌱 **Plant Health**: Disease identification and treatment\n` +
           `🌤️ **Weather**: Forecasts and seasonal advice\n` +
           `💰 **Markets**: Prices and buyer connections\n` +
           `🌾 **Farming**: Planting, fertilizer, and harvest tips\n\n` +
           `Try asking:\n` +
           `• "My tomato leaves are turning yellow"\n` +
           `• "When should I plant maize?"\n` +
           `• "What's the weather forecast?"\n` +
           `• "Current market prices for cassava"\n\n` +
           `You can also use our tools: Disease Detection, Weather Forecast, or Marketplace.`;
  };

  // Voice input handling
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = selectedLanguage === 'en' ? 'en-US' : 'en-GH';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.start();
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleSendMessage('I\'ve uploaded an image for analysis', 'image', {
          type: 'image',
          data: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick action handler
  const handleQuickAction = (actionId) => {
    const actionMessages = {
      weather: "What's the weather forecast for my area?",
      disease: "I need help identifying a plant disease",
      market: "Show me current market prices for crops",
      farming: "Give me farming tips for this season"
    };
    
    setInputValue(actionMessages[actionId]);
    handleSendMessage(actionMessages[actionId]);
  };

  // Update context when disease detection is used
  useEffect(() => {
    // This would be connected to your disease detection results
    const handleDiseaseDetection = (event) => {
      if (event.detail) {
        setUserContext(prev => ({
          ...prev,
          lastDiseaseDetection: event.detail
        }));
      }
    };

    window.addEventListener('diseaseDetectionComplete', handleDiseaseDetection);
    return () => window.removeEventListener('diseaseDetectionComplete', handleDiseaseDetection);
  }, []);

  return (
    <>
      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌾</span>
                </div>
                <div>
                  <h3 className="font-semibold">Agricultural Assistant</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      apiStatus === 'online' ? 'bg-green-400' : 
                      apiStatus === 'offline' ? 'bg-red-400' : 
                      'bg-yellow-400 animate-pulse'
                    }`} />
                    {apiStatus === 'online' ? 'AI Powered' : 
                     apiStatus === 'offline' ? 'Offline Mode' : 
                     'Connecting...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Language selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <ChevronDown size={20} />
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48 max-h-60 overflow-y-auto">
                      {Object.entries(ghanaianLanguages.languages).map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setSelectedLanguage(code);
                            setShowLanguageDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          {lang.name} ({lang.nativeName})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.attachments && message.attachments.type === 'image' && (
                      <img 
                        src={message.attachments.data} 
                        alt="Uploaded" 
                        className="w-full rounded mb-2"
                      />
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 py-2 border-t">
              <div className="flex space-x-2 overflow-x-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Camera size={20} />
                </button>
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgriculturalChatbot;