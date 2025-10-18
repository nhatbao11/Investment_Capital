const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Migration script để thêm bảng investment_knowledge
 */

const migrateInvestmentKnowledge = async () => {
  let connection;
  
  try {
    console.log('🔄 Starting investment knowledge migration...');
    
    // Kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'yt_capital_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Kiểm tra xem bảng đã tồn tại chưa
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'investment_knowledge'
    `, [process.env.DB_NAME || 'yt_capital_db']);

    if (tables.length > 0) {
      console.log('⚠️  Table investment_knowledge already exists');
      return;
    }

    // Tạo bảng investment_knowledge
    const createTableSQL = `
      CREATE TABLE investment_knowledge (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(500) NOT NULL,
        image_url VARCHAR(500),
        content LONGTEXT NOT NULL,
        meaning TEXT,
        author_id INT NOT NULL,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_author (author_id),
        INDEX idx_created_at (created_at)
      )
    `;

    await connection.execute(createTableSQL);
    console.log('✅ Table investment_knowledge created successfully');

    // Thêm dữ liệu mẫu
    const insertSampleDataSQL = `
      INSERT INTO investment_knowledge (title, image_url, content, meaning, author_id, status) VALUES
      (
        'Chiến lược đầu tư dài hạn',
        '/images/investment1.jpg',
        '<h3>Giới thiệu về đầu tư dài hạn</h3><p>Đầu tư dài hạn là một chiến lược đầu tư tập trung vào việc nắm giữ các tài sản trong một khoảng thời gian dài, thường từ 5 năm trở lên. Chiến lược này dựa trên niềm tin rằng thị trường tài chính sẽ tăng trưởng theo thời gian, bất chấp những biến động ngắn hạn.</p><h4>Lợi ích của đầu tư dài hạn:</h4><ul><li>Giảm thiểu tác động của biến động thị trường ngắn hạn</li><li>Tận dụng lãi kép (compound interest)</li><li>Giảm chi phí giao dịch</li><li>Giảm stress và thời gian theo dõi thị trường</li></ul>',
        'Đầu tư dài hạn giúp nhà đầu tư xây dựng tài sản một cách bền vững và ổn định, phù hợp với mục tiêu tài chính dài hạn như nghỉ hưu, giáo dục con cái, hoặc mua nhà.',
        1,
        'published'
      ),
      (
        'Quản lý rủi ro trong đầu tư',
        '/images/investment2.jpg',
        '<h3>Hiểu về rủi ro trong đầu tư</h3><p>Rủi ro là một phần không thể tránh khỏi trong đầu tư. Việc hiểu và quản lý rủi ro hiệu quả là chìa khóa để thành công trong đầu tư dài hạn.</p><h4>Các loại rủi ro chính:</h4><ul><li><strong>Rủi ro thị trường:</strong> Biến động giá do các yếu tố kinh tế vĩ mô</li><li><strong>Rủi ro thanh khoản:</strong> Khó khăn trong việc bán tài sản</li><li><strong>Rủi ro tín dụng:</strong> Khả năng mất vốn do đối tác không thực hiện nghĩa vụ</li><li><strong>Rủi ro lạm phát:</strong> Sức mua giảm theo thời gian</li></ul><h4>Chiến lược quản lý rủi ro:</h4><ul><li>Đa dạng hóa danh mục đầu tư</li><li>Đầu tư định kỳ (DCA)</li><li>Đặt mục tiêu rõ ràng và kiên trì</li><li>Thường xuyên đánh giá và điều chỉnh danh mục</li></ul>',
        'Quản lý rủi ro hiệu quả giúp nhà đầu tư bảo vệ vốn và đạt được mục tiêu tài chính một cách an toàn, đồng thời tối đa hóa lợi nhuận trong dài hạn.',
        1,
        'published'
      )
    `;

    await connection.execute(insertSampleDataSQL);
    console.log('✅ Sample data inserted successfully');

    console.log('🎉 Investment knowledge migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Chạy migration nếu được gọi trực tiếp
if (require.main === module) {
  migrateInvestmentKnowledge()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateInvestmentKnowledge;


