/**
 * Translation Endpoint Tester
 * Tests all translation endpoints to verify they're working correctly
 */

import axios from 'axios';

/**
 * Test all available translation endpoints
 */
export async function testAllEndpoints() {
  console.log('🔍 Testing All Translation Endpoints (v1 API)...');
  
  const testData = {
    in: 'Hello',
    lang: 'en-tw'
  };
  
  const endpoints = [
    {
      name: 'Ghana NLP Proxy',
      url: '/api/ghana-nlp/translate',
      data: testData
    },
    {
      name: 'Legacy Proxy',
      url: '/api/translate', 
      data: testData
    }
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    console.log(`\n--- Testing ${endpoint.name} ---`);
    
    try {
      const response = await axios.post(endpoint.url, endpoint.data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      const translation = typeof response.data === 'string' 
                         ? response.data 
                         : response.data.out || 
                           response.data.translated_text || 
                           response.data.translation ||
                           response.data.result;
      
      results[endpoint.name] = {
        success: true,
        status: response.status,
        data: response.data,
        translation: translation,
        url: endpoint.url
      };
      
      console.log(`✅ ${endpoint.name}: ${response.status}`);
      console.log(`📝 Response:`, response.data);
      console.log(`🌍 Translation: "${testData.in}" → "${translation}"`);
      
    } catch (error) {
      results[endpoint.name] = {
        success: false,
        error: error.message,
        status: error.response?.status || 'NETWORK_ERROR',
        url: endpoint.url
      };
      
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      if (error.response) {
        console.log(`📊 Status: ${error.response.status}`);
        console.log(`📝 Response:`, error.response.data);
      }
    }
  }
  
  // Summary
  console.log('\n📊 ENDPOINT TEST SUMMARY');
  console.log('=' .repeat(40));
  
  const workingEndpoints = Object.entries(results)
    .filter(([_, result]) => result.success)
    .map(([name, _]) => name);
  
  const failedEndpoints = Object.entries(results)
    .filter(([_, result]) => !result.success)
    .map(([name, result]) => ({ name, error: result.error, status: result.status }));
  
  console.log(`✅ Working endpoints: ${workingEndpoints.length}`);
  workingEndpoints.forEach(name => console.log(`   - ${name}`));
  
  console.log(`❌ Failed endpoints: ${failedEndpoints.length}`);
  failedEndpoints.forEach(({ name, error, status }) => 
    console.log(`   - ${name}: ${status} - ${error}`)
  );
  
  if (workingEndpoints.length > 0) {
    console.log(`\n🎯 RECOMMENDED: Use ${workingEndpoints[0]} for best performance`);
  } else {
    console.log('\n⚠️ NO WORKING ENDPOINTS FOUND');
    console.log('🔧 Troubleshooting steps:');
    console.log('   1. Restart Vite dev server: npm run dev');
    console.log('   2. Check API key in .env file');
    console.log('   3. Verify proxy configuration in vite.config.js');
    console.log('   4. Start backend proxy: node cors-proxy-server.js');
  }
  
  return results;
}

/**
 * Test specific endpoint with custom data
 */
export async function testEndpoint(url, data = null) {
  const testData = data || {
    in: 'Hello',
    lang: 'en-tw'
  };
  
  console.log(`🧪 Testing endpoint: ${url}`);
  console.log(`📤 Data:`, testData);
  
  try {
    const response = await axios.post(url, testData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log(`✅ Success: ${response.status}`);
    console.log(`📥 Response:`, response.data);
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📥 Response:`, error.response.data);
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 'NETWORK_ERROR'
    };
  }
}

/**
 * Quick endpoint health check
 */
export async function quickEndpointCheck() {
  console.log('⚡ Quick Endpoint Health Check...');
  
  try {
    // Test primary endpoint
    const primary = await testEndpoint('/api/ghana-nlp/translate');
    
    if (primary.success) {
      console.log('✅ Primary endpoint working');
      return { success: true, endpoint: '/api/ghana-nlp/translate' };
    }
    
    // Test legacy endpoint
    const legacy = await testEndpoint('/api/translate');
    
    if (legacy.success) {
      console.log('✅ Legacy endpoint working');
      return { success: true, endpoint: '/api/translate' };
    }
    
    console.log('❌ No endpoints working');
    return { success: false, message: 'All endpoints failed' };
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test translation service integration
 */
export async function testServiceIntegration() {
  console.log('🔗 Testing Translation Service Integration...');
  
  try {
    // Test different language pairs
    const testCases = [
      { text: 'Hello', from: 'en', to: 'tw', expected: 'greeting' },
      { text: 'Thank you', from: 'en', to: 'tw', expected: 'gratitude' },
      { text: 'Good morning', from: 'en', to: 'ee', expected: 'greeting' }
    ];
    
    const results = [];
    
    for (const testCase of testCases) {
      const langPair = `${testCase.from}-${testCase.to}`;
      const result = await testEndpoint('/api/ghana-nlp/translate', {
        in: testCase.text,
        lang: langPair
      });
      
      results.push({
        ...testCase,
        result: result.success,
        translation: typeof result.data === 'string' ? result.data : (result.data?.out || 'No translation'),
        error: result.error
      });
    }
    
    console.log('\n📊 Service Integration Results:');
    results.forEach(({ text, from, to, result, translation, error }) => {
      const status = result ? '✅' : '❌';
      console.log(`${status} "${text}" (${from}→${to}): "${translation}"`);
      if (error) console.log(`   Error: ${error}`);
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Service integration test failed:', error);
    return [];
  }
}

export default {
  testAllEndpoints,
  testEndpoint,
  quickEndpointCheck,
  testServiceIntegration
};