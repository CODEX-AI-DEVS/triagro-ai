import { useState, useEffect, useCallback, useRef } from 'react';
import hybridTranslationService from '../services/hybridTranslationService';
import enhancedGhanaNLPService from '../services/enhancedGhanaNLPService';

/**
 * Custom hook for handling translations in React components
 * @param {string} initialLanguage - Initial language code
 * @returns {object} Translation utilities and state
 */
export const useTranslation = (initialLanguage = 'en') => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);
  const [cachedTranslations, setCachedTranslations] = useState(new Map());
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Load saved language preference on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage && hybridTranslationService.isLanguageSupported(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }
      
      // Initialize hybrid translation service
      hybridTranslationService.initialize();
    } catch (error) {
      console.error('Error loading saved language preference:', error);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem('preferredLanguage', currentLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, [currentLanguage]);

  /**
   * Change current language
   */
  const changeLanguage = useCallback((languageCode) => {
    if (hybridTranslationService.isLanguageSupported(languageCode)) {
      setCurrentLanguage(languageCode);
      setTranslationError(null);
    } else {
      console.warn(`Unsupported language: ${languageCode}`);
    }
  }, []);

  /**
   * Translate a single text
   */
  const translate = useCallback(async (text, targetLanguage = null, sourceLanguage = 'en') => {
    const lang = targetLanguage || currentLanguage;
    
    // Return original text if target language is the same as source
    if (lang === sourceLanguage || !text) {
      return text;
    }

    // Check cache first
    const cacheKey = `${sourceLanguage}-${lang}-${text}`;
    if (cachedTranslations.has(cacheKey)) {
      return cachedTranslations.get(cacheKey);
    }

    try {
      setIsTranslating(true);
      setTranslationError(null);

      const translatedText = await hybridTranslationService.translateText(text, sourceLanguage, lang);
      
      // Update cache if component is still mounted
      if (isMountedRef.current) {
        setCachedTranslations(prev => new Map(prev.set(cacheKey, translatedText)));
      }

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      if (isMountedRef.current) {
        setTranslationError(error.message);
      }
      return text; // Return original text on error
    } finally {
      if (isMountedRef.current) {
        setIsTranslating(false);
      }
    }
  }, [currentLanguage, cachedTranslations]);

  /**
   * Translate multiple texts at once
   */
  const batchTranslate = useCallback(async (texts, targetLanguage = null, sourceLanguage = 'en') => {
    const lang = targetLanguage || currentLanguage;
    
    if (lang === sourceLanguage || !Array.isArray(texts)) {
      return texts;
    }

    try {
      setIsTranslating(true);
      setTranslationError(null);

      const translations = await hybridTranslationService.batchTranslate(texts, sourceLanguage, lang);
      
      // Cache results
      if (isMountedRef.current) {
        setCachedTranslations(prev => {
          const newCache = new Map(prev);
          texts.forEach((text, index) => {
            const cacheKey = `${sourceLanguage}-${lang}-${text}`;
            newCache.set(cacheKey, translations[index]);
          });
          return newCache;
        });
      }

      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      if (isMountedRef.current) {
        setTranslationError(error.message);
      }
      return texts; // Return original texts on error
    } finally {
      if (isMountedRef.current) {
        setIsTranslating(false);
      }
    }
  }, [currentLanguage, cachedTranslations]);

  /**
   * Translate UI labels object
   */
  const translateLabels = useCallback(async (labels, targetLanguage = null) => {
    const lang = targetLanguage || currentLanguage;
    
    if (lang === 'en' || !labels || typeof labels !== 'object') {
      return labels;
    }

    try {
      setIsTranslating(true);
      setTranslationError(null);

      const translatedLabels = await hybridTranslationService.translateUILabels(labels, lang);
      return translatedLabels;
    } catch (error) {
      console.error('Labels translation error:', error);
      if (isMountedRef.current) {
        setTranslationError(error.message);
      }
      return labels;
    } finally {
      if (isMountedRef.current) {
        setIsTranslating(false);
      }
    }
  }, [currentLanguage]);

  /**
   * Translate diagnosis result
   */
  const translateDiagnosisResult = useCallback(async (result, targetLanguage = null) => {
    const lang = targetLanguage || currentLanguage;
    
    if (lang === 'en' || !result) {
      return result;
    }

    try {
      setIsTranslating(true);
      setTranslationError(null);

      // Use hybrid translation for optimal speed and accuracy
      const translatedResult = await hybridTranslationService.translateDiagnosisResult(result, lang);
      return translatedResult;
    } catch (error) {
      console.error('Diagnosis translation error:', error);
      if (isMountedRef.current) {
        setTranslationError(error.message);
      }
      return result;
    } finally {
      if (isMountedRef.current) {
        setIsTranslating(false);
      }
    }
  }, [currentLanguage]);

  /**
   * Get available languages
   */
  const getAvailableLanguages = useCallback(() => {
    return hybridTranslationService.getSupportedLanguages();
  }, []);

  /**
   * Clear translation cache
   */
  const clearCache = useCallback(() => {
    setCachedTranslations(new Map());
    hybridTranslationService.clearCache();
  }, []);

  /**
   * Get translation statistics
   */
  const getTranslationStats = useCallback(() => {
    return {
      cacheSize: cachedTranslations.size,
      currentLanguage,
      supportedLanguages: translationService.getSupportedLanguages().length,
      hybridStats: hybridTranslationService.getServiceStats()
    };
  }, [cachedTranslations.size, currentLanguage]);

  /**
   * Check if a language is supported
   */
  const isLanguageSupported = useCallback((languageCode) => {
    return hybridTranslationService.isLanguageSupported(languageCode);
  }, []);

  /**
   * Get current language details
   */
  const getCurrentLanguageDetails = useCallback(() => {
    const languages = hybridTranslationService.getSupportedLanguages();
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  }, [currentLanguage]);

  /**
   * Simple translation function for quick use (with fallback)
   */
  const t = useCallback((key, fallback = key) => {
    // This is a synchronous version that uses pre-defined translations
    // For async translations, use the translate function
    if (currentLanguage === 'en') {
      return fallback;
    }

    // Try to get from cache first
    const cacheKey = `en-${currentLanguage}-${key}`;
    if (cachedTranslations.has(cacheKey)) {
      return cachedTranslations.get(cacheKey);
    }

    // Return fallback for now (async translation should be handled separately)
    return fallback;
  }, [currentLanguage, cachedTranslations]);

  return {
    // State
    currentLanguage,
    isTranslating,
    translationError,
    
    // Actions
    changeLanguage,
    translate,
    batchTranslate,
    translateLabels,
    translateDiagnosisResult,
    clearCache,
    
    // Utilities
    getAvailableLanguages,
    getTranslationStats,
    isLanguageSupported,
    getCurrentLanguageDetails,
    t,
    
    // Cache info
    cacheSize: cachedTranslations.size
  };
};

export default useTranslation;