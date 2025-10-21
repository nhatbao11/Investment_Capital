const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupViewTracking() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'yt_capital_db'
    });

    console.log('Connected to database');

    // Read and execute SQL file
    const sqlFile = path.join(__dirname, 'add_view_tracking_table.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL content by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_KEYNAME') {
            console.log('⚠️  Already exists:', statement.substring(0, 50) + '...');
          } else {
            console.error('❌ Error executing:', statement.substring(0, 50) + '...', error.message);
          }
        }
      }
    }

    console.log('✅ View tracking setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up view tracking:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupViewTracking();
