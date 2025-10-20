const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validatePagination, validateId, validateUserUpdate } = require('../middleware/validation');

/**
 * User Management Routes
 * Tất cả routes đều có prefix /api/v1/users
 */

/**
 * @route   GET /api/v1/users
 * @desc    Lấy danh sách users (Admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, requireAdmin, validatePagination, userController.getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Lấy user theo ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/:id', authenticate, requireAdmin, validateId, userController.getUserById);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Cập nhật user (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, validateId, validateUserUpdate, userController.updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Xóa user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, validateId, userController.deleteUser);

module.exports = router;
















