const mysql = require('mysql2/promise');

async function addPdfColumn() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    
    // Try different connection configs
    const configs = [
      { host: 'localhost', user: 'root', password: '', database: 'ytcapital_db' },
      { host: 'localhost', user: 'root', password: 'root', database: 'ytcapital_db' },
      { host: 'localhost', user: 'root', password: '123456', database: 'ytcapital_db' },
      { host: 'localhost', user: 'root', password: 'password', database: 'ytcapital_db' }
    ];
    
    for (const config of configs) {
      try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to database');
        break;
      } catch (err) {
        console.log(`❌ Failed with config: ${config.user}@${config.host} (password: ${config.password ? '***' : 'none'})`);
        continue;
      }
    }
    
    if (!connection) {
      console.log('❌ Could not connect to database with any config');
      console.log('📋 Please run this SQL manually in your MySQL client:');
      console.log('');
      console.log('USE ytcapital_db;');
      console.log('ALTER TABLE investment_knowledge ADD COLUMN pdf_url VARCHAR(500) AFTER image_url;');
      console.log('');
      return;
    }

    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'investment_knowledge' AND COLUMN_NAME = 'pdf_url'
    `, ['ytcapital_db']);

    if (columns.length > 0) {
      console.log('⚠️  Column pdf_url already exists, skipping migration');
      return;
    }

    // Add pdf_url column
    console.log('📝 Adding pdf_url column to investment_knowledge table...');
    await connection.execute(`
      ALTER TABLE investment_knowledge 
      ADD COLUMN pdf_url VARCHAR(500) AFTER image_url
    `);
    
    console.log('✅ Migration completed successfully!');
    console.log('📋 Column pdf_url added to investment_knowledge table');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('📋 Please run this SQL manually in your MySQL client:');
    console.log('');
    console.log('USE ytcapital_db;');
    console.log('ALTER TABLE investment_knowledge ADD COLUMN pdf_url VARCHAR(500) AFTER image_url;');
    console.log('');
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addPdfColumn();


















