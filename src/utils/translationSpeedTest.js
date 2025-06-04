/**
 * Translation Speed Performance Testing
 * Compares original vs optimized vs instant translation services
 */

import translationService from '../services/translationService';
import optimizedTranslationService from '../services/optimizedTranslationService';
import instantTranslationService from '../services/instantTranslationService';

/**
 * Sample diagnosis results for testing
 */
const testResults = [
  {
    plant: "Tomato",
    disease: "Early Blight",
    remedy: "Apply copper-based fungicide every 7-10 days. Remove affected leaves and improve air circulation between plants. Avoid overhead watering and ensure proper drainage to prevent fungal spread.",
    confidence: 0.89
  },
  {
    plant: "Maize", 
    disease: "Leaf Curl",
    remedy: "Control whiteflies which spread the virus using yellow sticky traps. Remove affected leaves promptly and use reflective mulch to deter insects. Apply organic pesticides if infestation is severe.",
    confidence: 0.94
  },
  {
    plant: "Pepper",
    disease: "Bacterial Spot", 
    remedy: "Apply copper-based bactericide early in the morning when humidity is low. Remove infected plants and avoid working with wet plants. Practice crop rotation and use disease-free seeds for future planting.",
    confidence: 0.87
  },
  {
    plant: "Cassava",
    disease: "Healthy",
    remedy: "Plant appears healthy with no signs of disease. Continue regular monitoring and maintain good agricultural practices including proper watering, fertilization, and pest control measures.",
    confidence: 0.98
  }
];

/**
 * Test single service performance
 */
