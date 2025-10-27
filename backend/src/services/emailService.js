const nodemailer = require('nodemailer');

/**
 * Email Service
 * Quản lý việc gửi email qua SMTP
 */

// Khởi tạo transporter với Gmail SMTP
const createTransporter = () => {
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';
  
  if (!emailEnabled) {
    console.log('📧 Email service is disabled in .env');
    return null;
  }

  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  try {
    return nodemailer.createTransport(config);
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

const transporter = createTransporter();

/**
 * Gửi email newsletter
 * @param {Object} options - { to, subject, html, unsubscribeLink }
 * @returns {Promise<Object>}
 */
const sendNewsletter = async ({ to, subject, html, unsubscribeLink }) => {
  if (!transporter) {
    console.log('📧 Email service is disabled. Skipping email.');
    return { success: false, message: 'Email service disabled' };
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    list: {
      help: 'mailto:help@ytcapital.vn?subject=Newsletter%20Help',
      unsubscribe: {
        url: unsubscribeLink,
        comment: 'Unsubscribe from Y&T Group newsletter',
      },
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

/**
 * Gửi email thông báo bài viết mới
 * @param {Array} recipients - Danh sách email người nhận
 * @param {Object} post - Thông tin bài viết
 * @returns {Promise<Object>}
 */
const sendNewPostNotification = async (recipients, post) => {
  if (!transporter) {
    console.log('📧 Email service is disabled. Skipping email notification.');
    return { success: false, message: 'Email service disabled' };
  }

  // Lấy full URL của frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  // URL bài viết (link đến trang chứa posts dựa vào category)
  let postUrl;
  if (post.category === 'nganh') {
    postUrl = `${frontendUrl}/sector`;
  } else if (post.category === 'doanh_nghiep') {
    postUrl = `${frontendUrl}/analysis`;
  } else {
    postUrl = `${frontendUrl}/posts/${post.id}`;
  }
  
  // URL unsubscribe (link hủy nhận email)
  const unsubscribeLink = `${frontendUrl}/unsubscribe`;

  const subject = `Y&T Group: ${post.title}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${post.title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <!-- Wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <img src="${frontendUrl}/images/Logo01.jpg" alt="Y&T Group" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                  <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: 700;">Y&T Group</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 16px;">Shaping Tomorrow Through Agile Innovation</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 24px; line-height: 1.3;">
                    ${post.title}
                  </h2>
                  
                  ${post.thumbnail_url ? `
                    <div style="margin: 25px 0;">
                      <img src="${post.thumbnail_url}" alt="${post.title}" style="width: 100%; border-radius: 8px; display: block;">
                    </div>
                  ` : ''}
                  
                  ${post.content ? `
                    <div style="color: #4a5568; line-height: 1.8; font-size: 15px; margin-bottom: 30px;">
                      ${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}
                    </div>
                  ` : ''}
                  
                  <!-- CTA Button -->
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="${postUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                      🔗 Xem thêm tại đây
                    </a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px;">
                    💼 <strong>Y&T Group</strong> - Đối tác tin cậy của bạn trong đầu tư
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                    <a href="${unsubscribeLink}" style="color: #667eea; text-decoration: underline;">Không muốn nhận email này nữa? Hủy đăng ký</a>
                  </p>
                  <p style="margin: 15px 0 0 0; color: #cbd5e0; font-size: 12px;">
                    © ${new Date().getFullYear()} Y&T Group. Tất cả quyền được bảo lưu.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Gửi email cho từng người nhận
  const results = [];
  for (const email of recipients) {
    try {
      // Tạo HTML riêng cho mỗi email với unsubscribe link riêng
      const personalUnsubscribeLink = `${unsubscribeLink}?email=${encodeURIComponent(email)}`;
      
      const personalHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${post.title}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
          <!-- Wrapper -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <img src="${frontendUrl}/images/Logo01.jpg" alt="Y&T Group" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                      <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: 700;">Y&T Group</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 16px;">Shaping Tomorrow Through Agile Innovation</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 24px; line-height: 1.3;">
                        ${post.title}
                      </h2>
                      
                      ${post.thumbnail_url ? `
                        <div style="margin: 25px 0;">
                          <img src="${post.thumbnail_url}" alt="${post.title}" style="width: 100%; border-radius: 8px; display: block;">
                        </div>
                      ` : ''}
                      
                      ${post.content ? `
                        <div style="color: #4a5568; line-height: 1.8; font-size: 15px; margin-bottom: 30px;">
                          ${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}
                        </div>
                      ` : ''}
                      
                      <!-- CTA Button -->
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="${postUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                          🔗 Xem thêm tại đây
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px;">
                        💼 <strong>Y&T Group</strong> - Đối tác tin cậy của bạn trong đầu tư
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                        <a href="${personalUnsubscribeLink}" style="color: #667eea; text-decoration: underline;">Không muốn nhận email này nữa? Hủy đăng ký</a>
                      </p>
                      <p style="margin: 15px 0 0 0; color: #cbd5e0; font-size: 12px;">
                        © ${new Date().getFullYear()} Y&T Group. Tất cả quyền được bảo lưu.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const result = await sendNewsletter({
        to: email,
        subject,
        html: personalHtml,
        unsubscribeLink: personalUnsubscribeLink
      });
      results.push({ email, success: true, messageId: result.messageId });
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      results.push({ email, success: false, error: error.message });
    }
  }

  return {
    success: true,
    total: recipients.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
};

/**
 * Gửi email thông báo Investment Knowledge mới
 * @param {Array} recipients - Danh sách email người nhận
 * @param {Object} knowledge - Thông tin investment knowledge
 * @returns {Promise<Object>}
 */
const sendInvestmentKnowledgeNotification = async (recipients, knowledge) => {
  if (!transporter) {
    console.log('📧 Email service is disabled. Skipping email notification.');
    return { success: false, message: 'Email service disabled' };
  }

  // Lấy full URL của frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  // URL bài viết (link đến trang investment)
  const knowledgeUrl = `${frontendUrl}/investment`;
  
  // URL unsubscribe (link hủy nhận email)
  const unsubscribeLink = `${frontendUrl}/unsubscribe`;

  const subject = `Y&T Group: ${knowledge.title}`;
  
  // Gửi email cho từng người nhận
  const results = [];
  for (const email of recipients) {
    try {
      // Tạo HTML riêng cho mỗi email với unsubscribe link riêng
      const personalUnsubscribeLink = `${unsubscribeLink}?email=${encodeURIComponent(email)}`;
      
      const personalHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${knowledge.title}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
          <!-- Wrapper -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <img src="${frontendUrl}/images/Logo01.jpg" alt="Y&T Group" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                      <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: 700;">Y&T Group</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 16px;">Shaping Tomorrow Through Agile Innovation</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 24px; line-height: 1.3;">
                        ${knowledge.title}
                      </h2>
                      
                      ${knowledge.image_url ? `
                        <div style="margin: 25px 0;">
                          <img src="${knowledge.image_url}" alt="${knowledge.title}" style="width: 100%; border-radius: 8px; display: block;">
                        </div>
                      ` : ''}
                      
                      ${knowledge.meaning ? `
                        <div style="color: #4a5568; line-height: 1.8; font-size: 15px; margin-bottom: 30px;">
                          ${knowledge.meaning.substring(0, 200)}${knowledge.meaning.length > 200 ? '...' : ''}
                        </div>
                      ` : ''}
                      
                      <!-- CTA Button -->
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="${knowledgeUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                          🔗 Xem thêm tại đây
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px;">
                        💼 <strong>Y&T Group</strong> - Đối tác tin cậy của bạn trong đầu tư
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                        <a href="${personalUnsubscribeLink}" style="color: #667eea; text-decoration: underline;">Không muốn nhận email này nữa? Hủy đăng ký</a>
                      </p>
                      <p style="margin: 15px 0 0 0; color: #cbd5e0; font-size: 12px;">
                        © ${new Date().getFullYear()} Y&T Group. Tất cả quyền được bảo lưu.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const result = await sendNewsletter({
        to: email,
        subject,
        html: personalHtml,
        unsubscribeLink: personalUnsubscribeLink
      });
      results.push({ email, success: true, messageId: result.messageId });
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      results.push({ email, success: false, error: error.message });
    }
  }

  return {
    success: true,
    total: recipients.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
};

/**
 * Gửi email thông báo Book Journey mới
 * @param {Array} recipients - Danh sách email người nhận
 * @param {Object} book - Thông tin book journey
 * @returns {Promise<Object>}
 */
const sendBookJourneyNotification = async (recipients, book) => {
  if (!transporter) {
    console.log('📧 Email service is disabled. Skipping email notification.');
    return { success: false, message: 'Email service disabled' };
  }

  // Lấy full URL của frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  // URL book journey (link đến trang investment)
  const bookUrl = `${frontendUrl}/investment`;
  
  // URL unsubscribe (link hủy nhận email)
  const unsubscribeLink = `${frontendUrl}/unsubscribe`;

  const subject = `Y&T Group: ${book.title}`;
  
  // Gửi email cho từng người nhận
  const results = [];
  for (const email of recipients) {
    try {
      // Tạo HTML riêng cho mỗi email với unsubscribe link riêng
      const personalUnsubscribeLink = `${unsubscribeLink}?email=${encodeURIComponent(email)}`;
      
      const personalHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${book.title}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
          <!-- Wrapper -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <img src="${frontendUrl}/images/Logo01.jpg" alt="Y&T Group" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                      <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: 700;">Y&T Group</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 16px;">Shaping Tomorrow Through Agile Innovation</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 20px; font-size: 24px; line-height: 1.3;">
                        ${book.title}
                      </h2>
                      
                      ${book.image_url ? `
                        <div style="margin: 25px 0;">
                          <img src="${book.image_url}" alt="${book.title}" style="width: 100%; border-radius: 8px; display: block;">
                        </div>
                      ` : ''}
                      
                      ${book.description ? `
                        <div style="color: #4a5568; line-height: 1.8; font-size: 15px; margin-bottom: 30px;">
                          ${book.description.substring(0, 200)}${book.description.length > 200 ? '...' : ''}
                        </div>
                      ` : ''}
                      
                      <!-- CTA Button -->
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="${bookUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                          🔗 Xem thêm tại đây
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px;">
                        💼 <strong>Y&T Group</strong> - Đối tác tin cậy của bạn trong đầu tư
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.6;">
                        <a href="${personalUnsubscribeLink}" style="color: #667eea; text-decoration: underline;">Không muốn nhận email này nữa? Hủy đăng ký</a>
                      </p>
                      <p style="margin: 15px 0 0 0; color: #cbd5e0; font-size: 12px;">
                        © ${new Date().getFullYear()} Y&T Group. Tất cả quyền được bảo lưu.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const result = await sendNewsletter({
        to: email,
        subject,
        html: personalHtml,
        unsubscribeLink: personalUnsubscribeLink
      });
      results.push({ email, success: true, messageId: result.messageId });
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      results.push({ email, success: false, error: error.message });
    }
  }

  return {
    success: true,
    total: recipients.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
};

module.exports = {
  sendNewsletter,
  sendNewPostNotification,
  sendInvestmentKnowledgeNotification,
  sendBookJourneyNotification,
  createTransporter
};

