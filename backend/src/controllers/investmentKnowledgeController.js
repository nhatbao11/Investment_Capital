const InvestmentKnowledge = require('../models/InvestmentKnowledge');
const { deleteMultipleFiles, getFilesToDelete } = require('../utils/fileUtils');

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
    const { title, image_url, meaning, status = 'draft', category_id } = req.body;
    const author_id = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề là bắt buộc',
        code: 'TITLE_REQUIRED'
      });
    }

    let pdf_path = '';

    // Handle uploaded PDF file
    if (req.files && req.files.pdf && req.files.pdf.length > 0) {
      pdf_path = `/uploads/investment/${req.files.pdf[0].filename}`;
    }

    // Fallback to URL if no file uploaded
    if (!pdf_path && req.body.pdf_url) {
      pdf_path = req.body.pdf_url;
    }

    if (!pdf_path) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file PDF hoặc nhập URL PDF',
        code: 'PDF_REQUIRED'
      });
    }

    const knowledge = await InvestmentKnowledge.create({
      title,
      image_url,
      content: pdf_path, // Store PDF path/URL in content field temporarily
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
      updateData.content = `/uploads/investment/${req.files.pdf[0].filename}`;
    } else if (req.body.pdf_url) {
      // Handle PDF URL (only if no new file uploaded)
      updateData.content = req.body.pdf_url;
    }
    // If neither file nor URL provided, keep existing PDF (don't update content field)

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
    
    const success = await InvestmentKnowledge.incrementViewCount(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'View count incremented successfully'
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

module.exports = {
  getAllInvestmentKnowledge,
  getInvestmentKnowledgeById,
  createInvestmentKnowledge,
  updateInvestmentKnowledge,
  deleteInvestmentKnowledge,
  getPopularInvestmentKnowledge,
  getLatestInvestmentKnowledge,
  incrementViewCount
};

