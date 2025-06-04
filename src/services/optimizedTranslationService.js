import axios from "axios";

class OptimizedTranslationService {
  constructor() {
    this.cache = new Map();
    this.supportedLanguages = [
      { code: "en", name: "English", flag: "🇬🇧" },
      { code: "tw", name: "Twi", flag: "🇬🇭" },
      { code: "ee", name: "Ewe", flag: "🇬🇭" },
      { code: "dag", name: "Dagbane", flag: "🇬🇭" },
    ];
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

    // Performance optimizations
    this.pendingRequests = new Map(); // Deduplicate identical requests
    this.requestQueue = []; // Queue for batch processing
    this.batchTimeout = null;
    this.batchDelay = 100; // ms to wait before batching
    this.maxBatchSize = 10; // Maximum texts per batch request
    this.fastTimeout = 3000; // Reduced timeout for faster failure detection

    this.loadCacheFromStorage();
    this.preloadCommonTerms();
  }

  /**
   * Preload common agricultural terms for instant access
   */
  async preloadCommonTerms() {
    try {
      const { default: agriculturalTerms } = await import(
        "../data/agriculturalTerms.json"
      );

      // Preload all terms into cache for instant lookup
      Object.values(agriculturalTerms).forEach((category) => {
        Object.values(category).forEach((termTranslations) => {
          this.supportedLanguages.forEach((lang) => {
            if (termTranslations.en && termTranslations[lang.code]) {
              const cacheKey = this.getCacheKey(
                termTranslations.en,
                "en",
                lang.code
              );
              this.cache.set(cacheKey, termTranslations[lang.code]);
            }
          });
        });
      });

      console.log(
        `🚀 Preloaded ${this.cache.size} agricultural terms for instant translation`
      );
    } catch (error) {
      console.warn("Could not preload agricultural terms:", error);
    }
  }

