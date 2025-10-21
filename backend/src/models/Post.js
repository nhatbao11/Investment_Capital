const { executeQuery } = require('../config/database');

/**
 * Post Model
 * Quản lý các thao tác với bảng posts
 */
class Post {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.category = data.category;
    this.category_id = data.category_id;
    this.thumbnail_url = data.thumbnail_url;
    this.pdf_url = data.pdf_url;
    this.author_id = data.author_id;
    this.status = data.status;
    this.view_count = data.view_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Tạo post mới
   * @param {Object} postData - Dữ liệu post
   * @returns {Promise<Post>} Post object
   */
  static async create(postData) {
    const { title, content, category, category_id, thumbnail_url, pdf_url, author_id, status = 'draft' } = postData;
    
    const sql = `
      INSERT INTO posts (title, content, category, category_id, thumbnail_url, pdf_url, author_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(sql, [title, content, category, category_id || null, thumbnail_url || null, pdf_url || null, author_id, status]);
    
    return await Post.findById(result.insertId);
  }

  /**
   * Tìm post theo ID
   * @param {number} id - Post ID
   * @returns {Promise<Post|null>} Post object hoặc null
   */
  static async findById(id) {
    const sql = `
      SELECT p.*, u.full_name as author_name, u.email as author_email, c.name as category_name, c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN post_categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const posts = await executeQuery(sql, [id]);
    
    return posts.length > 0 ? new Post(posts[0]) : null;
  }

  /**
   * Lấy tất cả posts (có phân trang và filter)
   * @param {Object} options - Tùy chọn phân trang và filter
   * @returns {Promise<Object>} Danh sách posts và metadata
   */
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      category_id,
      status = 'published', 
      search,
      author_id 
    } = options;
    const numericLimit = Number.isFinite(Number(limit)) ? Number(limit) : 10;
    const numericPage = Number.isFinite(Number(page)) ? Number(page) : 1;
    const offset = (numericPage - 1) * numericLimit;
    
    let sql = `
      SELECT p.*, u.full_name as author_name, u.email as author_email, c.name as category_name, c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN post_categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    let countSql = 'SELECT COUNT(*) as total FROM posts p WHERE 1=1';
    const params = [];
    
    // Filter by status (chỉ filter khi status không phải null hoặc 'all')
    if (status && status !== 'all') {
      sql += ' AND p.status = ?';
      countSql += ' AND p.status = ?';
      params.push(status);
    }
    
    // Filter by category
    if (category) {
      sql += ' AND p.category = ?';
      countSql += ' AND p.category = ?';
      params.push(category);
    }
    
    // Filter by category_id
    if (category_id) {
      sql += ' AND p.category_id = ?';
      countSql += ' AND p.category_id = ?';
      params.push(category_id);
    }
    
    // Filter by author
    if (author_id) {
      sql += ' AND p.author_id = ?';
      countSql += ' AND p.author_id = ?';
      params.push(author_id);
    }
    
    // Search by title or content
    if (search) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      countSql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Inline numeric literals for LIMIT/OFFSET to avoid mysql2 prepared stmt issues
    sql += ` ORDER BY p.created_at DESC LIMIT ${numericLimit} OFFSET ${offset}`;
    // No need to push numericLimit/offset as params since they are inlined safely
    
    const [posts, countResult] = await Promise.all([
      executeQuery(sql, params),
      executeQuery(countSql, params)
    ]);
    
    return {
      posts: posts.map(post => new Post(post)),
      pagination: {
        page: Number(numericPage),
        limit: Number(numericLimit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / numericLimit)
      }
    };
  }

  /**
   * Cập nhật post
   * @param {number} id - Post ID
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Post|null>} Post object hoặc null
   */
  static async update(id, updateData) {
    const allowedFields = ['title', 'content', 'category', 'category_id', 'thumbnail_url', 'pdf_url', 'status'];
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
    const sql = `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(sql, params);
    return await Post.findById(id);
  }

  /**
   * Xóa post
   * @param {number} id - Post ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const sql = 'DELETE FROM posts WHERE id = ?';
    const result = await executeQuery(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Tăng view count
   * @param {number} id - Post ID
   * @returns {Promise<boolean>} Success status
   */
  static async incrementViewCount(id) {
    const sql = 'UPDATE posts SET view_count = view_count + 1 WHERE id = ?';
    const result = await executeQuery(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Lấy posts phổ biến (theo view count)
   * @param {number} limit - Số lượng posts
   * @returns {Promise<Array>} Danh sách posts
   */
  static async getPopular(limit = 5) {
    let sql = `
      SELECT p.*, u.full_name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.view_count DESC, p.created_at DESC
    `;
    const numericLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;
    sql += ` LIMIT ${numericLimit}`;
    const posts = await executeQuery(sql);
    return posts.map(post => new Post(post));
  }

  /**
   * Lấy posts mới nhất
   * @param {number} limit - Số lượng posts
   * @returns {Promise<Array>} Danh sách posts
   */
  static async getLatest(limit = 5) {
    let sql = `
      SELECT p.*, u.full_name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
    `;
    const numericLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;
    sql += ` LIMIT ${numericLimit}`;
    const posts = await executeQuery(sql);
    return posts.map(post => new Post(post));
  }
}

module.exports = Post;

