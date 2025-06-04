/**
 * Comprehensive Translation Flow Test
 * Tests the complete translation pipeline end-to-end
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5173';

// Test data that mimics what the disease diagnosis tool would send
const TEST_DATA = {
  uiLabels: [
    'Plant Identified',
    'Disease Status', 
    'Treatment Recommendations',
    'Analysis Results',
    'Upload Image',
    'Take Photo',
    'Diagnose'
  ],
  diagnosisResult: {
    plant: 'Tomato',
    disease: 'Early Blight',
    remedy: 'Apply copper-based fungicide every 7-10 days. Remove affected leaves and improve air circulation between plants. Ensure proper spacing and avoid overhead watering.'
  }
};

const SUPPORTED_LANGUAGES = ['tw', 'ee', 'dag'];

class TranslationFlowTester {
  constructor() {
    this.results = {
      endpointTests: {},
      uiLabelTests: {},
      diagnosisTests: {},
      performanceMetrics: {},
      errors: []
    };
  }

  async testEndpoint(endpoint, data) {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Testing ${endpoint} with:`, data);
      
      const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      const duration = Date.now() - startTime;
      const result = {
        success: true,
        status: response.status,
        data: response.data,
        duration: `${duration}ms`,
        endpoint
      };
      
      console.log(`✅ ${endpoint} (${duration}ms):`, response.data);
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const result = {
        success: false,
        error: error.message,
        status: error.response?.status || 'NETWORK_ERROR',
        duration: `${duration}ms`,
        endpoint
      };
      
      console.log(`❌ ${endpoint} failed (${duration}ms):`, error.message);
      this.results.errors.push(result);
      return result;
    }
  }

  async testAllEndpoints() {
    console.log('\n🔍 Testing All Translation Endpoints...\n');
    
    const endpoints = [
      '/api/ghana-nlp/translate',
      '/api/translate'
    ];
    
    const testData = { in: 'Hello', lang: 'en-tw' };
    
    for (const endpoint of endpoints) {
      const result = await this.testEndpoint(endpoint, testData);
      this.results.endpointTests[endpoint] = result;
    }
  }

  async testUILabelTranslations() {
    console.log('\n🏷️ Testing UI Label Translations...\n');
    
    for (const lang of SUPPORTED_LANGUAGES) {
      console.log(`\n--- Testing UI Labels for ${lang} ---`);
      this.results.uiLabelTests[lang] = {};
      
      for (const label of TEST_DATA.uiLabels) {
        const testData = { in: label, lang: `en-${lang}` };
        const result = await this.testEndpoint('/api/ghana-nlp/translate', testData);
        this.results.uiLabelTests[lang][label] = result;
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  async testDiagnosisTranslations() {
    console.log('\n🔬 Testing Diagnosis Result Translations...\n');
    
    for (const lang of SUPPORTED_LANGUAGES) {
      console.log(`\n--- Testing Diagnosis Translation for ${lang} ---`);
      this.results.diagnosisTests[lang] = {};
      
      // Test each field of the diagnosis result
      const fields = ['plant', 'disease', 'remedy'];
      
      for (const field of fields) {
        const text = TEST_DATA.diagnosisResult[field];
        const testData = { in: text, lang: `en-${lang}` };
        const result = await this.testEndpoint('/api/ghana-nlp/translate', testData);
        this.results.diagnosisTests[lang][field] = result;
        
        // Longer delay for remedy (long text)
        if (field === 'remedy') {
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
  }

  async testPerformanceMetrics() {
    console.log('\n⚡ Testing Performance Metrics...\n');
    
    const performanceTests = [
      { type: 'short_text', text: 'Hello', expectedTime: 2000 },
      { type: 'medium_text', text: 'Plant disease detection using AI', expectedTime: 3000 },
      { type: 'long_text', text: TEST_DATA.diagnosisResult.remedy, expectedTime: 5000 }
    ];
    
    for (const test of performanceTests) {
      console.log(`🏃 Testing ${test.type}...`);
      
      const startTime = Date.now();
      const result = await this.testEndpoint('/api/ghana-nlp/translate', {
        in: test.text,
        lang: 'en-tw'
      });
      const duration = Date.now() - startTime;
      
      this.results.performanceMetrics[test.type] = {
        ...result,
        actualDuration: duration,
        expectedDuration: test.expectedTime,
        performanceRating: duration <= test.expectedTime ? 'excellent' : 
                          duration <= test.expectedTime * 1.5 ? 'good' : 'slow'
      };
      
      console.log(`   Duration: ${duration}ms (expected: <${test.expectedTime}ms)`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  async testLanguageChangeSimulation() {
    console.log('\n🔄 Simulating Language Change Flow...\n');
    
    // Simulate what happens when user changes language on the page
    const languages = ['en', 'tw', 'ee', 'dag'];
    
    for (let i = 0; i < languages.length - 1; i++) {
      const fromLang = languages[i];
      const toLang = languages[i + 1];
      
      if (fromLang === 'en') {
        console.log(`🌍 Simulating language change: ${fromLang} → ${toLang}`);
        
        // Test UI labels translation
        const uiTest = await this.testEndpoint('/api/ghana-nlp/translate', {
          in: 'Plant Identified',
          lang: `en-${toLang}`
        });
        
        // Test diagnosis translation
        const diagnosisTest = await this.testEndpoint('/api/ghana-nlp/translate', {
          in: 'Early Blight',
          lang: `en-${toLang}`
        });
        
        console.log(`   UI Label result: ${uiTest.success ? 'Success' : 'Failed'}`);
        console.log(`   Diagnosis result: ${diagnosisTest.success ? 'Success' : 'Failed'}`);
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }

  generateReport() {
    console.log('\n📊 COMPREHENSIVE TRANSLATION FLOW REPORT');
    console.log('=' .repeat(50));
    
    // Endpoint Summary
    const endpointSummary = Object.entries(this.results.endpointTests)
      .map(([endpoint, result]) => ({
        endpoint,
        status: result.success ? '✅ Working' : '❌ Failed',
        duration: result.duration
      }));
    
    console.log('\n🔗 Endpoint Status:');
    console.table(endpointSummary);
    
    // Language Support Summary
    const languageSummary = SUPPORTED_LANGUAGES.map(lang => {
      const uiSuccess = Object.values(this.results.uiLabelTests[lang] || {})
        .filter(r => r.success).length;
      const uiTotal = Object.keys(this.results.uiLabelTests[lang] || {}).length;
      const diagnosisSuccess = Object.values(this.results.diagnosisTests[lang] || {})
        .filter(r => r.success).length;
      const diagnosisTotal = Object.keys(this.results.diagnosisTests[lang] || {}).length;
      
      return {
        language: lang,
        uiLabels: `${uiSuccess}/${uiTotal}`,
        diagnosis: `${diagnosisSuccess}/${diagnosisTotal}`,
        overall: (uiSuccess + diagnosisSuccess) === (uiTotal + diagnosisTotal) ? '✅' : '⚠️'
      };
    });
    
    console.log('\n🌍 Language Support:');
    console.table(languageSummary);
    
    // Performance Summary
    if (Object.keys(this.results.performanceMetrics).length > 0) {
      const perfSummary = Object.entries(this.results.performanceMetrics)
        .map(([type, result]) => ({
          type,
          duration: `${result.actualDuration}ms`,
          expected: `<${result.expectedDuration}ms`,
          rating: result.performanceRating
        }));
      
      console.log('\n⚡ Performance Metrics:');
      console.table(perfSummary);
    }
    
    // Error Summary
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors Encountered:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.endpoint}: ${error.error} (${error.status})`);
      });
    } else {
      console.log('\n✅ No errors encountered!');
    }
    
    // Overall Assessment
    const totalTests = Object.values(this.results.endpointTests).length +
                      Object.values(this.results.uiLabelTests).flat().length +
                      Object.values(this.results.diagnosisTests).flat().length;
    const successfulTests = Object.values(this.results.endpointTests).filter(r => r.success).length +
                           Object.values(this.results.uiLabelTests).flatMap(lang => 
                             Object.values(lang).filter(r => r.success)).length +
                           Object.values(this.results.diagnosisTests).flatMap(lang => 
                             Object.values(lang).filter(r => r.success)).length;
    
    const successRate = (successfulTests / totalTests * 100).toFixed(1);
    
    console.log('\n🎯 Overall Assessment:');
    console.log(`   Success Rate: ${successRate}% (${successfulTests}/${totalTests})`);
    console.log(`   Supported Languages: ${SUPPORTED_LANGUAGES.length}`);
    console.log(`   Translation Endpoints: ${Object.keys(this.results.endpointTests).length}`);
    
    if (successRate >= 95) {
      console.log('   Status: 🟢 Excellent - Translation system is working optimally');
    } else if (successRate >= 85) {
      console.log('   Status: 🟡 Good - Translation system is working with minor issues');
    } else {
      console.log('   Status: 🔴 Poor - Translation system needs attention');
    }
    
    return this.results;
  }

  async runCompleteTest() {
    console.log('🚀 Starting Comprehensive Translation Flow Test...\n');
    
    try {
      await this.testAllEndpoints();
      await this.testUILabelTranslations();
      await this.testDiagnosisTranslations();
      await this.testPerformanceMetrics();
      await this.testLanguageChangeSimulation();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.errors.push({
        error: error.message,
        type: 'test_suite_failure'
      });
      return this.results;
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const tester = new TranslationFlowTester();
  tester.runCompleteTest()
    .then(results => {
      console.log('\n✅ Test completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = TranslationFlowTester;