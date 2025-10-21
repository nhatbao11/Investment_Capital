-- Add view_tracking table for advanced view analytics
USE yt_capital_db;

-- Create view_tracking table
CREATE TABLE IF NOT EXISTS view_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    resource_id INT NOT NULL,
    resource_type ENUM('post', 'investment_knowledge', 'bookjourney') NOT NULL,
    view_date DATE NOT NULL,
    view_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_user_resource_date (user_id, resource_id, view_date),
    INDEX idx_ip_resource_date (ip_address, resource_id, view_date),
    INDEX idx_resource_type_date (resource_type, view_date),
    INDEX idx_view_date (view_date),
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Unique constraints to prevent duplicate tracking
    UNIQUE KEY unique_user_tracking (user_id, resource_id, resource_type, view_date),
    UNIQUE KEY unique_ip_tracking (ip_address, user_agent(255), resource_id, resource_type, view_date)
);

-- Add indexes for better performance on existing tables
ALTER TABLE posts ADD INDEX idx_status_created (status, created_at);
ALTER TABLE investment_knowledge ADD INDEX idx_status_created (status, created_at);
ALTER TABLE bookjourney ADD INDEX idx_status_created (status, created_at);

-- Create view for analytics dashboard
CREATE OR REPLACE VIEW view_analytics AS
SELECT 
    resource_type,
    resource_id,
    DATE(view_date) as date,
    COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
    SUM(view_count) as total_views,
    COUNT(DISTINCT user_id) as logged_in_users,
    COUNT(DISTINCT CASE WHEN user_id IS NULL THEN CONCAT(ip_address, '-', user_agent) END) as anonymous_users
FROM view_tracking 
GROUP BY resource_type, resource_id, DATE(view_date);

-- Create view for daily statistics
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
    DATE(view_date) as date,
    resource_type,
    COUNT(DISTINCT resource_id) as unique_resources,
    COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
    SUM(view_count) as total_views
FROM view_tracking 
GROUP BY DATE(view_date), resource_type;

-- Create view for top content
CREATE OR REPLACE VIEW top_content AS
SELECT 
    resource_type,
    resource_id,
    COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
    SUM(view_count) as total_views,
    MAX(view_date) as last_viewed
FROM view_tracking 
WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY resource_type, resource_id
ORDER BY unique_visitors DESC, total_views DESC;

COMMIT;
