const { executeQuery } = require('../src/config/database');

async function fixCategoriesMixup() {
  try {
    console.log('🔧 Đang sửa lỗi danh mục bị lộn xộn...');
    
    // Xóa tất cả categories hiện tại
    await executeQuery('DELETE FROM post_categories');
    console.log('🗑️  Đã xóa tất cả categories cũ');
    
    // Thêm lại categories đúng cho NGÀNH
    const nganhCategories = [
      { name: 'Ngân hàng', description: 'Phân tích ngành ngân hàng', color: '#3b82f6' },
      { name: 'Bất động sản', description: 'Phân tích ngành bất động sản', color: '#10b981' },
      { name: 'Công nghệ', description: 'Phân tích ngành công nghệ', color: '#f59e0b' },
      { name: 'Năng lượng', description: 'Phân tích ngành năng lượng', color: '#ef4444' },
      { name: 'Thực phẩm', description: 'Phân tích ngành thực phẩm', color: '#8b5cf6' },
      { name: 'Y tế', description: 'Phân tích ngành y tế', color: '#06b6d4' }
    ];
    
    for (const category of nganhCategories) {
      await executeQuery(`
        INSERT INTO post_categories (name, description, color, category_type) 
        VALUES (?, ?, ?, 'nganh')
      `, [category.name, category.description, category.color]);
      console.log(`✅ Thêm danh mục NGÀNH: ${category.name}`);
    }
    
    // Thêm categories đúng cho DOANH NGHIỆP
    const doanhNghiepCategories = [
      { name: 'Ngân hàng thương mại', description: 'Phân tích các ngân hàng thương mại', color: '#3b82f6' },
      { name: 'Công ty bất động sản', description: 'Phân tích các công ty bất động sản', color: '#10b981' },
      { name: 'Công ty công nghệ', description: 'Phân tích các công ty công nghệ', color: '#f59e0b' },
      { name: 'Công ty năng lượng', description: 'Phân tích các công ty năng lượng', color: '#ef4444' },
      { name: 'Công ty thực phẩm', description: 'Phân tích các công ty thực phẩm', color: '#8b5cf6' },
      { name: 'Công ty y tế', description: 'Phân tích các công ty y tế', color: '#06b6d4' }
    ];
    
    for (const category of doanhNghiepCategories) {
      await executeQuery(`
        INSERT INTO post_categories (name, description, color, category_type) 
        VALUES (?, ?, ?, 'doanh_nghiep')
      `, [category.name, category.description, category.color]);
      console.log(`✅ Thêm danh mục DOANH NGHIỆP: ${category.name}`);
    }
    
    // Kiểm tra kết quả
    const nganhCount = await executeQuery('SELECT COUNT(*) as count FROM post_categories WHERE category_type = "nganh"');
    const doanhNghiepCount = await executeQuery('SELECT COUNT(*) as count FROM post_categories WHERE category_type = "doanh_nghiep"');
    
    console.log(`\n📊 Tổng kết:`);
    console.log(`   - Danh mục NGÀNH: ${nganhCount[0].count}`);
    console.log(`   - Danh mục DOANH NGHIỆP: ${doanhNghiepCount[0].count}`);
    
    // Hiển thị danh sách chi tiết
    const allCategories = await executeQuery('SELECT * FROM post_categories ORDER BY category_type, name');
    console.log(`\n📋 Danh sách categories mới:`);
    allCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.category_type}) - ID: ${cat.id}`);
    });
    
    console.log('\n🎉 Hoàn thành! Categories đã được sửa đúng.');
    
  } catch (error) {
    console.error('❌ Lỗi khi sửa categories:', error);
    process.exit(1);
  }
}

fixCategoriesMixup();