  /**
   * Load cached translations from localStorage
   */
  loadCacheFromStorage() {
    try {
      const cachedData = localStorage.getItem("translationCache");
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();

        if (now - timestamp < this.cacheTimeout) {
          this.cache = new Map([...this.cache, ...data]);
        } else {
          localStorage.removeItem("translationCache");
        }
      }
    } catch (error) {
      console.error("Error loading translation cache:", error);
    }
  }

  /**
   * Generate cache key for translation
   */
  getCacheKey(text, fromLang, toLang) {
    // Normalize text for better cache hits
    const normalizedText = text.toLowerCase().trim().replace(/\s+/g, " ");
    return `${fromLang}-${toLang}-${normalizedText}`;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(languageCode) {
    return this.supportedLanguages.some((lang) => lang.code === languageCode);
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Smart text chunking for long texts
   */
  chunkText(text, maxChunkSize = 200) {
    if (text.length <= maxChunkSize) {
      return [text];
    }

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const potentialChunk =
        currentChunk + (currentChunk ? ". " : "") + trimmedSentence;

      if (potentialChunk.length <= maxChunkSize) {
        currentChunk = potentialChunk;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + ".");
          currentChunk = trimmedSentence;
        } else {
          // Sentence too long, split by words
          const words = trimmedSentence.split(" ");
          let wordChunk = "";

          for (const word of words) {
            const potentialWordChunk =
              wordChunk + (wordChunk ? " " : "") + word;
            if (potentialWordChunk.length <= maxChunkSize) {
              wordChunk = potentialWordChunk;
            } else {
              if (wordChunk) chunks.push(wordChunk);
              wordChunk = word;
            }
          }
          if (wordChunk) currentChunk = wordChunk;
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk + (currentChunk.endsWith(".") ? "" : "."));
    }

    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Fast fallback translation using pre-defined terms
   */
  getInstantTranslation(text, targetLanguage) {
    // Check exact match first
    const exactKey = this.getCacheKey(text, "en", targetLanguage);
    if (this.cache.has(exactKey)) {
      return this.cache.get(exactKey);
    }

    // Check for partial matches in common terms
    const normalizedText = text.toLowerCase().trim();

    // Common disease patterns
    const diseasePatterns = [
      { pattern: /early blight/i, key: "early_blight" },
      { pattern: /late blight/i, key: "late_blight" },
      { pattern: /bacterial spot/i, key: "bacterial_spot" },
      { pattern: /leaf curl/i, key: "leaf_curl" },
      { pattern: /mosaic/i, key: "mosaic_virus" },
      { pattern: /healthy/i, key: "healthy" },
    ];

    for (const { pattern, key } of diseasePatterns) {
      if (pattern.test(text)) {
        const termKey = this.getCacheKey(
          key.replace("_", " "),
          "en",
          targetLanguage
        );
        if (this.cache.has(termKey)) {
          return this.cache.get(termKey);
        }
      }
    }

    return null;
  }

  /**
   * Deduplicated translation request
   */
  async translateText(text, targetLanguage, sourceLanguage = "en") {
    if (targetLanguage === sourceLanguage || !text) {
      return text;
    }

    if (!this.isLanguageSupported(targetLanguage)) {
      return text;
    }

    // Check cache first (instant)
    const cacheKey = this.getCacheKey(text, sourceLanguage, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check for instant translation (preloaded terms)
    const instant = this.getInstantTranslation(text, targetLanguage);
    if (instant) {
      return instant;
    }

    // Deduplicate identical pending requests
    const requestKey = `${text}-${sourceLanguage}-${targetLanguage}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    // Create new request
    const requestPromise = this.performTranslation(
      text,
      targetLanguage,
      sourceLanguage
    );
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Perform actual translation with optimizations
   */
  async performTranslation(text, targetLanguage, sourceLanguage) {
    const cacheKey = this.getCacheKey(text, sourceLanguage, targetLanguage);

    // For long texts, try chunking
    if (text.length > 300) {
      return this.translateLongText(text, targetLanguage, sourceLanguage);
    }

    try {
      // Use correct Ghana NLP API format and endpoint
      const langPair = `${sourceLanguage}-${targetLanguage}`;
      const response = await axios.post(
        "/api/ghana-nlp/translate",
        {
          in: text,
          lang: langPair,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: this.fastTimeout, // Reduced timeout
        }
      );

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
      console.warn(
        `Translation API failed for "${text.substring(0, 50)}...":`,
        error.message
      );

      // Fast fallback - return original text
      return text;
    }
  }

  /**
   * Optimized translation for long texts (like treatment recommendations)
   */
  async translateLongText(text, targetLanguage, sourceLanguage) {
    try {
      // 1. Check if we have any sentence-level cache hits
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
      const cachedTranslations = [];
      const needTranslation = [];

      for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (!trimmed) continue;

        const sentenceKey = this.getCacheKey(
          trimmed,
          sourceLanguage,
          targetLanguage
        );
        if (this.cache.has(sentenceKey)) {
          cachedTranslations.push(this.cache.get(sentenceKey));
        } else {
          needTranslation.push(trimmed);
          cachedTranslations.push(null); // Placeholder
        }
      }

      // 2. If everything is cached, return immediately
      if (needTranslation.length === 0) {
        return cachedTranslations.filter((t) => t !== null).join(". ") + ".";
      }

      // 3. For uncached parts, try pattern matching first
      const patternTranslated = needTranslation.map((sentence) => {
        return this.translateWithPatterns(sentence, targetLanguage) || sentence;
      });

      // 4. Combine cached and pattern-matched results
      let translationIndex = 0;
      const finalTranslations = cachedTranslations.map((cached) => {
        if (cached !== null) {
          return cached;
        } else {
          return patternTranslated[translationIndex++];
        }
      });

      const result = finalTranslations.join(". ") + ".";

      // Cache the full result
      const fullKey = this.getCacheKey(text, sourceLanguage, targetLanguage);
      this.cache.set(fullKey, result);
      this.saveCacheToStorage();

      return result;
    } catch (error) {
      console.error("Long text translation failed:", error);
      return text;
    }
  }

  /**
   * Pattern-based translation for common agricultural phrases
   */
  translateWithPatterns(text, targetLanguage) {
    const patterns = {
      tw: {
        "apply fungicide": "de nnuru a ɛko tia nnua nhwehwɛ",
        "remove affected leaves": "yi nhaban a ɛhyɛ no",
        "improve drainage": "ma nsuo ntwa yie",
        "ensure proper spacing": "hwɛ sɛ ntam kwan yɛ",
        "practice crop rotation": "di nnua sesa akyi",
        "use resistant varieties": "de nnua a wɔtumi ko tia yadeɛ",
        "apply organic pesticide": "de abɔdeɛ nnuru",
        "monitor regularly": "hwɛ daa",
        "maintain good hygiene": "di ahinya pa so",
      },
      ee: {
        "apply fungicide": "tsɔ aƒuiƒewuaƒe",
        "remove affected leaves": "ɖe aŋgbawo siwo dze",
        "improve drainage": "na tsi dodo nanyo",
        "ensure proper spacing": "kpɔ egbɔ be teƒe nanyo",
        "practice crop rotation": "wɔ nukuwo ɖɔɖo",
        "use resistant varieties": "zã nukuwo siwo te ŋu",
      },
    };

    const langPatterns = patterns[targetLanguage];
    if (!langPatterns) return null;

    const lowerText = text.toLowerCase();
    for (const [pattern, translation] of Object.entries(langPatterns)) {
      if (lowerText.includes(pattern)) {
        return text.replace(new RegExp(pattern, "gi"), translation);
      }
    }

    return null;
  }

  /**
   * Ultra-fast batch translation with parallel processing
   */
  async batchTranslate(texts, targetLanguage, sourceLanguage = "en") {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    // Use Promise.all for parallel processing instead of sequential
    const translations = await Promise.all(
      texts.map(async (text) => {
        try {
          return await this.translateText(text, targetLanguage, sourceLanguage);
        } catch (error) {
          console.warn(`Failed to translate "${text}":`, error);
          return text; // Fallback to original
        }
      })
    );

    return translations;
  }

  /**
   * Optimized diagnosis result translation
   */
  async translateDiagnosisResult(result, targetLanguage) {
    if (targetLanguage === "en" || !result) {
      return result;
    }

    try {
      // Translate all fields in parallel for maximum speed
      const [translatedPlant, translatedDisease, translatedRemedy] =
        await Promise.all([
          this.translateText(result.plant, targetLanguage),
          this.translateText(result.disease, targetLanguage),
          this.translateText(result.remedy, targetLanguage), // This will use chunking for long text
        ]);

      return {
        ...result,
        plant: translatedPlant,
        disease: translatedDisease,
        remedy: translatedRemedy,
      };
    } catch (error) {
      console.error("Error translating diagnosis result:", error);
      return result;
    }
  }

  /**
   * Optimized UI labels translation
   */
  async translateUILabels(labels, targetLanguage) {
    if (targetLanguage === "en" || !labels || typeof labels !== "object") {
      return labels;
    }

    // Extract all text values for batch translation
    const textEntries = Object.entries(labels).filter(
      ([_, value]) => typeof value === "string"
    );
    const texts = textEntries.map(([_, value]) => value);

    // Batch translate all at once
    const translations = await this.batchTranslate(texts, targetLanguage);

    // Reconstruct the labels object
    const translatedLabels = { ...labels };
    textEntries.forEach(([key, _], index) => {
      translatedLabels[key] = translations[index];
    });

    return translatedLabels;
  }

  /**
   * Save cache to localStorage (debounced for performance)
   */
  saveCacheToStorage() {
    // Debounce cache saving to avoid excessive localStorage writes
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try {
        const cacheData = {
          data: Array.from(this.cache.entries()),
          timestamp: Date.now(),
        };
        localStorage.setItem("translationCache", JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving translation cache:", error);
      }
    }, 1000);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      lastUpdated: localStorage.getItem("translationCache")
        ? JSON.parse(localStorage.getItem("translationCache")).timestamp
        : null,
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
    localStorage.removeItem("translationCache");
  }
}

// Create singleton instance
const optimizedTranslationService = new OptimizedTranslationService();

export default optimizedTranslationService;
