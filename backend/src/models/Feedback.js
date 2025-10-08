const { executeQuery } = require('../config/database');

/**
 * Feedback Model
 * Quản lý các thao tác với bảng feedbacks
 */
class Feedback {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.company = data.company;
    this.content = data.content;
    this.rating = data.rating;
    this.status = data.status;
    this.admin_notes = data.admin_notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Tạo feedback mới
   * @param {Object} feedbackData - Dữ liệu feedback
   * @returns {Promise<Feedback>} Feedback object
   */
  static async create(feedbackData) {
    const { user_id, name, company, content, rating } = feedbackData;
    // Ensure no undefined values are passed to the DB driver
    const safeCompany = typeof company === 'undefined' ? null : company;
    const safeRating = typeof rating === 'undefined' ? null : rating;
    
    const sql = `
      INSERT INTO feedbacks (user_id, name, company, content, rating)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(sql, [user_id, name, safeCompany, content, safeRating]);
    
    return await Feedback.findById(result.insertId);
  }

  /**
   * Tìm feedback theo ID
   * @param {number} id - Feedback ID
   * @returns {Promise<Feedback|null>} Feedback object hoặc null
   */
  static async findById(id) {
    const sql = `
      SELECT f.*, u.full_name as user_name, u.email as user_email, u.avatar_url as user_avatar_url
      FROM feedbacks f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `;
    const feedbacks = await executeQuery(sql, [id]);
    
    return feedbacks.length > 0 ? new Feedback(feedbacks[0]) : null;
  }

  /**
   * Lấy tất cả feedbacks (có phân trang và filter)
   * @param {Object} options - Tùy chọn phân trang và filter
   * @returns {Promise<Object>} Danh sách feedbacks và metadata
   */
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status = 'approved', 
      rating,
      user_id 
    } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT f.*, u.full_name as user_name, u.email as user_email, u.avatar_url as user_avatar_url
      FROM feedbacks f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;
    let countSql = 'SELECT COUNT(*) as total FROM feedbacks f WHERE 1=1';
    const params = [];
    
    // Filter by status
    if (status) {
      sql += ' AND f.status = ?';
      countSql += ' AND f.status = ?';
      params.push(status);
    }
    
    // Filter by rating
    if (rating) {
      sql += ' AND f.rating = ?';
      countSql += ' AND f.rating = ?';
      params.push(rating);
    }
    
    // Filter by user
    if (user_id) {
      sql += ' AND f.user_id = ?';
      countSql += ' AND f.user_id = ?';
      params.push(user_id);
    }
    
    // ORDER and pagination
    const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 10;
    const safeOffset = Number.isFinite(Number(offset)) ? Number(offset) : 0;
    sql += ` ORDER BY f.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    
    const countParams = params;
    
    const [feedbacks, countResult] = await Promise.all([
      executeQuery(sql, params),
      executeQuery(countSql, countParams)
    ]);
    
    return {
      feedbacks: feedbacks.map(feedback => new Feedback(feedback)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  /**
   * Cập nhật feedback
   * @param {number} id - Feedback ID
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Feedback|null>} Feedback object hoặc null
   */
  static async update(id, updateData) {
    const allowedFields = ['status', 'admin_notes'];
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
    const sql = `UPDATE feedbacks SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(sql, params);
    return await Feedback.findById(id);
  }

  /**
   * Xóa feedback
   * @param {number} id - Feedback ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const sql = 'DELETE FROM feedbacks WHERE id = ?';
    const result = await executeQuery(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Duyệt feedback (approve)
   * @param {number} id - Feedback ID
   * @param {string} adminNotes - Ghi chú của admin
   * @returns {Promise<Feedback|null>} Feedback object hoặc null
   */
  static async approve(id, adminNotes = '') {
    return await Feedback.update(id, { 
      status: 'approved', 
      admin_notes: adminNotes 
    });
  }

  /**
   * Từ chối feedback (reject)
   * @param {number} id - Feedback ID
   * @param {string} adminNotes - Lý do từ chối
   * @returns {Promise<Feedback|null>} Feedback object hoặc null
   */
  static async reject(id, adminNotes = '') {
    return await Feedback.update(id, { 
      status: 'rejected', 
      admin_notes: adminNotes 
    });
  }

  /**
   * Lấy thống kê feedbacks
   * @returns {Promise<Object>} Thống kê feedbacks
   */
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_stars
      FROM feedbacks
    `;
    
    const result = await executeQuery(sql);
    return result[0];
  }

  /**
   * Lấy feedbacks chờ duyệt (cho admin)
   * @param {number} limit - Số lượng feedbacks
   * @returns {Promise<Array>} Danh sách feedbacks
   */
  static async getPending(limit = 10) {
    const sql = `
      SELECT f.*, u.full_name as user_name, u.email as user_email
      FROM feedbacks f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.status = 'pending'
      ORDER BY f.created_at ASC
      LIMIT ?
    `;
    const feedbacks = await executeQuery(sql, [limit]);
    return feedbacks.map(feedback => new Feedback(feedback));
  }
}

module.exports = Feedback;

