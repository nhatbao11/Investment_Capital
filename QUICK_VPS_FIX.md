# 🚀 Sửa nhanh database trên VPS

## ⚡ Cách nhanh nhất (2 phút)

### Bước 1: SSH vào VPS
```bash
ssh root@103.75.183.131
```

### Bước 2: Chạy SQL trực tiếp
```bash
mysql -u yt_backend -pYtcapital@123 yt_capital_db
```

### Bước 3: Chạy các lệnh SQL này
```sql
-- Xóa foreign key constraint cũ
ALTER TABLE posts DROP FOREIGN KEY posts_ibfk_2;

-- Thêm foreign key constraint mới đúng
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_category_id 
FOREIGN KEY (category_id) 
REFERENCES post_categories(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Kiểm tra kết quả
SHOW CREATE TABLE posts;

-- Thoát
EXIT;
```

### Bước 4: Restart backend
```bash
pm2 restart backend
```

## ✅ Xong! 
Chỉ cần 4 lệnh SQL là xong, không cần script phức tạp! 🎯
