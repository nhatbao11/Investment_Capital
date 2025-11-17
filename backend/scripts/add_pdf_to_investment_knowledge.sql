-- Thêm cột pdf_url vào bảng investment_knowledge
ALTER TABLE investment_knowledge 
ADD COLUMN pdf_url VARCHAR(500) AFTER image_url;

-- Cập nhật index nếu cần
-- ALTER TABLE investment_knowledge ADD INDEX idx_pdf_url (pdf_url);







































