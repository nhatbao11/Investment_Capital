-- Script để sửa foreign key constraint cho bảng posts
-- Chạy script này để sửa lỗi foreign key

USE yt_capital_db;

-- Xóa foreign key constraint cũ nếu tồn tại
ALTER TABLE posts DROP FOREIGN KEY IF EXISTS posts_ibfk_2;

-- Thêm foreign key constraint mới đúng
ALTER TABLE posts
    ADD CONSTRAINT fk_posts_category_id
        FOREIGN KEY (category_id)
        REFERENCES post_categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;

-- Kiểm tra kết quả
SHOW CREATE TABLE posts;
