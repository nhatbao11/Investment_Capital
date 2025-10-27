const BookJourney = require('../models/BookJourney');
const { validationResult } = require('express-validator');
const { deleteMultipleFiles, getFilesToDelete } = require('../utils/fileUtils');
const { sendBookJourneyNotification } = require('../services/emailService');
const { executeQuery } = require('../config/database');

class BookJourneyController {
  // Lấy tất cả BookJourney (public)
  static async getAll(req, res) {
    try {

      const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status: 'published',
        search,
        sortBy,
        sortOrder
      };

      const [books, total] = await Promise.all([
        BookJourney.getAll(options),
        BookJourney.count(options)
      ]);

      res.json({
        success: true,
        data: books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('❌ Error getting bookjourney:', error);
      console.error('Stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách hành trình sách'
      });
    }
  }

  // Lấy BookJourney theo ID (public)
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const book = await BookJourney.getById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hành trình sách'
        });
      }

      // Track view với logic chống buff
      const ViewTracking = require('../models/ViewTracking');
      const user_id = req.user?.id || null;
      const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      const user_agent = req.get('User-Agent') || '';

      await ViewTracking.trackView({
        user_id,
        ip_address,
        user_agent,
        resource_id: parseInt(id),
        resource_type: 'bookjourney'
      });

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error getting bookjourney by id:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin hành trình sách'
      });
    }
  }

  // Tăng lượt xem
  static async incrementView(req, res) {
    try {
      const { id } = req.params;
      const book = await BookJourney.getById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hành trình sách'
        });
      }

      // Track view với logic chống buff
      const ViewTracking = require('../models/ViewTracking');
      const user_id = req.user?.id || null;
      const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      const user_agent = req.get('User-Agent') || '';

      await ViewTracking.trackView({
        user_id,
        ip_address,
        user_agent,
        resource_id: parseInt(id),
        resource_type: 'bookjourney'
      });

      res.json({
        success: true,
        message: 'Đã tăng lượt xem'
      });
    } catch (error) {
      console.error('Error incrementing view:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tăng lượt xem'
      });
    }
  }

  // Tải PDF (tăng download count và track view)
  static async downloadPdf(req, res) {
    try {
      const { id } = req.params;
      const book = await BookJourney.getById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hành trình sách'
        });
      }

      // Track view khi mở PDF (theo IP)
      const ViewTracking = require('../models/ViewTracking');
      const user_id = req.user?.id || null;
      const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      const user_agent = req.get('User-Agent') || '';

      await ViewTracking.trackView({
        user_id,
        ip_address,
        user_agent,
        resource_id: parseInt(id),
        resource_type: 'bookjourney'
      });

      // Tăng download count
      await book.incrementDownloadCount();

      // Redirect to PDF URL
      res.redirect(book.pdf_url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tải PDF'
      });
    }
  }

  // Lấy BookJourney phổ biến
  static async getPopular(req, res) {
    try {
      const { limit = 5 } = req.query;
      const books = await BookJourney.getPopular(parseInt(limit));

      res.json({
        success: true,
        data: books
      });
    } catch (error) {
      console.error('Error getting popular bookjourney:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy hành trình sách phổ biến'
      });
    }
  }

  // Lấy BookJourney mới nhất
  static async getLatest(req, res) {
    try {
      const { limit = 5 } = req.query;
      const books = await BookJourney.getLatest(parseInt(limit));

      res.json({
        success: true,
        data: books
      });
    } catch (error) {
      console.error('Error getting latest bookjourney:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy hành trình sách mới nhất'
      });
    }
  }

  // Lấy thống kê (admin only)
  static async getStats(req, res) {
    try {
      const stats = await BookJourney.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting bookjourney stats:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê hành trình sách'
      });
    }
  }

  // Tạo BookJourney mới (admin only)
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const {
        title,
        description,
        status = 'draft'
      } = req.body;

      let image_url = '';
      let pdf_url = '';

      // Handle uploaded files
      if (req.files) {
        // Handle images
        if (req.files.images && req.files.images.length > 0) {
          image_url = `/uploads/bookjourney/${req.files.images[0].filename}`;
        }
        
        // Handle PDF
        if (req.files.pdf && req.files.pdf.length > 0) {
          pdf_url = `/uploads/bookjourney/${req.files.pdf[0].filename}`;
        }
      }

      // Fallback to URL if no files uploaded
      if (!image_url && req.body.image_url) {
        image_url = req.body.image_url;
      }
      if (!pdf_url && req.body.pdf_url) {
        pdf_url = req.body.pdf_url;
      }

      if (!pdf_url) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp file PDF hoặc URL PDF'
        });
      }

      const bookData = {
        title,
        description,
        image_url,
        pdf_url,
        author_id: req.user.id,
        status
      };

      const book = await BookJourney.create(bookData);

      res.status(201).json({
        success: true,
        message: 'Tạo hành trình sách thành công',
        data: book
      });
    } catch (error) {
      console.error('Error creating bookjourney:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo hành trình sách'
      });
    }
  }

  // Cập nhật BookJourney (admin only)
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const book = await BookJourney.getById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hành trình sách'
        });
      }

      const {
        title,
        description,
        status
      } = req.body;

      let image_url = book.image_url;
      let pdf_url = book.pdf_url;

      // Handle uploaded files
      if (req.files) {
        // Handle images
        if (req.files.images && req.files.images.length > 0) {
          image_url = `/uploads/bookjourney/${req.files.images[0].filename}`;
        }
        
        // Handle PDF
        if (req.files.pdf && req.files.pdf.length > 0) {
          pdf_url = `/uploads/bookjourney/${req.files.pdf[0].filename}`;
        }
      }

      // Fallback to URL if no files uploaded
      if (req.body.image_url) {
        image_url = req.body.image_url;
      }
      if (req.body.pdf_url) {
        pdf_url = req.body.pdf_url;
      }

      const updateData = {
        title,
        description,
        image_url,
        pdf_url,
        status
      };

      await book.update(updateData);

      res.json({
        success: true,
        message: 'Cập nhật hành trình sách thành công',
        data: book
      });
    } catch (error) {
      console.error('Error updating bookjourney:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật hành trình sách'
      });
    }
  }

  // Xóa BookJourney (admin only)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const book = await BookJourney.getById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hành trình sách'
        });
      }

      // Lấy danh sách file cần xóa trước khi xóa book
      const filesToDelete = getFilesToDelete(book);

      await book.delete();

      // Xóa các file liên quan sau khi xóa book thành công
      if (filesToDelete.length > 0) {
        await deleteMultipleFiles(filesToDelete);
      }

      res.json({
        success: true,
        message: 'Xóa hành trình sách thành công'
      });
    } catch (error) {
      console.error('Error deleting bookjourney:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa hành trình sách'
      });
    }
  }

  // Lấy tất cả BookJourney cho admin (bao gồm draft)
  static async getAllForAdmin(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = '',
        search = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status: status || null,
        search,
        sortBy,
        sortOrder
      };

      const [books, total] = await Promise.all([
        BookJourney.getAll(options),
        BookJourney.count(options)
      ]);

      res.json({
        success: true,
        data: books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting bookjourney for admin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách hành trình sách cho admin'
      });
    }
  }

  // Preview email trước khi gửi (Admin only)
  static async previewNewsletter(req, res) {
    try {
      const { id } = req.params;
      const { custom_subject, custom_content } = req.body;

      // Lấy thông tin book journey
      const book = await BookJourney.getById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book journey not found',
          code: 'NOT_FOUND'
        });
      }

      // Nếu có custom_subject hoặc custom_content → Override
      if (custom_subject) {
        book.title = custom_subject;
      }
      if (custom_content) {
        book.description = custom_content;
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
      const bookUrl = `${frontendUrl}/investment`;
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
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="${bookUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
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
          original_title: book.title,
          original_content: book.description || '',
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
  }

  // Gửi newsletter cho Book Journey
  static async sendNewsletter(req, res) {
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

      // Lấy thông tin book journey
      const book = await BookJourney.getById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book journey not found',
          code: 'NOT_FOUND'
        });
      }

      // Nếu có custom_subject hoặc custom_content → Override
      if (custom_subject) {
        book.title = custom_subject;
      }
      if (custom_content) {
        book.description = custom_content;
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
      const result = await sendBookJourneyNotification(recipients, book);

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
  }
}

module.exports = BookJourneyController;
