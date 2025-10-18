const mysql = require('mysql2/promise');

async function testQuery() {
  const connection = await mysql.createConnection({
    host: '103.75.183.131',
    port: 3306,
    user: 'yt_backend',
    password: 'Ytcapital@123',
    database: 'yt_capital_db',
    ssl: false,
    multipleStatements: true
  });

  try {
    console.log('Testing direct query...');
    
    // Test the exact query from Feedback.findAll
    const sql = `
      SELECT f.*, f.name as user_name, u.email as user_email
      FROM feedbacks f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE 1=1
      AND f.status = ? 
      ORDER BY f.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const params = ['approved', Number(10), Number(0)];
    
    console.log('SQL:', sql);
    console.log('Params:', params);
    
    const [rows] = await connection.execute(sql, params);
    console.log('✅ Query successful!');
    console.log('Results:', rows);
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await connection.end();
  }
}

testQuery();
