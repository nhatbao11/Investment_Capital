const express = require('express');
const router = express.Router();
const {
  getAllInvestmentKnowledge,
  getInvestmentKnowledgeById,
  createInvestmentKnowledge,
  updateInvestmentKnowledge,
  deleteInvestmentKnowledge,
  getPopularInvestmentKnowledge,
  getLatestInvestmentKnowledge,
  incrementViewCount,
  previewNewsletter,
  sendNewsletter
} = require('../controllers/investmentKnowledgeController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { uploadInvestment } = require('../middleware/upload');

/**
 * Investment Knowledge Routes
 * Quản lý các route cho investment knowledge
 */

// Public routes - không cần authentication
router.get('/', optionalAuth, getAllInvestmentKnowledge);
router.get('/popular', getPopularInvestmentKnowledge);
router.get('/latest', getLatestInvestmentKnowledge);
router.get('/:id', getInvestmentKnowledgeById);
router.post('/:id/view', incrementViewCount);

// Protected routes - cần authentication
router.use(authenticate);

// Admin only routes
router.post('/', requireAdmin, uploadInvestment.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), createInvestmentKnowledge);
router.put('/:id', requireAdmin, uploadInvestment.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), updateInvestmentKnowledge);
router.delete('/:id', requireAdmin, deleteInvestmentKnowledge);
router.post('/:id/preview-newsletter', authenticate, requireAdmin, previewNewsletter);
router.post('/:id/send-newsletter', requireAdmin, sendNewsletter);

module.exports = router;
