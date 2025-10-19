const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validatePagination, validateId, validatePost } = require('../middleware/validation');
const { uploadPostAsset } = require('../middleware/upload');

/**
 * Post Management Routes
 * Tất cả routes đều có prefix /api/v1/posts
 */

/**
 * @route   GET /api/v1/posts
 * @desc    Lấy danh sách posts (Public)
 * @access  Public
 */
router.get('/', optionalAuth, validatePagination, postController.getAllPosts);

/**
 * @route   GET /api/v1/posts/popular
 * @desc    Lấy posts phổ biến (Public)
 * @access  Public
 */
router.get('/popular', postController.getPopularPosts);

/**
 * @route   GET /api/v1/posts/latest
 * @desc    Lấy posts mới nhất (Public)
 * @access  Public
 */
router.get('/latest', postController.getLatestPosts);

/**
 * @route   GET /api/v1/posts/:id
 * @desc    Lấy post theo ID (Public)
 * @access  Public
 */
router.get('/:id', optionalAuth, validateId, postController.getPostById);

/**
 * @route   POST /api/v1/posts/:id/view
 * @desc    Tăng lượt xem post (Public)
 * @access  Public
 */
router.post('/:id/view', validateId, postController.incrementViewCount);

/**
 * @route   POST /api/v1/posts
 * @desc    Tạo post mới (Admin only)
 * @access  Private (Admin)
 */
router.post('/', authenticate, requireAdmin, uploadPostAsset.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), validatePost, postController.createPost);
/**
 * @route   POST /api/v1/posts/upload
 * @desc    Upload post asset (image/pdf)
 * @access  Private (Admin)
 */
router.post('/upload', authenticate, requireAdmin, uploadPostAsset.single('file'), (req, res) => {
  //if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
  return res.json({ success: true, message: 'Uploaded', data: { url: `/uploads/posts/${req.file.filename}` } })
});

/**
 * @route   PUT /api/v1/posts/:id
 * @desc    Cập nhật post (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, uploadPostAsset.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), validateId, validatePost, postController.updatePost);

/**
 * @route   DELETE /api/v1/posts/:id
 * @desc    Xóa post (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, validateId, postController.deletePost);

module.exports = router;

