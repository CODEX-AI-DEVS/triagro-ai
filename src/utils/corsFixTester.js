/**
 * CORS Fix Testing Utility
 * Test different methods to resolve Ghana NLP API CORS issues
 */

import enhancedGhanaNLPService from '../services/enhancedGhanaNLPService';
import axios from 'axios';

/**
 * Test Vite proxy configuration
 */
export async function testViteProxy() {
  console.log('🧪 Testing Vite Proxy Configuration...');
  
  try {
    const response = await axios.post('/api/ghana-nlp/translate', {
      in: 'Hello',
      lang: 'en-tw'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Vite proxy working!', response.data);
    return {
      success: true,
      method: 'vite-proxy',
      result: response.data,
      message: 'Vite proxy successfully bypassed CORS'
    };
    
  } catch (error) {
    console.error('❌ Vite proxy failed:', error.message);
    return {
      success: false,
      method: 'vite-proxy',
      error: error.message,
      message: 'Vite proxy configuration needs adjustment'
    };
  }
}

/**
 * Test legacy proxy endpoint
 */
export async function testLegacyProxy() {
  console.log('🧪 Testing Legacy Proxy Endpoint...');
  
  try {
    const response = await axios.post('/api/translate', {
      in: 'Hello',
      lang: 'en-tw'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Legacy proxy working!', response.data);
    return {
      success: true,
      method: 'legacy-proxy',
      result: response.data,
      message: 'Legacy proxy successfully bypassed CORS'
    };
    
  } catch (error) {
    console.error('❌ Legacy proxy failed:', error.message);
    return {
      success: false,
      method: 'legacy-proxy',
      error: error.message,
      message: 'Legacy proxy endpoint not working'
    };
  }
}

/**
 * Test direct API access (expected to fail due to CORS)
 */
export async function testDirectAPI() {
  console.log('🧪 Testing Direct API Access (expected to fail)...');
  
  try {
    const response = await axios.post('https://translation.ghananlp.org/translate', {
      in: 'Hello',
      lang: 'en-tw'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': import.meta.env.VITE_GHANA_NLP_API_KEY || 'f61d93ed885e46629af097304e12d297'
      },
      timeout: 10000
    });
    
    console.log('🤔 Direct API unexpectedly working!', response.data);
    return {
      success: true,
      method: 'direct-api',
      result: response.data,
      message: 'Direct API access working (CORS not blocking)'
    };
    
  } catch (error) {
    if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
      console.log('✅ Expected CORS error confirmed:', error.message);
      return {
        success: false,
        method: 'direct-api',
        error: 'CORS_EXPECTED',
        message: 'CORS blocking confirmed (expected behavior)'
      };
    } else {
      console.error('❌ Direct API failed with unexpected error:', error.message);
      return {
        success: false,
        method: 'direct-api',
        error: error.message,
        message: 'Direct API failed with non-CORS error'
      };
    }
  }
}

/**
 * Test enhanced Ghana NLP service
 */
export async function testEnhancedService() {
  console.log('🧪 Testing Enhanced Ghana NLP Service...');
  
  try {
    const result = await enhancedGhanaNLPService.testCORSFix();
    
    if (result.fixed) {
      console.log(`✅ Enhanced service working via ${result.method}!`, result.result);
      return {
        success: true,
        method: 'enhanced-service',
        result: result.result,
        approach: result.method,
        message: `Enhanced service successfully using ${result.method} method`
      };
    } else {
      console.error('❌ Enhanced service failed:', result);
      return {
        success: false,
        method: 'enhanced-service',
        error: result,
        message: 'Enhanced service could not resolve CORS issues'
      };
    }
    
  } catch (error) {
    console.error('❌ Enhanced service test failed:', error.message);
    return {
      success: false,
      method: 'enhanced-service',
      error: error.message,
      message: 'Enhanced service test threw an exception'
    };
  }
}

/**
 * Test backend CORS proxy server (if running)
 */
export async function testBackendProxy() {
  console.log('🧪 Testing Backend CORS Proxy Server...');
  
  try {
    // First check if proxy server is running
    const healthCheck = await axios.get('http://localhost:3001/health', {
      timeout: 3000
    });
    
    console.log('✅ CORS proxy server is running:', healthCheck.data);
    
    // Test translation through proxy
    const response = await axios.post('http://localhost:3001/api/translate', {
      in: 'Hello',
      lang: 'en-tw'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_GHANA_NLP_API_KEY || 'f61d93ed885e46629af097304e12d297'
      },
      timeout: 10000
    });
    
    console.log('✅ Backend proxy translation working!', response.data);
    return {
      success: true,
      method: 'backend-proxy',
      result: response.data,
      proxyInfo: healthCheck.data,
      message: 'Backend CORS proxy server successfully bypassed CORS'
    };
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      console.log('ℹ️ Backend proxy server not running (start with: node cors-proxy-server.js)');
      return {
        success: false,
        method: 'backend-proxy',
        error: 'SERVER_NOT_RUNNING',
        message: 'Backend CORS proxy server is not running'
      };
    } else {
      console.error('❌ Backend proxy failed:', error.message);
      return {
        success: false,
        method: 'backend-proxy',
        error: error.message,
        message: 'Backend CORS proxy server error'
      };
    }
  }
}

