/**
 * Ultra-Fast Instant Translation Service
 * Provides immediate translations using pre-compiled templates and patterns
 * Falls back to optimized translation service only when necessary
 */

import optimizedTranslationService from './optimizedTranslationService';

class InstantTranslationService {
  constructor() {
    this.templateCache = new Map();
    this.phraseCache = new Map();
    this.diseasePatterns = new Map();
    this.isInitialized = false;
    
    this.initialize();
  }

  /**
   * Initialize with pre-compiled translations
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load treatment templates
      const { treatmentTemplates, commonPhrases } = await import('../data/treatmentTemplates.json');
      
      // Compile disease patterns for instant matching
      this.compileDiseasePatterns(treatmentTemplates);
      
      // Cache common phrases
      this.cacheCommonPhrases(commonPhrases);
      
      this.isInitialized = true;
      console.log('🚀 Instant Translation Service initialized with', this.templateCache.size, 'templates');
      
    } catch (error) {
      console.error('Failed to initialize instant translation service:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Compile disease patterns for instant recognition
   */
  compileDiseasePatterns(treatmentTemplates) {
    const patterns = [
      // Fungal diseases
      { regex: /potato.?early.?blight/i, template: treatmentTemplates.fungal_diseases.potato_early_blight },
      { regex: /early.?blight/i, template: treatmentTemplates.fungal_diseases.early_blight },
      { regex: /late.?blight/i, template: treatmentTemplates.fungal_diseases.late_blight },
      { regex: /powdery.?mildew/i, template: treatmentTemplates.fungal_diseases.powdery_mildew },
      { regex: /target.?spot|tomato.?target.?spot/i, template: treatmentTemplates.fungal_diseases.target_spot },
      
      // Bacterial diseases
      { regex: /bacterial.?spot/i, template: treatmentTemplates.bacterial_diseases.bacterial_spot },
      { regex: /bacterial.?wilt/i, template: treatmentTemplates.bacterial_diseases.bacterial_wilt },
      
      // Viral diseases
      { regex: /mosaic.?virus|mosaic/i, template: treatmentTemplates.viral_diseases.mosaic_virus },
      { regex: /leaf.?curl/i, template: treatmentTemplates.viral_diseases.leaf_curl },
      
      // Nutritional
      { regex: /nitrogen.?deficiency/i, template: treatmentTemplates.nutritional_issues.nitrogen_deficiency },
      { regex: /phosphorus.?deficiency/i, template: treatmentTemplates.nutritional_issues.phosphorus_deficiency },
      
      // Healthy/General
      { regex: /healthy|no.?disease/i, template: treatmentTemplates.general_care.healthy_plant },
      { regex: /prevention|preventive/i, template: treatmentTemplates.general_care.prevention }
    ];

    patterns.forEach(({ regex, template }) => {
      this.diseasePatterns.set(regex, template);
    });
  }

  /**
   * Cache common phrases for instant replacement
   */
  cacheCommonPhrases(commonPhrases) {
    Object.entries(commonPhrases).forEach(([phrase, translations]) => {
      this.phraseCache.set(phrase.toLowerCase(), translations);
    });
  }

  /**
   * Ultra-fast disease treatment translation
   */
  async translateTreatmentInstantly(treatmentText, diseaseType, targetLanguage) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (targetLanguage === 'en') {
      return treatmentText;
    }

    // Try exact template match first (instant)
    for (const [regex, template] of this.diseasePatterns) {
      if (regex.test(diseaseType) || regex.test(treatmentText)) {
        if (template[targetLanguage]) {
          return template[targetLanguage];
        }
      }
    }

    // Try phrase-by-phrase replacement (very fast)
    const rapidTranslation = this.translateWithPhraseReplacement(treatmentText, targetLanguage);
    if (rapidTranslation !== treatmentText) {
      return rapidTranslation;
    }

