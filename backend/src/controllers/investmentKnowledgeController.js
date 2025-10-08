const InvestmentKnowledge = require('../models/InvestmentKnowledge');

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
    const { page, limit, status = 'published', search } = req.query;
    
    // Nếu không phải admin, chỉ cho xem published knowledge
    const filterStatus = req.user && req.user.role === 'admin' ? status : 'published';
    
    const result = await InvestmentKnowledge.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status: filterStatus,
      search
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
    const { title, image_url, content, meaning, status = 'draft' } = req.body;
    const author_id = req.user.id;

    const knowledge = await InvestmentKnowledge.create({
      title,
      image_url,
      content,
      meaning,
      author_id,
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

    const success = await InvestmentKnowledge.delete(id);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete investment knowledge',
        code: 'DELETE_INVESTMENT_KNOWLEDGE_ERROR'
      });
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


