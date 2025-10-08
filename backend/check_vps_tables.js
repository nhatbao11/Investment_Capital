const mysql = require('mysql2/promise');

async function checkTables() {
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
    console.log('Checking VPS database tables...');
    
    // Check users table structure
    const [usersStructure] = await connection.execute('DESCRIBE users');
    console.log('\n📋 Users table structure:');
    console.table(usersStructure);
    
    // Check posts table structure
    const [postsStructure] = await connection.execute('DESCRIBE posts');
    console.log('\n📋 Posts table structure:');
    console.table(postsStructure);
    
    // Check feedbacks table structure
    const [feedbacksStructure] = await connection.execute('DESCRIBE feedbacks');
    console.log('\n📋 Feedbacks table structure:');
    console.table(feedbacksStructure);
    
    // Check data in tables
    const [usersData] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('\n📊 Users count:', usersData[0].count);
    
    const [postsData] = await connection.execute('SELECT COUNT(*) as count FROM posts');
    console.log('📊 Posts count:', postsData[0].count);
    
    const [feedbacksData] = await connection.execute('SELECT COUNT(*) as count FROM feedbacks');
    console.log('📊 Feedbacks count:', feedbacksData[0].count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTables();















