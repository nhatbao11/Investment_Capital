const { executeQuery } = require('../src/config/database');

async function updateOldInvestmentKnowledge() {
  try {
    console.log('Checking for investment_knowledge with NULL category_id...');
    
    // Check how many have NULL category_id
    const nullCheckSql = 'SELECT COUNT(*) as count FROM investment_knowledge WHERE category_id IS NULL';
    const nullResult = await executeQuery(nullCheckSql);
    console.log('Investment knowledge with NULL category_id:', nullResult[0].count);
    
    if (nullResult[0].count > 0) {
      console.log('Updating NULL category_id to a default category...');
      
      // Get the first category (or create a default one)
      const getFirstCategorySql = 'SELECT id FROM categories ORDER BY id LIMIT 1';
      const categoryResult = await executeQuery(getFirstCategorySql);
      
      if (categoryResult.length > 0) {
        const defaultCategoryId = categoryResult[0].id;
        console.log('Using default category ID:', defaultCategoryId);
        
        // Update all NULL category_id to the first category
        const updateSql = 'UPDATE investment_knowledge SET category_id = ? WHERE category_id IS NULL';
        await executeQuery(updateSql, [defaultCategoryId]);
        console.log('Updated investment_knowledge with NULL category_id');
      } else {
        console.log('No categories found, creating a default category...');
        
        // Create a default category
        const createCategorySql = `
          INSERT INTO categories (name, description, color) 
          VALUES ('Chưa phân loại', 'Danh mục mặc định cho kiến thức chưa phân loại', '#6B7280')
        `;
        const insertResult = await executeQuery(createCategorySql);
        const defaultCategoryId = insertResult.insertId;
        
        // Update all NULL category_id to the new default category
        const updateSql = 'UPDATE investment_knowledge SET category_id = ? WHERE category_id IS NULL';
        await executeQuery(updateSql, [defaultCategoryId]);
        console.log('Created default category and updated investment_knowledge');
      }
    } else {
      console.log('No investment_knowledge with NULL category_id found');
    }
    
    // Verify the update
    const verifySql = 'SELECT COUNT(*) as count FROM investment_knowledge WHERE category_id IS NULL';
    const verifyResult = await executeQuery(verifySql);
    console.log('Investment knowledge with NULL category_id after update:', verifyResult[0].count);
    
    console.log('Update completed successfully!');
  } catch (error) {
    console.error('Error updating investment_knowledge:', error);
    process.exit(1);
  }
}

updateOldInvestmentKnowledge();
