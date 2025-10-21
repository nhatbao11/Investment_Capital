const fs = require('fs');
const path = require('path');

console.log('=== Checking uploads directory ===');

const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory:', uploadsDir);
console.log('Exists:', fs.existsSync(uploadsDir));

if (fs.existsSync(uploadsDir)) {
  const subdirs = fs.readdirSync(uploadsDir);
  console.log('Subdirectories:', subdirs);
  
  subdirs.forEach(subdir => {
    const subdirPath = path.join(uploadsDir, subdir);
    const files = fs.readdirSync(subdirPath);
    console.log(`${subdir}: ${files.length} files`);
    if (files.length > 0) {
      console.log(`  First 5 files:`, files.slice(0, 5));
    }
  });
}

// Check for specific file
const testFile = path.join(uploadsDir, 'posts', 'post_1760864950964_fcgg1j947lo.pdf');
console.log('\n=== Checking specific file ===');
console.log('File path:', testFile);
console.log('Exists:', fs.existsSync(testFile));

if (fs.existsSync(testFile)) {
  const stats = fs.statSync(testFile);
  console.log('File size:', stats.size, 'bytes');
  console.log('Last modified:', stats.mtime);
}











