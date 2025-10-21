const BookJourney = require('../models/BookJourney');
const { validationResult } = require('express-validator');
const { deleteMultipleFiles, getFilesToDelete } = require('../utils/fileUtils');

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

  // Tải PDF (tăng download count)
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
}

module.exports = BookJourneyController;
