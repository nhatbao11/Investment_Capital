#!/bin/bash

echo "🔧 Fixing investment_knowledge table on VPS..."

# Cách 1: Chạy SQL file
echo "Option 1: Run SQL file"
echo "mysql -u your_username -p your_database_name < scripts/fix_vps_investment_knowledge.sql"

echo ""
echo "Option 2: Run SQL commands directly"
echo "mysql -u your_username -p your_database_name"

echo ""
echo "Then copy and paste these SQL commands:"
echo ""
echo "ALTER TABLE investment_knowledge ADD COLUMN category_id INT DEFAULT NULL;"
echo "ALTER TABLE investment_knowledge ADD INDEX idx_category_id (category_id);"
echo "ALTER TABLE investment_knowledge ADD CONSTRAINT fk_investment_knowledge_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE;"
echo "DESCRIBE investment_knowledge;"

echo ""
echo "✅ After running, the investment knowledge categories will work correctly!"
