const { executeQuery } = require('./src/config/database');

async function testPosts() {
  try {
    console.log('Testing posts query...');
    
    // Test simple query first
    const simpleResult = await executeQuery('SELECT COUNT(*) as count FROM posts');
    console.log('Posts count:', simpleResult);
    
    // Test the actual query from getLatest
    const latestResult = await executeQuery(`
      SELECT p.*, u.full_name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 3
    `);
    console.log('Latest posts:', latestResult);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPosts();












