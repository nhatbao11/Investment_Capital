const mysql = require('mysql2/promise');
const { queryCache } = require('./cache');

/**
 * Database connection pool để tối ưu hóa performance
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yt_capital_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

/**
 * Optimized query execution với caching
 */
const executeQuery = async (sql, params = [], useCache = true, cacheTTL = 300) => {
  try {
    // Kiểm tra cache trước
    if (useCache) {
      const cached = queryCache.get(sql, params);
      if (cached) {
        console.log('Query cache hit:', sql.substring(0, 50) + '...');
        return cached;
      }
    }
    
    // Thực hiện query
    const [rows] = await pool.execute(sql, params);
    
    // Lưu vào cache
    if (useCache) {
      queryCache.set(sql, params, rows, cacheTTL);
    }
    
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Optimized queries cho Posts
 */
const PostQueries = {
  // Lấy posts với pagination và caching
  findAll: async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      category,
      category_id,
      status = 'published',
      search,
      useCache = true
    } = options;
    
    const offset = (page - 1) * limit;
    let sql = `
      SELECT p.*, 
             pc.name as category_name,
             u.full_name as author_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    
    if (category) {
      sql += ' AND pc.name = ?';
      params.push(category);
    }
    
    if (category_id) {
      sql += ' AND p.category_id = ?';
      params.push(category_id);
    }
    
    if (search) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const posts = await executeQuery(sql, params, useCache);
    
    // Count query
    let countSql = `
      SELECT COUNT(*) as total
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      WHERE 1=1
    `;
    
    const countParams = [];
    
    if (status) {
      countSql += ' AND p.status = ?';
      countParams.push(status);
    }
    
    if (category) {
      countSql += ' AND pc.name = ?';
      countParams.push(category);
    }
    
    if (category_id) {
      countSql += ' AND p.category_id = ?';
      countParams.push(category_id);
    }
    
    if (search) {
      countSql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    const [countResult] = await executeQuery(countSql, countParams, useCache);
    const total = countResult[0].total;
    
    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },
  
  // Lấy latest posts với caching
  getLatest: async (limit = 6) => {
    const sql = `
      SELECT p.*, 
             pc.name as category_name,
             u.full_name as author_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    
    return await executeQuery(sql, [limit], true, 300); // Cache 5 phút
  },
  
  // Lấy popular posts với caching
  getPopular: async (limit = 6) => {
    const sql = `
      SELECT p.*, 
             pc.name as category_name,
             u.full_name as author_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.view_count DESC, p.created_at DESC
      LIMIT ?
    `;
    
    return await executeQuery(sql, [limit], true, 600); // Cache 10 phút
  }
};

/**
 * Optimized queries cho Investment Knowledge
 */
const InvestmentKnowledgeQueries = {
  findAll: async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      status = 'published',
      search,
      category_id,
      useCache = true
    } = options;
    
    const offset = (page - 1) * limit;
    let sql = `
      SELECT ik.*, 
             c.name as category_name,
             u.full_name as author_name
      FROM investment_knowledge ik
      LEFT JOIN categories c ON ik.category_id = c.id
      LEFT JOIN users u ON ik.author_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      sql += ' AND ik.status = ?';
      params.push(status);
    }
    
    if (category_id) {
      sql += ' AND ik.category_id = ?';
      params.push(category_id);
    }
    
    if (search) {
      sql += ' AND (ik.title LIKE ? OR ik.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    sql += ' ORDER BY ik.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const knowledge = await executeQuery(sql, params, useCache);
    
    // Count query
    let countSql = `
      SELECT COUNT(*) as total
      FROM investment_knowledge ik
      WHERE 1=1
    `;
    
    const countParams = [];
    
    if (status) {
      countSql += ' AND ik.status = ?';
      countParams.push(status);
    }
    
    if (category_id) {
      countSql += ' AND ik.category_id = ?';
      countParams.push(category_id);
    }
    
    if (search) {
      countSql += ' AND (ik.title LIKE ? OR ik.content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    const [countResult] = await executeQuery(countSql, countParams, useCache);
    const total = countResult[0].total;
    
    return {
      knowledge,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },
  
  getLatest: async (limit = 6) => {
    const sql = `
      SELECT ik.*, 
             c.name as category_name,
             u.full_name as author_name
      FROM investment_knowledge ik
      LEFT JOIN categories c ON ik.category_id = c.id
      LEFT JOIN users u ON ik.author_id = u.id
      WHERE ik.status = 'published'
      ORDER BY ik.created_at DESC
      LIMIT ?
    `;
    
    return await executeQuery(sql, [limit], true, 300);
  }
};

/**
 * Optimized statistics queries
 */
const StatisticsQueries = {
  getOverallStats: async () => {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM posts WHERE status = 'published') as total_posts,
        (SELECT COUNT(*) FROM investment_knowledge WHERE status = 'published') as total_knowledge,
        (SELECT COUNT(*) FROM bookjourney WHERE status = 'published') as total_books,
        (SELECT SUM(view_count) FROM posts) as total_post_views,
        (SELECT SUM(view_count) FROM investment_knowledge) as total_knowledge_views,
        (SELECT SUM(view_count) FROM bookjourney) as total_book_views
    `;
    
    return await executeQuery(sql, [], true, 1800); // Cache 30 phút
  }
};

module.exports = {
  pool,
  executeQuery,
  PostQueries,
  InvestmentKnowledgeQueries,
  StatisticsQueries
};
