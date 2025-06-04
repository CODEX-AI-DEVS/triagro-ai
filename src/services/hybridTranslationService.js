/**
 * Hybrid Translation Service
 * Combines Ghana NLP API with local optimizations for maximum speed and reliability
 * Uses the best of both instant templates and official Ghana NLP API
 */

import axios from 'axios';
import enhancedGhanaNLPService from './enhancedGhanaNLPService';
import instantTranslationService from './instantTranslationService';
import optimizedTranslationService from './optimizedTranslationService';

class HybridTranslationService {
  constructor() {
    this.cache = new Map();
    this.performanceMetrics = {
      instantHits: 0,
      ghanaNLPHits: 0,
      fallbackHits: 0,
      totalRequests: 0,
      averageSpeed: 0
    };
    
    this.initialize();
  }

  async initialize() {
    try {
      // Test Ghana NLP API connectivity
      const connectivity = await enhancedGhanaNLPService.testConnection();
      this.ghanaNLPAvailable = connectivity.success;
      
      if (this.ghanaNLPAvailable) {
        console.log('✅ Ghana NLP API connected successfully');
      } else {
        console.warn('⚠️ Ghana NLP API not available, using fallback services');
      }
      
      // Initialize instant service
      await instantTranslationService.initialize();
      
    } catch (error) {
      console.error('Hybrid translation service initialization failed:', error);
      this.ghanaNLPAvailable = false;
    }
  }

  /**
   * Main translation method with intelligent routing
   */
  async translateText(text, fromLang = 'en', toLang = 'tw') {
    const startTime = performance.now();
    this.performanceMetrics.totalRequests++;

    try {
      // Step 1: Try instant template/cache (0-5ms)
      const instantResult = await this.tryInstantTranslation(text, fromLang, toLang);
      if (instantResult.success) {
        this.recordMetrics('instant', startTime);
        return instantResult.translation;
      }

      // Step 2: Try Ghana NLP API (official, most accurate)
      if (this.ghanaNLPAvailable) {
        const ghanaNLPResult = await this.tryGhanaNLPTranslation(text, fromLang, toLang);
        if (ghanaNLPResult.success) {
          this.recordMetrics('ghanaNLP', startTime);
          return ghanaNLPResult.translation;
        }
      }

      // Step 3: Fallback to optimized service
      const fallbackResult = await this.tryFallbackTranslation(text, fromLang, toLang);
      this.recordMetrics('fallback', startTime);
      return fallbackResult.translation;

    } catch (error) {
      console.error('All translation methods failed:', error);
      return text; // Return original text as last resort
    }
  }

  /**
   * Try instant translation (templates, cache, phrase replacement)
   */
  async tryInstantTranslation(text, fromLang, toLang) {
    try {
      // Check instant service first
      const cacheKey = `instant-${fromLang}-${toLang}-${text.toLowerCase().trim()}`;
      if (this.cache.has(cacheKey)) {
        return { success: true, translation: this.cache.get(cacheKey) };
      }

      // Try instant service for disease treatments
      if (this.isDiseaseTreatment(text)) {
        const instantTranslation = await instantTranslationService.translateTreatmentInstantly(
          text, text, toLang
        );
        
        if (instantTranslation !== text) {
          this.cache.set(cacheKey, instantTranslation);
          return { success: true, translation: instantTranslation };
        }
      }

      // Try pre-loaded agricultural terms
      const termTranslation = await instantTranslationService.getInstantTranslation(text, toLang);
      if (termTranslation) {
        this.cache.set(cacheKey, termTranslation);
        return { success: true, translation: termTranslation };
      }

      return { success: false };

    } catch (error) {
      console.warn('Instant translation failed:', error);
      return { success: false };
    }
  }

  /**
   * Try Ghana NLP API translation
   */
  async tryGhanaNLPTranslation(text, fromLang, toLang) {
    try {
      const translation = await enhancedGhanaNLPService.translateText(text, fromLang, toLang);
      
      if (translation && translation !== text) {
        // Cache successful Ghana NLP translations
        const cacheKey = `ghananlp-${fromLang}-${toLang}-${text.toLowerCase().trim()}`;
        this.cache.set(cacheKey, translation);
        
        return { success: true, translation };
      }

      return { success: false };

    } catch (error) {
      console.warn('Ghana NLP API translation failed:', error);
      // Mark as temporarily unavailable if multiple failures
      this.handleGhanaNLPFailure(error);
      return { success: false };
    }
  }

