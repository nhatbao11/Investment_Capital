const express = require('express');
const router = express.Router();
const ViewTracking = require('../models/ViewTracking');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * Track view cho resource
 * POST /view-tracking/:resource_type/:resource_id
 */
router.post('/:resource_type/:resource_id', async (req, res) => {
  try {
    const { resource_type, resource_id } = req.params;
    const user_id = req.user?.id || null;
    const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const user_agent = req.get('User-Agent') || '';

    // Validate resource_type
    if (!['post', 'investment_knowledge', 'bookjourney'].includes(resource_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type',
        code: 'INVALID_RESOURCE_TYPE'
      });
    }

    // Track view
    const tracked = await ViewTracking.trackView({
      user_id,
      ip_address,
      user_agent,
      resource_id: parseInt(resource_id),
      resource_type
    });

    res.json({
      success: true,
      message: tracked ? 'View tracked successfully' : 'View already tracked today',
      data: {
        tracked,
        resource_type,
        resource_id: parseInt(resource_id)
      }
    });

  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track view',
      code: 'TRACK_VIEW_ERROR'
    });
  }
});

/**
 * Lấy thống kê cho resource cụ thể
 * GET /view-tracking/stats/:resource_type/:resource_id
 */
router.get('/stats/:resource_type/:resource_id', authenticate, async (req, res) => {
  try {
    const { resource_type, resource_id } = req.params;
    const { days = 30 } = req.query;

    const stats = await ViewTracking.getResourceStats(
      resource_type,
      parseInt(resource_id),
      parseInt(days)
    );

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get resource stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource stats',
      code: 'GET_RESOURCE_STATS_ERROR'
    });
  }
});

/**
 * Lấy thống kê tổng quan
 * GET /view-tracking/overall
 */
router.get('/overall', authenticate, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const stats = await ViewTracking.getOverallStats(parseInt(days));

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get overall stats',
      code: 'GET_OVERALL_STATS_ERROR'
    });
  }
});

/**
 * Lấy top content
 * GET /view-tracking/top
 */
router.get('/top', authenticate, async (req, res) => {
  try {
    const { resource_type, limit = 10, days = 30 } = req.query;

    const topContent = await ViewTracking.getTopContent(
      resource_type,
      parseInt(limit),
      parseInt(days)
    );

    res.json({
      success: true,
      data: topContent
    });

  } catch (error) {
    console.error('Get top content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top content',
      code: 'GET_TOP_CONTENT_ERROR'
    });
  }
});

/**
 * Lấy thống kê dashboard (Admin only)
 * GET /view-tracking/dashboard
 */
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const dashboardStats = await ViewTracking.getDashboardStats(parseInt(days));

    res.json({
      success: true,
      data: dashboardStats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      code: 'GET_DASHBOARD_STATS_ERROR'
    });
  }
});

module.exports = router;