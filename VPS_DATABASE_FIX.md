# Hướng dẫn sửa database trên VPS

## 🔧 Vấn đề
Foreign key constraint trong bảng `posts` đang tham chiếu sai bảng `categories` thay vì `post_categories`.

## 🚀 Cách sửa trên VPS

### Bước 1: SSH vào VPS
```bash
ssh root@your-vps-ip
```

### Bước 2: Upload script sửa lỗi
```bash
# Tạo file script
cat > fix_posts_foreign_key.js << 'EOF'
const mysql = require('mysql2/promise');

async function fixPostsForeignKey() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your-mysql-password',
    database: 'yt_capital_db'
  });

  try {
    console.log('Đang sửa foreign key constraint cho bảng posts...');
    
    // Kiểm tra constraints hiện tại
    const [constraints] = await connection.execute(`
      SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_NAME = 'posts' 
      AND TABLE_SCHEMA = 'yt_capital_db'
      AND COLUMN_NAME = 'category_id'
    `);
    
    console.log('Constraints hiện tại:', constraints);
    
    // Xóa tất cả foreign key constraints liên quan đến category_id
    for (const constraint of constraints) {
      if (constraint.CONSTRAINT_NAME) {
        try {
          await connection.execute(`ALTER TABLE posts DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
          console.log(`✅ Đã xóa constraint: ${constraint.CONSTRAINT_NAME}`);
        } catch (err) {
          console.log(`⚠️  Không thể xóa constraint ${constraint.CONSTRAINT_NAME}:`, err.message);
        }
      }
    }
    
    // Thêm foreign key constraint mới đúng
    try {
      await connection.execute(`
        ALTER TABLE posts
        ADD CONSTRAINT fk_posts_category_id
            FOREIGN KEY (category_id)
            REFERENCES post_categories(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
      `);
      console.log('✅ Đã thêm foreign key constraint mới');
    } catch (err) {
      if (err.code === 'ER_FK_DUP_NAME') {
        console.log('✅ Foreign key constraint đã tồn tại và đúng');
      } else {
        throw err;
      }
    }
    
    console.log('🎉 Hoàn thành! Foreign key constraint đã được sửa.');
    
  } catch (error) {
    console.error('❌ Lỗi khi sửa foreign key constraint:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

fixPostsForeignKey();
EOF
```

### Bước 3: Chạy script
```bash
# Cài đặt mysql2 nếu chưa có
npm install mysql2

# Chạy script
node fix_posts_foreign_key.js
```

### Bước 4: Kiểm tra kết quả
```bash
# Kiểm tra cấu trúc bảng
mysql -u root -p -e "USE yt_capital_db; SHOW CREATE TABLE posts;"
```

## ✅ Kết quả mong đợi
- Foreign key constraint `category_id` sẽ tham chiếu đến `post_categories(id)`
- Không còn lỗi khi tạo/sửa bài viết
- Cả phân tích ngành và doanh nghiệp đều hoạt động bình thường

## 🔄 Restart services
```bash
# Restart backend service
pm2 restart backend

# Hoặc restart toàn bộ
pm2 restart all
```
