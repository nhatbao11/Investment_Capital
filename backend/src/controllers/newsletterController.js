const { executeQuery } = require('../config/database');
const emailService = require('../services/emailService');

/**
 * Newsletter Controller
 * Xử lý các request liên quan đến newsletter
 */

/**
 * Lấy danh sách users đã đồng ý nhận newsletter
 */
const getSubscribers = async (req, res) => {
  try {
    const query = `
      SELECT id, email, full_name, created_at
      FROM users
      WHERE newsletter_opt_in = 1 AND is_active = 1
      ORDER BY created_at DESC
    `;

    const users = await executeQuery(query);
    
    res.json({
      success: true,
      message: 'Subscribers retrieved successfully',
      data: {
        total: users.length,
        subscribers: users
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscribers',
      code: 'GET_SUBSCRIBERS_ERROR'
    });
  }
};

/**
 * Gửi newsletter cho tất cả subscribers
 * POST /api/v1/newsletter/send
 */
const sendNewsletter = async (req, res) => {
  try {
    const { post_id, custom_subject, custom_content } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can send newsletters',
        code: 'ACCESS_DENIED'
      });
    }

    // Validation
    if (!post_id) {
      return res.status(400).json({
        success: false,
        message: 'post_id is required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Lấy thông tin post từ database
    const postQuery = `
      SELECT id, title, content, thumbnail_url, pdf_url, category, created_at
      FROM posts
      WHERE id = ?
    `;
    const posts = await executeQuery(postQuery, [post_id]);
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }
    
    let post = posts[0];

    // Nếu có custom_subject hoặc custom_content → Override
    if (custom_subject) {
      post.title = custom_subject;
    }
    if (custom_content) {
      post.content = custom_content;
    }

    // Lấy danh sách subscribers
    const subscribersQuery = `
      SELECT email, full_name
      FROM users
      WHERE newsletter_opt_in = 1 AND is_active = 1
    `;
    const subscribers = await executeQuery(subscribersQuery);

    if (subscribers.length === 0) {
      return res.json({
        success: true,
        message: 'No subscribers found',
        data: {
          sent: 0,
          total: 0
        }
      });
    }

    // Gửi email với custom content (nếu có)
    const recipients = subscribers.map(s => s.email);
    const result = await emailService.sendNewPostNotification(recipients, post);

    res.json({
      success: true,
      message: `Newsletter sent to ${result.sent} recipients`,
      data: {
        sent: result.sent,
        failed: result.failed,
        total: result.total,
        recipients: result.results
      }
    });

  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter',
      code: 'SEND_NEWSLETTER_ERROR'
    });
  }
};

/**
 * Unsubscribe - Hủy đăng ký newsletter
 * POST /api/v1/newsletter/unsubscribe
 */
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Cập nhật newsletter_opt_in = 0
    const query = `
      UPDATE users
      SET newsletter_opt_in = 0
      WHERE email = ?
    `;

    await executeQuery(query, [email]);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe',
      code: 'UNSUBSCRIBE_ERROR'
    });
  }
};

/**
 * Toggle newsletter subscription (cho user đăng nhập)
 * POST /api/v1/newsletter/toggle
 */
const toggleSubscription = async (req, res) => {
  try {
    const { newsletter_opt_in } = req.body;
    const userId = req.user.id;

    // Cập nhật newsletter_opt_in
    const query = `
      UPDATE users
      SET newsletter_opt_in = ?
      WHERE id = ?
    `;

    await executeQuery(query, [newsletter_opt_in ? 1 : 0, userId]);

    res.json({
      success: true,
      message: newsletter_opt_in ? 'Subscribed to newsletter' : 'Unsubscribed from newsletter',
      data: {
        newsletter_opt_in: Boolean(newsletter_opt_in)
      }
    });

  } catch (error) {
    console.error('Toggle subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle subscription',
      code: 'TOGGLE_SUBSCRIPTION_ERROR'
    });
  }
};

/**
 * Preview email trước khi gửi (Admin only)
 */
const previewEmail = async (req, res) => {
  try {
    const { post_id, custom_subject, custom_content } = req.body;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        message: 'post_id is required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Lấy thông tin post
    const postQuery = `
      SELECT id, title, content, thumbnail_url, category, created_at
      FROM posts
      WHERE id = ?
    `;
    const posts = await executeQuery(postQuery, [post_id]);
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    const post = posts[0];

    // Lấy số lượng subscribers
    const subscribersQuery = `
      SELECT COUNT(*) as count
      FROM users
      WHERE newsletter_opt_in = 1 AND is_active = 1
    `;
    const subscribers = await executeQuery(subscribersQuery);

    // Tạo HTML preview (format giống email gửi thật)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Tạo URL dựa vào category
    let postUrl;
    if (post.category === 'nganh') {
      postUrl = `${frontendUrl}/sector`;
    } else if (post.category === 'doanh_nghiep') {
      postUrl = `${frontendUrl}/analysis`;
    } else {
      postUrl = `${frontendUrl}/posts/${post.id}`;
    }
    
    const unsubscribeLink = `${frontendUrl}/unsubscribe`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
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
                      ${custom_subject || post.title}
                    </h2>
                    
                    ${post.thumbnail_url ? `
                      <div style="margin: 25px 0;">
                        <img src="${post.thumbnail_url}" alt="${post.title}" style="width: 100%; border-radius: 8px; display: block;">
                      </div>
                    ` : ''}
                    
                    <div style="color: #4a5568; line-height: 1.8; font-size: 15px; margin-bottom: 30px;">
                      ${custom_content || post.content || 'Nội dung bài viết...'}
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="margin-top: 30px; text-align: center;">
                      <a href="${postUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
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

    res.json({
      success: true,
      message: 'Email preview generated',
      data: {
        html: emailHtml,
        original_title: post.title,
        original_content: post.content || '',
        subscribers_count: subscribers[0].count
      }
    });

  } catch (error) {
    console.error('Preview email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to preview email',
      code: 'PREVIEW_EMAIL_ERROR'
    });
  }
};

module.exports = {
  getSubscribers,
  sendNewsletter,
  unsubscribe,
  toggleSubscription,
  previewEmail
};
