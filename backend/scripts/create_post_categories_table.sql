-- Tạo bảng post_categories cho danh mục bài viết (ngành/doanh nghiệp)
CREATE TABLE IF NOT EXISTS post_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6',
  category_type ENUM('nganh', 'doanh_nghiep') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Đảm bảo tên danh mục là duy nhất trong cùng loại
  UNIQUE KEY unique_name_per_type (name, category_type),
  
  -- Index cho tìm kiếm theo loại
  INDEX idx_category_type (category_type)
);

-- Thêm cột category_id vào bảng posts nếu chưa có
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS category_id INT NULL,
ADD INDEX IF NOT EXISTS idx_posts_category_id (category_id);

-- Thêm foreign key constraint
ALTER TABLE posts 
ADD CONSTRAINT IF NOT EXISTS fk_posts_category_id 
FOREIGN KEY (category_id) REFERENCES post_categories(id) 
ON DELETE SET NULL ON UPDATE CASCADE;