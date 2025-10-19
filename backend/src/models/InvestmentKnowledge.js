const { executeQuery } = require('../config/database');

/**
 * Investment Knowledge Model
 * Quản lý các thao tác với bảng investment_knowledge
 */
class InvestmentKnowledge {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.image_url = data.image_url;
    this.pdf_url = data.pdf_url;
    this.images = data.images ? (typeof data.images === 'string' ? JSON.parse(data.images) : data.images) : [];
    this.content = data.content;
    this.meaning = data.meaning;
    this.author_id = data.author_id;
    this.category_id = data.category_id;
    this.status = data.status;
    this.view_count = data.view_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.author_name = data.author_name;
    this.author_email = data.author_email;
    this.category_name = data.category_name;
    this.category_color = data.category_color;
  }

  /**
   * Tạo investment knowledge mới
   * @param {Object} knowledgeData - Dữ liệu investment knowledge
   * @returns {Promise<InvestmentKnowledge>} InvestmentKnowledge object
   */
  static async create(knowledgeData) {
    const { title, image_url, images, content, pdf_url, meaning, author_id, category_id, status = 'draft' } = knowledgeData;
    
    const sql = `
      INSERT INTO investment_knowledge (title, image_url, images, content, pdf_url, meaning, author_id, category_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(sql, [title, image_url || null, JSON.stringify(images || []), content, pdf_url || null, meaning || null, author_id, category_id || null, status]);
    
    return await InvestmentKnowledge.findById(result.insertId);
  }

  /**
   * Tìm investment knowledge theo ID
   * @param {number} id - Investment Knowledge ID
   * @returns {Promise<InvestmentKnowledge|null>} InvestmentKnowledge object hoặc null
   */
  static async findById(id) {
    const sql = `
      SELECT ik.*, u.full_name as author_name, u.email as author_email,
             c.name as category_name, c.color as category_color
      FROM investment_knowledge ik
      LEFT JOIN users u ON ik.author_id = u.id
      LEFT JOIN categories c ON ik.category_id = c.id
      WHERE ik.id = ?
    `;
    const knowledge = await executeQuery(sql, [id]);
    
    return knowledge.length > 0 ? new InvestmentKnowledge(knowledge[0]) : null;
  }

  /**
   * Lấy tất cả investment knowledge (có phân trang và filter)
   * @param {Object} options - Tùy chọn phân trang và filter
   * @returns {Promise<Object>} Danh sách investment knowledge và metadata
   */
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status = 'published', 
      search,
      author_id,
      category_id
    } = options;
    const numericLimit = Number.isFinite(Number(limit)) ? Number(limit) : 10;
    const numericPage = Number.isFinite(Number(page)) ? Number(page) : 1;
    const offset = (numericPage - 1) * numericLimit;
    
    let sql = `
      SELECT ik.*, u.full_name as author_name, u.email as author_email,
             c.name as category_name, c.color as category_color
      FROM investment_knowledge ik
      LEFT JOIN users u ON ik.author_id = u.id
      LEFT JOIN categories c ON ik.category_id = c.id
      WHERE 1=1
    `;
    let countSql = 'SELECT COUNT(*) as total FROM investment_knowledge ik WHERE 1=1';
    const params = [];
    
    // Filter by status
    if (status) {
      sql += ' AND ik.status = ?';
      countSql += ' AND ik.status = ?';
      params.push(status);
    }
    
    // Filter by author
    if (author_id) {
      sql += ' AND ik.author_id = ?';
      countSql += ' AND ik.author_id = ?';
      params.push(author_id);
    }
    
    // Filter by category
    if (category_id) {
      sql += ' AND ik.category_id = ?';
      countSql += ' AND ik.category_id = ?';
      params.push(category_id);
    }
    
    // Search by title or content
    if (search) {
      sql += ' AND (ik.title LIKE ? OR ik.content LIKE ? OR ik.meaning LIKE ?)';
      countSql += ' AND (ik.title LIKE ? OR ik.content LIKE ? OR ik.meaning LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Inline numeric literals for LIMIT/OFFSET to avoid mysql2 prepared stmt issues
    sql += ` ORDER BY ik.created_at ASC LIMIT ${numericLimit} OFFSET ${offset}`;
    
    const [knowledge, countResult] = await Promise.all([
      executeQuery(sql, params),
      executeQuery(countSql, params)
    ]);
    
    return {
      knowledge: knowledge.map(k => new InvestmentKnowledge(k)),
      pagination: {
        page: Number(numericPage),
        limit: Number(numericLimit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / numericLimit)
      }
    };
  }

  /**
   * Cập nhật investment knowledge
   * @param {number} id - Investment Knowledge ID
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<InvestmentKnowledge|null>} InvestmentKnowledge object hoặc null
   */
  static async update(id, updateData) {
    const allowedFields = ['title', 'image_url', 'images', 'content', 'pdf_url', 'meaning', 'status', 'category_id'];
    const updates = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        // Handle images array
        if (key === 'images' && Array.isArray(value)) {
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
    }
    
    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    params.push(id);
    const sql = `UPDATE investment_knowledge SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(sql, params);
    return await InvestmentKnowledge.findById(id);
  }

  /**
   * Xóa investment knowledge
   * @param {number} id - Investment Knowledge ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const sql = 'DELETE FROM investment_knowledge WHERE id = ?';
    const result = await executeQuery(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Tăng view count
   * @param {number} id - Investment Knowledge ID
   * @returns {Promise<boolean>} Success status
   */
  static async incrementViewCount(id) {
    const sql = 'UPDATE investment_knowledge SET view_count = view_count + 1 WHERE id = ?';
    const result = await executeQuery(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Lấy investment knowledge phổ biến (theo view count)
   * @param {number} limit - Số lượng knowledge
   * @returns {Promise<Array>} Danh sách investment knowledge
   */
  static async getPopular(limit = 5) {
    let sql = `
      SELECT ik.*, u.full_name as author_name
      FROM investment_knowledge ik
      LEFT JOIN users u ON ik.author_id = u.id
      WHERE ik.status = 'published'
      ORDER BY ik.view_count DESC, ik.created_at DESC
    `;
    const numericLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;
    sql += ` LIMIT ${numericLimit}`;
    const knowledge = await executeQuery(sql);
    return knowledge.map(k => new InvestmentKnowledge(k));
  }

  /**
   * Lấy investment knowledge mới nhất
   * @param {number} limit - Số lượng knowledge
   * @returns {Promise<Array>} Danh sách investment knowledge
   */
  static async getLatest(limit = 5) {
    let sql = `
      SELECT ik.*, u.full_name as author_name
      FROM investment_knowledge ik
      LEFT JOIN users u ON ik.author_id = u.id
      WHERE ik.status = 'published'
      ORDER BY ik.created_at DESC
    `;
    const numericLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;
    sql += ` LIMIT ${numericLimit}`;
    const knowledge = await executeQuery(sql);
    return knowledge.map(k => new InvestmentKnowledge(k));
  }
}

module.exports = InvestmentKnowledge;
