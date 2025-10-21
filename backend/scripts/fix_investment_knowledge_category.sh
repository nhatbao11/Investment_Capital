#!/bin/bash

echo "🔧 Adding category_id to investment_knowledge table on VPS..."

# Update the database credentials in the script
echo "Please update the database credentials in add_category_id_to_investment_knowledge.js first!"
echo "Then run: node scripts/add_category_id_to_investment_knowledge.js"

# Alternative: Direct SQL approach
echo ""
echo "Or run this SQL directly on your VPS:"
echo ""
echo "ALTER TABLE investment_knowledge ADD COLUMN category_id INT DEFAULT NULL;"
echo "ALTER TABLE investment_knowledge ADD INDEX idx_category_id (category_id);"
echo "ALTER TABLE investment_knowledge ADD CONSTRAINT fk_investment_knowledge_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE;"
echo ""
echo "✅ After running the SQL, the investment knowledge categories will work correctly!"
