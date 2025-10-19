const { executeQuery } = require('../config/database');

class PostCategory {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.color = data.color;
    this.category_type = data.category_type;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const sql = `
      SELECT * FROM post_categories 
      ORDER BY category_type, name ASC
    `;
    const rows = await executeQuery(sql);
    return rows.map(row => new PostCategory(row));
  }

  static async findByType(categoryType) {
    const sql = `
      SELECT * FROM post_categories 
      WHERE category_type = ?
      ORDER BY name ASC
    `;
    const rows = await executeQuery(sql, [categoryType]);
    return rows.map(row => new PostCategory(row));
  }

  static async findById(id) {
    const sql = 'SELECT * FROM post_categories WHERE id = ?';
    const rows = await executeQuery(sql, [id]);
    return rows.length > 0 ? new PostCategory(rows[0]) : null;
  }

  static async findByName(name, categoryType) {
    const sql = 'SELECT * FROM post_categories WHERE name = ? AND category_type = ?';
    const rows = await executeQuery(sql, [name, categoryType]);
    return rows.length > 0 ? new PostCategory(rows[0]) : null;
  }

  static async create(categoryData) {
    const { name, description, color, category_type } = categoryData;
    
    const sql = `
      INSERT INTO post_categories (name, description, color, category_type)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await executeQuery(sql, [name, description || null, color || '#3b82f6', category_type]);
    return await PostCategory.findById(result.insertId);
  }

  static async update(id, updateData) {
    const allowedFields = ['name', 'description', 'color'];
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
    const sql = `UPDATE post_categories SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(sql, params);
    return await PostCategory.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM post_categories WHERE id = ?';
    await executeQuery(sql, [id]);
    return true;
  }

  static async getWithCounts() {
    const sql = `
      SELECT 
        pc.*,
        COUNT(p.id) as post_count
      FROM post_categories pc
      LEFT JOIN posts p ON pc.id = p.category_id
      GROUP BY pc.id
      ORDER BY pc.category_type, pc.name ASC
    `;
    const rows = await executeQuery(sql);
    return rows.map(row => ({
      ...new PostCategory(row),
      post_count: row.post_count
    }));
  }

  static async getWithCountsByType(categoryType) {
    const sql = `
      SELECT 
        pc.*,
        COUNT(p.id) as post_count
      FROM post_categories pc
      LEFT JOIN posts p ON pc.id = p.category_id
      WHERE pc.category_type = ?
      GROUP BY pc.id
      ORDER BY pc.name ASC
    `;
    const rows = await executeQuery(sql, [categoryType]);
    return rows.map(row => ({
      ...new PostCategory(row),
      post_count: row.post_count
    }));
  }
}

module.exports = PostCategory;