    // Fall back to optimized service for unknown treatments
    return await optimizedTranslationService.translateText(treatmentText, targetLanguage);
  }

  /**
   * Phrase-by-phrase rapid translation
   */
  translateWithPhraseReplacement(text, targetLanguage) {
    let translatedText = text;

    // Replace common agricultural phrases
    for (const [englishPhrase, translations] of this.phraseCache) {
      if (translations[targetLanguage]) {
        const regex = new RegExp(`\\b${englishPhrase}\\b`, 'gi');
        translatedText = translatedText.replace(regex, translations[targetLanguage]);
      }
    }

    // Additional rapid replacements for common terms
    const rapidReplacements = this.getRapidReplacements(targetLanguage);
    for (const [english, translated] of rapidReplacements) {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    }

    return translatedText;
  }

  /**
   * Get rapid word replacements for common agricultural terms
   */
  getRapidReplacements(targetLanguage) {
    const replacements = {
      'tw': new Map([
        ['fungicide', 'nnuru a ɛko tia nnua nhwehwɛ'],
        ['pesticide', 'mmoa kɔmi nnuru'],
        ['fertilizer', 'wura'],
        ['leaves', 'nhaban'],
        ['plants', 'nnua'],
        ['water', 'nsuo'],
        ['soil', 'asase'],
        ['drainage', 'nsuo ntwa'],
        ['spacing', 'ntam kwan'],
        ['rotation', 'sesa'],
        ['infected', 'a yadeɛ ato mu'],
        ['affected', 'a ɛhyɛ'],
        ['healthy', 'a ho yɛ den'],
        ['disease', 'yadeɛ'],
        ['symptoms', 'nsɛnkyerɛnne']
      ]),
      'ee': new Map([
        ['fungicide', 'aƒuiƒewuaƒe'],
        ['pesticide', 'nudzodzoe wuaƒe'],
        ['fertilizer', 'anyigbakaka'],
        ['leaves', 'aŋgbawo'],
        ['plants', 'nukuwo'],
        ['water', 'tsi'],
        ['soil', 'anyigba'],
        ['drainage', 'tsi dodo'],
        ['spacing', 'didiƒe'],
        ['rotation', 'ɖɔɖo'],
        ['infected', 'siwo dze'],
        ['affected', 'siwo dze'],
        ['healthy', 'le dedie me'],
        ['disease', 'dɔléléaƒe'],
        ['symptoms', 'dzesiwo']
      ]),
      'ga': new Map([
        ['fungicide', 'gbomo kɔmi aduru'],
        ['pesticide', 'mmoa kɔmi aduru'],
        ['fertilizer', 'wula'],
        ['leaves', 'lɛ'],
        ['plants', 'nua'],
        ['water', 'nsu'],
        ['soil', 'asase'],
        ['drainage', 'nsu dodo'],
        ['spacing', 'ntam kwan'],
        ['rotation', 'yɛmli'],
        ['infected', 'siwo ayaresa ato wɔn mu'],
        ['affected', 'siwo ayaresa kɛ'],
        ['healthy', 'a ho yɛ dɛn'],
        ['disease', 'ayaresa'],
        ['symptoms', 'nsɛnkyerɛnne']
      ]),
      'dag': new Map([
        ['fungicide', 'naŋmaariya kɔmi doyuli'],
        ['pesticide', 'yayili kɔmi doyuli'],
        ['fertilizer', 'wula'],
        ['leaves', 'gbaŋa'],
        ['plants', 'gbuli'],
        ['water', 'kɔm'],
        ['soil', 'tɔɣ'],
        ['drainage', 'kɔm dondoli'],
        ['spacing', 'ntam-kwan'],
        ['rotation', 'yɛmli'],
        ['infected', 'sibi naŋmaariya nyɛla'],
        ['affected', 'sibi naŋmaariya nyɛla'],
        ['healthy', 'siɣisim'],
        ['disease', 'naŋmaariya'],
        ['symptoms', 'tontonni']
      ])
    };

    return replacements[targetLanguage] || new Map();
  }

  /**
   * Lightning-fast diagnosis result translation
   */
  async translateDiagnosisInstantly(result, targetLanguage) {
    if (targetLanguage === 'en' || !result) {
      return result;
    }

    const startTime = performance.now();

    try {
      // Translate plant and disease names (usually cached/instant)
      const [plantPromise, diseasePromise] = await Promise.all([
        optimizedTranslationService.translateText(result.plant, targetLanguage),
        optimizedTranslationService.translateText(result.disease, targetLanguage)
      ]);

      // Use instant treatment translation
      const remedyTranslation = await this.translateTreatmentInstantly(
        result.remedy, 
        result.disease, 
        targetLanguage
      );

      const endTime = performance.now();
      console.log(`⚡ Instant translation completed in ${(endTime - startTime).toFixed(2)}ms`);

      return {
        ...result,
        plant: plantPromise,
        disease: diseasePromise,
        remedy: remedyTranslation
      };
    } catch (error) {
      console.error('Instant translation failed, falling back:', error);
      return await optimizedTranslationService.translateDiagnosisResult(result, targetLanguage);
    }
  }

  /**
   * Get instant translation for text (used by hybrid service)
   */
  getInstantTranslation(text, targetLanguage) {
    if (targetLanguage === 'en' || !text) {
      return null;
    }

    // Check phrase cache for exact matches
    const normalizedText = text.toLowerCase().trim();
    if (this.phraseCache.has(normalizedText)) {
      const translations = this.phraseCache.get(normalizedText);
      if (translations[targetLanguage]) {
        return translations[targetLanguage];
      }
    }

    // Try rapid replacements for single words
    const rapidReplacements = this.getRapidReplacements(targetLanguage);
    if (rapidReplacements.has(normalizedText)) {
      return rapidReplacements.get(normalizedText);
    }

    return null;
  }

  /**
   * Translate UI labels instantly
   */
  async translateUILabels(labels, targetLanguage) {
    if (targetLanguage === 'en' || !labels || typeof labels !== 'object') {
      return labels;
    }

    const translatedLabels = { ...labels };
    
    for (const [key, value] of Object.entries(labels)) {
      if (typeof value === 'string') {
        // Try instant translation first
        const instantTranslation = this.getInstantTranslation(value, targetLanguage);
        if (instantTranslation) {
          translatedLabels[key] = instantTranslation;
        } else {
          // Fall back to optimized service
          translatedLabels[key] = await optimizedTranslationService.translateText(value, targetLanguage);
        }
      } else {
        translatedLabels[key] = value;
      }
    }

    return translatedLabels;
  }

  /**
   * Clear cache if method exists
   */
  clearCache() {
    this.templateCache.clear();
    this.phraseCache.clear();
    console.log('Instant translation cache cleared');
  }

  /**
   * Get translation performance metrics
   */
  getPerformanceMetrics() {
    return {
      templatesLoaded: this.diseasePatterns.size,
      phrasesLoaded: this.phraseCache.size,
      isInitialized: this.isInitialized,
      cacheHitRate: this.getCacheHitRate(),
      cacheSize: this.phraseCache.size + this.templateCache.size
    };
  }

  /**
   * Calculate cache hit rate
   */
  getCacheHitRate() {
    const stats = optimizedTranslationService.getCacheStats();
    return stats.size > 0 ? (stats.size / (stats.size + stats.pendingRequests)) * 100 : 0;
  }

  /**
   * Pre-warm cache with common diagnosis results
   */
  async preWarmCache() {
    const commonResults = [
      { plant: 'Tomato', disease: 'Early Blight', remedy: 'Apply fungicide and improve air circulation' },
      { plant: 'Maize', disease: 'Leaf Curl', remedy: 'Use resistant varieties and control insects' },
      { plant: 'Pepper', disease: 'Bacterial Spot', remedy: 'Apply copper spray and practice crop rotation' },
      { plant: 'Cassava', disease: 'Healthy', remedy: 'Continue monitoring and good practices' }
    ];

    const languages = ['tw', 'ee', 'ga', 'dag'];

    console.log('🔥 Pre-warming translation cache...');
    
    for (const lang of languages) {
      await Promise.all(
        commonResults.map(result => this.translateDiagnosisInstantly(result, lang))
      );
    }

    console.log('✅ Translation cache pre-warmed for instant responses');
  }

  /**
   * Test translation speed
   */
  async testTranslationSpeed() {
    const testResult = {
      plant: 'Tomato',
      disease: 'Early Blight',
      remedy: 'Apply copper-based fungicide every 7-10 days. Remove affected leaves and improve air circulation between plants.'
    };

    const results = {};

    for (const lang of ['tw', 'ee', 'ga', 'dag']) {
      const startTime = performance.now();
      await this.translateDiagnosisInstantly(testResult, lang);
      const endTime = performance.now();
      results[lang] = `${(endTime - startTime).toFixed(2)}ms`;
    }

    console.log('🏃‍♂️ Translation Speed Test Results:', results);
    return results;
  }
}

// Create singleton instance
const instantTranslationService = new InstantTranslationService();

export default instantTranslationService;