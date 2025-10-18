const User = require('../models/User');
const { generateTokenPair, verifyRefreshToken } = require('../config/jwt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { executeQuery } = require('../config/database');
const path = require('path');

/**
 * Authentication Controller
 * Xử lý các request liên quan đến authentication
 */

/**
 * Đăng ký user mới
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { email, password, full_name, role = 'client', newsletter_opt_in = false } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    // Tạo user mới
    const user = await User.create({
      email,
      password,
      full_name,
      role,
      newsletter_opt_in: Boolean(newsletter_opt_in)
    });

    // Tạo token pair
    const tokens = generateTokenPair(user);

    // Lưu refresh token vào database
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toSafeObject(),
        tokens
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
};

/**
 * Đăng nhập user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password, newsletter_opt_in } = req.body;

    // Tìm user theo email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Kiểm tra tài khoản có active không
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Cập nhật tùy chọn newsletter nếu có gửi lên (không bắt buộc)
    if (typeof newsletter_opt_in === 'boolean') {
      await User.update(user.id, { newsletter_opt_in });
    }

    // Tạo token pair
    const tokens = generateTokenPair(user);

    // Lưu refresh token vào database
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        tokens
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

/**
 * Refresh access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refresh_token);

    // Kiểm tra refresh token có trong database không
    const tokenExists = await checkRefreshToken(decoded.id, refresh_token);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Lấy thông tin user
    const user = await User.findById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or deactivated',
        code: 'USER_NOT_FOUND'
      });
    }

    // Tạo token pair mới
    const tokens = generateTokenPair(user);

    // Xóa refresh token cũ và lưu token mới
    await deleteRefreshToken(decoded.id, refresh_token);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: user.toSafeObject(),
        tokens
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      code: 'REFRESH_ERROR'
    });
  }
};

/**
 * Đăng xuất (logout)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      // Xóa refresh token khỏi database
      await deleteRefreshToken(req.user.id, refresh_token);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
};

/**
 * Google OAuth login: exchange Google ID token for our JWT
 * Body: { id_token }
 */
const loginWithGoogle = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ success: false, message: 'Missing id_token', code: 'MISSING_ID_TOKEN' });
    }

    // Verify with Google tokeninfo endpoint (simple) or using google-auth-library. Use tokeninfo to avoid new deps.
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`;
    const { data: g } = await axios.get(verifyUrl);
    // Expected fields: sub, email, email_verified, name, picture, aud
    const audOk = process.env.GOOGLE_CLIENT_ID ? g.aud === process.env.GOOGLE_CLIENT_ID : true;
    if (!audOk) {
      return res.status(401).json({ success: false, message: 'Invalid Google client', code: 'INVALID_GOOGLE_AUD' });
    }

    const googleId = g.sub;
    const email = g.email;
    const fullName = g.name || email;
    const avatar = g.picture || null;
    const emailVerified = String(g.email_verified) === 'true';

    // Find existing user by google_id or email
    let user = null;
    // Try by google_id
    const existingByGoogle = await executeQuery('SELECT * FROM users WHERE google_id = ? LIMIT 1', [googleId]);
    if (existingByGoogle.length > 0) {
      user = new User(existingByGoogle[0]);
    } else {
      // Try by email
      const existingByEmail = await executeQuery('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      if (existingByEmail.length > 0) {
        // Link google_id to existing account
        await executeQuery('UPDATE users SET google_id = ?, auth_provider = \'google\', avatar_url = COALESCE(?, avatar_url), email_verified = ? WHERE id = ?', [googleId, avatar, emailVerified, existingByEmail[0].id]);
        user = await User.findById(existingByEmail[0].id);
      } else {
        // Create new user (no password)
        user = await User.create({ email, full_name: fullName, role: 'client', auth_provider: 'google', google_id: googleId, avatar_url: avatar, email_verified: emailVerified });
      }
    }

    const tokens = generateTokenPair(user);
    await saveRefreshToken(user.id, tokens.refreshToken);

    return res.json({ success: true, message: 'Google login successful', data: { user: user.toSafeObject(), tokens } });
  } catch (error) {
    console.error('Google login error:', error?.response?.data || error);
    return res.status(500).json({ success: false, message: 'Google login failed', code: 'GOOGLE_LOGIN_ERROR' });
  }
};

/**
 * Forgot password: issue a short-lived JWT reset token and (optionally) email it
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required', code: 'NO_EMAIL' });
    const user = await User.findByEmail(email);
    if (!user) return res.status(200).json({ success: true, message: 'If account exists, a reset link was issued' });

    const token = jwt.sign({ id: user.id, purpose: 'password_reset' }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-very-long-and-random', { expiresIn: '15m' });
    // TODO: send email. For now, return token for simplicity/demo.
    return res.json({ success: true, message: 'Reset token created', data: { token } });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create reset token', code: 'FORGOT_PASSWORD_ERROR' });
  }
};

/**
 * Reset password using reset token
 */
const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;
    if (!token || !new_password) return res.status(400).json({ success: false, message: 'Missing token or new password', code: 'MISSING_FIELDS' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-very-long-and-random');
    if (decoded.purpose !== 'password_reset') throw new Error('Invalid purpose');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', code: 'USER_NOT_FOUND' });

    await user.updatePassword(new_password);
    // Invalidate existing refresh tokens
    await executeQuery('DELETE FROM refresh_tokens WHERE user_id = ?', [user.id]);

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(400).json({ success: false, message: 'Invalid or expired token', code: 'INVALID_RESET_TOKEN' });
  }
};

/**
 * Lấy thông tin user hiện tại
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      code: 'PROFILE_ERROR'
    });
  }
};

/**
 * Cập nhật thông tin profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProfile = async (req, res) => {
  try {
    const { full_name, avatar_url } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (typeof full_name === 'string' && full_name.trim().length > 0) {
      updateData.full_name = full_name.trim();
    }
    if (typeof avatar_url === 'string' && avatar_url.trim().length > 0) {
      updateData.avatar_url = avatar_url.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
        code: 'NO_FIELDS'
      });
    }

    const updatedUser = await User.update(userId, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
};

/**
 * Đổi mật khẩu
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    // Lấy user từ database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await user.checkPassword(current_password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Cập nhật mật khẩu mới
    const success = await user.updatePassword(new_password);
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update password',
        code: 'PASSWORD_UPDATE_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      code: 'CHANGE_PASSWORD_ERROR'
    });
  }
};

/**
 * Upload avatar (multipart/form-data, field: avatar)
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded', code: 'NO_FILE' });
    }
    // Public URL path clients can use
    const urlPath = `/uploads/avatars/${path.basename(req.file.path)}`;
    // Delete previous avatar file if different
    const current = await User.findById(req.user.id);
    if (current && current.avatar_url && current.avatar_url !== urlPath) {
      try {
        const fileOnDisk = path.join(__dirname, '..', '..', current.avatar_url.replace(/^\//, ''));
        // Only delete if inside uploads dir
        if (fileOnDisk.includes(path.join('uploads', 'avatars'))) {
          require('fs').unlink(fileOnDisk, () => {});
        }
      } catch {}
    }
    const updated = await User.update(req.user.id, { avatar_url: urlPath });
    return res.json({ success: true, message: 'Avatar uploaded', data: { avatar_url: updated.avatar_url, user: updated.toSafeObject() } });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload avatar', code: 'UPLOAD_AVATAR_ERROR' });
  }
};

/**
 * Helper function: Lưu refresh token vào database
 * @param {number} userId - User ID
 * @param {string} token - Refresh token
 */
const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const sql = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `;
  
  await executeQuery(sql, [userId, token, expiresAt]);
};

/**
 * Helper function: Kiểm tra refresh token có tồn tại không
 * @param {number} userId - User ID
 * @param {string} token - Refresh token
 * @returns {Promise<boolean>} Token exists
 */
const checkRefreshToken = async (userId, token) => {
  const sql = `
    SELECT id FROM refresh_tokens 
    WHERE user_id = ? AND token = ? AND expires_at > NOW()
  `;
  
  const result = await executeQuery(sql, [userId, token]);
  return result.length > 0;
};

/**
 * Helper function: Xóa refresh token
 * @param {number} userId - User ID
 * @param {string} token - Refresh token
 */
const deleteRefreshToken = async (userId, token) => {
  const sql = 'DELETE FROM refresh_tokens WHERE user_id = ? AND token = ?';
  await executeQuery(sql, [userId, token]);
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  loginWithGoogle,
  forgotPassword,
  resetPassword
};

