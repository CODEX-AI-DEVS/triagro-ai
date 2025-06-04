# 🌍 Translation System Guide

## Overview

The TriAgro translation system provides comprehensive support for Ghanaian languages in the disease diagnosis feature. It combines real-time API translation with pre-defined agricultural terms for optimal performance and accuracy.

## Supported Languages

- **English (en)** - Default language
- **Twi (tw)** - Most widely spoken Ghanaian language
- **Ewe (ee)** - Spoken in Volta region
- **Ga (ga)** - Spoken in Greater Accra region  
- **Dagbane (dag)** - Spoken in Northern region

## Features

### 🎯 Core Functionality
- **Real-time Translation**: Uses Ghana NLP API for live translation
- **Agricultural Terms Database**: Pre-translated farming vocabulary
- **Smart Caching**: Stores translations locally for performance
- **Fallback System**: Uses pre-defined terms when API fails
- **Batch Translation**: Translate multiple texts efficiently

### 🧩 Components

#### 1. TranslationService (`/src/services/translationService.js`)
Central service handling all translation logic:
```javascript
import translationService from '../services/translationService';

// Translate single text
const translated = await translationService.translateText('Tomato', 'tw');

// Translate diagnosis result
const result = { plant: 'Tomato', disease: 'Early Blight', remedy: '...' };
const translatedResult = await translationService.translateDiagnosisResult(result, 'tw');
```

#### 2. LanguageSelector Component (`/src/components/LanguageSelector.jsx`)
Language switching UI component:
```jsx
import LanguageSelector from './LanguageSelector';

<LanguageSelector
  currentLanguage={currentLanguage}
  onLanguageChange={changeLanguage}
  size="medium"
/>
```

#### 3. useTranslation Hook (`/src/hooks/useTranslation.js`)
React hook for translation state management:
```jsx
import useTranslation from '../hooks/useTranslation';

const {
  currentLanguage,
  changeLanguage,
  translateDiagnosisResult,
  isTranslating
} = useTranslation();
```

#### 4. Agricultural Terms Database (`/src/data/agriculturalTerms.json`)
Pre-translated farming vocabulary:
```json
{
  "commonDiseases": {
    "early_blight": {
      "en": "Early Blight",
      "tw": "Ntɛm Bonsra",
      "ee": "Gbãtɔ Dɔléléaƒe"
    }
  }
}
```

## Integration in CropDiagnosticTool

The disease diagnosis component now includes:

### Language Selection
- Language selector in the top-right corner
- Persists user's language preference
- Real-time language switching

### Translated Content
- Plant identification results
- Disease status information  
- Treatment recommendations
- UI labels and buttons
- Error messages
- Loading states

### Example Usage
```jsx
// Results display with translation
<p>{translatedResult?.plant || result.plant}</p>
<p>{translatedResult?.disease || result.disease}</p>
<p>{translatedResult?.remedy || result.remedy}</p>

// UI labels with translation
<h3>{uiLabels.plant_identified || "Plant Identified"}</h3>
<button>{uiLabels.diagnose || "Diagnose"}</button>
```

## Performance Features

### 🚀 Caching System
- **Browser Storage**: Translations cached in localStorage
- **24-hour TTL**: Cache expires after 1 day
- **Instant Access**: Cached translations load immediately
- **Smart Cleanup**: Automatic cache management

### 🔄 Fallback Strategy
1. **Cache Check**: Look for existing translation
2. **API Call**: Request from Ghana NLP API
3. **Fallback Terms**: Use pre-defined agricultural terms
4. **Original Text**: Return original if all else fails

### ⚡ Batch Processing
- Translate multiple texts in parallel
- Reduces API calls
- Optimizes performance

## Testing

### Manual Testing
```javascript
// Open browser console on the disease diagnosis page
import translationTest from '../utils/translationTest';

// Run all tests
await translationTest.runAllTests();

// Test specific functionality
await translationTest.testBasicTranslation();
await translationTest.testWithSampleData('tw');
```

### Test Categories
- ✅ Basic translation (single words)
- ✅ Diagnosis result translation (complex objects)
- ✅ Batch translation (multiple texts)
- ✅ Cache system (performance)
- ✅ Fallback system (reliability)

## API Configuration

### Ghana NLP API Setup
The system uses Ghana NLP translation service:
```javascript
// Configured in vite.config.js
"/api/translate": {
  target: "https://translation.ghananlp.org/translate",
  headers: {
    "Ocp-Apim-Subscription-Key": "your-api-key"
  }
}
```

### Environment Variables
```env
# Add to your .env file
VITE_GHANA_NLP_API_KEY=your-api-key-here
```

## Error Handling

### Graceful Degradation
- **API Failures**: Falls back to pre-defined terms
- **Network Issues**: Uses cached translations
- **Invalid Languages**: Defaults to English
- **Missing Translations**: Shows original text

### User Feedback
- Loading indicators during translation
- Error messages for translation failures
- Smooth fallback with no interruption

## Extending the System

### Adding New Languages
1. Update `supportedLanguages` in `translationService.js`
2. Add translations to `agriculturalTerms.json`
3. Test with new language code

### Adding New Terms
1. Edit `agriculturalTerms.json`
2. Add translations for all supported languages
3. Clear cache to see changes immediately

### Custom Translation Logic
```javascript
// Extend translation service
class CustomTranslationService extends TranslationService {
  async customTranslate(text, targetLang) {
    // Your custom logic here
    return await super.translateText(text, targetLang);
  }
}
```

## Best Practices

### Performance
- Use batch translation for multiple texts
- Implement proper loading states
- Cache translations appropriately
- Handle offline scenarios

### User Experience  
- Provide language selection in prominent location
- Show translation progress for longer operations
- Maintain context when switching languages
- Gracefully handle translation failures

### Development
- Test all language combinations
- Validate pre-defined terms regularly
- Monitor API usage and limits
- Update agricultural vocabulary as needed

## Troubleshooting

### Common Issues

**Translation not working:**
- Check API key configuration
- Verify network connectivity
- Clear translation cache
- Check browser console for errors

**Slow translations:**
- Use batch translation for multiple texts
- Check cache is enabled
- Consider pre-loading common terms

**Missing translations:**
- Add terms to `agriculturalTerms.json`
- Verify language code is correct
- Check fallback system is working

**Cache issues:**
- Clear localStorage
- Check cache timeout settings
- Verify browser storage availability

## Support

For issues with the translation system:
1. Check browser console for error messages
2. Test with sample data using translation test utility
3. Verify API configuration and connectivity
4. Review this documentation for proper usage

The translation system is designed to be robust, fast, and user-friendly, ensuring that Ghanaian farmers can access disease diagnosis information in their preferred language.