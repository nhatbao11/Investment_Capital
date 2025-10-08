const mysql = require('mysql2/promise');

async function testConnection() {
  const configs = [
    {
      name: 'VPS with ytcapital_user',
      host: '103.75.183.131',
      port: 3306,
      user: 'ytcapital_user',
      password: 'Ytcapital@123',
      database: 'ytcapital_db'
    },
    {
      name: 'VPS with root',
      host: '103.75.183.131',
      port: 3306,
      user: 'root',
      password: 'Ytcapital@123',
      database: 'ytcapital_db'
    },
    {
      name: 'VPS without database',
      host: '103.75.183.131',
      port: 3306,
      user: 'root',
      password: 'Ytcapital@123'
    }
  ];

  for (const config of configs) {
    try {
      console.log(`\nTesting ${config.name}...`);
      const connection = await mysql.createConnection({
        ...config,
        ssl: false,
        multipleStatements: true
      });
      
      console.log(`✅ ${config.name} - Connection successful!`);
      
      // Test basic query
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log(`✅ ${config.name} - Query test successful!`);
      
      await connection.end();
      
    } catch (error) {
      console.log(`❌ ${config.name} - Failed: ${error.message}`);
    }
  }
}

testConnection();