/**
 * Run comprehensive CORS fix test
 */
export async function runCORSFixTest() {
  console.log('🚀 COMPREHENSIVE CORS FIX TEST');
  console.log('=' .repeat(60));
  
  const results = {};
  const workingMethods = [];
  
  // Test all methods
  console.log('\n1️⃣ Testing Vite Proxy...');
  results.viteProxy = await testViteProxy();
  if (results.viteProxy.success) workingMethods.push('Vite Proxy');
  
  console.log('\n2️⃣ Testing Legacy Proxy...');
  results.legacyProxy = await testLegacyProxy();
  if (results.legacyProxy.success) workingMethods.push('Legacy Proxy');
  
  console.log('\n3️⃣ Testing Enhanced Service...');
  results.enhancedService = await testEnhancedService();
  if (results.enhancedService.success) workingMethods.push('Enhanced Service');
  
  console.log('\n4️⃣ Testing Backend Proxy...');
  results.backendProxy = await testBackendProxy();
  if (results.backendProxy.success) workingMethods.push('Backend Proxy');
  
  console.log('\n5️⃣ Testing Direct API (should fail)...');
  results.directAPI = await testDirectAPI();
  
  // Summary
  console.log('\n📊 CORS FIX TEST SUMMARY');
  console.log('=' .repeat(40));
  
  if (workingMethods.length > 0) {
    console.log('✅ CORS Issue RESOLVED!');
    console.log('🛠️ Working methods:', workingMethods.join(', '));
    
    // Recommend best method
    if (results.viteProxy.success) {
      console.log('🌟 RECOMMENDED: Use Vite Proxy (fastest, no additional server needed)');
    } else if (results.enhancedService.success) {
      console.log('🌟 RECOMMENDED: Use Enhanced Service (automatic fallback)');
    } else if (results.backendProxy.success) {
      console.log('🌟 RECOMMENDED: Use Backend Proxy (most reliable)');
    }
  } else {
    console.log('❌ CORS Issue NOT RESOLVED');
    console.log('🔧 Try the following steps:');
    console.log('   1. Restart Vite dev server: npm run dev');
    console.log('   2. Start backend proxy: node cors-proxy-server.js');
    console.log('   3. Check API key configuration');
    console.log('   4. Verify network connectivity');
  }
  
  // Check if CORS is properly blocked
  if (results.directAPI.error === 'CORS_EXPECTED') {
    console.log('✅ CORS properly blocking direct API access (good security)');
  } else if (results.directAPI.success) {
    console.log('⚠️ Direct API access working (unexpected, possible security concern)');
  }
  
  return {
    summary: {
      totalMethods: Object.keys(results).length,
      workingMethods: workingMethods.length,
      corsFixed: workingMethods.length > 0,
      recommendedMethod: workingMethods[0] || 'none'
    },
    results,
    workingMethods
  };
}

/**
 * Quick CORS test (for regular monitoring)
 */
export async function quickCORSTest() {
  console.log('⚡ Quick CORS Test...');
  
  try {
    // Try the most likely to work first
    const viteTest = await testViteProxy();
    if (viteTest.success) {
      console.log('✅ CORS resolved via Vite proxy');
      return { success: true, method: 'vite-proxy' };
    }
    
    const enhancedTest = await testEnhancedService();
    if (enhancedTest.success) {
      console.log('✅ CORS resolved via enhanced service');
      return { success: true, method: 'enhanced-service' };
    }
    
    console.log('❌ CORS not resolved, run full test: corsFixTester.runCORSFixTest()');
    return { success: false, message: 'No working CORS solution found' };
    
  } catch (error) {
    console.error('❌ Quick CORS test failed:', error.message);
    return { success: false, error: error.message };
  }
}

export default {
  testViteProxy,
  testLegacyProxy,
  testDirectAPI,
  testEnhancedService,
  testBackendProxy,
  runCORSFixTest,
  quickCORSTest
};