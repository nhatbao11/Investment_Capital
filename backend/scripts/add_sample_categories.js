const { executeQuery } = require('../src/config/database');

async function addSampleCategories() {
  try {
    console.log('Đang thêm categories mẫu...');
    
    // Thêm categories cho ngành
    const nganhCategories = [
      { name: 'Ngân hàng', description: 'Phân tích ngành ngân hàng', color: '#3b82f6' },
      { name: 'Bất động sản', description: 'Phân tích ngành bất động sản', color: '#10b981' },
      { name: 'Công nghệ', description: 'Phân tích ngành công nghệ', color: '#f59e0b' },
      { name: 'Năng lượng', description: 'Phân tích ngành năng lượng', color: '#ef4444' }
    ];
    
    for (const category of nganhCategories) {
      try {
        await executeQuery(`
          INSERT INTO post_categories (name, description, color, category_type) 
          VALUES (?, ?, ?, 'nganh')
        `, [category.name, category.description, category.color]);
        console.log(`✅ Thêm danh mục ngành: ${category.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Danh mục ngành đã tồn tại: ${category.name}`);
        } else {
          console.error(`❌ Lỗi thêm danh mục ngành ${category.name}:`, err.message);
        }
      }
    }
    
    // Thêm categories cho doanh nghiệp
    const doanhNghiepCategories = [
      { name: 'Ngân hàng thương mại', description: 'Phân tích các ngân hàng thương mại', color: '#3b82f6' },
      { name: 'Công ty bất động sản', description: 'Phân tích các công ty bất động sản', color: '#10b981' },
      { name: 'Công ty công nghệ', description: 'Phân tích các công ty công nghệ', color: '#f59e0b' },
      { name: 'Công ty năng lượng', description: 'Phân tích các công ty năng lượng', color: '#ef4444' }
    ];
    
    for (const category of doanhNghiepCategories) {
      try {
        await executeQuery(`
          INSERT INTO post_categories (name, description, color, category_type) 
          VALUES (?, ?, ?, 'doanh_nghiep')
        `, [category.name, category.description, category.color]);
        console.log(`✅ Thêm danh mục doanh nghiệp: ${category.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Danh mục doanh nghiệp đã tồn tại: ${category.name}`);
        } else {
          console.error(`❌ Lỗi thêm danh mục doanh nghiệp ${category.name}:`, err.message);
        }
      }
    }
    
    // Kiểm tra kết quả
    const nganhCount = await executeQuery('SELECT COUNT(*) as count FROM post_categories WHERE category_type = "nganh"');
    const doanhNghiepCount = await executeQuery('SELECT COUNT(*) as count FROM post_categories WHERE category_type = "doanh_nghiep"');
    
    console.log(`📊 Tổng kết:`);
    console.log(`   - Danh mục ngành: ${nganhCount[0].count}`);
    console.log(`   - Danh mục doanh nghiệp: ${doanhNghiepCount[0].count}`);
    
    console.log('🎉 Hoàn thành! Categories mẫu đã được thêm.');
    
  } catch (error) {
    console.error('❌ Lỗi khi thêm categories mẫu:', error);
    process.exit(1);
  }
}

addSampleCategories();
