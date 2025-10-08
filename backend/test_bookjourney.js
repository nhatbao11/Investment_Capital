const { executeQuery } = require('./src/config/database');

async function testBookJourney() {
  try {
    console.log('🔗 Testing BookJourney API...');
    
    // Test database connection
    const testQuery = 'SELECT COUNT(*) as count FROM bookjourney';
    const result = await executeQuery(testQuery);
    console.log('✅ Database connection OK');
    console.log('📊 BookJourney count:', result[0].count);
    
    // Test getAll query
    const getAllQuery = `
      SELECT bj.*, u.full_name as author_name
      FROM bookjourney bj
      LEFT JOIN users u ON bj.author_id = u.id
      WHERE bj.status = 'published'
      ORDER BY bj.created_at DESC
      LIMIT 10
    `;
    
    const books = await executeQuery(getAllQuery);
    console.log('📚 Books found:', books.length);
    console.log('📖 First book:', books[0] ? books[0].title : 'No books');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testBookJourney();

