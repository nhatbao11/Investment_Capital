const express = require('express');
const router = express.Router();
const { getRealStatistics } = require('../controllers/statisticsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * Get real statistics from database
 * GET /statistics/real
 */
router.get('/real', authenticate, requireAdmin, getRealStatistics);

module.exports = router;
