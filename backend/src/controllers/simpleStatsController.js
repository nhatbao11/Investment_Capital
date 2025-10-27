const { executeQuery } = require('../config/database');

/**
 * Simple Statistics Controller
 * Thống kê đơn giản theo lượt truy cập theo IP
 */

/**
 * Lấy thống kê đơn giản theo khoảng thời gian
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSimpleStats = async (req, res) => {
  try {
    const { period = 'today', date } = req.query;

    let dateCondition = '';
    let params = [];

    if (period === 'custom' && date) {
      // Chọn ngày cụ thể
      dateCondition = 'DATE(view_date) = ?';
      params = [date];
    } else {
      switch (period) {
        case 'today':
          dateCondition = 'view_date = CURDATE()';
          break;
        case 'week':
          dateCondition = 'view_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)';
          break;
        case 'month':
          dateCondition = 'YEAR(view_date) = YEAR(CURDATE()) AND MONTH(view_date) = MONTH(CURDATE())';
          break;
        case 'year':
          dateCondition = 'YEAR(view_date) = YEAR(CURDATE())';
          break;
        default:
          dateCondition = 'DATE(view_date) = CURDATE()';
      }
    }

    // Thống kê tổng lượt truy cập theo IP - chỉ tính IP (1 người)
    const totalVisitsSql = `
      SELECT 
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(DISTINCT ip_address) as total_visits
      FROM view_tracking 
      WHERE ${dateCondition}
    `;

    const totalVisits = await executeQuery(totalVisitsSql, params);

    // Thống kê theo ngày trong tuần (nếu period = week)
    let dailyStats = [];
    if (period === 'week') {
      const dailySql = `
        SELECT 
          DATE(view_date) as date,
          COUNT(DISTINCT ip_address) as unique_ips,
          COUNT(*) as total_visits
        FROM view_tracking 
        WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
        GROUP BY DATE(view_date)
        ORDER BY date ASC
      `;
      dailyStats = await executeQuery(dailySql, []);
    }

    // Thống kê theo tháng trong năm (nếu period = year)
    let monthlyStats = [];
    if (period === 'year') {
      const monthlySql = `
        SELECT 
          MONTH(view_date) as month,
          COUNT(DISTINCT ip_address) as unique_ips,
          COUNT(*) as total_visits
        FROM view_tracking 
        WHERE YEAR(view_date) = YEAR(CURDATE())
        GROUP BY MONTH(view_date)
        ORDER BY month ASC
      `;
      monthlyStats = await executeQuery(monthlySql, []);
    }

    // Thống kê theo loại nội dung
    const contentStatsSql = `
      SELECT 
        resource_type,
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(*) as total_visits
      FROM view_tracking 
      WHERE ${dateCondition}
      GROUP BY resource_type
      ORDER BY total_visits DESC
    `;

    const contentStats = await executeQuery(contentStatsSql, params);

    res.json({
      success: true,
      message: 'Simple statistics retrieved successfully',
      data: {
        period,
        total_visits: totalVisits[0] || { unique_ips: 0, total_visits: 0 },
        daily_stats: dailyStats,
        monthly_stats: monthlyStats,
        content_stats: contentStats
      }
    });

  } catch (error) {
    console.error('Get simple stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve simple statistics',
      code: 'GET_SIMPLE_STATS_ERROR'
    });
  }
};

/**
 * Lấy thống kê tổng quan cho dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardOverview = async (req, res) => {
  try {
    // Thống kê hôm nay
    const todayStats = await executeQuery(`
      SELECT 
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(DISTINCT ip_address) as total_visits
      FROM view_tracking 
      WHERE view_date = CURDATE()
    `);

    // Thống kê tuần này
    const weekStats = await executeQuery(`
      SELECT 
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(DISTINCT ip_address) as total_visits
      FROM view_tracking 
      WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
    `);

    // Thống kê tháng này
    const monthStats = await executeQuery(`
      SELECT 
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(DISTINCT ip_address) as total_visits
      FROM view_tracking 
      WHERE YEAR(view_date) = YEAR(CURDATE()) AND MONTH(view_date) = MONTH(CURDATE())
    `);

    // Thống kê năm này
    const yearStats = await executeQuery(`
      SELECT 
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(DISTINCT ip_address) as total_visits
      FROM view_tracking 
      WHERE YEAR(view_date) = YEAR(CURDATE())
    `);

    res.json({
      success: true,
      message: 'Dashboard overview retrieved successfully',
      data: {
        today: todayStats[0] || { unique_ips: 0, total_visits: 0 },
        week: weekStats[0] || { unique_ips: 0, total_visits: 0 },
        month: monthStats[0] || { unique_ips: 0, total_visits: 0 },
        year: yearStats[0] || { unique_ips: 0, total_visits: 0 }
      }
    });

  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard overview',
      code: 'GET_DASHBOARD_OVERVIEW_ERROR'
    });
  }
};

module.exports = {
  getSimpleStats,
  getDashboardOverview
};
