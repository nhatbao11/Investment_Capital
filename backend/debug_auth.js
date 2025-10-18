const { executeQuery } = require('./src/config/database');

async function testAuth() {
  try {
    console.log('Testing authentication data...');
    
    // Test users table
    const usersResult = await executeQuery('SELECT id, email, full_name, role FROM users LIMIT 5');
    console.log('Users:', usersResult);
    
    // Test posts with author info
    const postsResult = await executeQuery(`
      SELECT p.*, u.full_name as author_name, u.role as author_role
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 3
    `);
    console.log('Posts with author info:', postsResult);
    
    // Test admin user specifically
    const adminResult = await executeQuery("SELECT * FROM users WHERE role = 'admin'");
    console.log('Admin users:', adminResult);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();












