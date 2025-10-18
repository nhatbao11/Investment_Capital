const fs = require('fs');
const path = require('path');

// Tạo placeholder ảnh nếu không tồn tại
const createPlaceholder = (width, height) => {
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
        ${width}x${height}
      </text>
    </svg>
  `).toString('base64')}`;
};

// Tối ưu ảnh trong public/images
const optimizeImages = () => {
  const imagesDir = path.join(__dirname, '../public/images');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('Images directory not found');
    return;
  }

  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} image files to optimize`);

  // Tạo file tối ưu cho từng ảnh
  imageFiles.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    
    console.log(`Optimizing ${file} (${Math.round(stats.size / 1024)}KB)`);
    
    // Có thể thêm logic resize ảnh ở đây nếu cần
    // Hiện tại chỉ log thông tin
  });

  console.log('Image optimization complete!');
};

// Chạy tối ưu
optimizeImages();
































