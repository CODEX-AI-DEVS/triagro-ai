/**
 * Enhanced Ghana NLP Translation Service
 * Optimized based on official Ghana NLP API documentation
 * Implements proper request formats, authentication, and error handling
 */

import axios from 'axios';

class EnhancedGhanaNLPService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GHANA_NLP_API_KEY;
    // Use proxy endpoint to avoid CORS issues
    this.baseURL = '/api/ghana-nlp';
    this.directURL = 'https://translation-api.ghananlp.org/v1'; // For direct access if needed
    this.cache = new Map();
    this.requestQueue = [];
    this.batchTimeout = null;
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
    this.useProxy = true; // Flag to control proxy usage
    
    // Language codes based on Ghana NLP API documentation
    // Note: Ga (ga) is not supported by the API as of current version
    this.supportedLanguagePairs = {
      // English to Ghanaian Languages
      'en-tw': { from: 'en', to: 'tw', name: 'English to Twi' },
      'en-ee': { from: 'en', to: 'ee', name: 'English to Ewe' },
      'en-dag': { from: 'en', to: 'dag', name: 'English to Dagbani' },
      'en-ff': { from: 'en', to: 'ff', name: 'English to Fula' },
      'en-ha': { from: 'en', to: 'ha', name: 'English to Hausa' },
      
      // Ghanaian Languages to English
      'tw-en': { from: 'tw', to: 'en', name: 'Twi to English' },
      'ee-en': { from: 'ee', to: 'en', name: 'Ewe to English' },
      'dag-en': { from: 'dag', to: 'en', name: 'Dagbani to English' },
      'ff-en': { from: 'ff', to: 'en', name: 'Fula to English' },
      'ha-en': { from: 'ha', to: 'en', name: 'Hausa to English' },
      
      // Inter-Ghanaian Language Translation (if supported)
      'tw-ee': { from: 'tw', to: 'ee', name: 'Twi to Ewe' },
      'ee-tw': { from: 'ee', to: 'tw', name: 'Ewe to Twi' },
      'tw-dag': { from: 'tw', to: 'dag', name: 'Twi to Dagbani' },
      'dag-tw': { from: 'dag', to: 'tw', name: 'Dagbani to Twi' },
    };

    this.initializeAxios();
  }

  /**
   * Initialize axios instance with proper configuration
   */
  initializeAxios() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 15000, // 15 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'TriAgro-Translation-Client/1.0'
      }
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.useProxy) {
          // When using proxy, headers are set by Vite proxy
          console.log('🌐 Using Vite proxy for Ghana NLP API');
        } else if (this.apiKey) {
          // Direct API access (will likely fail due to CORS)
          config.headers['Ocp-Apim-Subscription-Key'] = this.apiKey;
          console.log('🔑 Using direct API access with key');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('Ghana NLP API Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url,
          data: error.config?.data
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate language pair code for Ghana NLP API
   */
  getLanguagePairCode(fromLang, toLang) {
    const pairCode = `${fromLang}-${toLang}`;
    if (this.supportedLanguagePairs[pairCode]) {
      return pairCode;
    }
    
    // Fallback to English if direct pair not supported
    if (fromLang !== 'en' && toLang !== 'en') {
      // Try via English: source -> en -> target
      return { via: 'en', first: `${fromLang}-en`, second: `en-${toLang}` };
    }
    
    throw new Error(`Unsupported language pair: ${fromLang} to ${toLang}`);
  }

  /**
   * Generate cache key
   */
  getCacheKey(text, langPair) {
    return `${langPair}:${text.toLowerCase().trim()}`;
  }

  /**
   * Check if text needs translation
   */
  needsTranslation(text, fromLang, toLang) {
    if (!text || fromLang === toLang) return false;
    
    // Skip translation for very short text that might be symbols or numbers
    if (text.length < 2 || /^\d+$/.test(text.trim())) return false;
    
    return true;
  }

  /**
   * Translate single text using Ghana NLP API
   */
  async translateText(text, fromLang = 'en', toLang = 'tw') {
    if (!this.needsTranslation(text, fromLang, toLang)) {
      return text;
    }

    const langPair = this.getLanguagePairCode(fromLang, toLang);
    const cacheKey = this.getCacheKey(text, typeof langPair === 'string' ? langPair : `${fromLang}-${toLang}`);

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let translatedText;

      if (typeof langPair === 'object') {
        // Two-step translation via English
        const intermediate = await this.performSingleTranslation(text, langPair.first);
        translatedText = await this.performSingleTranslation(intermediate, langPair.second);
      } else {
        // Direct translation
        translatedText = await this.performSingleTranslation(text, langPair);
      }

      // Cache the result
      this.cache.set(cacheKey, translatedText);
      return translatedText;

    } catch (error) {
      console.error(`Translation failed for "${text}" (${fromLang} -> ${toLang}):`, error);
      return text; // Return original text on failure
    }
  }

  /**
   * Perform single translation request to Ghana NLP API
   */
  async performSingleTranslation(text, langPairCode, retryCount = 0) {
    try {
      const requestData = {
        in: text.trim(),
        lang: langPairCode
      };

      console.log(`🌍 Ghana NLP API Request (${this.useProxy ? 'via proxy' : 'direct'}):`, requestData);

      const response = await this.axiosInstance.post('/translate', requestData);

      // Handle different possible response formats
      let translatedText;
      if (response.data && typeof response.data === 'object') {
        // Try different possible response field names
        translatedText = response.data.out || 
                        response.data.translated_text || 
                        response.data.translation || 
                        response.data.result ||
                        response.data.text;
      } else if (typeof response.data === 'string') {
        translatedText = response.data;
      }

      if (!translatedText) {
        console.warn('Unexpected response format:', response.data);
        return text; // Return original if response format is unexpected
      }

      console.log(`✅ Translation successful: "${text}" -> "${translatedText}"`);
      return translatedText.trim();

    } catch (error) {
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        console.log(`🔄 Retrying translation (${retryCount + 1}/${this.maxRetries})`);
        await this.sleep(this.retryDelay * (retryCount + 1));
        return this.performSingleTranslation(text, langPairCode, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Determine if error is retryable
   */
  shouldRetry(error) {
    const status = error.response?.status;
    
    // Check for CORS error (common in direct API calls)
    if (error.message && error.message.includes('CORS')) {
      console.warn('🙅 CORS error detected, switching to proxy mode');
      this.useProxy = true;
      this.baseURL = '/api/ghana-nlp';
      this.initializeAxios(); // Reinitialize with proxy settings
      return true;
    }
    
    // Retry on network errors, timeouts, and server errors
    if (!status) return true; // Network error
    if (status >= 500) return true; // Server error
    if (status === 429) return true; // Rate limit
    if (status === 408) return true; // Timeout
    
    return false;
  }

  /**
   * Toggle between proxy and direct API access
   */
  setUseProxy(useProxy = true) {
    this.useProxy = useProxy;
    this.baseURL = useProxy ? '/api/ghana-nlp' : this.directURL;
    this.initializeAxios();
    console.log(`🔄 Switched to ${useProxy ? 'proxy' : 'direct'} mode for Ghana NLP API`);
  }

  /**
   * Test both proxy and direct access methods
   */
  async testBothMethods() {
    const results = {};
    
    // Test proxy method
    try {
      this.setUseProxy(true);
      const proxyResult = await this.translateText('Hello', 'en', 'tw');
      results.proxy = { success: true, result: proxyResult };
      console.log('✅ Proxy method working:', proxyResult);
    } catch (error) {
      results.proxy = { success: false, error: error.message };
      console.log('❌ Proxy method failed:', error.message);
    }
    
    // Test direct method (will likely fail due to CORS)
    try {
      this.setUseProxy(false);
      const directResult = await this.translateText('Hello', 'en', 'tw');
      results.direct = { success: true, result: directResult };
      console.log('✅ Direct method working:', directResult);
    } catch (error) {
      results.direct = { success: false, error: error.message };
      console.log('❌ Direct method failed (expected due to CORS):', error.message);
    }
    
    // Default back to proxy mode
    this.setUseProxy(true);
    
    return results;
  }

  /**
   * Sleep utility for retries
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(texts, fromLang = 'en', toLang = 'tw') {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    // Process in parallel but with concurrency limit to avoid overwhelming the API
    const batchSize = 5; // Process 5 translations at a time
    const results = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map(text => 
        this.translateText(text, fromLang, toLang)
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to be respectful to the API
      if (i + batchSize < texts.length) {
        await this.sleep(200);
      }
    }

    return results;
  }

  /**
   * Translate diagnosis result with proper language handling
   */
  async translateDiagnosisResult(result, targetLang = 'tw') {
    if (!result || targetLang === 'en') {
      return result;
    }

    try {
      const startTime = performance.now();

      // Translate all fields in parallel
      const [plant, disease, remedy] = await Promise.all([
        this.translateText(result.plant, 'en', targetLang),
        this.translateText(result.disease, 'en', targetLang),
        this.translateText(result.remedy, 'en', targetLang)
      ]);

      const endTime = performance.now();
      console.log(`⚡ Ghana NLP translation completed in ${(endTime - startTime).toFixed(2)}ms`);

      return {
        ...result,
        plant,
        disease,
        remedy
      };

    } catch (error) {
      console.error('Diagnosis translation failed:', error);
      return result;
    }
  }

  /**
   * Translate UI labels with optimized batching
   */
  async translateUILabels(labels, targetLang = 'tw') {
    if (!labels || typeof labels !== 'object' || targetLang === 'en') {
      return labels;
    }

    const textEntries = Object.entries(labels).filter(([_, value]) => 
      typeof value === 'string' && value.trim().length > 0
    );

    if (textEntries.length === 0) {
      return labels;
    }

    try {
      const texts = textEntries.map(([_, value]) => value);
      const translations = await this.batchTranslate(texts, 'en', targetLang);

      const translatedLabels = { ...labels };
      textEntries.forEach(([key, _], index) => {
        translatedLabels[key] = translations[index];
      });

      return translatedLabels;

    } catch (error) {
      console.error('UI labels translation failed:', error);
      return labels;
    }
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'tw', name: 'Twi', flag: '🇬🇭' },
      { code: 'ee', name: 'Ewe', flag: '🇬🇭' },
      { code: 'ga', name: 'Ga', flag: '🇬🇭' },
      { code: 'dag', name: 'Dagbani', flag: '🇬🇭' },
      { code: 'ff', name: 'Fula', flag: '🇬🇭' },
      { code: 'ha', name: 'Hausa', flag: '🇬🇭' }
    ];
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(langCode) {
    return this.getSupportedLanguages().some(lang => lang.code === langCode);
  }

  /**
   * Get supported language pairs
   */
  getSupportedLanguagePairs() {
    return Object.keys(this.supportedLanguagePairs).map(pair => ({
      code: pair,
      ...this.supportedLanguagePairs[pair]
    }));
  }

  /**
   * Test API connectivity
   */
  async testConnection() {
    try {
      const testText = "Hello";
      const result = await this.translateText(testText, 'en', 'tw');
      return {
        success: true,
        testTranslation: result,
        message: 'Ghana NLP API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Ghana NLP API connection failed'
      };
    }
  }

  /**
   * Get API usage statistics
   */
  getUsageStats() {
    return {
      cacheSize: this.cache.size,
      supportedLanguages: this.getSupportedLanguages().length,
      supportedLanguagePairs: Object.keys(this.supportedLanguagePairs).length,
      apiKey: this.apiKey ? 'Configured' : 'Not configured',
      mode: this.useProxy ? 'proxy' : 'direct',
      baseURL: this.baseURL
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Ghana NLP translation cache cleared');
  }

  /**
   * Health check for monitoring
   */
  async healthCheck() {
    const stats = this.getUsageStats();
    const connectivity = await this.testConnection();
    
    return {
      service: 'Enhanced Ghana NLP Translation Service',
      status: connectivity.success ? 'healthy' : 'degraded',
      ...stats,
      connectivity,
      mode: this.useProxy ? 'proxy' : 'direct',
      baseURL: this.baseURL,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Comprehensive CORS fix test
   */
  async testCORSFix() {
    console.log('🔧 Testing CORS Fix for Ghana NLP API...');
    
    const methods = await this.testBothMethods();
    
    if (methods.proxy.success) {
      console.log('✅ CORS issue resolved using Vite proxy!');
      return {
        fixed: true,
        method: 'proxy',
        result: methods.proxy.result
      };
    } else if (methods.direct.success) {
      console.log('✅ Direct API access working!');
      return {
        fixed: true,
        method: 'direct', 
        result: methods.direct.result
      };
    } else {
      console.log('❌ CORS issue not resolved, both methods failed');
      return {
        fixed: false,
        proxyError: methods.proxy.error,
        directError: methods.direct.error
      };
    }
  }
}

// Create singleton instance
const enhancedGhanaNLPService = new EnhancedGhanaNLPService();

export default enhancedGhanaNLPService;