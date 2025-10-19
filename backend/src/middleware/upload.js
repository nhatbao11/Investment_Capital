const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const AVATAR_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');
if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
}
const POSTS_DIR = path.join(__dirname, '..', '..', 'uploads', 'posts');
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}
const BOOKJOURNEY_DIR = path.join(__dirname, '..', '..', 'uploads', 'bookjourney');
if (!fs.existsSync(BOOKJOURNEY_DIR)) {
  fs.mkdirSync(BOOKJOURNEY_DIR, { recursive: true });
}
const INVESTMENT_DIR = path.join(__dirname, '..', '..', 'uploads', 'investment');
if (!fs.existsSync(INVESTMENT_DIR)) {
  fs.mkdirSync(INVESTMENT_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVATAR_DIR);
  },
  filename: function (req, file, cb) {
    const userId = req.user?.id || 'guest';
    const ext = (path.extname(file.originalname) || '.png').toLowerCase();
    const baseName = `avatar_${userId}_${Date.now()}`;
    cb(null, `${baseName}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
}

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = {
  uploadAvatar,
  uploadPostAsset: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, POSTS_DIR);
      },
      filename: function (req, file, cb) {
        const ext = (path.extname(file.originalname) || '').toLowerCase();
        const safeName = `post_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, safeName);
      }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter(req, file, cb) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (allowed.includes(file.mimetype)) cb(null, true); else cb(new Error('Invalid file type'))
    }
  }),
  uploadBookJourney: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, BOOKJOURNEY_DIR);
      },
      filename: function (req, file, cb) {
        const ext = (path.extname(file.originalname) || '').toLowerCase();
        const safeName = `bookjourney_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, safeName);
      }
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDFs
    fileFilter(req, file, cb) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (allowed.includes(file.mimetype)) cb(null, true); else cb(new Error('Invalid file type'))
    }
  }),
  uploadInvestment: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // Determine destination based on field name
        if (file.fieldname === 'image') {
          cb(null, INVESTMENT_DIR);
        } else if (file.fieldname === 'pdf') {
          cb(null, INVESTMENT_DIR);
        } else {
          cb(null, INVESTMENT_DIR);
        }
      },
      filename: function (req, file, cb) {
        const ext = (path.extname(file.originalname) || '').toLowerCase();
        const safeName = `investment_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, safeName);
      }
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDFs
    fileFilter(req, file, cb) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (allowed.includes(file.mimetype)) cb(null, true); else cb(new Error('Invalid file type'))
    }
  })
};

