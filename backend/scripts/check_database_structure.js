const { executeQuery } = require('../src/config/database');

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Kiểm tra cấu trúc database...');
    
    // Kiểm tra cấu trúc bảng posts
    const postsStructure = await executeQuery('SHOW CREATE TABLE posts');
    console.log('📋 Cấu trúc bảng posts:');
    console.log(postsStructure[0]['Create Table']);
    
    // Kiểm tra foreign key constraints
    const constraints = await executeQuery(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME,
        DELETE_RULE,
        UPDATE_RULE
      FROM information_schema.KEY_COLUMN_USAGE kcu
      JOIN information_schema.REFERENTIAL_CONSTRAINTS rc 
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
      WHERE kcu.TABLE_NAME = 'posts' 
        AND kcu.TABLE_SCHEMA = 'yt_capital_db'
        AND kcu.COLUMN_NAME = 'category_id'
    `);
    
    console.log('\n🔗 Foreign key constraints cho category_id:');
    constraints.forEach(constraint => {
      console.log(`   - ${constraint.CONSTRAINT_NAME}: ${constraint.COLUMN_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
      console.log(`     DELETE: ${constraint.DELETE_RULE}, UPDATE: ${constraint.UPDATE_RULE}`);
    });
    
    // Kiểm tra bảng post_categories
    const postCategories = await executeQuery('SELECT * FROM post_categories ORDER BY category_type, name');
    console.log('\n📂 Danh mục hiện có:');
    postCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.category_type}) - ID: ${cat.id}`);
    });
    
    // Kiểm tra bài viết hiện có
    const posts = await executeQuery('SELECT id, title, category, category_id FROM posts ORDER BY created_at DESC LIMIT 5');
    console.log('\n📝 Bài viết gần đây:');
    posts.forEach(post => {
      console.log(`   - ${post.title} (${post.category}) - Category ID: ${post.category_id}`);
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error);
  }
}

checkDatabaseStructure();
