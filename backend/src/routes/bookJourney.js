const express = require('express');
const router = express.Router();
const BookJourneyController = require('../controllers/bookJourneyController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { uploadBookJourney } = require('../middleware/upload');
const { body } = require('express-validator');

// Validation rules
const createValidation = [
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề là bắt buộc')
    .isLength({ min: 5, max: 500 })
    .withMessage('Tiêu đề phải từ 5-500 ký tự'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được quá 1000 ký tự'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('URL hình ảnh không hợp lệ'),
  body('pdf_url')
    .optional()
    .isURL()
    .withMessage('URL PDF không hợp lệ'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ')
];

const updateValidation = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Tiêu đề phải từ 5-500 ký tự'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được quá 1000 ký tự'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('URL hình ảnh không hợp lệ'),
  body('pdf_url')
    .optional()
    .isURL()
    .withMessage('URL PDF không hợp lệ'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ')
];

// Public routes
router.get('/', BookJourneyController.getAll);
router.get('/popular', BookJourneyController.getPopular);
router.get('/latest', BookJourneyController.getLatest);
router.get('/stats', BookJourneyController.getStats);
router.get('/:id', BookJourneyController.getById);
router.get('/:id/download', BookJourneyController.downloadPdf);
router.post('/:id/view', BookJourneyController.incrementView);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.get('/admin/all', BookJourneyController.getAllForAdmin);
router.post('/', uploadBookJourney.fields([
  { name: 'images', maxCount: 5 },
  { name: 'pdf', maxCount: 1 }
]), createValidation, BookJourneyController.create);
router.put('/:id', uploadBookJourney.fields([
  { name: 'images', maxCount: 5 },
  { name: 'pdf', maxCount: 1 }
]), updateValidation, BookJourneyController.update);
router.delete('/:id', BookJourneyController.delete);
router.post('/:id/preview-newsletter', authenticate, requireAdmin, BookJourneyController.previewNewsletter);
router.post('/:id/send-newsletter', BookJourneyController.sendNewsletter);

module.exports = router;
