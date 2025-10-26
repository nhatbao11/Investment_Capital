const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Xác thực JWT token và gán user vào request
 */

/**
 * Middleware xác thực JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer " prefix
    
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Lấy thông tin user từ database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
        code: 'USER_DEACTIVATED'
      });
    }

    // Gán user vào request object
    req.user = user.toSafeObject();
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }

  next();
};

/**
 * Middleware kiểm tra quyền (admin hoặc chính user đó)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  const userId = parseInt(req.params.userId || req.params.id);
  const isAdmin = req.user.role === 'admin';
  const isOwner = req.user.id === userId;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
      code: 'ACCESS_DENIED'
    });
  }

  next();
};

/**
 * Middleware xác thực tùy chọn (không bắt buộc)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Không có token, tiếp tục mà không gán user
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    
    if (user && user.is_active) {
      req.user = user.toSafeObject();
    }
    
    next();
    
  } catch (error) {
    // Lỗi token không ảnh hưởng, tiếp tục mà không gán user
    next();
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  requireAdminOrOwner,
  optionalAuth
};



























