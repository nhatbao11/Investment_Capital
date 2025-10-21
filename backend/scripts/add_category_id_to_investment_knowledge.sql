-- Thêm field category_id vào bảng investment_knowledge
ALTER TABLE investment_knowledge 
ADD COLUMN category_id INT DEFAULT NULL,
ADD INDEX idx_category_id (category_id),
ADD CONSTRAINT fk_investment_knowledge_category_id 
    FOREIGN KEY (category_id) 
    REFERENCES categories(id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
