/**
 * Test Newsletter API
 * Chạy: node test_newsletter_api.js
 */

require('dotenv').config();
const fetch = require('node-fetch');

const API_BASE = process.env.API_URL || 'http://localhost:5000/api/v1';
const TEST_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Thay bằng token thật

const test = async () => {
  console.log('🧪 Testing Newsletter API...\n');
  
  try {
    // Test 1: Get subscribers count
    console.log('1️⃣ Testing GET /newsletter/subscribers');
    const subscribersRes = await fetch(`${API_BASE}/newsletter/subscribers`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    const subscribersData = await subscribersRes.json();
    console.log('✅ Response:', JSON.stringify(subscribersData, null, 2));
    
    if (subscribersData.success) {
      console.log(`📊 Số người nhận: ${subscribersData.data.total}`);
    }
    
    console.log('\n---\n');
    
    // Test 2: Preview email
    console.log('2️⃣ Testing POST /newsletter/preview');
    const previewRes = await fetch(`${API_BASE}/newsletter/preview`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: 1, // Thay bằng ID bài viết thật
        custom_subject: 'Test Subject',
        custom_content: 'Test Content'
      })
    });
    
    const previewData = await previewRes.json();
    console.log('✅ Response:', JSON.stringify(previewData, null, 2));
    
    if (previewData.success) {
      console.log(`📧 Subject: ${previewData.data.subject}`);
      console.log(`👥 Subscribers: ${previewData.data.subscribers_count}`);
      console.log(`📄 HTML length: ${previewData.data.html?.length || 0} chars`);
    }
    
    console.log('\n---\n');
    
    // Test 3: Check email enabled
    console.log('3️⃣ Checking email configuration');
    console.log('EMAIL_ENABLED:', process.env.EMAIL_ENABLED);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' : 'NOT SET');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

test();
