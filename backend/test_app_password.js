/**
 * Test App Password - Kiểm tra App Password có đúng không
 * Chạy: node test_app_password.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const test = async () => {
  console.log('🔍 Kiểm tra App Password...\n');
  
  const config = {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT
  };
  
  console.log('📧 Config hiện tại:');
  console.log('EMAIL_USER:', config.EMAIL_USER);
  console.log('EMAIL_HOST:', config.EMAIL_HOST);
  console.log('EMAIL_PORT:', config.EMAIL_PORT);
  console.log('EMAIL_PASSWORD length:', config.EMAIL_PASSWORD?.length);
  console.log('EMAIL_PASSWORD có space:', config.EMAIL_PASSWORD?.includes(' '));
  console.log('');
  
  if (!config.EMAIL_USER || !config.EMAIL_PASSWORD) {
    console.log('❌ EMAIL_USER hoặc EMAIL_PASSWORD chưa được cấu hình!');
    return;
  }
  
  if (config.EMAIL_PASSWORD.includes(' ')) {
    console.log('❌ EMAIL_PASSWORD có chứa dấu CÁCH! Phải xóa hết space đi.');
    console.log('Ví dụ: "abcd efgh" → "abcdefgh"');
    return;
  }
  
  console.log('✅ Cấu hình cơ bản OK');
  console.log('');
  console.log('🧪 Đang test kết nối Gmail SMTP...');
  
  try {
    const transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: false,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD
      }
    });
    
    await transporter.verify();
    console.log('✅ Kết nối Gmail SMTP thành công!');
    console.log('');
    console.log('🎉 App Password của bạn đã đúng và hoạt động!');
    
  } catch (error) {
    console.log('');
    console.log('❌ LỖI:', error.message);
    console.log('');
    
    if (error.code === 'EAUTH') {
      console.log('💡 App Password hoặc Email không đúng!');
      console.log('Hãy làm theo:');
      console.log('1. Vào: https://myaccount.google.com/apppasswords');
      console.log('2. Xóa tất cả App passwords cũ');
      console.log('3. Tạo mới: Mail → Windows Computer → Tạo');
      console.log('4. Copy password mới vào file .env');
    } else {
      console.log('Lỗi khác:', error);
    }
  }
};

test();

