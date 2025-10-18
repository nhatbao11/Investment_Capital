const { executeQuery } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Quản lý các thao tác với bảng users
 */
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.full_name = data.full_name;
    this.avatar_url = data.avatar_url;
    this.role = data.role;
    this.is_active = data.is_active;
    this.email_verified = data.email_verified;
    this.newsletter_opt_in = data.newsletter_opt_in;
    this.auth_provider = data.auth_provider;
    this.google_id = data.google_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Tạo user mới
   * @param {Object} userData - Dữ liệu user
   * @returns {Promise<User>} User object
   */
  static async create(userData) {
    const { email, password, full_name, role = 'client', auth_provider = 'local', google_id = null, avatar_url = null, email_verified = false, newsletter_opt_in = false } = userData;

    let password_hash = null;
    if (auth_provider === 'local') {
      const saltRounds = 12;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    const sql = `
      INSERT INTO users (email, password_hash, full_name, role, auth_provider, google_id, avatar_url, email_verified, newsletter_opt_in)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(sql, [email, password_hash, full_name, role, auth_provider, google_id, avatar_url, email_verified, newsletter_opt_in]);

    return await User.findById(result.insertId);
  }

  /**
   * Tìm user theo ID
   * @param {number} id - User ID
   * @returns {Promise<User|null>} User object hoặc null
   */
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
    const users = await executeQuery(sql, [id]);
    
    return users.length > 0 ? new User(users[0]) : null;
  }

  /**
   * Tìm user theo email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User object hoặc null
   */
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const users = await executeQuery(sql, [email]);
    
    return users.length > 0 ? new User(users[0]) : null;
  }

  /**
   * Lấy tất cả users (có phân trang)
   * @param {Object} options - Tùy chọn phân trang
   * @returns {Promise<Object>} Danh sách users và metadata
   */
  static async findAll(options = {}) {
    const { page = 1, limit = 10, role, search } = options;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM users WHERE is_active = TRUE';
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE is_active = TRUE';
    const params = [];
    
    // Filter by role
    if (role) {
      sql += ' AND role = ?';
      countSql += ' AND role = ?';
      params.push(role);
    }
    
    // Search by name or email
    if (search) {
      sql += ' AND (full_name LIKE ? OR email LIKE ?)';
      countSql += ' AND (full_name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Avoid binding LIMIT/OFFSET as parameters to prevent ER_WRONG_ARGUMENTS
    const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 10;
    const safeOffset = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    sql += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    
    const [users, countResult] = await Promise.all([
      executeQuery(sql, params),
      executeQuery(countSql, params) // count uses same WHERE params only
    ]);
    
    return {
      users: users.map(user => new User(user)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  /**
   * Cập nhật user
   * @param {number} id - User ID
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<User|null>} User object hoặc null
   */
  static async update(id, updateData) {
    const allowedFields = ['full_name', 'avatar_url', 'role', 'is_active', 'email_verified', 'newsletter_opt_in'];
    const updates = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    params.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(sql, params);
    return await User.findById(id);
  }

  /**
   * Xóa user (soft delete)
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // Hard delete: remove the row entirely. Note: posts/feedbacks have ON DELETE CASCADE in schema
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await executeQuery(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Kiểm tra password
   * @param {string} password - Plain password
   * @returns {Promise<boolean>} Match result
   */
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  /**
   * Cập nhật password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async updatePassword(newPassword) {
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    const sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
    const result = await executeQuery(sql, [password_hash, this.id]);
    
    if (result.affectedRows > 0) {
      this.password_hash = password_hash;
      return true;
    }
    return false;
  }

  /**
   * Chuyển đổi user thành object an toàn (không có password)
   * @returns {Object} Safe user object
   */
  toSafeObject() {
    const { password_hash, ...safeUser } = this;
    return safeUser;
  }
}

module.exports = User;

