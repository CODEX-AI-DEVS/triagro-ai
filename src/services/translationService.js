import axios from 'axios';
import offlineTranslationService from './offlineTranslationService';
import { ghanaianLanguages } from '../data/ghanaianLanguages';

// Ghana NLP Translation Service with offline fallback
class TranslationService {
  constructor() {
    this.apiKey = import.meta.env.VITE_NLP_PRIMARY_KEY || 'f61d93ed885e46629af097304e12d297';
    this.baseUrl = '/api/translate';
    this.ttsUrl = '/api/tts';
    
    // Use comprehensive language data
    this.languages = ghanaianLanguages.languages;

    // Translation cache to reduce API calls
    this.cache = new Map();
    
    // Track online/offline status
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.languages;
  }

  // Get user's preferred language from localStorage or browser
  getUserLanguage() {
    const stored = localStorage.getItem('preferredLanguage');
    if (stored && this.languages[stored]) {
      return stored;
    }
    
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0];
    return this.languages[browserLang] ? browserLang : 'en';
  }

  // Set user's preferred language
  setUserLanguage(langCode) {
    if (this.languages[langCode]) {
      localStorage.setItem('preferredLanguage', langCode);
      return true;
    }
    return false;
  }

  // Translate text with offline fallback
  async translate(text, targetLang = 'tw', sourceLang = 'en') {
    if (!text || targetLang === sourceLang) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLang}_${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // If offline or API fails, use offline translation
    if (!this.isOnline) {
      const offlineTranslation = offlineTranslationService.translateOffline(text, sourceLang, targetLang);
      this.cache.set(cacheKey, offlineTranslation);
      return offlineTranslation;
    }

    try {
      const response = await axios.post(this.baseUrl, {
        in: text,
        lang: `${sourceLang}-${targetLang}`
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.apiKey
        },
        timeout: 5000 // 5 second timeout
      });

      const translatedText = response.data;
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation API error, falling back to offline:', error);
      // Fallback to offline translation
      const offlineTranslation = offlineTranslationService.translateOffline(text, sourceLang, targetLang);
      this.cache.set(cacheKey, offlineTranslation);
      return offlineTranslation;
    }
  }

  // Translate disease detection results with offline fallback
  async translateDiseaseResults(results, targetLang) {
    if (targetLang === 'en') {
      return results;
    }

    // If offline, use offline translation service
    if (!this.isOnline) {
      const offlineResults = offlineTranslationService.translateDiseaseResultsOffline(results, targetLang);
      return {
        ...results,
        ...offlineResults,
        originalLanguage: 'en',
        translatedLanguage: targetLang
      };
    }

    try {
      const [plant, disease, remedy] = await Promise.all([
        this.translate(results.plant, targetLang),
        this.translate(results.disease, targetLang),
        this.translate(results.remedy, targetLang)
      ]);

      return {
        ...results,
        plant,
        disease,
        remedy,
        originalLanguage: 'en',
        translatedLanguage: targetLang,
        translationType: 'online'
      };
    } catch (error) {
      console.error('Disease results translation error, using offline fallback:', error);
      const offlineResults = offlineTranslationService.translateDiseaseResultsOffline(results, targetLang);
      return {
        ...results,
        ...offlineResults,
        originalLanguage: 'en',
        translatedLanguage: targetLang
      };
    }
  }

  // Text to speech with fallback to browser TTS
  async textToSpeech(text, language = 'en') {
    // First try Ghana NLP TTS API
    if (this.isOnline) {
      try {
        const response = await axios.post(this.ttsUrl, {
          text: text,
          language: language
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': this.apiKey
          },
          responseType: 'blob',
          timeout: 10000 // 10 second timeout
        });

        // Create audio URL from blob
        const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        return { url: audioUrl, type: 'api' };
      } catch (error) {
        console.error('Ghana NLP TTS error, falling back to browser TTS:', error);
      }
    }

    // Fallback to browser's built-in TTS
    if ('speechSynthesis' in window) {
      try {
        // Create a promise-based wrapper for speechSynthesis
        return new Promise((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Set language based on our language code
          const langMap = {
            'en': 'en-US',
            'tw': 'en-GH', // Use Ghanaian English as fallback for Twi
            'ee': 'en-GH',
            'gaa': 'en-GH',
            'dag': 'en-GH',
            'ha': 'ha-NG', // Hausa (Nigeria)
            'fat': 'en-GH',
            'nzi': 'en-GH'
          };
          
          utterance.lang = langMap[language] || 'en-US';
          utterance.rate = 0.9; // Slightly slower for clarity
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          // Return a function that will speak when called
          resolve({
            speak: () => window.speechSynthesis.speak(utterance),
            cancel: () => window.speechSynthesis.cancel(),
            type: 'browser'
          });
        });
      } catch (error) {
        console.error('Browser TTS error:', error);
        return null;
      }
    }
    
    return null;
  }

  // Get greeting in different languages
  getGreeting(langCode) {
    const greetings = {
      en: 'Good morning',
      tw: 'Maakye',
      ee: 'Ŋdi',
      gaa: 'Ojekoo',
      dag: 'Dasuba',
      nzi: 'Maakye',
      fat: 'Maakye',
      ha: 'Ina kwana'
    };
    
    return greetings[langCode] || greetings.en;
  }

  // Get common agricultural terms translations
  getAgriculturalTerms(langCode) {
    const terms = {
      en: {
        plant: 'Plant',
        disease: 'Disease',
        treatment: 'Treatment',
        healthy: 'Healthy',
        infected: 'Infected',
        prevention: 'Prevention',
        farmer: 'Farmer',
        crop: 'Crop',
        harvest: 'Harvest',
        pesticide: 'Pesticide'
      },
      tw: {
        plant: 'Afifide',
        disease: 'Yare',
        treatment: 'Ayaresa',
        healthy: 'Apɔmuden',
        infected: 'Yare aka no',
        prevention: 'Siw',
        farmer: 'Okuani',
        crop: 'Nnɔbae',
        harvest: 'Twabere',
        pesticide: 'Nnwurammoa aduru'
      },
      // Add more languages as needed
    };
    
    return terms[langCode] || terms.en;
  }

  // Clear translation cache
  clearCache() {
    this.cache.clear();
  }
}

export default new TranslationService();