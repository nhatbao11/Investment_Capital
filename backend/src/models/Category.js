const { executeQuery } = require('../config/database');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.color = data.color;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const sql = `
      SELECT * FROM categories 
      ORDER BY name ASC
    `;
    const rows = await executeQuery(sql);
    return rows.map(row => new Category(row));
  }

  static async findById(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const rows = await executeQuery(sql, [id]);
    return rows.length > 0 ? new Category(rows[0]) : null;
  }

  static async findByName(name) {
    const sql = 'SELECT * FROM categories WHERE name = ?';
    const rows = await executeQuery(sql, [name]);
    return rows.length > 0 ? new Category(rows[0]) : null;
  }

  static async create(categoryData) {
    const { name, description, color } = categoryData;
    
    const sql = `
      INSERT INTO categories (name, description, color)
      VALUES (?, ?, ?)
    `;
    
    const result = await executeQuery(sql, [name, description || null, color || '#3b82f6']);
    return await Category.findById(result.insertId);
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
    const sql = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    
    await executeQuery(sql, params);
    return await Category.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    await executeQuery(sql, [id]);
    return true;
  }

  static async getWithCounts() {
    const sql = `
      SELECT 
        c.*,
        COUNT(ik.id) as knowledge_count
      FROM categories c
      LEFT JOIN investment_knowledge ik ON c.id = ik.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const rows = await executeQuery(sql);
    return rows.map(row => ({
      ...new Category(row),
      knowledge_count: row.knowledge_count
    }));
  }
}

module.exports = Category;















