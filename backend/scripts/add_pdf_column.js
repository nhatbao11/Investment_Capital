// Simple script to add pdf_url column to investment_knowledge table
// Run this manually in your MySQL client or phpMyAdmin

console.log('📋 SQL to run manually:');
console.log('');
console.log('USE ytcapital_db;');
console.log('ALTER TABLE investment_knowledge ADD COLUMN pdf_url VARCHAR(500) AFTER image_url;');
console.log('');
console.log('✅ After running this SQL, the Investment Knowledge feature will work with PDF uploads.');
console.log('');
console.log('🔧 Alternative: If you have MySQL command line access, run:');
console.log('mysql -u root -p ytcapital_db < scripts/add_pdf_to_investment_knowledge.sql');




































