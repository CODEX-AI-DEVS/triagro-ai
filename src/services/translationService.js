import axios from 'axios';

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.supportedLanguages = [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'tw', name: 'Twi', flag: '🇬🇭' },
      { code: 'ee', name: 'Ewe', flag: '🇬🇭' },
      { code: 'dag', name: 'Dagbane', flag: '🇬🇭' }
    ];
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    this.loadCacheFromStorage();
  }

  /**
   * Load cached translations from localStorage
   */
  loadCacheFromStorage() {
    try {
      const cachedData = localStorage.getItem('translationCache');
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - timestamp < this.cacheTimeout) {
          this.cache = new Map(data);
        } else {
          localStorage.removeItem('translationCache');
        }
      }
    } catch (error) {
      console.error('Error loading translation cache:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  saveCacheToStorage() {
    try {
      const cacheData = {
        data: Array.from(this.cache.entries()),
        timestamp: Date.now()
      };
      localStorage.setItem('translationCache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving translation cache:', error);
    }
  }

  /**
   * Generate cache key for translation
   */
  getCacheKey(text, fromLang, toLang) {
    return `${fromLang}-${toLang}-${text.toLowerCase().trim()}`;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(languageCode) {
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  /**
   * Translate text using Ghana NLP API
   */
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    // Return original text if target is the same as source
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    // Check if languages are supported
    if (!this.isLanguageSupported(targetLanguage) || !this.isLanguageSupported(sourceLanguage)) {
      console.warn(`Unsupported language: ${sourceLanguage} -> ${targetLanguage}`);
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, sourceLanguage, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Use correct Ghana NLP API format and endpoint
      const langPair = `${sourceLanguage}-${targetLanguage}`;
      const response = await axios.post('/api/ghana-nlp/translate', {
        in: text,
        lang: langPair
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      });

      // Handle Ghana NLP API v1 response format
      // v1 API returns just the translated text as a string
      const translatedText = typeof response.data === 'string' 
                            ? response.data 
                            : response.data.out || 
                              response.data.translated_text || 
                              response.data.translation || 
                              response.data.result ||
                              text;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      this.saveCacheToStorage();
      
      return translatedText;
    } catch (error) {
      console.error('Translation API error:', error);
      
      // Try fallback with pre-defined translations
      const fallbackTranslation = await this.getFallbackTranslation(text, targetLanguage);
      if (fallbackTranslation !== text) {
        return fallbackTranslation;
      }
      
      // Return original text if all translation attempts fail
      return text;
    }
  }

  /**
   * Get fallback translation from pre-defined agricultural terms
   */
  async getFallbackTranslation(text, targetLanguage) {
    try {
      // Import agricultural terms dynamically
      const { default: agriculturalTerms } = await import('../data/agriculturalTerms.json');
      
      const normalizedText = text.toLowerCase().trim();
      
      // Search in common diseases
      for (const [key, translations] of Object.entries(agriculturalTerms.commonDiseases || {})) {
        if (translations.en && translations.en.toLowerCase() === normalizedText) {
          return translations[targetLanguage] || text;
        }
      }
      
      // Search in plants
      for (const [key, translations] of Object.entries(agriculturalTerms.plants || {})) {
        if (translations.en && translations.en.toLowerCase() === normalizedText) {
          return translations[targetLanguage] || text;
        }
      }
      
      // Search in treatments
      for (const [key, translations] of Object.entries(agriculturalTerms.treatments || {})) {
        if (translations.en && translations.en.toLowerCase() === normalizedText) {
          return translations[targetLanguage] || text;
        }
      }
      
      // Search in UI labels
      for (const [key, translations] of Object.entries(agriculturalTerms.uiLabels || {})) {
        if (translations.en && translations.en.toLowerCase() === normalizedText) {
          return translations[targetLanguage] || text;
        }
      }
      
    } catch (error) {
      console.error('Error loading agricultural terms:', error);
    }
    
    return text;
  }

  /**
   * Translate diagnosis result object
   */
  async translateDiagnosisResult(result, targetLanguage) {
    if (targetLanguage === 'en' || !result) {
      return result;
    }

    try {
      const [translatedPlant, translatedDisease, translatedRemedy] = await Promise.all([
        this.translateText(result.plant, targetLanguage),
        this.translateText(result.disease, targetLanguage),
        this.translateText(result.remedy, targetLanguage)
      ]);

      return {
        ...result,
        plant: translatedPlant,
        disease: translatedDisease,
        remedy: translatedRemedy
      };
    } catch (error) {
      console.error('Error translating diagnosis result:', error);
      return result;
    }
  }

  /**
   * Translate UI labels
   */
  async translateUILabels(labels, targetLanguage) {
    if (targetLanguage === 'en' || !labels || typeof labels !== 'object') {
      return labels;
    }

    const translatedLabels = {};
    
    for (const [key, value] of Object.entries(labels)) {
      if (typeof value === 'string') {
        translatedLabels[key] = await this.translateText(value, targetLanguage);
      } else {
        translatedLabels[key] = value;
      }
    }

    return translatedLabels;
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(texts, targetLanguage, sourceLanguage = 'en') {
    if (!Array.isArray(texts)) {
      return [];
    }

    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage, sourceLanguage))
    );

    return translations;
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache.clear();
    localStorage.removeItem('translationCache');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      lastUpdated: localStorage.getItem('translationCache') ? 
        JSON.parse(localStorage.getItem('translationCache')).timestamp : null
    };
  }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;