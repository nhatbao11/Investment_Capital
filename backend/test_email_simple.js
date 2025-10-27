/**
 * Test Email Service - Tiếng Việt
 * Chạy: node test_email_simple.js
 */

require('dotenv').config();
const emailService = require('./src/services/emailService');

const testEmail = async () => {
  console.log('🧪 Bắt đầu test email...\n');
  
  // Kiểm tra config
  console.log('📧 Cấu hình Email:');
  console.log('- EMAIL_ENABLED:', process.env.EMAIL_ENABLED);
  console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('- EMAIL_USER:', process.env.EMAIL_USER);
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('');

  // 👇 THAY EMAIL NÀY THÀNH EMAIL CỦA BẠN
  const recipients = ['nguyennhatbao2k4@gmail.com'];
  
  const testPost = {
    id: 999,
    title: '🎉 Test Newsletter - Y&T Group',
    content: 'Xin chào! Đây là email test để kiểm tra chức năng newsletter. Nếu bạn nhận được email này, hệ thống đã hoạt động tốt! Đây là một bài viết mới về đầu tư chứng khoán, phân tích ngành, và các kiến thức tài chính mới nhất từ Y&T Group.',
    thumbnail_url: 'https://ytcapital.vn/images/Logo01.jpg'
  };

  try {
    console.log('🚀 Đang gửi email test...\n');
    const result = await emailService.sendNewPostNotification(recipients, testPost);
    
    console.log('✅ THÀNH CÔNG!');
    console.log('Đã gửi email đến:', recipients[0]);
    console.log('\n📧 Hãy kiểm tra hộp thư đến của bạn!');
    console.log('\nKết quả:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.log('\n💡 Hướng dẫn khắc phục:');
    console.log('1. Kiểm tra EMAIL_ENABLED=true trong file .env');
    console.log('2. Kiểm tra EMAIL_PASSWORD đúng (App Password từ Google)');
    console.log('3. Kiểm tra email recipient tồn tại');
    console.log('4. Xem file HUONG_DAN_EMAIL_TIENG_VIET.md để setup');
    
    process.exit(1);
  }
};

testEmail();

