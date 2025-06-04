/**
 * Translation Flow Tracker
 * Monitors and logs translation activity for debugging
 */

class TranslationFlowTracker {
  constructor() {
    this.logs = [];
    this.isEnabled = true;
    this.networkRequests = [];
    this.componentUpdates = [];
    
    // Hook into console.log to capture translation logs
    this.originalConsoleLog = console.log;
    this.originalConsoleTime = console.time;
    this.originalConsoleTimeEnd = console.timeEnd;
    
    if (this.isEnabled) {
      this.enableLogging();
      this.setupNetworkMonitoring();
    }
  }

  enableLogging() {
    console.log = (...args) => {
      this.originalConsoleLog(...args);
      
      // Capture translation-related logs
      const message = args.join(' ');
      if (this.isTranslationRelated(message)) {
        this.addLog('console', message, new Date().toISOString());
      }
    };

    console.time = (label) => {
      this.originalConsoleTime(label);
      if (label.includes('Translation') || label.includes('Hybrid')) {
        this.addLog('timer_start', `Timer started: ${label}`, new Date().toISOString());
      }
    };

    console.timeEnd = (label) => {
      this.originalConsoleTimeEnd(label);
      if (label.includes('Translation') || label.includes('Hybrid')) {
        this.addLog('timer_end', `Timer ended: ${label}`, new Date().toISOString());
      }
    };
  }

  setupNetworkMonitoring() {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      
      if (this.isTranslationEndpoint(url)) {
        const requestId = this.generateId();
        const startTime = performance.now();
        
        this.addLog('network_request', {
          id: requestId,
          url,
          method: options?.method || 'GET',
          body: options?.body ? JSON.parse(options.body) : null,
          startTime: new Date().toISOString()
        });

        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          const responseData = await response.clone().text();
          
          this.addLog('network_response', {
            id: requestId,
            status: response.status,
            statusText: response.statusText,
            responseData,
            duration: `${(endTime - startTime).toFixed(2)}ms`,
            endTime: new Date().toISOString()
          });

          return response;
        } catch (error) {
          this.addLog('network_error', {
            id: requestId,
            error: error.message,
            endTime: new Date().toISOString()
          });
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    // Intercept XMLHttpRequest (for axios)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._trackingInfo = {
        method,
        url,
        id: this.generateId ? this.generateId() : Math.random().toString(36).substr(2, 9)
      };
      
      if (this.isTranslationEndpoint && this.isTranslationEndpoint(url)) {
        this._isTranslationRequest = true;
      }
      
      return originalXHROpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function(data) {
      if (this._isTranslationRequest) {
        const requestId = this._trackingInfo?.id || Math.random().toString(36).substr(2, 9);
        const startTime = performance.now();
        
        // Log request
        window.translationTracker?.addLog('xhr_request', {
          id: requestId,
          method: this._trackingInfo?.method,
          url: this._trackingInfo?.url,
          body: data ? JSON.parse(data) : null,
          startTime: new Date().toISOString()
        });

        // Set up response handlers
        const originalOnLoad = this.onload;
        const originalOnError = this.onerror;

        this.onload = function() {
          const endTime = performance.now();
          window.translationTracker?.addLog('xhr_response', {
            id: requestId,
            status: this.status,
            statusText: this.statusText,
            responseData: this.responseText,
            duration: `${(endTime - startTime).toFixed(2)}ms`,
            endTime: new Date().toISOString()
          });
          
          if (originalOnLoad) originalOnLoad.call(this);
        };

        this.onerror = function() {
          window.translationTracker?.addLog('xhr_error', {
            id: requestId,
            error: 'Network error',
            endTime: new Date().toISOString()
          });
          
          if (originalOnError) originalOnError.call(this);
        };
      }
      
      return originalXHRSend.call(this, data);
    };
  }

