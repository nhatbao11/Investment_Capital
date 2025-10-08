const mysql = require('mysql2/promise');

async function insertSampleData() {
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
    console.log('Inserting sample data...');
    
    // Insert sample posts
    await connection.execute(`
      INSERT IGNORE INTO posts (title, content, category, thumbnail_url, author_id, status, view_count) VALUES
      ('Phân tích ngành ngân hàng Việt Nam 2024', 'Ngành ngân hàng Việt Nam đang trải qua giai đoạn chuyển đổi số mạnh mẽ với sự phát triển của fintech và digital banking. Các ngân hàng lớn như Vietcombank, BIDV, VietinBank đang đầu tư mạnh vào công nghệ để cải thiện trải nghiệm khách hàng và tăng hiệu quả hoạt động.', 'nganh', '/images/phantichnganh.png', 1, 'published', 1250),
      ('Báo cáo phân tích Công ty Cổ phần FPT', 'FPT là một trong những công ty công nghệ hàng đầu Việt Nam với lợi thế cạnh tranh mạnh trong lĩnh vực phần mềm và dịch vụ CNTT. Công ty có doanh thu ổn định và triển vọng tăng trưởng tốt trong tương lai.', 'doanh_nghiep', '/images/phantichdoanhnghiep.jpg', 1, 'published', 890),
      ('Triển vọng ngành bất động sản 2024', 'Thị trường bất động sản Việt Nam đang có những tín hiệu tích cực với sự phục hồi của nhu cầu nhà ở và đầu tư. Các dự án hạ tầng lớn và chính sách hỗ trợ của Chính phủ sẽ thúc đẩy sự phát triển của ngành.', 'nganh', '/images/phantichnganh.png', 1, 'published', 2100)
    `);
    
    // Insert sample feedbacks
    await connection.execute(`
      INSERT IGNORE INTO feedbacks (user_id, name, company, content, rating, status) VALUES
      (2, 'Nguyễn Văn A', 'Công ty ABC', 'Dịch vụ tư vấn đầu tư rất chuyên nghiệp, giúp tôi hiểu rõ hơn về thị trường và đưa ra quyết định đầu tư đúng đắn.', 5, 'approved'),
      (2, 'Trần Thị B', 'Công ty XYZ', 'Phân tích ngành rất chi tiết và chính xác. Tôi đã áp dụng những gợi ý và có kết quả đầu tư rất tốt.', 4, 'approved'),
      (2, 'Lê Văn C', 'Công ty DEF', 'Đội ngũ chuyên gia có kinh nghiệm, tư vấn nhiệt tình và tận tâm. Tôi rất hài lòng với dịch vụ.', 5, 'approved')
    `);
    
    console.log('✅ Sample data inserted successfully!');
    
    // Check counts
    const [postsCount] = await connection.execute('SELECT COUNT(*) as count FROM posts');
    const [feedbacksCount] = await connection.execute('SELECT COUNT(*) as count FROM feedbacks');
    
    console.log(`📊 Posts: ${postsCount[0].count}`);
    console.log(`📊 Feedbacks: ${feedbacksCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
  } finally {
    await connection.end();
  }
}

insertSampleData();















