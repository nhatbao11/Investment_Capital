-- Script để sửa bảng investment_knowledge trên VPS
-- Chạy: mysql -u username -p database_name < fix_vps_investment_knowledge.sql

-- Thêm field category_id vào bảng investment_knowledge
ALTER TABLE investment_knowledge 
ADD COLUMN category_id INT DEFAULT NULL;

-- Thêm index cho category_id
ALTER TABLE investment_knowledge 
ADD INDEX idx_category_id (category_id);

-- Thêm foreign key constraint
ALTER TABLE investment_knowledge 
ADD CONSTRAINT fk_investment_knowledge_category_id 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Kiểm tra kết quả
DESCRIBE investment_knowledge;
