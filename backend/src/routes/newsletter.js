const express = require('express');
const router = express.Router();

const newsletterController = require('../controllers/newsletterController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * Newsletter Routes
 * Tất cả routes đều có prefix /api/v1/newsletter
 */

/**
 * @route   GET /api/v1/newsletter/subscribers
 * @desc    Lấy danh sách subscribers (Admin only)
 * @access  Private (Admin)
 */
router.get('/subscribers', authenticate, requireAdmin, newsletterController.getSubscribers);

/**
 * @route   POST /api/v1/newsletter/send
 * @desc    Gửi newsletter cho tất cả subscribers (Admin only)
 * @access  Private (Admin)
 */
router.post('/send', authenticate, requireAdmin, newsletterController.sendNewsletter);

/**
 * @route   POST /api/v1/newsletter/unsubscribe
 * @desc    Hủy đăng ký newsletter (Public - qua email link)
 * @access  Public
 */
router.post('/unsubscribe', newsletterController.unsubscribe);

/**
 * @route   POST /api/v1/newsletter/toggle
 * @desc    Bật/tắt newsletter subscription (User đã đăng nhập)
 * @access  Private
 */
router.post('/toggle', authenticate, newsletterController.toggleSubscription);

/**
 * @route   POST /api/v1/newsletter/preview
 * @desc    Xem preview email trước khi gửi (Admin only)
 * @access  Private (Admin)
 */
router.post('/preview', authenticate, requireAdmin, newsletterController.previewEmail);

module.exports = router;
