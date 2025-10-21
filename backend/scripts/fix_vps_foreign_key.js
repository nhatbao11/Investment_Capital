const { executeQuery } = require('../src/config/database');

async function fixVPSPostsForeignKey() {
  try {
    console.log('Đang sửa foreign key constraint cho bảng posts trên VPS...');
    
    // Kiểm tra constraints hiện tại
    const constraints = await executeQuery(`
      SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_NAME = 'posts' 
      AND TABLE_SCHEMA = 'yt_capital_db'
      AND COLUMN_NAME = 'category_id'
    `);
    
    console.log('Constraints hiện tại trên VPS:', constraints);
    
    // Xóa tất cả foreign key constraints liên quan đến category_id
    for (const constraint of constraints) {
      if (constraint.CONSTRAINT_NAME) {
        try {
          await executeQuery(`ALTER TABLE posts DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
          console.log(`✅ Đã xóa constraint: ${constraint.CONSTRAINT_NAME}`);
        } catch (err) {
          console.log(`⚠️  Không thể xóa constraint ${constraint.CONSTRAINT_NAME}:`, err.message);
        }
      }
    }
    
    // Thêm foreign key constraint mới đúng
    try {
      await executeQuery(`
        ALTER TABLE posts
        ADD CONSTRAINT fk_posts_category_id
            FOREIGN KEY (category_id)
            REFERENCES post_categories(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
      `);
      console.log('✅ Đã thêm foreign key constraint mới trên VPS');
    } catch (err) {
      if (err.code === 'ER_FK_DUP_NAME') {
        console.log('✅ Foreign key constraint đã tồn tại và đúng trên VPS');
      } else {
        throw err;
      }
    }
    
    console.log('🎉 Hoàn thành! Foreign key constraint trên VPS đã được sửa.');
    
  } catch (error) {
    console.error('❌ Lỗi khi sửa foreign key constraint trên VPS:', error);
    process.exit(1);
  }
}

fixVPSPostsForeignKey();
