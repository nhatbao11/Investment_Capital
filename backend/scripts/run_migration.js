const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root', // Try common password
  database: 'ytcapital_db'
};

async function runMigration() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check if pdf_url column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'investment_knowledge' AND COLUMN_NAME = 'pdf_url'
    `, [dbConfig.database]);

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
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration if this script is called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
