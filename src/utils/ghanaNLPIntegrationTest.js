/**
 * Ghana NLP API Integration Testing & Monitoring
 * Comprehensive testing suite for the enhanced Ghana NLP integration
 */

import hybridTranslationService from '../services/hybridTranslationService';
import enhancedGhanaNLPService from '../services/enhancedGhanaNLPService';

/**
 * Test Ghana NLP API connectivity and basic functionality
 */
export async function testGhanaNLPConnectivity() {
  console.log('🔗 Testing Ghana NLP API Connectivity...');
  
  try {
    const healthCheck = await enhancedGhanaNLPService.healthCheck();
    console.log('Health Check Result:', healthCheck);
    
    if (healthCheck.connectivity.success) {
      console.log('✅ Ghana NLP API is connected and working');
      console.log(`Test Translation: "${healthCheck.connectivity.testTranslation}"`);
      return true;
    } else {
      console.log('❌ Ghana NLP API connection failed');
      console.log('Error:', healthCheck.connectivity.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Ghana NLP API test failed:', error);
    return false;
  }
}

/**
 * Test all supported language pairs
 */
export async function testAllLanguagePairs() {
  console.log('🌍 Testing All Language Pairs...');
  
  const testText = "Hello, how are you?";
  const languages = ['tw', 'ee', 'ga', 'dag', 'ff', 'ha'];
  const results = {};
  
  for (const targetLang of languages) {
    console.log(`\n--- Testing English to ${targetLang.toUpperCase()} ---`);
    
    try {
      const startTime = performance.now();
      const translation = await enhancedGhanaNLPService.translateText(testText, 'en', targetLang);
      const endTime = performance.now();
      
      results[targetLang] = {
        success: true,
        original: testText,
        translated: translation,
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        changed: translation !== testText
      };
      
      console.log(`✅ ${targetLang}: "${translation}" (${results[targetLang].duration})`);
      
    } catch (error) {
      results[targetLang] = {
        success: false,
        error: error.message,
        duration: 'N/A'
      };
      
      console.log(`❌ ${targetLang}: ${error.message}`);
    }
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Language Pair Test Summary:');
  Object.entries(results).forEach(([lang, result]) => {
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} ${lang}: ${result.duration}`);
  });
  
  return results;
}

/**
 * Test agricultural terminology translation accuracy
 */
export async function testAgriculturalTerms() {
  console.log('🌾 Testing Agricultural Terminology Translation...');
  
  const agriculturalTerms = [
    // Plants
    { text: "Tomato", category: "plants" },
    { text: "Maize", category: "plants" },
    { text: "Cassava", category: "plants" },
    { text: "Yam", category: "plants" },
    
    // Diseases
    { text: "Early Blight", category: "diseases" },
    { text: "Bacterial Spot", category: "diseases" },
    { text: "Leaf Curl", category: "diseases" },
    { text: "Mosaic Virus", category: "diseases" },
    
    // Treatments
    { text: "Apply fungicide", category: "treatments" },
    { text: "Remove infected leaves", category: "treatments" },
    { text: "Improve drainage", category: "treatments" },
    { text: "Use resistant varieties", category: "treatments" },
    
    // Complex sentences
    { 
      text: "Apply copper-based fungicide every 7-10 days and remove affected leaves to prevent disease spread", 
      category: "complex_treatment" 
    }
  ];
  
  const results = {};
  
  for (const term of agriculturalTerms) {
    console.log(`\n--- Testing: ${term.text} (${term.category}) ---`);
    
    const translations = {};
    
    for (const targetLang of ['tw', 'ee', 'ga']) {
      try {
        const startTime = performance.now();
        const translation = await enhancedGhanaNLPService.translateText(term.text, 'en', targetLang);
        const endTime = performance.now();
        
        translations[targetLang] = {
          text: translation,
          duration: endTime - startTime,
          success: true,
          changed: translation !== term.text
        };
        
        console.log(`  ${targetLang}: "${translation}" (${translations[targetLang].duration.toFixed(2)}ms)`);
        
      } catch (error) {
        translations[targetLang] = {
          error: error.message,
          success: false
        };
        console.log(`  ${targetLang}: ❌ ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    results[term.text] = {
      category: term.category,
      translations
    };
  }
  
  return results;
}

/**
 * Test diagnosis result translation end-to-end
 */
export async function testDiagnosisTranslation() {
  console.log('🔬 Testing Diagnosis Result Translation...');
  
  const sampleDiagnoses = [
    {
      plant: "Tomato",
      disease: "Early Blight",
      remedy: "Apply copper-based fungicide every 7-10 days. Remove affected leaves and improve air circulation between plants.",
      confidence: 0.89
    },
    {
      plant: "Maize",
      disease: "Leaf Curl",
      remedy: "Control whiteflies which spread the virus. Remove affected leaves promptly and use reflective mulch to deter insects.",
      confidence: 0.94
    },
    {
      plant: "Cassava",
      disease: "Healthy",
      remedy: "Plant appears healthy. Continue regular monitoring and maintain good agricultural practices.",
      confidence: 0.98
    }
  ];
  
  const results = {};
  
  for (const diagnosis of sampleDiagnoses) {
    console.log(`\n--- Testing: ${diagnosis.plant} - ${diagnosis.disease} ---`);
    
    for (const targetLang of ['tw', 'ee']) {
      try {
        const startTime = performance.now();
        const translated = await enhancedGhanaNLPService.translateDiagnosisResult(diagnosis, targetLang);
        const endTime = performance.now();
        
        results[`${diagnosis.plant}_${diagnosis.disease}_${targetLang}`] = {
          original: diagnosis,
          translated,
          duration: endTime - startTime,
          success: true
        };
        
        console.log(`  ${targetLang}:`);
        console.log(`    Plant: ${translated.plant}`);
        console.log(`    Disease: ${translated.disease}`);
        console.log(`    Remedy: ${translated.remedy.substring(0, 80)}...`);
        console.log(`    Duration: ${(endTime - startTime).toFixed(2)}ms`);
        
      } catch (error) {
        results[`${diagnosis.plant}_${diagnosis.disease}_${targetLang}`] = {
          error: error.message,
          success: false
        };
        console.log(`  ${targetLang}: ❌ ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Test hybrid service performance comparison
 */
export async function testHybridPerformance() {
  console.log('⚡ Testing Hybrid Service Performance...');
  
  const testCases = [
    { text: "Tomato", type: "simple_term" },
    { text: "Early Blight", type: "disease_name" },
    { text: "Apply fungicide and remove infected leaves", type: "treatment_phrase" },
    { text: "Apply copper-based fungicide every 7-10 days. Remove affected leaves and improve air circulation between plants. Avoid overhead watering and ensure proper drainage.", type: "complex_treatment" }
  ];
  
  const results = {};
  
  for (const testCase of testCases) {
    console.log(`\n--- Testing: ${testCase.text.substring(0, 50)}... (${testCase.type}) ---`);
    
    try {
      const startTime = performance.now();
      const translation = await hybridTranslationService.translateText(testCase.text, 'en', 'tw');
      const endTime = performance.now();
      
      results[testCase.type] = {
        original: testCase.text,
        translated: translation,
        duration: endTime - startTime,
        success: true,
        speedCategory: endTime - startTime < 50 ? 'instant' : 
                     endTime - startTime < 200 ? 'fast' : 
                     endTime - startTime < 1000 ? 'moderate' : 'slow'
      };
      
      console.log(`✅ Translation: "${translation}"`);
      console.log(`⏱️ Duration: ${(endTime - startTime).toFixed(2)}ms (${results[testCase.type].speedCategory})`);
      
    } catch (error) {
      results[testCase.type] = {
        error: error.message,
        success: false
      };
      console.log(`❌ Failed: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

/**
 * Monitor API usage and performance over time
 */
export async function monitorAPIUsage() {
  console.log('📊 Monitoring API Usage and Performance...');
  
  const stats = hybridTranslationService.getServiceStats();
  console.log('Service Statistics:', stats);
  
  const healthCheck = await hybridTranslationService.healthCheck();
  console.log('Health Check:', healthCheck);
  
  // Performance test
  const performanceResults = await hybridTranslationService.performanceTest();
  console.log('Performance Test Results:', performanceResults);
  
  return {
    stats,
    healthCheck,
    performanceResults,
    timestamp: new Date().toISOString()
  };
}

/**
 * Test error handling and fallback mechanisms
 */
export async function testErrorHandling() {
  console.log('🛡️ Testing Error Handling and Fallback Mechanisms...');
  
  const testCases = [
    { text: "", description: "Empty string" },
    { text: "   ", description: "Whitespace only" },
    { text: "123456", description: "Numbers only" },
    { text: "This is a very long text that might exceed API limits and test how the system handles large content. ".repeat(10), description: "Very long text" }
  ];
  
  const results = {};
  
  for (const testCase of testCases) {
    console.log(`\n--- Testing: ${testCase.description} ---`);
    
    try {
      const translation = await hybridTranslationService.translateText(testCase.text, 'en', 'tw');
      
      results[testCase.description] = {
        original: testCase.text,
        translated: translation,
        success: true,
        handled: true
      };
      
      console.log(`✅ Handled gracefully: "${translation.substring(0, 50)}..."`);
      
    } catch (error) {
      results[testCase.description] = {
        error: error.message,
        success: false,
        handled: false
      };
      
      console.log(`❌ Error not handled: ${error.message}`);
    }
  }
  
  return results;
}

/**
 * Run comprehensive integration test suite
 */
export async function runFullIntegrationTest() {
  console.log('🚀 COMPREHENSIVE GHANA NLP INTEGRATION TEST SUITE');
  console.log('=' .repeat(60));
  
  const testResults = {};
  
  try {
    // Test 1: API Connectivity
    console.log('\n1️⃣ API Connectivity Test');
    testResults.connectivity = await testGhanaNLPConnectivity();
    
    // Test 2: Language Pairs
    console.log('\n2️⃣ Language Pairs Test');
    testResults.languagePairs = await testAllLanguagePairs();
    
    // Test 3: Agricultural Terms
    console.log('\n3️⃣ Agricultural Terms Test');
    testResults.agriculturalTerms = await testAgriculturalTerms();
    
    // Test 4: Diagnosis Translation
    console.log('\n4️⃣ Diagnosis Translation Test');
    testResults.diagnosisTranslation = await testDiagnosisTranslation();
    
    // Test 5: Hybrid Performance
    console.log('\n5️⃣ Hybrid Performance Test');
    testResults.hybridPerformance = await testHybridPerformance();
    
    // Test 6: Error Handling
    console.log('\n6️⃣ Error Handling Test');
    testResults.errorHandling = await testErrorHandling();
    
    // Test 7: Monitoring
    console.log('\n7️⃣ Monitoring and Statistics');
    testResults.monitoring = await monitorAPIUsage();
    
    console.log('\n✅ ALL INTEGRATION TESTS COMPLETED!');
    console.log('📋 Test Results Summary:');
    
    Object.entries(testResults).forEach(([testName, result]) => {
      const status = result ? '✅' : '❌';
      console.log(`  ${status} ${testName}`);
    });
    
    return testResults;
    
  } catch (error) {
    console.error('❌ Integration test suite failed:', error);
    return { error: error.message, testResults };
  }
}

/**
 * Quick health check for regular monitoring
 */
export async function quickHealthCheck() {
  console.log('⚡ Quick Health Check...');
  
  try {
    const start = performance.now();
    const translation = await hybridTranslationService.translateText("Hello", 'en', 'tw');
    const end = performance.now();
    
    const speed = end - start;
    const status = speed < 100 ? 'excellent' : speed < 500 ? 'good' : speed < 2000 ? 'moderate' : 'poor';
    
    console.log(`✅ Translation: "${translation}" in ${speed.toFixed(2)}ms (${status})`);
    
    const stats = hybridTranslationService.getServiceStats();
    console.log(`📊 Cache Size: ${stats.totalCacheSize}, Ghana NLP Available: ${stats.hybrid.ghanaNLPAvailable}`);
    
    return { 
      success: true, 
      speed, 
      status, 
      translation, 
      stats 
    };
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export default {
  testGhanaNLPConnectivity,
  testAllLanguagePairs,
  testAgriculturalTerms,
  testDiagnosisTranslation,
  testHybridPerformance,
  testErrorHandling,
  monitorAPIUsage,
  runFullIntegrationTest,
  quickHealthCheck
};