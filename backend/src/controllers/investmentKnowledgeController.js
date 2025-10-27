const InvestmentKnowledge = require('../models/InvestmentKnowledge');
const { deleteMultipleFiles, getFilesToDelete } = require('../utils/fileUtils');
const { sendInvestmentKnowledgeNotification } = require('../services/emailService');
const { executeQuery } = require('../config/database');

/**
 * Investment Knowledge Controller
 * Xử lý các request liên quan đến quản lý investment knowledge
 */

/**
 * Lấy tất cả investment knowledge với phân trang và filter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllInvestmentKnowledge = async (req, res) => {
  try {
    const { page, limit, status, search, category_id } = req.query;
    
    // Check if user is admin to show all statuses
    const userRole = req.user?.role;
    const isAdmin = userRole === 'admin';
    
    let filterStatus = 'published'; // Default: show only published
    if (isAdmin && status === 'all') {
      filterStatus = null; // Admin can see all statuses
    } else if (status && status !== 'all') {
      filterStatus = status;
    }
    
    // Filter investment knowledge based on user role and status
    
    const result = await InvestmentKnowledge.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status: filterStatus,
      search,
      category_id: category_id ? parseInt(category_id) : null
    });

    res.json({
      success: true,
      message: 'Investment knowledge retrieved successfully',
      data: {
        knowledge: result.knowledge,
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Get all investment knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve investment knowledge',
      code: 'GET_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Lấy investment knowledge theo ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInvestmentKnowledgeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const knowledge = await InvestmentKnowledge.findById(id);
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    // Nếu không phải admin và knowledge không published, trả về 404
    if (knowledge.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    // Tăng view count nếu là published knowledge
    if (knowledge.status === 'published') {
      await InvestmentKnowledge.incrementViewCount(id);
    }

    res.json({
      success: true,
      message: 'Investment knowledge retrieved successfully',
      data: {
        knowledge
      }
    });

  } catch (error) {
    console.error('Get investment knowledge by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve investment knowledge',
      code: 'GET_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Tạo investment knowledge mới (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createInvestmentKnowledge = async (req, res) => {
  try {
    const { title, image_url, meaning, status = 'draft', category_id, images } = req.body;
    const author_id = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề là bắt buộc',
        code: 'TITLE_REQUIRED'
      });
    }

    let pdf_url = '';

    // Handle uploaded PDF file
    if (req.files && req.files.pdf && req.files.pdf.length > 0) {
      pdf_url = `/uploads/investment/${req.files.pdf[0].filename}`;
    }

    // Fallback to URL if no file uploaded
    if (!pdf_url && req.body.pdf_url) {
      pdf_url = req.body.pdf_url;
    }

    if (!pdf_url) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file PDF hoặc nhập URL PDF',
        code: 'PDF_REQUIRED'
      });
    }

    // Handle images array
    let imagesArray = [];
    if (images) {
      try {
        imagesArray = typeof images === 'string' ? JSON.parse(images) : images;
      } catch (e) {
        console.error('Error parsing images:', e);
        imagesArray = [];
      }
    }

    const knowledge = await InvestmentKnowledge.create({
      title,
      image_url,
      images: imagesArray,
      content: '', // Keep content field empty for now
      pdf_url: pdf_url, // Store PDF path/URL in pdf_url field
      meaning,
      author_id,
      category_id: category_id ? parseInt(category_id) : null,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Investment knowledge created successfully',
      data: {
        knowledge
      }
    });

  } catch (error) {
    console.error('Create investment knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create investment knowledge',
      code: 'CREATE_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Cập nhật investment knowledge (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateInvestmentKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const knowledge = await InvestmentKnowledge.findById(id);
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    // Handle uploaded PDF file (takes priority)
    if (req.files && req.files.pdf && req.files.pdf.length > 0) {
      updateData.pdf_url = `/uploads/investment/${req.files.pdf[0].filename}`;
    } else if (req.body.pdf_url) {
      // Handle PDF URL (only if no new file uploaded)
      updateData.pdf_url = req.body.pdf_url;
    }
    // If neither file nor URL provided, keep existing PDF (don't update pdf_url field)

    // Handle images array
    if (updateData.images) {
      try {
        updateData.images = typeof updateData.images === 'string' ? JSON.parse(updateData.images) : updateData.images;
      } catch (e) {
        console.error('Error parsing images:', e);
        // Keep existing images if parsing fails
        delete updateData.images;
      }
    }

    const updatedKnowledge = await InvestmentKnowledge.update(id, updateData);
    
    if (!updatedKnowledge) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update investment knowledge',
        code: 'UPDATE_INVESTMENT_KNOWLEDGE_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Investment knowledge updated successfully',
      data: {
        knowledge: updatedKnowledge
      }
    });

  } catch (error) {
    console.error('Update investment knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update investment knowledge',
      code: 'UPDATE_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Xóa investment knowledge (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteInvestmentKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    
    const knowledge = await InvestmentKnowledge.findById(id);
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    // Lấy danh sách file cần xóa trước khi xóa knowledge
    const filesToDelete = getFilesToDelete(knowledge);
    
    const success = await InvestmentKnowledge.delete(id);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete investment knowledge',
        code: 'DELETE_INVESTMENT_KNOWLEDGE_ERROR'
      });
    }

    // Xóa các file liên quan sau khi xóa knowledge thành công
    if (filesToDelete.length > 0) {
      await deleteMultipleFiles(filesToDelete);
    }

    res.json({
      success: true,
      message: 'Investment knowledge deleted successfully'
    });

  } catch (error) {
    console.error('Delete investment knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete investment knowledge',
      code: 'DELETE_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Lấy investment knowledge phổ biến
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPopularInvestmentKnowledge = async (req, res) => {
  try {
    const { limit: rawLimit } = req.query;
    const limit = Number.parseInt(rawLimit, 10);
    const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 5;
    
    const knowledge = await InvestmentKnowledge.getPopular(safeLimit);

    res.json({
      success: true,
      message: 'Popular investment knowledge retrieved successfully',
      data: {
        knowledge
      }
    });

  } catch (error) {
    console.error('Get popular investment knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular investment knowledge',
      code: 'GET_POPULAR_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Lấy investment knowledge mới nhất
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLatestInvestmentKnowledge = async (req, res) => {
  try {
    const { limit: rawLimit } = req.query;
    const limit = Number.parseInt(rawLimit, 10);
    const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 5;
    
    const knowledge = await InvestmentKnowledge.getLatest(safeLimit);

    res.json({
      success: true,
      message: 'Latest investment knowledge retrieved successfully',
      data: {
        knowledge
      }
    });

  } catch (error) {
    console.error('Get latest investment knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest investment knowledge',
      code: 'GET_LATEST_INVESTMENT_KNOWLEDGE_ERROR'
    });
  }
};

/**
 * Tăng lượt xem investment knowledge
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
  const incrementViewCount = async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id || null;
      // Lấy IP từ X-Forwarded-For header (từ Next.js API) hoặc từ req.ip
      let ip_address = req.get('X-Forwarded-For') || req.ip;
      // Nếu X-Forwarded-For có nhiều IP (trong trường hợp proxy chain), lấy IP đầu tiên
      if (ip_address && ip_address.includes(',')) {
        ip_address = ip_address.split(',')[0].trim();
      }
      // Fallback
      if (!ip_address) {
        ip_address = req.connection.remoteAddress || req.socket.remoteAddress;
      }
      const user_agent = req.get('User-Agent') || '';

    // Import ViewTracking model
    const ViewTracking = require('../models/ViewTracking');

    // Track view với logic chống buff
    const tracked = await ViewTracking.trackView({
      user_id,
      ip_address,
      user_agent,
      resource_id: parseInt(id),
      resource_type: 'investment_knowledge'
    });

    // Kiểm tra investment knowledge có tồn tại không
    const knowledge = await InvestmentKnowledge.findById(id);
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    // Cập nhật view_count nếu chưa track (IP mới)
    let updated_view_count = knowledge.view_count;
    if (tracked) {
      updated_view_count = knowledge.view_count + 1;
      await InvestmentKnowledge.incrementViewCount(id);
    }

    res.json({
      success: true,
      message: tracked ? 'View tracked successfully' : 'View already tracked today',
      data: {
        tracked,
        knowledge_id: parseInt(id),
        current_view_count: updated_view_count
      }
    });

  } catch (error) {
    console.error('Increment view count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment view count',
      code: 'INCREMENT_VIEW_ERROR'
    });
  }
};

/**
 * Preview email trước khi gửi (Admin only)
 * POST /api/v1/investment-knowledge/:id/preview-newsletter
 */
const previewNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { custom_subject, custom_content } = req.body;

    // Lấy thông tin investment knowledge
    const knowledge = await InvestmentKnowledge.findById(id);
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'NOT_FOUND'
      });
    }

    // Nếu có custom_subject hoặc custom_content → Override
    if (custom_subject) {
      knowledge.title = custom_subject;
    }
    if (custom_content) {
      knowledge.meaning = custom_content;
    }

    // Lấy số lượng subscribers
    const subscribersQuery = `
      SELECT COUNT(*) as count
      FROM users
      WHERE newsletter_opt_in = 1 AND is_active = 1
    `;
    const subscribers = await executeQuery(subscribersQuery);

    // Tạo HTML preview
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const knowledgeUrl = `${frontendUrl}/investment`;
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
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <img src="${frontendUrl}/images/Logo01.jpg" alt="Y&T Group" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                    <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: 700;">Y&T Group</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 16px;">Shaping Tomorrow Through Agile Innovation</p>
                  </td>
                </tr>
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
                    <div style="margin-top: 30px; text-align: center;">
                      <a href="${knowledgeUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                        🔗 Xem thêm tại đây
                      </a>
                    </div>
                  </td>
                </tr>
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
      message: 'Preview generated successfully',
      data: {
        html: emailHtml,
        original_title: knowledge.title,
        original_content: knowledge.meaning || '',
        subscribers_count: subscribers[0].count
      }
    });

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate preview',
      code: 'PREVIEW_ERROR'
    });
  }
};

/**
 * Gửi newsletter cho Investment Knowledge
 * POST /api/v1/investment-knowledge/:id/send-newsletter
 */
const sendNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { custom_subject, custom_content } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can send newsletters',
        code: 'ACCESS_DENIED'
      });
    }

    // Lấy thông tin investment knowledge
    const knowledge = await InvestmentKnowledge.findById(id);
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'NOT_FOUND'
      });
    }

    // Nếu có custom_subject hoặc custom_content → Override
    if (custom_subject) {
      knowledge.title = custom_subject;
    }
    if (custom_content) {
      knowledge.meaning = custom_content;
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

    // Gửi email
    const recipients = subscribers.map(s => s.email);
    const result = await sendInvestmentKnowledgeNotification(recipients, knowledge);

    res.json({
      success: true,
      message: `Newsletter sent to ${result.sent}/${result.total} subscribers`,
      data: {
        sent: result.sent,
        total: result.total,
        failed: result.failed
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

module.exports = {
  getAllInvestmentKnowledge,
  getInvestmentKnowledgeById,
  createInvestmentKnowledge,
  updateInvestmentKnowledge,
  deleteInvestmentKnowledge,
  getPopularInvestmentKnowledge,
  getLatestInvestmentKnowledge,
  incrementViewCount,
  previewNewsletter,
  sendNewsletter
};

