const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedbackController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validatePagination, validateId, validateFeedback } = require('../middleware/validation');

/**
 * Feedback Management Routes
 * Tất cả routes đều có prefix /api/v1/feedbacks
 */

/**
 * @route   GET /api/v1/feedbacks
 * @desc    Lấy danh sách feedbacks (Public - chỉ approved)
 * @access  Public
 */
// Use optionalAuth so admin requests carry user info and can fetch non-approved statuses
router.get('/', optionalAuth, validatePagination, feedbackController.getAllFeedbacks);

/**
 * @route   POST /api/v1/feedbacks
 * @desc    Tạo feedback mới (Auth required)
 * @access  Private
 */
router.post('/', authenticate, validateFeedback, feedbackController.createFeedback);

/**
 * @route   GET /api/v1/feedbacks/pending
 * @desc    Lấy feedbacks chờ duyệt (Admin only)
 * @access  Private (Admin)
 */
router.get('/pending', authenticate, requireAdmin, feedbackController.getPendingFeedbacks);

/**
 * @route   PUT /api/v1/feedbacks/:id/approve
 * @desc    Duyệt feedback (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/approve', authenticate, requireAdmin, validateId, feedbackController.approveFeedback);

/**
 * @route   PUT /api/v1/feedbacks/:id/reject
 * @desc    Từ chối feedback (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/reject', authenticate, requireAdmin, validateId, feedbackController.rejectFeedback);

/**
 * @route   DELETE /api/v1/feedbacks/:id
 * @desc    Xóa feedback (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, validateId, feedbackController.deleteFeedback);

/**
 * @route   GET /api/v1/feedbacks/stats
 * @desc    Lấy thống kê feedbacks (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, requireAdmin, feedbackController.getFeedbackStats);

module.exports = router;

