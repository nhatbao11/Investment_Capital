const mysql = require('mysql2/promise');

async function testDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ytcapital_db'
  });

  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Test feedbacks table
    try {
      const [feedbacks] = await connection.execute('SELECT COUNT(*) as count FROM feedbacks');
      console.log('✅ Feedbacks table exists, count:', feedbacks[0].count);
    } catch (error) {
      console.log('❌ Feedbacks table error:', error.message);
    }
    
    // Test posts table
    try {
      const [posts] = await connection.execute('SELECT COUNT(*) as count FROM posts');
      console.log('✅ Posts table exists, count:', posts[0].count);
    } catch (error) {
      console.log('❌ Posts table error:', error.message);
    }
    
    // Test users table
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log('✅ Users table exists, count:', users[0].count);
    } catch (error) {
      console.log('❌ Users table error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await connection.end();
  }
}

testDatabase();
