const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupCategories() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ytcapital_db'
    });

    console.log('Connected to database');

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3b82f6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Categories table created');

    // Insert default categories
    const defaultCategories = [
      ['Phân tích cơ bản', 'Phân tích tài chính, báo cáo doanh nghiệp', '#3b82f6'],
      ['Phân tích kỹ thuật', 'Biểu đồ, chỉ báo kỹ thuật', '#10b981'],
      ['Chiến lược đầu tư', 'Các phương pháp đầu tư dài hạn', '#f59e0b'],
      ['Quản lý rủi ro', 'Đánh giá và kiểm soát rủi ro', '#ef4444'],
      ['Thị trường chứng khoán', 'Kiến thức về thị trường', '#8b5cf6'],
      ['Bất động sản', 'Đầu tư bất động sản', '#06b6d4'],
      ['Tiền điện tử', 'Cryptocurrency và blockchain', '#84cc16'],
      ['Kinh tế vĩ mô', 'Chính sách kinh tế, lãi suất', '#f97316']
    ];

    for (const [name, description, color] of defaultCategories) {
      await connection.execute(`
        INSERT IGNORE INTO categories (name, description, color)
        VALUES (?, ?, ?)
      `, [name, description, color]);
    }

    console.log('Default categories inserted');

    // Add category_id column to investment_knowledge table
    try {
      await connection.execute(`
        ALTER TABLE investment_knowledge 
        ADD COLUMN category_id INT AFTER author_id
      `);
      console.log('category_id column added to investment_knowledge');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('category_id column already exists');
      } else {
        throw error;
      }
    }

    // Add foreign key constraint
    try {
      await connection.execute(`
        ALTER TABLE investment_knowledge 
        ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      `);
      console.log('Foreign key constraint added');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('Foreign key constraint already exists');
      } else {
        throw error;
      }
    }

    // Update existing records to have a default category
    await connection.execute(`
      UPDATE investment_knowledge 
      SET category_id = 1 
      WHERE category_id IS NULL
    `);

    console.log('Existing records updated with default category');

    console.log('✅ Categories setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up categories:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupCategories();





























