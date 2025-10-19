-- Create post_categories table for posts (nganh/doanh_nghiep)
USE yt_capital_db;

CREATE TABLE IF NOT EXISTS post_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    category_type ENUM('nganh', 'doanh_nghiep') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_type (category_type),
    INDEX idx_name (name)
);

-- Insert sample categories for nganh (sectors)
INSERT INTO post_categories (name, description, color, category_type) VALUES
('Ngân hàng', 'Phân tích ngành ngân hàng và tài chính', '#3B82F6', 'nganh'),
('Công nghiệp', 'Phân tích ngành công nghiệp và sản xuất', '#10B981', 'nganh'),
('Bất động sản', 'Phân tích ngành bất động sản', '#F59E0B', 'nganh'),
('Công nghệ', 'Phân tích ngành công nghệ thông tin', '#8B5CF6', 'nganh'),
('Năng lượng', 'Phân tích ngành năng lượng', '#EF4444', 'nganh'),
('Y tế', 'Phân tích ngành y tế và dược phẩm', '#06B6D4', 'nganh');

-- Insert sample categories for doanh_nghiep (companies)
INSERT INTO post_categories (name, description, color, category_type) VALUES
('Ngân hàng', 'Phân tích các doanh nghiệp ngân hàng', '#3B82F6', 'doanh_nghiep'),
('Công nghiệp', 'Phân tích các doanh nghiệp công nghiệp', '#10B981', 'doanh_nghiep'),
('Bất động sản', 'Phân tích các doanh nghiệp bất động sản', '#F59E0B', 'doanh_nghiep'),
('Công nghệ', 'Phân tích các doanh nghiệp công nghệ', '#8B5CF6', 'doanh_nghiep'),
('Năng lượng', 'Phân tích các doanh nghiệp năng lượng', '#EF4444', 'doanh_nghiep'),
('Y tế', 'Phân tích các doanh nghiệp y tế', '#06B6D4', 'doanh_nghiep');

