const User = require('../models/User');

/**
 * User Controller
 * Xử lý các request liên quan đến quản lý users (Admin only)
 */

/**
 * Lấy tất cả users với phân trang
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    const { page, limit, role, search } = req.query;
    
    const result = await User.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      role,
      search
    });

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: result.users.map(user => user.toSafeObject()),
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      code: 'GET_USERS_ERROR'
    });
  }
};

/**
 * Lấy user theo ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      code: 'GET_USER_ERROR'
    });
  }
};

/**
 * Cập nhật user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const updatedUser = await User.update(id, updateData);
    
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
        code: 'UPDATE_USER_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      code: 'UPDATE_USER_ERROR'
    });
  }
};

/**
 * Xóa user (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Không cho phép xóa chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
        code: 'CANNOT_DELETE_SELF'
      });
    }

    const success = await User.delete(id);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        code: 'DELETE_USER_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      code: 'DELETE_USER_ERROR'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};



























