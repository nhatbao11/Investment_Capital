const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

/**
 * Script để dọn dẹp các file upload không còn được sử dụng
 * Chạy: node scripts/cleanup_orphaned_files.js
 */

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ytcapital_db'
};

async function getUploadedFiles() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const files = [];
  
  try {
    const dirs = await fs.readdir(uploadsDir);
    
    for (const dir of dirs) {
      const dirPath = path.join(uploadsDir, dir);
      const stat = await fs.stat(dirPath);
      
      if (stat.isDirectory()) {
        const dirFiles = await fs.readdir(dirPath);
        for (const file of dirFiles) {
          files.push(path.join('uploads', dir, file));
        }
      }
    }
  } catch (error) {
    console.error('Error reading uploads directory:', error);
  }
  
  return files;
}

async function getUsedFiles() {
  const connection = await mysql.createConnection(dbConfig);
  const usedFiles = new Set();
  
  try {
    // Lấy file từ posts
    const [posts] = await connection.execute(`
      SELECT thumbnail_url, pdf_url 
      FROM posts 
      WHERE thumbnail_url IS NOT NULL OR pdf_url IS NOT NULL
    `);
    
    posts.forEach(post => {
      if (post.thumbnail_url) usedFiles.add(post.thumbnail_url);
      if (post.pdf_url) usedFiles.add(post.pdf_url);
    });
    
    // Lấy file từ investment_knowledge
    const [knowledge] = await connection.execute(`
      SELECT image_url 
      FROM investment_knowledge 
      WHERE image_url IS NOT NULL
    `);
    
    knowledge.forEach(item => {
      if (item.image_url) usedFiles.add(item.image_url);
    });
    
    // Lấy file từ bookjourney
    const [books] = await connection.execute(`
      SELECT image_url, pdf_url 
      FROM bookjourney 
      WHERE image_url IS NOT NULL OR pdf_url IS NOT NULL
    `);
    
    books.forEach(book => {
      if (book.image_url) usedFiles.add(book.image_url);
      if (book.pdf_url) usedFiles.add(book.pdf_url);
    });
    
    // Lấy file từ users (avatar)
    const [users] = await connection.execute(`
      SELECT avatar_url 
      FROM users 
      WHERE avatar_url IS NOT NULL
    `);
    
    users.forEach(user => {
      if (user.avatar_url) usedFiles.add(user.avatar_url);
    });
    
  } finally {
    await connection.end();
  }
  
  return usedFiles;
}

async function cleanupOrphanedFiles() {
  console.log('🧹 Starting cleanup of orphaned files...');
  
  try {
    const uploadedFiles = await getUploadedFiles();
    const usedFiles = await getUsedFiles();
    
    console.log(`📁 Found ${uploadedFiles.length} uploaded files`);
    console.log(`📋 Found ${usedFiles.size} files in use`);
    
    const orphanedFiles = uploadedFiles.filter(file => !usedFiles.has(file));
    
    console.log(`🗑️  Found ${orphanedFiles.length} orphaned files`);
    
    if (orphanedFiles.length === 0) {
      console.log('✅ No orphaned files to clean up');
      return;
    }
    
    // Hiển thị danh sách file sẽ xóa
    console.log('\n📋 Files to be deleted:');
    orphanedFiles.forEach(file => console.log(`  - ${file}`));
    
    // Xóa file
    let deletedCount = 0;
    for (const file of orphanedFiles) {
      try {
        const fullPath = path.join(__dirname, '..', file);
        await fs.unlink(fullPath);
        console.log(`✅ Deleted: ${file}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete ${file}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Cleanup completed! Deleted ${deletedCount}/${orphanedFiles.length} files`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Chạy cleanup nếu script được gọi trực tiếp
if (require.main === module) {
  cleanupOrphanedFiles()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupOrphanedFiles };





































