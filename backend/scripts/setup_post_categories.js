const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Đọc file SQL
const sqlFile = path.join(__dirname, 'create_post_categories_table.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Tách các câu lệnh SQL
const statements = sqlContent
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

async function setupPostCategories() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'investment_capital'
    });

    console.log('✅ Kết nối database thành công');

    // Thực thi từng câu lệnh SQL
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`📝 Thực thi: ${statement.substring(0, 50)}...`);
        await connection.execute(statement);
      }
    }

    console.log('✅ Tạo bảng post_categories thành công');

    // Thêm một số danh mục mẫu
    const sampleCategories = [
      // Danh mục ngành
      { name: 'Ngân hàng', description: 'Phân tích ngành ngân hàng', color: '#3b82f6', category_type: 'nganh' },
      { name: 'Bất động sản', description: 'Phân tích ngành bất động sản', color: '#10b981', category_type: 'nganh' },
      { name: 'Công nghệ', description: 'Phân tích ngành công nghệ', color: '#f59e0b', category_type: 'nganh' },
      { name: 'Năng lượng', description: 'Phân tích ngành năng lượng', color: '#ef4444', category_type: 'nganh' },
      
      // Danh mục doanh nghiệp
      { name: 'Ngân hàng thương mại', description: 'Phân tích các ngân hàng thương mại', color: '#3b82f6', category_type: 'doanh_nghiep' },
      { name: 'Công ty bất động sản', description: 'Phân tích các công ty bất động sản', color: '#10b981', category_type: 'doanh_nghiep' },
      { name: 'Công ty công nghệ', description: 'Phân tích các công ty công nghệ', color: '#f59e0b', category_type: 'doanh_nghiep' },
      { name: 'Công ty năng lượng', description: 'Phân tích các công ty năng lượng', color: '#ef4444', category_type: 'doanh_nghiep' }
    ];

    for (const category of sampleCategories) {
      try {
        await connection.execute(
          'INSERT INTO post_categories (name, description, color, category_type) VALUES (?, ?, ?, ?)',
          [category.name, category.description, category.color, category.category_type]
        );
        console.log(`✅ Thêm danh mục: ${category.name} (${category.category_type})`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Danh mục đã tồn tại: ${category.name}`);
        } else {
          console.error(`❌ Lỗi thêm danh mục ${category.name}:`, error.message);
        }
      }
    }

    console.log('✅ Hoàn thành setup post_categories');

  } catch (error) {
    console.error('❌ Lỗi setup post_categories:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Chạy script
if (require.main === module) {
  setupPostCategories()
    .then(() => {
      console.log('🎉 Setup post_categories hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup post_categories thất bại:', error);
      process.exit(1);
    });
}

module.exports = { setupPostCategories };