  /**
   * Try fallback translation services
   */
  async tryFallbackTranslation(text, fromLang, toLang) {
    // First try instant translation again for any missed patterns
    try {
      const instantResult = await this.tryInstantTranslation(text, fromLang, toLang);
      if (instantResult.success) {
        return instantResult;
      }
    } catch (instantError) {
      console.warn('Instant fallback failed:', instantError);
    }

    // Try optimized service
    try {
      const translation = await optimizedTranslationService.translateText(text, toLang, fromLang);
      return { success: true, translation };
    } catch (error) {
      console.warn('Optimized service failed, trying legacy endpoint:', error);
      
      // Try legacy endpoint as final fallback
      try {
        const legacyTranslation = await this.tryLegacyEndpoint(text, fromLang, toLang);
        return { success: true, translation: legacyTranslation };
      } catch (legacyError) {
        console.warn('All translation methods failed, returning original text:', legacyError);
        return { success: true, translation: text }; // Return original as final fallback
      }
    }
  }

  /**
   * Try legacy translation endpoint
   */
  async tryLegacyEndpoint(text, fromLang, toLang) {
    const langPair = `${fromLang}-${toLang}`;
    
    const response = await axios.post('/api/translate', {
      in: text,
      lang: langPair
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });
    
    return typeof response.data === 'string' 
           ? response.data 
           : response.data.out || response.data.translated_text || response.data.translation || text;
  }

  /**
   * Check if text appears to be a disease treatment
   */
  isDiseaseTreatment(text) {
    const treatmentKeywords = [
      'apply', 'remove', 'spray', 'treat', 'fungicide', 'pesticide',
      'fertilizer', 'water', 'drainage', 'circulation', 'rotation',
      'prevent', 'control', 'monitor', 'ensure'
    ];
    
    const lowerText = text.toLowerCase();
    return treatmentKeywords.some(keyword => lowerText.includes(keyword)) && text.length > 20;
  }