async function testServiceSpeed(service, serviceName, result, targetLanguage) {
  console.log(`🧪 Testing ${serviceName} for ${result.plant} - ${result.disease} → ${targetLanguage}`);
  
  const startTime = performance.now();
  
  try {
    let translated;
    
    if (serviceName === 'Instant Service') {
      translated = await service.translateDiagnosisInstantly(result, targetLanguage);
    } else {
      translated = await service.translateDiagnosisResult(result, targetLanguage);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ ${serviceName}: ${duration.toFixed(2)}ms`);
    console.log(`   Plant: ${translated.plant}`);
    console.log(`   Disease: ${translated.disease}`);
    console.log(`   Remedy: ${translated.remedy.substring(0, 100)}...`);
    
    return {
      service: serviceName,
      duration: duration,
      success: true,
      translated: translated
    };
    
  } catch (error) {
    const endTime = performance.now();
    console.error(`❌ ${serviceName} failed:`, error.message);
    
    return {
      service: serviceName,
      duration: endTime - startTime,
      success: false,
      error: error.message
    };
  }
}

/**
 * Compare all translation services
 */
export async function compareTranslationSpeed(targetLanguage = 'tw') {
  console.log(`🏁 Starting Translation Speed Comparison for ${targetLanguage.toUpperCase()}`);
  console.log('=' .repeat(60));
  
  const services = [
    { service: translationService, name: 'Original Service' },
    { service: optimizedTranslationService, name: 'Optimized Service' },
    { service: instantTranslationService, name: 'Instant Service' }
  ];
  
  const results = [];
  
  for (const testResult of testResults) {
    console.log(`\n🔬 Testing: ${testResult.plant} - ${testResult.disease}`);
    console.log('-'.repeat(50));
    
    const testResultsForThisCase = [];
    
    for (const { service, name } of services) {
      const result = await testServiceSpeed(service, name, testResult, targetLanguage);
      testResultsForThisCase.push(result);
      
      // Small delay between tests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    results.push({
      testCase: `${testResult.plant} - ${testResult.disease}`,
      results: testResultsForThisCase
    });
  }
  
  // Generate summary
  console.log('\n📊 PERFORMANCE SUMMARY');
  console.log('=' .repeat(60));
  
  results.forEach(({ testCase, results: testResults }) => {
    console.log(`\n${testCase}:`);
    testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`  ${status} ${result.service}: ${result.duration.toFixed(2)}ms`);
    });
  });
  
  // Calculate averages
  const averages = {};
  services.forEach(({ name }) => {
    const serviceTimes = results.flatMap(r => 
      r.results.filter(res => res.service === name && res.success).map(res => res.duration)
    );
    
    if (serviceTimes.length > 0) {
      averages[name] = serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length;
    } else {
      averages[name] = 'Failed';
    }
  });
  
  console.log('\n⚡ AVERAGE TRANSLATION TIMES:');
  Object.entries(averages).forEach(([service, avgTime]) => {
    const timeDisplay = typeof avgTime === 'number' ? `${avgTime.toFixed(2)}ms` : avgTime;
    console.log(`  ${service}: ${timeDisplay}`);
  });
  
  // Speed improvement calculation
  if (typeof averages['Original Service'] === 'number' && typeof averages['Instant Service'] === 'number') {
    const improvement = ((averages['Original Service'] - averages['Instant Service']) / averages['Original Service']) * 100;
    console.log(`\n🚀 SPEED IMPROVEMENT: ${improvement.toFixed(1)}% faster with Instant Service!`);
  }
  
  return { results, averages };
}

/**
 * Test cache performance
 */
export async function testCachePerformance() {
  console.log('🧪 Testing Cache Performance...');
  
  const testText = "Apply copper-based fungicide every 7-10 days";
  const targetLang = 'tw';
  
  // First translation (cache miss)
  console.time('First Translation (Cache Miss)');
  const first = await optimizedTranslationService.translateText(testText, targetLang);
  console.timeEnd('First Translation (Cache Miss)');
  
  // Second translation (cache hit)
  console.time('Second Translation (Cache Hit)');
  const second = await optimizedTranslationService.translateText(testText, targetLang);
  console.timeEnd('Second Translation (Cache Hit)');
  
  console.log(`Cache working: ${first === second ? '✅' : '❌'}`);
  console.log(`Translation: "${first}"`);
  
  const stats = optimizedTranslationService.getCacheStats();
  console.log(`Cache size: ${stats.size} entries`);
}

/**
 * Test all languages performance
 */
export async function testAllLanguagesSpeed() {
  console.log('🌍 Testing All Languages Performance...');
  
  const languages = ['tw', 'ee', 'ga', 'dag'];
  const testResult = testResults[0]; // Use tomato early blight
  
  for (const lang of languages) {
    console.log(`\n--- ${lang.toUpperCase()} ---`);
    await testServiceSpeed(instantTranslationService, 'Instant Service', testResult, lang);
  }
}

/**
 * Stress test with multiple concurrent translations
 */
export async function stressTestTranslations() {
  console.log('💪 Stress Testing Concurrent Translations...');
  
  const concurrentTests = [];
  const startTime = performance.now();
  
  // Create 20 concurrent translation requests
  for (let i = 0; i < 20; i++) {
    const result = testResults[i % testResults.length];
    const lang = ['tw', 'ee', 'ga', 'dag'][i % 4];
    
    concurrentTests.push(
      instantTranslationService.translateDiagnosisInstantly(result, lang)
    );
  }
  
  const translations = await Promise.all(concurrentTests);
  const endTime = performance.now();
  
  console.log(`✅ Completed 20 concurrent translations in ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`⚡ Average per translation: ${((endTime - startTime) / 20).toFixed(2)}ms`);
  
  return translations;
}

/**
 * Run comprehensive performance test suite
 */
export async function runFullPerformanceTest() {
  console.log('🚀 COMPREHENSIVE TRANSLATION PERFORMANCE TEST');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Speed comparison
    console.log('\n1️⃣ Speed Comparison Test');
    await compareTranslationSpeed('tw');
    
    // Test 2: Cache performance
    console.log('\n2️⃣ Cache Performance Test');
    await testCachePerformance();
    
    // Test 3: All languages
    console.log('\n3️⃣ All Languages Test');
    await testAllLanguagesSpeed();
    
    // Test 4: Stress test
    console.log('\n4️⃣ Stress Test');
    await stressTestTranslations();
    
    // Test 5: Instant service metrics
    console.log('\n5️⃣ Instant Service Metrics');
    const metrics = instantTranslationService.getPerformanceMetrics();
    console.log('Metrics:', metrics);
    
    console.log('\n✅ All performance tests completed!');
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  }
}

/**
 * Quick performance check (for regular use)
 */
export async function quickPerformanceCheck() {
  console.log('⚡ Quick Performance Check...');
  
  const testResult = testResults[0];
  
  const start = performance.now();
  await instantTranslationService.translateDiagnosisInstantly(testResult, 'tw');
  const end = performance.now();
  
  const speed = end - start;
  console.log(`Translation completed in ${speed.toFixed(2)}ms`);
  
  if (speed < 50) {
    console.log('🚀 Excellent performance!');
  } else if (speed < 200) {
    console.log('⚡ Good performance!');
  } else if (speed < 500) {
    console.log('🐌 Moderate performance');
  } else {
    console.log('❌ Poor performance - check network/cache');
  }
  
  return speed;
}

export default {
  compareTranslationSpeed,
  testCachePerformance,
  testAllLanguagesSpeed,
  stressTestTranslations,
  runFullPerformanceTest,
  quickPerformanceCheck,
  testResults
};