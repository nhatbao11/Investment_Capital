#!/usr/bin/env node

/**
 * Y&T Capital - Connection Test Script
 * Test kết nối giữa frontend và backend
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const CONFIG = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  API_BASE: process.env.API_BASE || '/api/v1',
  TIMEOUT: 10000
};

// Test cases
const tests = [
  {
    name: 'Health Check',
    url: `${CONFIG.BACKEND_URL}/health`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Posts API (Public)',
    url: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}/posts`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Feedbacks API (Public)',
    url: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}/feedbacks`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Popular Posts API',
    url: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}/posts/popular`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Latest Posts API',
    url: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}/posts/latest`,
    method: 'GET',
    expectedStatus: 200
  }
];

// Authentication tests
const authTests = [
  {
    name: 'User Registration',
    url: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}/auth/register`,
    method: 'POST',
    data: {
      email: `test_${Date.now()}@example.com`,
      password: 'Test123456',
      full_name: 'Test User'
    },
    expectedStatus: 201
  }
];

// Helper functions
const log = {
  info: (msg) => console.log(`[INFO] ${msg}`.blue),
  success: (msg) => console.log(`[SUCCESS] ${msg}`.green),
  error: (msg) => console.log(`[ERROR] ${msg}`.red),
  warning: (msg) => console.log(`[WARNING] ${msg}`.yellow)
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test function
async function runTest(test) {
  try {
    const config = {
      method: test.method,
      url: test.url,
      timeout: CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (test.data) {
      config.data = test.data;
    }

    const response = await axios(config);
    
    if (response.status === test.expectedStatus) {
      log.success(`${test.name}: ${response.status} ${response.statusText}`);
      return { success: true, response };
    } else {
      log.error(`${test.name}: Expected ${test.expectedStatus}, got ${response.status}`);
      return { success: false, response };
    }
  } catch (error) {
    if (error.response) {
      log.error(`${test.name}: ${error.response.status} ${error.response.statusText}`);
      if (error.response.data) {
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      }
    } else if (error.request) {
      log.error(`${test.name}: No response received - ${error.message}`);
    } else {
      log.error(`${test.name}: ${error.message}`);
    }
    return { success: false, error };
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Y&T Capital API Connection Test'.rainbow);
  console.log('=====================================');
  console.log(`Backend URL: ${CONFIG.BACKEND_URL}`);
  console.log(`API Base: ${CONFIG.API_BASE}`);
  console.log('');

  let passedTests = 0;
  let totalTests = tests.length + authTests.length;
  let authToken = null;

  // Run public API tests
  log.info('Testing Public APIs...');
  for (const test of tests) {
    const result = await runTest(test);
    if (result.success) {
      passedTests++;
    }
    await sleep(500); // Small delay between tests
  }

  console.log('');

  // Run authentication tests
  log.info('Testing Authentication APIs...');
  for (const test of authTests) {
    const result = await runTest(test);
    if (result.success) {
      passedTests++;
      // Save token for further tests
      if (result.response.data && result.response.data.data && result.response.data.data.tokens) {
        authToken = result.response.data.data.tokens.accessToken;
        log.success('Authentication token obtained');
      }
    }
    await sleep(500);
  }

  console.log('');

  // Test authenticated endpoints if we have a token
  if (authToken) {
    log.info('Testing Authenticated APIs...');
    
    const authTest = {
      name: 'Get Profile (Authenticated)',
      url: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}/auth/profile`,
      method: 'GET',
      expectedStatus: 200,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    const result = await runTest(authTest);
    if (result.success) {
      passedTests++;
      log.success('Authenticated API test passed');
    }
    totalTests++;
  }

  // Summary
  console.log('');
  console.log('📊 Test Summary'.rainbow);
  console.log('===============');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`.green);
  console.log(`Failed: ${totalTests - passedTests}`.red);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    log.success('🎉 All tests passed! Backend is working correctly.');
    process.exit(0);
  } else {
    log.error('❌ Some tests failed. Please check the backend configuration.');
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    log.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, runTest };


















