  isTranslationRelated(message) {
    const translationKeywords = [
      'translation', 'translate', 'ghana', 'nlp', 'hybrid', 'instant',
      'language', 'twi', 'ewe', 'ga', 'dagbane', 'api/ghana-nlp', 'api/translate'
    ];
    
    return translationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  isTranslationEndpoint(url) {
    if (typeof url !== 'string') return false;
    
    return url.includes('/api/ghana-nlp/') || 
           url.includes('/api/translate') ||
           url.includes('translation.ghananlp.org') ||
           url.includes('translation-api.ghananlp.org');
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  addLog(type, data, timestamp = new Date().toISOString()) {
    const logEntry = {
      type,
      data,
      timestamp,
      id: this.generateId()
    };
    
    this.logs.push(logEntry);
    
    // Also log to console for immediate visibility
    this.originalConsoleLog(`🔍 TranslationTracker [${type}]:`, data);
    
    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  trackLanguageChange(oldLang, newLang) {
    this.addLog('language_change', {
      from: oldLang,
      to: newLang,
      triggeredAt: new Date().toISOString()
    });
  }

  trackComponentUpdate(componentName, updateType, details = {}) {
    this.addLog('component_update', {
      component: componentName,
      updateType,
      details,
      timestamp: new Date().toISOString()
    });
  }

  getTranslationLogs() {
    return this.logs.filter(log => 
      log.type.includes('translation') || 
      log.type.includes('language') ||
      log.type.includes('network') ||
      log.type.includes('xhr')
    );
  }

  generateReport() {
    const report = {
      summary: {
        totalLogs: this.logs.length,
        languageChanges: this.logs.filter(l => l.type === 'language_change').length,
        networkRequests: this.logs.filter(l => l.type.includes('request')).length,
        networkResponses: this.logs.filter(l => l.type.includes('response')).length,
        errors: this.logs.filter(l => l.type.includes('error')).length
      },
      recentActivity: this.logs.slice(-20),
      networkActivity: this.logs.filter(l => l.type.includes('network') || l.type.includes('xhr')),
      languageChanges: this.logs.filter(l => l.type === 'language_change'),
      errors: this.logs.filter(l => l.type.includes('error'))
    };

    console.table(report.summary);
    console.group('📊 Translation Flow Report');
    console.log('Recent Activity:', report.recentActivity);
    console.log('Network Activity:', report.networkActivity);
    console.log('Language Changes:', report.languageChanges);
    if (report.errors.length > 0) {
      console.log('Errors:', report.errors);
    }
    console.groupEnd();

    return report;
  }

  clearLogs() {
    this.logs = [];
    this.addLog('system', 'Logs cleared');
  }

  disable() {
    this.isEnabled = false;
    // Restore original functions
    console.log = this.originalConsoleLog;
    console.time = this.originalConsoleTime;
    console.timeEnd = this.originalConsoleTimeEnd;
  }

  // Test translation endpoints
  async testEndpoints() {
    this.addLog('test_start', 'Starting endpoint tests');
    
    const testCases = [
      {
        name: 'Ghana NLP Proxy',
        url: '/api/ghana-nlp/translate',
        body: { in: 'Hello', lang: 'en-tw' }
      },
      {
        name: 'Legacy Proxy',
        url: '/api/translate',
        body: { in: 'Thank you', lang: 'en-tw' }
      }
    ];

    for (const testCase of testCases) {
      try {
        this.addLog('test_case', `Testing ${testCase.name}`);
        
        const response = await fetch(testCase.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.body)
        });

        const result = await response.text();
        
        this.addLog('test_result', {
          name: testCase.name,
          status: response.status,
          result: result,
          success: response.ok
        });
      } catch (error) {
        this.addLog('test_error', {
          name: testCase.name,
          error: error.message
        });
      }
    }
    
    this.addLog('test_end', 'Endpoint tests completed');
  }
}

// Create global instance
window.translationTracker = new TranslationFlowTracker();

// Helper functions for easy access
window.trackTranslation = {
  start: () => window.translationTracker,
  report: () => window.translationTracker.generateReport(),
  clear: () => window.translationTracker.clearLogs(),
  test: () => window.translationTracker.testEndpoints(),
  logs: () => window.translationTracker.getTranslationLogs()
};

export default TranslationFlowTracker;