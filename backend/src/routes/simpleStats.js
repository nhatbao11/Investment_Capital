const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getSimpleStats, getDashboardOverview } = require('../controllers/simpleStatsController');

// Lấy thống kê đơn giản theo khoảng thời gian
// GET /api/v1/simple-stats?period=today|week|month|year
router.get('/', authenticate, requireAdmin, getSimpleStats);

// Lấy tổng quan thống kê cho dashboard
// GET /api/v1/simple-stats/overview
router.get('/overview', authenticate, requireAdmin, getDashboardOverview);

module.exports = router;
