-- Y&T Capital Database Schema
-- Tạo database và các bảng cần thiết

CREATE DATABASE IF NOT EXISTS yt_capital_db;
USE yt_capital_db;

-- Bảng users: Quản lý người dùng
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    newsletter_opt_in BOOLEAN DEFAULT FALSE,
    auth_provider ENUM('local','google') DEFAULT 'local',
    google_id VARCHAR(64) UNIQUE NULL,
    avatar_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- Bảng posts: Quản lý bài đăng/báo cáo
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('nganh', 'doanh_nghiep') NOT NULL,
    -- Liên kết tới bảng post_categories (có thể null để tương thích dữ liệu cũ)
    category_id INT NULL,
    thumbnail_url VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_posts_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_author (author_id),
    INDEX idx_created_at (created_at)
);

-- Bảng feedbacks: Quản lý phản hồi khách hàng
CREATE TABLE feedbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    content TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- Bảng post_categories: Danh mục cho bài viết phân tích ngành/doanh nghiệp
CREATE TABLE post_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    category_type ENUM('nganh', 'doanh_nghiep') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name_per_type (name, category_type),
    INDEX idx_post_categories_type (category_type)
);

-- Ràng buộc khóa ngoại từ posts.category_id tới post_categories.id
ALTER TABLE posts
    ADD CONSTRAINT fk_posts_category_id
        FOREIGN KEY (category_id)
        REFERENCES post_categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

-- Bảng refresh_tokens: Quản lý refresh tokens
CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
);

-- Bảng investment_knowledge: Quản lý kiến thức đầu tư
CREATE TABLE investment_knowledge (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    image_url VARCHAR(500),
    images JSON,
    content LONGTEXT NOT NULL,
    pdf_url VARCHAR(500),
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
);

-- Bảng bookjourney: Quản lý hành trình sách đầu tư
CREATE TABLE bookjourney (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    pdf_url VARCHAR(500) NOT NULL,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_author (author_id),
    INDEX idx_created_at (created_at),
    INDEX idx_view_count (view_count)
);

-- Tạo admin user mặc định
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified) 
VALUES ('admin@ytcapital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin', TRUE, TRUE);









