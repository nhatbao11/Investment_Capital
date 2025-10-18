const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Ensure investment knowledge upload directory exists
const INVESTMENT_DIR = path.join(__dirname, '..', '..', 'uploads', 'investment');
if (!fs.existsSync(INVESTMENT_DIR)) {
  fs.mkdirSync(INVESTMENT_DIR, { recursive: true });
}

// Configure multer for investment images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, INVESTMENT_DIR);
  },
  filename: function (req, file, cb) {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const safeName = `investment_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép file ảnh (JPEG, PNG, WebP, GIF)'), false);
    }
  }
});

// Test endpoint without auth
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Upload route is working' });
});

// Test upload without auth
router.post('/test-upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const fileUrl = `/uploads/investment/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;

    res.json({
      success: true,
      message: 'Upload ảnh thành công (test)',
      data: {
        filename: req.file.filename,
        url: fullUrl,
        path: fileUrl
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload ảnh'
    });
  }
});

// Upload investment image
router.post('/investment', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Tạo URL để truy cập file
    const fileUrl = `/uploads/investment/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;

    res.json({
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        filename: req.file.filename,
        url: fullUrl,
        path: fileUrl
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload ảnh'
    });
  }
});

module.exports = router;
