const { executeQuery } = require('../src/config/database');

async function setupPostCategories() {
  try {
    // Create table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS post_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#6B7280',
        category_type ENUM('nganh', 'doanh_nghiep') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category_type (category_type),
        INDEX idx_name (name)
      )
    `);
    console.log('✅ Table post_categories created');

    // Insert sample categories for nganh (sectors)
    const nganhCategories = [
      ['Ngân hàng', 'Phân tích ngành ngân hàng và tài chính', '#3B82F6'],
      ['Công nghiệp', 'Phân tích ngành công nghiệp và sản xuất', '#10B981'],
      ['Bất động sản', 'Phân tích ngành bất động sản', '#F59E0B'],
      ['Công nghệ', 'Phân tích ngành công nghệ thông tin', '#8B5CF6'],
      ['Năng lượng', 'Phân tích ngành năng lượng', '#EF4444'],
      ['Y tế', 'Phân tích ngành y tế và dược phẩm', '#06B6D4']
    ];

    for (const [name, description, color] of nganhCategories) {
      await executeQuery(
        'INSERT IGNORE INTO post_categories (name, description, color, category_type) VALUES (?, ?, ?, ?)',
        [name, description, color, 'nganh']
      );
    }
    console.log('✅ Nganh categories inserted');

    // Insert sample categories for doanh_nghiep (companies)
    const doanhNghiepCategories = [
      ['Ngân hàng', 'Phân tích các doanh nghiệp ngân hàng', '#3B82F6'],
      ['Công nghiệp', 'Phân tích các doanh nghiệp công nghiệp', '#10B981'],
      ['Bất động sản', 'Phân tích các doanh nghiệp bất động sản', '#F59E0B'],
      ['Công nghệ', 'Phân tích các doanh nghiệp công nghệ', '#8B5CF6'],
      ['Năng lượng', 'Phân tích các doanh nghiệp năng lượng', '#EF4444'],
      ['Y tế', 'Phân tích các doanh nghiệp y tế', '#06B6D4']
    ];

    for (const [name, description, color] of doanhNghiepCategories) {
      await executeQuery(
        'INSERT IGNORE INTO post_categories (name, description, color, category_type) VALUES (?, ?, ?, ?)',
        [name, description, color, 'doanh_nghiep']
      );
    }
    console.log('✅ Doanh nghiep categories inserted');

    console.log('🎉 Post categories setup completed!');
  } catch (error) {
    console.error('❌ Error setting up post categories:', error);
  }
}

setupPostCategories();




