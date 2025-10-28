-- Add categories table for investment knowledge
USE ytcapital_db;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6', -- hex color for UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
('Phân tích cơ bản', 'Phân tích tài chính, báo cáo doanh nghiệp', '#3b82f6'),
('Phân tích kỹ thuật', 'Biểu đồ, chỉ báo kỹ thuật', '#10b981'),
('Chiến lược đầu tư', 'Các phương pháp đầu tư dài hạn', '#f59e0b'),
('Quản lý rủi ro', 'Đánh giá và kiểm soát rủi ro', '#ef4444'),
('Thị trường chứng khoán', 'Kiến thức về thị trường', '#8b5cf6'),
('Bất động sản', 'Đầu tư bất động sản', '#06b6d4'),
('Tiền điện tử', 'Cryptocurrency và blockchain', '#84cc16'),
('Kinh tế vĩ mô', 'Chính sách kinh tế, lãi suất', '#f97316')
ON DUPLICATE KEY UPDATE name = name;

-- Add category_id column to investment_knowledge table
ALTER TABLE investment_knowledge 
ADD COLUMN category_id INT AFTER author_id,
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Update existing records to have a default category
UPDATE investment_knowledge 
SET category_id = 1 
WHERE category_id IS NULL;



































