-- Add pdf_url column to investment_knowledge table
ALTER TABLE investment_knowledge ADD COLUMN pdf_url VARCHAR(500) NULL AFTER content;

-- Update existing records to move content to pdf_url if content contains PDF path
UPDATE investment_knowledge 
SET pdf_url = content 
WHERE content LIKE '/uploads/investment/%' 
   OR content LIKE 'http%' 
   OR content LIKE '%.pdf';

-- Clear content field for records that had PDF URLs
UPDATE investment_knowledge 
SET content = '' 
WHERE pdf_url IS NOT NULL AND pdf_url != '';
