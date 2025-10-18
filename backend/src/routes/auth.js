const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordChange 
} = require('../middleware/validation');

/**
 * Authentication Routes
 * Tất cả routes đều có prefix /api/v1/auth
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Đăng ký user mới
 * @access  Public
 */
router.post('/register', validateUserRegistration, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Đăng nhập user
 * @access  Public
 */
router.post('/login', validateUserLogin, authController.login);

// Google OAuth login
router.post('/google', authController.loginWithGoogle);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Đăng xuất user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Lấy thông tin profile của user hiện tại
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Cập nhật thông tin profile
 * @access  Private
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   POST /api/v1/auth/avatar
 * @desc    Upload avatar image
 * @access  Private
 */
router.post('/avatar', authenticate, uploadAvatar.single('avatar'), authController.uploadAvatar);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
router.put('/change-password', authenticate, validatePasswordChange, authController.changePassword);

// Forgot/Reset password (no auth required)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;

