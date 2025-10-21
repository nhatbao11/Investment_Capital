const mysql = require('mysql2/promise');

// VPS Database configuration
const dbConfig = {
  host: 'your-vps-host',
  user: 'your-username', 
  password: 'your-password',
  database: 'your-database-name'
};

async function addCategoryIdToInvestmentKnowledge() {
  let connection;
  
  try {
    console.log('Connecting to VPS database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Adding category_id column to investment_knowledge table...');
    
    // Check if category_id column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'investment_knowledge' 
      AND COLUMN_NAME = 'category_id'
    `, [dbConfig.database]);
    
    if (columns.length > 0) {
      console.log('category_id column already exists, skipping...');
      return;
    }
    
    // Add category_id column
    await connection.execute(`
      ALTER TABLE investment_knowledge 
      ADD COLUMN category_id INT DEFAULT NULL
    `);
    
    console.log('Added category_id column');
    
    // Add index
    await connection.execute(`
      ALTER TABLE investment_knowledge 
      ADD INDEX idx_category_id (category_id)
    `);
    
    console.log('Added index for category_id');
    
    // Add foreign key constraint
    await connection.execute(`
      ALTER TABLE investment_knowledge 
      ADD CONSTRAINT fk_investment_knowledge_category_id 
      FOREIGN KEY (category_id) 
      REFERENCES categories(id) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);
    
    console.log('Added foreign key constraint');
    console.log('✅ Successfully added category_id to investment_knowledge table!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ER_DUP_KEYNAME') {
      console.log('Index already exists, continuing...');
    } else if (error.code === 'ER_FK_DUP_NAME') {
      console.log('Foreign key constraint already exists, continuing...');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addCategoryIdToInvestmentKnowledge()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
