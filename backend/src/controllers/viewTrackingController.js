const ViewTracking = require('../models/ViewTracking');

/**
 * View Tracking Controller
 * Xử lý tracking lượt xem và thống kê
 */

/**
 * Track view cho resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const trackView = async (req, res) => {
  try {
    const { resource_id, resource_type } = req.params;
    const user_id = req.user?.id || null;
    const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const user_agent = req.get('User-Agent') || '';

    // Validate resource_type
    const validTypes = ['post', 'investment_knowledge', 'bookjourney'];
    if (!validTypes.includes(resource_type)) {
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
        resource_id: parseInt(resource_id),
        resource_type
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
};

/**
 * Lấy thống kê view cho resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getResourceStats = async (req, res) => {
  try {
    const { resource_id, resource_type } = req.params;
    const { days = 30 } = req.query;

    const stats = await ViewTracking.getResourceStats(
      parseInt(resource_id), 
      resource_type, 
      parseInt(days)
    );

    res.json({
      success: true,
      message: 'Resource stats retrieved successfully',
      data: {
        resource_id: parseInt(resource_id),
        resource_type,
        days: parseInt(days),
        stats
      }
    });

  } catch (error) {
    console.error('Get resource stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resource stats',
      code: 'GET_RESOURCE_STATS_ERROR'
    });
  }
};

/**
 * Lấy thống kê tổng quan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getOverallStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const stats = await ViewTracking.getOverallStats(parseInt(days));

    res.json({
      success: true,
      message: 'Overall stats retrieved successfully',
      data: {
        days: parseInt(days),
        stats
      }
    });

  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve overall stats',
      code: 'GET_OVERALL_STATS_ERROR'
    });
  }
};

/**
 * Lấy top content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTopContent = async (req, res) => {
  try {
    const { resource_type } = req.query;
    const { limit = 10, days = 30 } = req.query;

    const topContent = await ViewTracking.getTopContent(
      resource_type, 
      parseInt(limit), 
      parseInt(days)
    );

    res.json({
      success: true,
      message: 'Top content retrieved successfully',
      data: {
        resource_type,
        limit: parseInt(limit),
        days: parseInt(days),
        top_content: topContent
      }
    });

  } catch (error) {
    console.error('Get top content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve top content',
      code: 'GET_TOP_CONTENT_ERROR'
    });
  }
};

/**
 * Lấy thống kê dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Lấy thống kê tổng quan
    const overallStats = await ViewTracking.getOverallStats(parseInt(days));
    
    // Lấy top content cho từng loại
    const topPosts = await ViewTracking.getTopContent('post', 5, parseInt(days));
    const topKnowledge = await ViewTracking.getTopContent('investment_knowledge', 5, parseInt(days));
    const topBookJourney = await ViewTracking.getTopContent('bookjourney', 5, parseInt(days));

    res.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        days: parseInt(days),
        overall_stats: overallStats,
        top_posts: topPosts,
        top_knowledge: topKnowledge,
        top_bookjourney: topBookJourney
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
      code: 'GET_DASHBOARD_STATS_ERROR'
    });
  }
};

module.exports = {
  trackView,
  getResourceStats,
  getOverallStats,
  getTopContent,
  getDashboardStats
};
