const Feedback = require('../models/Feedback');
const { mockFeedbacks } = require('../data/mockData');

/**
 * Feedback Controller
 * Xử lý các request liên quan đến quản lý feedbacks
 */

/**
 * Lấy tất cả feedbacks (chỉ approved cho public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllFeedbacks = async (req, res) => {
  try {
    const { page, limit, rating } = req.query;
    
    // Nếu không phải admin, chỉ cho xem approved feedbacks
    const status = req.user && req.user.role === 'admin' ? req.query.status : 'approved';
    
    const result = await Feedback.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      rating: rating ? parseInt(rating) : undefined
    });

    res.json({
      success: true,
      message: 'Feedbacks retrieved successfully',
      data: {
        feedbacks: result.feedbacks,
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedbacks',
      code: 'GET_FEEDBACKS_ERROR'
    });
  }
};

/**
 * Tạo feedback mới (Auth required)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createFeedback = async (req, res) => {
  try {
    const { name, company, content, rating } = req.body;
    const user_id = req.user.id;

    const feedback = await Feedback.create({
      user_id,
      name,
      company,
      content,
      rating
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. It will be reviewed before being published.',
      data: {
        feedback
      }
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      code: 'CREATE_FEEDBACK_ERROR'
    });
  }
};

/**
 * Lấy feedbacks chờ duyệt (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPendingFeedbacks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const feedbacks = await Feedback.getPending(parseInt(limit));

    res.json({
      success: true,
      message: 'Pending feedbacks retrieved successfully',
      data: {
        feedbacks
      }
    });

  } catch (error) {
    console.error('Get pending feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pending feedbacks',
      code: 'GET_PENDING_FEEDBACKS_ERROR'
    });
  }
};

/**
 * Duyệt feedback (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes = '' } = req.body;
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
        code: 'FEEDBACK_NOT_FOUND'
      });
    }

    if (feedback.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Feedback is not pending approval',
        code: 'FEEDBACK_NOT_PENDING'
      });
    }

    const approvedFeedback = await Feedback.approve(id, admin_notes);
    
    if (!approvedFeedback) {
      return res.status(500).json({
        success: false,
        message: 'Failed to approve feedback',
        code: 'APPROVE_FEEDBACK_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Feedback approved successfully',
      data: {
        feedback: approvedFeedback
      }
    });

  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve feedback',
      code: 'APPROVE_FEEDBACK_ERROR'
    });
  }
};

/**
 * Từ chối feedback (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const rejectFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes = '' } = req.body;
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
        code: 'FEEDBACK_NOT_FOUND'
      });
    }

    if (feedback.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Feedback is not pending approval',
        code: 'FEEDBACK_NOT_PENDING'
      });
    }

    const rejectedFeedback = await Feedback.reject(id, admin_notes);
    
    if (!rejectedFeedback) {
      return res.status(500).json({
        success: false,
        message: 'Failed to reject feedback',
        code: 'REJECT_FEEDBACK_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Feedback rejected successfully',
      data: {
        feedback: rejectedFeedback
      }
    });

  } catch (error) {
    console.error('Reject feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject feedback',
      code: 'REJECT_FEEDBACK_ERROR'
    });
  }
};

/**
 * Xóa feedback (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
        code: 'FEEDBACK_NOT_FOUND'
      });
    }

    const success = await Feedback.delete(id);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete feedback',
        code: 'DELETE_FEEDBACK_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      code: 'DELETE_FEEDBACK_ERROR'
    });
  }
};

/**
 * Lấy thống kê feedbacks (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.getStats();

    res.json({
      success: true,
      message: 'Feedback statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback statistics',
      code: 'GET_FEEDBACK_STATS_ERROR'
    });
  }
};

module.exports = {
  getAllFeedbacks,
  createFeedback,
  getPendingFeedbacks,
  approveFeedback,
  rejectFeedback,
  deleteFeedback,
  getFeedbackStats
};