  /**
   * Handle Ghana NLP API failures
   */
  handleGhanaNLPFailure(error) {
    const status = error.response?.status;
    
    // Temporarily disable Ghana NLP if too many failures
    if (status === 401 || status === 403) {
      console.error('Ghana NLP API authentication failed');
      this.ghanaNLPAvailable = false;
    } else if (status === 429) {
      console.warn('Ghana NLP API rate limit reached, temporarily disabling');
      this.ghanaNLPAvailable = false;
      // Re-enable after 5 minutes
      setTimeout(() => {
        this.ghanaNLPAvailable = true;
        console.log('Ghana NLP API re-enabled after rate limit cooldown');
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Record performance metrics
   */
  recordMetrics(method, startTime) {
    const duration = performance.now() - startTime;
    
    switch (method) {
      case 'instant':
        this.performanceMetrics.instantHits++;
        break;
      case 'ghanaNLP':
        this.performanceMetrics.ghanaNLPHits++;
        break;
      case 'fallback':
        this.performanceMetrics.fallbackHits++;
        break;
    }

    // Update rolling average
    const totalTime = this.performanceMetrics.averageSpeed * (this.performanceMetrics.totalRequests - 1);
    this.performanceMetrics.averageSpeed = (totalTime + duration) / this.performanceMetrics.totalRequests;
  }

  /**
   * Translate diagnosis result with hybrid approach
   */
  async translateDiagnosisResult(result, targetLang = 'tw') {
    if (!result || targetLang === 'en') {
      return result;
    }

    try {
      console.time('Hybrid Diagnosis Translation');

      // Try instant translation first for entire result
      const instantResult = await instantTranslationService.translateDiagnosisInstantly(result, targetLang);
      
      // If instant translation was successful (fast), use it
      if (this.isDiagnosisTranslationComplete(instantResult, result)) {
        console.timeEnd('Hybrid Diagnosis Translation');
        return instantResult;
      }

      // Otherwise, use Ghana NLP API for more accurate results
      let finalResult;
      if (this.ghanaNLPAvailable) {
        finalResult = await enhancedGhanaNLPService.translateDiagnosisResult(result, targetLang);
      } else {
        finalResult = await optimizedTranslationService.translateDiagnosisResult(result, targetLang);
      }

      console.timeEnd('Hybrid Diagnosis Translation');
      return finalResult;

    } catch (error) {
      console.error('Hybrid diagnosis translation failed:', error);
      return result;
    }
  }

  /**
   * Check if diagnosis translation is complete and accurate
   */
  isDiagnosisTranslationComplete(translated, original) {
    return translated.plant !== original.plant || 
           translated.disease !== original.disease || 
           translated.remedy !== original.remedy;
  }

  /**
   * Translate UI labels with optimization
   */
  async translateUILabels(labels, targetLang = 'tw') {
    if (!labels || typeof labels !== 'object' || targetLang === 'en') {
      return labels;
    }

    // First try instant translation for UI labels
    const instantLabels = await instantTranslationService.translateUILabels(labels, targetLang);
    
    // Check if instant translation was successful
    const labelsChanged = Object.keys(labels).some(key => 
      labels[key] !== instantLabels[key] && typeof labels[key] === 'string'
    );

    if (labelsChanged) {
      return instantLabels;
    }

    // Fall back to Ghana NLP API for better accuracy
    if (this.ghanaNLPAvailable) {
      return await enhancedGhanaNLPService.translateUILabels(labels, targetLang);
    }

    return await optimizedTranslationService.translateUILabels(labels, targetLang);
  }

  /**
   * Batch translate with intelligent routing
   */
  async batchTranslate(texts, fromLang = 'en', toLang = 'tw') {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    // Try instant translation for each text first
    const results = [];
    const remainingTexts = [];
    const remainingIndices = [];

    for (let i = 0; i < texts.length; i++) {
      const instantResult = await this.tryInstantTranslation(texts[i], fromLang, toLang);
      if (instantResult.success) {
        results[i] = instantResult.translation;
      } else {
        remainingTexts.push(texts[i]);
        remainingIndices.push(i);
      }
    }

    // Use Ghana NLP API for remaining texts
    if (remainingTexts.length > 0) {
      let remainingTranslations;
      
      if (this.ghanaNLPAvailable) {
        remainingTranslations = await enhancedGhanaNLPService.batchTranslate(
          remainingTexts, fromLang, toLang
        );
      } else {
        remainingTranslations = await optimizedTranslationService.batchTranslate(
          remainingTexts, toLang, fromLang
        );
      }

      // Fill in the remaining results
      remainingIndices.forEach((originalIndex, i) => {
        results[originalIndex] = remainingTranslations[i];
      });
    }

    return results;
  }

  /**
   * Get comprehensive service statistics
   */
  getServiceStats() {
    const ghanaNLPStats = enhancedGhanaNLPService.getUsageStats();
    const instantStats = instantTranslationService.getPerformanceMetrics();
    
    return {
      hybrid: {
        ...this.performanceMetrics,
        ghanaNLPAvailable: this.ghanaNLPAvailable,
        cacheSize: this.cache.size
      },
      ghanaNLP: ghanaNLPStats,
      instant: instantStats,
      totalCacheSize: this.cache.size + (instantStats.cacheSize || 0)
    };
  }

  /**
   * Get supported languages (union of all services)
   */
  getSupportedLanguages() {
    return enhancedGhanaNLPService.getSupportedLanguages();
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(langCode) {
    return enhancedGhanaNLPService.isLanguageSupported(langCode);
  }

  /**
   * Performance test
   */
  async performanceTest() {
    const testCases = [
      { text: 'Tomato', type: 'plant' },
      { text: 'Early Blight', type: 'disease' },
      { text: 'Apply copper-based fungicide every 7-10 days', type: 'treatment' },
      { text: 'Plant Identified', type: 'ui_label' }
    ];

    const results = {};

    for (const testCase of testCases) {
      const startTime = performance.now();
      const translation = await this.translateText(testCase.text, 'en', 'tw');
      const endTime = performance.now();
      
      results[testCase.type] = {
        original: testCase.text,
        translated: translation,
        duration: `${(endTime - startTime).toFixed(2)}ms`
      };
    }

    return results;
  }

  /**
   * Health check
   */
  async healthCheck() {
    const stats = this.getServiceStats();
    const ghanaNLPHealth = await enhancedGhanaNLPService.healthCheck();
    
    return {
      service: 'Hybrid Translation Service',
      status: this.ghanaNLPAvailable ? 'optimal' : 'degraded',
      performance: stats,
      ghanaNLP: ghanaNLPHealth,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    enhancedGhanaNLPService.clearCache();
    instantTranslationService.clearCache?.();
    optimizedTranslationService.clearCache();
    console.log('All translation caches cleared');
  }
}

// Create singleton instance
const hybridTranslationService = new HybridTranslationService();

export default hybridTranslationService;