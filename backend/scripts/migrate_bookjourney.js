const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'investment_user',
  password: process.env.DB_PASSWORD || 'your_secure_password_here',
  database: process.env.DB_NAME || 'investment_capital',
  multipleStatements: true
};

async function migrateBookJourney() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Create bookjourney table
    console.log('📚 Creating bookjourney table...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS bookjourney (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        pdf_url VARCHAR(500) NOT NULL,
        author_id INT NOT NULL,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        view_count INT DEFAULT 0,
        download_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_author (author_id),
        INDEX idx_created_at (created_at),
        INDEX idx_view_count (view_count)
      );
    `;
    
    await connection.execute(createTableSQL);
    console.log('✅ BookJourney table created successfully');

    // Insert sample data
    console.log('📖 Inserting sample bookjourney data...');
    
    // Get admin user ID
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users WHERE role = "admin" LIMIT 1'
    );
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    const adminId = adminUsers[0].id;
    
    const sampleBooks = [
      {
        title: 'Lý Thuyết Dow - Nền Tảng Phân Tích Kỹ Thuật',
        description: 'Cuốn sách kinh điển về lý thuyết Dow, nền tảng của phân tích kỹ thuật hiện đại. Tìm hiểu về các nguyên lý cơ bản của xu hướng thị trường.',
        image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        pdf_url: '/uploads/reports/dow_theory_guide.pdf',
        author_id: adminId,
        status: 'published'
      },
      {
        title: 'Sóng Elliott - Phân Tích Chu Kỳ Thị Trường',
        description: 'Khám phá lý thuyết sóng Elliott và cách áp dụng trong phân tích chu kỳ thị trường. Học cách nhận diện các mẫu sóng và dự đoán xu hướng.',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        pdf_url: '/uploads/reports/elliott_wave_analysis.pdf',
        author_id: adminId,
        status: 'published'
      },
      {
        title: 'Fibonacci - Tỷ Lệ Vàng Trong Đầu Tư',
        description: 'Tìm hiểu về tỷ lệ Fibonacci và ứng dụng trong phân tích kỹ thuật. Cách sử dụng các mức hồi lại và mở rộng để tìm điểm vào/lệnh.',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop',
        pdf_url: '/uploads/reports/fibonacci_trading.pdf',
        author_id: adminId,
        status: 'published'
      },
      {
        title: 'Tâm Lý Thị Trường - Đọc Vị Đám Đông',
        description: 'Phân tích tâm lý thị trường và hành vi của đám đông. Học cách nhận diện các dấu hiệu tâm lý để đưa ra quyết định đầu tư đúng đắn.',
        image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=600&fit=crop',
        pdf_url: '/uploads/reports/market_psychology.pdf',
        author_id: adminId,
        status: 'published'
      },
      {
        title: 'Quản Lý Rủi Ro - Bảo Vệ Vốn Đầu Tư',
        description: 'Các chiến lược quản lý rủi ro hiệu quả trong đầu tư. Học cách bảo vệ vốn và tối ưu hóa tỷ lệ rủi ro/lợi nhuận.',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
        pdf_url: '/uploads/reports/risk_management.pdf',
        author_id: adminId,
        status: 'published'
      },
      {
        title: 'Phân Tích Cơ Bản - Đánh Giá Giá Trị Doanh Nghiệp',
        description: 'Hướng dẫn phân tích cơ bản và đánh giá giá trị nội tại của doanh nghiệp. Các chỉ số tài chính quan trọng và cách sử dụng.',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop',
        pdf_url: '/uploads/reports/fundamental_analysis.pdf',
        author_id: adminId,
        status: 'published'
      }
    ];

    for (const book of sampleBooks) {
      await connection.execute(
        `INSERT INTO bookjourney (title, description, image_url, pdf_url, author_id, status, view_count, download_count) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.title,
          book.description,
          book.image_url,
          book.pdf_url,
          book.author_id,
          book.status,
          Math.floor(Math.random() * 1000) + 100, // Random view count
          Math.floor(Math.random() * 200) + 50    // Random download count
        ]
      );
    }
    
    console.log('✅ Sample bookjourney data inserted successfully');
    
    // Show summary
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM bookjourney');
    console.log(`📊 Total bookjourney records: ${countResult[0].total}`);
    
    console.log('🎉 BookJourney migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration
if (require.main === module) {
  migrateBookJourney()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateBookJourney };

