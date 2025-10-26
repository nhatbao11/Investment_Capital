const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const connection = await mysql.createConnection({
    host: '103.75.183.131',
    port: 3306,
    user: 'ytcapital_user',
    password: 'Ytcapital@123',
    database: 'ytcapital_db'
  });

  try {
    // Hash password
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    // Insert admin user
    await connection.execute(
      `INSERT INTO users (email, password, full_name, role, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      ['admin@ytcapital.com', hashedPassword, 'Admin User', 'admin', true]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@ytcapital.com');
    console.log('Password: admin123');
    
    // Insert test client user
    const clientPassword = bcrypt.hashSync('client123', 10);
    await connection.execute(
      `INSERT INTO users (email, password, full_name, role, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      ['client@test.com', clientPassword, 'Test Client', 'client', true]
    );
    
    console.log('✅ Test client user created successfully!');
    console.log('Email: client@test.com');
    console.log('Password: client123');
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️ Users already exist in database');
    } else {
      console.error('❌ Error creating users:', error.message);
    }
  } finally {
    await connection.end();
  }
}

createTestUser();




















































