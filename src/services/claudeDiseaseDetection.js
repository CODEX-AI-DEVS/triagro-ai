// Claude AI-Powered Disease Detection Service
import axios from 'axios';

class ClaudeDiseaseDetectionService {
  constructor() {
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-haiku-20240307'; // Supports vision
    
    // Existing backend endpoints
    this.backendUrl = '/api/disease/predict';
    this.useClaudeAsBackup = true;
  }

  // Main disease detection method
  async detectDisease(imageBase64, options = {}) {
    const { 
      preferredLanguage = 'en',
      location = 'Ghana',
      additionalContext = ''
    } = options;

    try {
      // Try backend first (HuggingFace model)
      const backendResult = await this.tryBackendDetection(imageBase64);
      if (backendResult && backendResult.confidence > 0.7) {
        // Enhance backend result with Claude's analysis
        const enhancedResult = await this.enhanceWithClaude(imageBase64, backendResult);
        return enhancedResult || backendResult;
      }
    } catch (backendError) {
      console.log('Backend detection failed, using Claude directly:', backendError);
    }

    // Use Claude Vision API directly
    return await this.detectWithClaude(imageBase64, { location, additionalContext });
  }

  // Try existing backend detection
  async tryBackendDetection(imageBase64) {
    try {
      const response = await axios.post(
        this.backendUrl,
        { image: imageBase64 },
        { 
          timeout: 15000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Backend detection error:', error);
      return null;
    }
  }

  // Detect disease using Claude Vision
  async detectWithClaude(imageBase64, context = {}) {
    if (!this.apiKey || this.apiKey === 'your_claude_api_key_here') {
      throw new Error('Claude API key not configured');
    }

    const imageData = imageBase64.split(',')[1] || imageBase64;
    
    const systemPrompt = `You are an expert plant pathologist specializing in crops grown in Ghana and West Africa. 
    
Your task is to analyze plant images and provide disease detection results in a specific JSON format.

Consider these common Ghanaian crops and their diseases:
- Maize: Leaf blight, Rust, Streak virus, Stem borer damage
- Cassava: Mosaic virus, Bacterial blight, Brown streak, Anthracnose
- Tomato: Early blight, Late blight, Bacterial wilt, Leaf curl virus
- Pepper: Bacterial spot, Anthracnose, Mosaic virus
- Plantain: Black sigatoka, Panama disease, Weevil damage
- Yam: Anthracnose, Leaf spot, Mosaic virus
- Cocoa: Black pod, Swollen shoot virus, Mirids damage

${context.location ? `Location: ${context.location}` : ''}

Analyze the image and respond ONLY with a JSON object in this exact format:
{
  "plant": "Plant name",
  "disease": "Disease name or Healthy",
  "confidence": 0.85,
  "remedy": "Detailed treatment recommendation",
  "prevention": "Prevention measures",
  "severity": "mild|moderate|severe",
  "additional_notes": "Any other relevant observations"
}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 600,
          temperature: 0.3, // Lower temperature for more consistent JSON
          system: systemPrompt,
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
                  text: context.additionalContext || 'Analyze this plant for diseases. If healthy, confirm it. Provide treatment in the context of Ghanaian farming practices.'
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Claude API error:', response.status, errorData);
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.content[0].text;
      
      // Parse JSON response
      try {
        const result = JSON.parse(responseText);
        return {
          ...result,
          source: 'Claude AI Vision',
          timestamp: new Date().toISOString(),
          predicted_class: `${result.plant.toLowerCase()}_${result.disease.toLowerCase().replace(/\s+/g, '_')}`
        };
      } catch (parseError) {
        // If JSON parsing fails, extract information from text
        return this.parseTextResponse(responseText);
      }
      
    } catch (error) {
      console.error('Claude detection error:', error);
      throw error;
    }
  }

  // Enhance backend results with Claude analysis
  async enhanceWithClaude(imageBase64, backendResult) {
    if (!this.apiKey || !this.useClaudeAsBackup) {
      return null;
    }

    const imageData = imageBase64.split(',')[1] || imageBase64;
    
    const enhancementPrompt = `You are enhancing an AI disease detection result with additional insights.

The initial detection found:
- Plant: ${backendResult.plant}
- Disease: ${backendResult.disease}
- Confidence: ${(backendResult.confidence * 100).toFixed(1)}%

Please verify this detection and provide:
1. Confirmation or correction of the diagnosis
2. Additional symptoms visible in the image
3. Specific treatment for Ghanaian farmers
4. Prevention measures
5. When to seek expert help

Respond in JSON format with enhanced remedy and additional insights.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 400,
          temperature: 0.5,
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
                  text: enhancementPrompt
                }
              ]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const enhancement = this.parseEnhancement(data.content[0].text);
        
        return {
          ...backendResult,
          remedy: enhancement.remedy || backendResult.remedy,
          confidence: enhancement.confirmedConfidence || backendResult.confidence,
          additional_insights: enhancement.insights,
          source: 'HuggingFace + Claude AI',
          enhanced: true
        };
      }
    } catch (error) {
      console.error('Enhancement error:', error);
    }

    return null;
  }

  // Parse text response if JSON parsing fails
  parseTextResponse(text) {
    const result = {
      plant: 'Unknown',
      disease: 'Unknown',
      confidence: 0.7,
      remedy: '',
      source: 'Claude AI Vision'
    };

    // Extract plant name
    const plantMatch = text.match(/plant[:\s]+([A-Za-z\s]+)/i);
    if (plantMatch) result.plant = plantMatch[1].trim();

    // Extract disease
    const diseaseMatch = text.match(/disease[:\s]+([A-Za-z\s]+)/i);
    if (diseaseMatch) result.disease = diseaseMatch[1].trim();

    // Extract confidence
    const confMatch = text.match(/confidence[:\s]+([0-9.]+)/i);
    if (confMatch) result.confidence = parseFloat(confMatch[1]);

    // Extract remedy
    const remedyMatch = text.match(/remedy[:\s]+(.+?)(?=\n|$)/is);
    if (remedyMatch) result.remedy = remedyMatch[1].trim();

    // If no structured data found, use the whole response as remedy
    if (!result.remedy && text.length > 50) {
      result.remedy = text;
    }

    return result;
  }

  // Parse enhancement response
  parseEnhancement(text) {
    try {
      return JSON.parse(text);
    } catch {
      // Extract key information from text
      const remedyMatch = text.match(/treatment[:\s]+(.+?)(?=prevention|$)/is);
      const insightsMatch = text.match(/additional[:\s]+(.+?)(?=$)/is);
      
      return {
        remedy: remedyMatch ? remedyMatch[1].trim() : text,
        insights: insightsMatch ? insightsMatch[1].trim() : '',
        confirmedConfidence: null
      };
    }
  }

  // Get common diseases for offline fallback
  getCommonDiseases(plantType) {
    const diseases = {
      tomato: [
        { disease: 'Early Blight', confidence: 0.75, remedy: 'Remove affected leaves, apply copper fungicide, improve air circulation' },
        { disease: 'Late Blight', confidence: 0.72, remedy: 'Apply fungicide immediately, remove infected plants, ensure good drainage' },
        { disease: 'Bacterial Wilt', confidence: 0.70, remedy: 'Remove infected plants, crop rotation, use resistant varieties' }
      ],
      maize: [
        { disease: 'Leaf Blight', confidence: 0.73, remedy: 'Apply fungicide, remove crop debris, plant resistant varieties' },
        { disease: 'Rust', confidence: 0.71, remedy: 'Early fungicide application, remove volunteer plants' },
        { disease: 'Streak Virus', confidence: 0.68, remedy: 'Control leafhopper vectors, remove infected plants early' }
      ],
      cassava: [
        { disease: 'Mosaic Virus', confidence: 0.74, remedy: 'Use virus-free planting material, remove infected plants' },
        { disease: 'Bacterial Blight', confidence: 0.70, remedy: 'Use clean cuttings, practice crop rotation' },
        { disease: 'Brown Streak', confidence: 0.69, remedy: 'Use resistant varieties, remove infected roots' }
      ]
    };

    return diseases[plantType.toLowerCase()] || [
      { disease: 'Unknown Disease', confidence: 0.5, remedy: 'Consult local agricultural extension officer for proper diagnosis' }
    ];
  }

  // Batch process multiple images
  async batchDetect(images, options = {}) {
    const results = [];
    
    for (const image of images) {
      try {
        const result = await this.detectDisease(image, options);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  // Check if service is available
  async checkHealth() {
    const health = {
      claude: false,
      backend: false,
      overall: 'offline'
    };

    // Check Claude API
    if (this.apiKey && this.apiKey !== 'your_claude_api_key_here') {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: this.model,
            max_tokens: 10,
            messages: [{ role: 'user', content: 'test' }]
          })
        });
        health.claude = response.ok;
      } catch {
        health.claude = false;
      }
    }

    // Check backend
    try {
      const response = await axios.get('/api/disease/health', { timeout: 5000 });
      health.backend = response.status === 200;
    } catch {
      health.backend = false;
    }

    health.overall = health.claude ? 'claude' : health.backend ? 'backend' : 'offline';
    return health;
  }
}

export default new ClaudeDiseaseDetectionService();