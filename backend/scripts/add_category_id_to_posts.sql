-- Add category_id column to posts table
USE yt_capital_db;

-- Add category_id column to posts table
ALTER TABLE posts 
ADD COLUMN category_id INT NULL AFTER category,
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
ADD INDEX idx_category_id (category_id);

-- Update existing posts to have category_id based on their category
-- This is a temporary mapping - you may need to adjust based on your actual category IDs
UPDATE posts SET category_id = 1 WHERE category = 'nganh';
UPDATE posts SET category_id = 2 WHERE category = 'doanh_nghiep';

