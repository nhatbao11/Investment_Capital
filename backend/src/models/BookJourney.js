const { executeQuery } = require('../config/database');

class BookJourney {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.image_url = data.image_url;
    this.pdf_url = data.pdf_url;
    this.author_id = data.author_id;
    this.status = data.status || 'draft';
    this.view_count = data.view_count || 0;
    this.download_count = data.download_count || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Tạo mới BookJourney
  static async create(data) {
    const {
      title,
      description,
      image_url,
      pdf_url,
      author_id,
      status = 'draft'
    } = data;

    const sql = `
      INSERT INTO bookjourney (title, description, image_url, pdf_url, author_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [title, description, image_url, pdf_url, author_id, status];
    const result = await executeQuery(sql, params);
    
    return BookJourney.getById(result.insertId);
  }

  // Lấy BookJourney theo ID
  static async getById(id) {
    const sql = `
      SELECT bj.*, u.full_name as author_name
      FROM bookjourney bj
      LEFT JOIN users u ON bj.author_id = u.id
      WHERE bj.id = ?
    `;
    
    const results = await executeQuery(sql, [id]);
    return results.length > 0 ? new BookJourney(results[0]) : null;
  }

  // Lấy tất cả BookJourney với phân trang
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      status = 'published',
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    let sql = `
      SELECT bj.*, u.full_name as author_name
      FROM bookjourney bj
      LEFT JOIN users u ON bj.author_id = u.id
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by status
    if (status) {
      sql += ' AND bj.status = ?';
      params.push(status);
    }

    // Search
    if (search) {
      sql += ' AND (bj.title LIKE ? OR bj.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sort
    sql += ` ORDER BY bj.${sortBy} ${sortOrder}`;

    // Pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    const results = await executeQuery(sql, params);
    return results.map(row => new BookJourney(row));
  }

  // Đếm tổng số BookJourney
  static async count(options = {}) {
    const { status = 'published', search = '' } = options;
    
    let sql = 'SELECT COUNT(*) as total FROM bookjourney WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const results = await executeQuery(sql, params);
    return results[0].total;
  }

  // Cập nhật BookJourney
  async update(data) {
    const {
      title,
      description,
      image_url,
      pdf_url,
      status
    } = data;

    const sql = `
      UPDATE bookjourney 
      SET title = ?, description = ?, image_url = ?, pdf_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [title, description, image_url, pdf_url, status, this.id];
    await executeQuery(sql, params);

    // Cập nhật instance
    Object.assign(this, data);
    this.updated_at = new Date();

    return this;
  }

  // Xóa BookJourney
  async delete() {
    const sql = 'DELETE FROM bookjourney WHERE id = ?';
    await executeQuery(sql, [this.id]);
    return true;
  }

  // Tăng view count
  async incrementViewCount() {
    const sql = 'UPDATE bookjourney SET view_count = view_count + 1 WHERE id = ?';
    await executeQuery(sql, [this.id]);
    this.view_count += 1;
    return this;
  }

  // Tăng download count
  async incrementDownloadCount() {
    const sql = 'UPDATE bookjourney SET download_count = download_count + 1 WHERE id = ?';
    await executeQuery(sql, [this.id]);
    this.download_count += 1;
    return this;
  }

  // Lấy BookJourney phổ biến nhất
  static async getPopular(limit = 5) {
    const sql = `
      SELECT bj.*, u.full_name as author_name
      FROM bookjourney bj
      LEFT JOIN users u ON bj.author_id = u.id
      WHERE bj.status = 'published'
      ORDER BY bj.view_count DESC, bj.download_count DESC
      LIMIT ?
    `;
    
    const results = await executeQuery(sql, [limit]);
    return results.map(row => new BookJourney(row));
  }

  // Lấy BookJourney mới nhất
  static async getLatest(limit = 5) {
    const sql = `
      SELECT bj.*, u.full_name as author_name
      FROM bookjourney bj
      LEFT JOIN users u ON bj.author_id = u.id
      WHERE bj.status = 'published'
      ORDER BY bj.created_at DESC
      LIMIT ?
    `;
    
    const results = await executeQuery(sql, [limit]);
    return results.map(row => new BookJourney(row));
  }

  // Lấy thống kê BookJourney
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_books,
        SUM(view_count) as total_views,
        SUM(download_count) as total_downloads,
        AVG(view_count) as avg_views
      FROM bookjourney 
      WHERE status = 'published'
    `;
    
    const results = await executeQuery(sql);
    return results[0];
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_url: this.image_url,
      pdf_url: this.pdf_url,
      author_id: this.author_id,
      author_name: this.author_name,
      status: this.status,
      view_count: this.view_count,
      download_count: this.download_count,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = BookJourney;
