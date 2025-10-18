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
  incrementViewCount
} = require('../controllers/investmentKnowledgeController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

/**
 * Investment Knowledge Routes
 * Quản lý các route cho investment knowledge
 */

// Public routes - không cần authentication
router.get('/', getAllInvestmentKnowledge);
router.get('/popular', getPopularInvestmentKnowledge);
router.get('/latest', getLatestInvestmentKnowledge);
router.get('/:id', getInvestmentKnowledgeById);
router.post('/:id/view', incrementViewCount);

// Protected routes - cần authentication
router.use(authenticate);

// Admin only routes
router.post('/', requireAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), createInvestmentKnowledge);
router.put('/:id', requireAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), updateInvestmentKnowledge);
router.delete('/:id', requireAdmin, deleteInvestmentKnowledge);

module.exports = router;
