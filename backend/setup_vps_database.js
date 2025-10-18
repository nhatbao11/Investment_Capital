const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: '103.75.183.131',
    port: 3306,
    user: 'ytcapital_user',
    password: 'Ytcapital@123',
    database: 'ytcapital_db',
    ssl: false,
    multipleStatements: true
  });

  try {
    console.log('Connecting to VPS database...');
    
    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'client') DEFAULT 'client',
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        category ENUM('nganh', 'doanh_nghiep') NOT NULL,
        thumbnail_url VARCHAR(500),
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        view_count INT DEFAULT 0,
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        content TEXT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        company VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Insert sample data
    await connection.execute(`
      INSERT IGNORE INTO users (id, full_name, email, password, role) VALUES
      (1, 'Admin User', 'admin@ytcapital.com', '$2b$10$example', 'admin'),
      (2, 'Test User', 'test@test.com', '$2b$10$example', 'client')
    `);

    await connection.execute(`
      INSERT IGNORE INTO posts (id, title, content, category, thumbnail_url, status, author) VALUES
      (1, 'Phân tích ngành ngân hàng Việt Nam 2024', 'Ngành ngân hàng Việt Nam đang trải qua giai đoạn chuyển đổi số mạnh mẽ...', 'nganh', '/images/phantichnganh.png', 'published', 'Chuyên gia tài chính'),
      (2, 'Báo cáo phân tích Công ty Cổ phần FPT', 'FPT là một trong những công ty công nghệ hàng đầu Việt Nam...', 'doanh_nghiep', '/images/phantichdoanhnghiep.jpg', 'published', 'Chuyên gia phân tích'),
      (3, 'Triển vọng ngành bất động sản 2024', 'Thị trường bất động sản Việt Nam đang có những tín hiệu tích cực...', 'nganh', '/images/phantichnganh.png', 'published', 'Chuyên gia bất động sản')
    `);

    await connection.execute(`
      INSERT IGNORE INTO feedbacks (id, user_id, content, rating, company, status) VALUES
      (1, 2, 'Dịch vụ tư vấn đầu tư rất chuyên nghiệp, giúp tôi hiểu rõ hơn về thị trường.', 5, 'Công ty ABC', 'approved'),
      (2, 2, 'Phân tích ngành rất chi tiết và chính xác. Tôi đã áp dụng và có kết quả tốt.', 4, 'Công ty XYZ', 'approved'),
      (3, 2, 'Đội ngũ chuyên gia có kinh nghiệm, tư vấn nhiệt tình và tận tâm.', 5, 'Công ty DEF', 'approved')
    `);

    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();















