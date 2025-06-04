/**
 * Translation System Test Utility
 * This file contains functions to test the translation functionality
 */

import translationService from '../services/translationService';

/**
 * Test basic translation functionality
 */
export const testBasicTranslation = async () => {
  console.log('🧪 Testing Basic Translation...');
  
  try {
    // Test English to Twi
    const englishText = "Tomato";
    const twiTranslation = await translationService.translateText(englishText, 'tw');
    console.log(`✅ English "${englishText}" → Twi "${twiTranslation}"`);
    
    // Test with disease name
    const diseaseText = "Early Blight";
    const diseaseTranslation = await translationService.translateText(diseaseText, 'tw');
    console.log(`✅ Disease "${diseaseText}" → Twi "${diseaseTranslation}"`);
    
    return true;
  } catch (error) {
    console.error('❌ Basic translation test failed:', error);
    return false;
  }
};

/**
 * Test diagnosis result translation
 */
export const testDiagnosisTranslation = async () => {
  console.log('🧪 Testing Diagnosis Result Translation...');
  
  try {
    const sampleResult = {
      plant: "Tomato",
      disease: "Early Blight", 
      remedy: "Apply fungicide preventively and ensure proper spacing between plants for air circulation",
      confidence: 0.89
    };
    
    // Test translation to different languages
    const languages = ['tw', 'ee', 'ga', 'dag'];
    
    for (const lang of languages) {
      const translated = await translationService.translateDiagnosisResult(sampleResult, lang);
      console.log(`✅ Translated to ${lang}:`, {
        plant: translated.plant,
        disease: translated.disease,
        remedy: translated.remedy.substring(0, 50) + '...'
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Diagnosis translation test failed:', error);
    return false;
  }
};

/**
 * Test batch translation
 */
export const testBatchTranslation = async () => {
  console.log('🧪 Testing Batch Translation...');
  
  try {
    const texts = [
      "Plant Identified",
      "Disease Status", 
      "Treatment Recommendations",
      "Healthy",
      "Confidence"
    ];
    
    const translations = await translationService.batchTranslate(texts, 'tw');
    
    texts.forEach((text, index) => {
      console.log(`✅ "${text}" → "${translations[index]}"`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Batch translation test failed:', error);
    return false;
  }
};

/**
 * Test cache functionality
 */
export const testCacheSystem = async () => {
  console.log('🧪 Testing Cache System...');
  
  try {
    const testText = "Test Cache";
    
    // First translation (should hit API)
    console.time('First translation');
    const first = await translationService.translateText(testText, 'tw');
    console.timeEnd('First translation');
    
    // Second translation (should use cache)
    console.time('Cached translation');
    const second = await translationService.translateText(testText, 'tw');
    console.timeEnd('Cached translation');
    
    const stats = translationService.getCacheStats();
    console.log(`✅ Cache working: ${first === second}, Cache size: ${stats.size}`);
    
    return first === second;
  } catch (error) {
    console.error('❌ Cache test failed:', error);
    return false;
  }
};

/**
 * Test fallback functionality with pre-defined terms
 */
export const testFallbackSystem = async () => {
  console.log('🧪 Testing Fallback System...');
  
  try {
    // Test with a term that should be in our agricultural terms database
    const fallbackTest = await translationService.getFallbackTranslation('Tomato', 'tw');
    console.log(`✅ Fallback for "Tomato" → "${fallbackTest}"`);
    
    // Test with unknown term
    const unknownTest = await translationService.getFallbackTranslation('Unknown Term', 'tw');
    console.log(`✅ Unknown term fallback: "${unknownTest}"`);
    
    return true;
  } catch (error) {
    console.error('❌ Fallback test failed:', error);
    return false;
  }
};

/**
 * Run all translation tests
 */
export const runAllTests = async () => {
  console.log('🚀 Starting Translation System Tests...\n');
  
  const tests = [
    { name: 'Basic Translation', fn: testBasicTranslation },
    { name: 'Diagnosis Translation', fn: testDiagnosisTranslation },
    { name: 'Batch Translation', fn: testBatchTranslation },
    { name: 'Cache System', fn: testCacheSystem },
    { name: 'Fallback System', fn: testFallbackSystem }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      console.log(`${result ? '✅' : '❌'} ${test.name} ${result ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      console.error(`❌ ${test.name} FAILED:`, error);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  console.log(`${passed}/${total} tests passed`);
  
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  return { passed, total, results };
};

/**
 * Sample data for testing
 */
export const sampleDiagnosisResults = [
  {
    plant: "Tomato",
    disease: "Early Blight",
    remedy: "Apply copper-based fungicide every 7-10 days. Remove affected leaves and improve air circulation.",
    confidence: 0.92
  },
  {
    plant: "Maize",
    disease: "Leaf Curl",
    remedy: "Use resistant varieties and apply organic pesticides. Ensure proper drainage and spacing.",
    confidence: 0.87
  },
  {
    plant: "Pepper",
    disease: "Bacterial Spot", 
    remedy: "Apply copper spray and remove infected plants. Practice crop rotation and avoid overhead watering.",
    confidence: 0.94
  },
  {
    plant: "Cassava",
    disease: "Healthy",
    remedy: "Plant appears healthy. Continue regular monitoring and good agricultural practices.",
    confidence: 0.98
  }
];

/**
 * Helper function to test with sample data
 */
export const testWithSampleData = async (languageCode = 'tw') => {
  console.log(`🧪 Testing with sample data in ${languageCode}...`);
  
  for (const sample of sampleDiagnosisResults) {
    console.log(`\n--- Testing: ${sample.plant} - ${sample.disease} ---`);
    try {
      const translated = await translationService.translateDiagnosisResult(sample, languageCode);
      console.log('✅ Original:', sample);
      console.log('✅ Translated:', translated);
    } catch (error) {
      console.error('❌ Translation failed:', error);
    }
  }
};

export default {
  testBasicTranslation,
  testDiagnosisTranslation,
  testBatchTranslation,
  testCacheSystem,
  testFallbackSystem,
  runAllTests,
  testWithSampleData,
  sampleDiagnosisResults
};