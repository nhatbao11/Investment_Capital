const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Tạo thư mục optimized nếu chưa có
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const optimizeImage = async (inputPath, outputPath, width, quality = 80) => {
  try {
    await sharp(inputPath)
      .resize(width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality })
      .webp({ quality })
      .toFile(outputPath);
    console.log(`✓ Optimized ${path.basename(inputPath)} to ${width}px`);
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
  }
};

const processImages = async () => {
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file) && !file.includes('optimized')
  );

  console.log(`Found ${imageFiles.length} images to optimize...`);

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    
    // Tạo các kích thước khác nhau
    const sizes = [
      { width: 320, suffix: '_sm' },
      { width: 640, suffix: '_md' },
      { width: 1024, suffix: '_lg' },
      { width: 1920, suffix: '_xl' }
    ];

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${baseName}${size.suffix}.webp`);
      await optimizeImage(inputPath, outputPath, size.width);
    }
  }

  console.log('🎉 Image optimization completed!');
};

processImages().catch(console.error);
