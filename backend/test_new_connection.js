const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testing connection with new credentials...');
    const connection = await mysql.createConnection({
      host: '103.75.183.131',
      port: 3306,
      user: 'yt_backend',
      password: 'Ytcapital@123',
      database: 'yt_capital_db',
      ssl: false,
      multipleStatements: true
    });
    
    console.log('✅ Connection successful!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful!');
    
    // Test if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Existing tables:', tables);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();















