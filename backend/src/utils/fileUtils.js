const fs = require('fs').promises;
const path = require('path');

/**
 * Xóa file từ filesystem
 * @param {string} filePath - Đường dẫn file cần xóa
 * @returns {Promise<boolean>} - true nếu xóa thành công, false nếu thất bại
 */
const deleteFile = async (filePath) => {
  try {
    if (!filePath) return false;
    
    // Chuyển đổi URL thành đường dẫn file thực tế
    let actualPath = filePath;
    
    // Nếu là URL, lấy phần path sau domain
    if (filePath.startsWith('http')) {
      const url = new URL(filePath);
      actualPath = url.pathname;
    }
    
    // Nếu bắt đầu bằng /uploads/, bỏ dấu / đầu
    if (actualPath.startsWith('/uploads/')) {
      actualPath = actualPath.substring(1);
    }
    
    // Tạo đường dẫn tuyệt đối
    const fullPath = path.join(process.cwd(), actualPath);
    
    // Kiểm tra file có tồn tại không
    try {
      await fs.access(fullPath);
    } catch (error) {
      return false;
    }
    
    // Xóa file
    await fs.unlink(fullPath);
    return true;
    
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

/**
 * Xóa nhiều file cùng lúc
 * @param {string[]} filePaths - Mảng đường dẫn file cần xóa
 * @returns {Promise<boolean>} - true nếu tất cả xóa thành công
 */
const deleteMultipleFiles = async (filePaths) => {
  try {
    if (!filePaths || !Array.isArray(filePaths)) return true;
    
    const deletePromises = filePaths.map(filePath => deleteFile(filePath));
    const results = await Promise.allSettled(deletePromises);
    
    const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
    return successCount === filePaths.length;
    
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    return false;
  }
};

/**
 * Lấy danh sách file cần xóa từ post/knowledge data
 * @param {Object} data - Dữ liệu post hoặc knowledge
 * @returns {string[]} - Mảng đường dẫn file
 */
const getFilesToDelete = (data) => {
  const files = [];
  
  if (data.thumbnail_url) files.push(data.thumbnail_url);
  if (data.pdf_url) files.push(data.pdf_url);
  if (data.image_url) files.push(data.image_url);
  
  return files;
};

module.exports = {
  deleteFile,
  deleteMultipleFiles,
  getFilesToDelete
};



































