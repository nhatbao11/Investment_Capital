const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Xử lý validation cho các request
 */

/**
 * Middleware xử lý kết quả validation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    console.error('Request body:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * Validation rules cho user registration
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&)'),
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải có từ 2 đến 100 ký tự'),
  body('role')
    .optional()
    .isIn(['client', 'admin'])
    .withMessage('Role must be either client or admin'),
  body('newsletter_opt_in')
    .optional()
    .isBoolean()
    .withMessage('newsletter_opt_in must be a boolean'),
  handleValidationErrors
];

/**
 * Validation rules cho user login
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
  body('newsletter_opt_in')
    .optional()
    .isBoolean()
    .withMessage('newsletter_opt_in must be a boolean'),
  handleValidationErrors
];

/**
 * Validation rules cho post creation/update
 */
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Title must be between 2 and 500 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('category')
    .isIn(['nganh', 'doanh_nghiep'])
    .withMessage('Category must be either nganh or doanh_nghiep'),
  body('thumbnail_url')
    .optional()
    .custom((value) => {
      if (!value) return true
      const isUploadPath = typeof value === 'string' && value.startsWith('/uploads/')
      const isHttpUrl = /^https?:\/\//i.test(value)
      if (!isUploadPath && !isHttpUrl) {
        throw new Error('Thumbnail must be a valid URL or /uploads path')
      }
      return true
    }),
  body('pdf_url')
    .optional()
    .custom((value) => {
      if (!value) return true
      const isUploadPath = typeof value === 'string' && value.startsWith('/uploads/')
      const isHttpUrl = /^https?:\/\//i.test(value)
      if (!isUploadPath && !isHttpUrl) {
        throw new Error('PDF must be a valid URL or /uploads path')
      }
      return true
    }),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  body('category_id')
    .optional()
    .custom((value) => {
      // Allow undefined, null, empty string
      if (value === undefined || value === null || value === '') return true
      if (typeof value === 'string' && value.trim() === '') return true
      
      // Just check if it's a valid number
      const numValue = Number(value)
      if (isNaN(numValue)) {
        throw new Error('Category ID must be a valid number')
      }
      
      return true
    }),
  handleValidationErrors
];

/**
 * Validation rules cho feedback creation
 */
const validateFeedback = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must not exceed 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  handleValidationErrors
];

/**
 * Validation rules cho pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  handleValidationErrors
];

/**
 * Validation rules cho ID parameter
 */
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

/**
 * Validation rules cho user update
 */
const validateUserUpdate = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['client', 'admin'])
    .withMessage('Role must be either client or admin'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  body('email_verified')
    .optional()
    .isBoolean()
    .withMessage('email_verified must be a boolean'),
  handleValidationErrors
];

/**
 * Validation rules cho password change
 */
const validatePasswordChange = [
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),
  body('new_password')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePost,
  validateFeedback,
  validatePagination,
  validateId,
  validateUserUpdate,
  validatePasswordChange
};

