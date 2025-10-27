const { executeQuery } = require('../config/database');

/**
 * View Tracking Model
 * Quản lý tracking lượt xem với logic chống buff
 */
class ViewTracking {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.ip_address = data.ip_address;
    this.user_agent = data.user_agent;
    this.resource_id = data.resource_id;
    this.resource_type = data.resource_type;
    this.view_date = data.view_date;
    this.view_count = data.view_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Track view với logic chống buff
   * @param {Object} trackingData - Dữ liệu tracking
   * @returns {Promise<boolean>} True nếu đã track, false nếu đã track rồi
   */
  static async trackView(trackingData) {
    const { 
      user_id, 
      ip_address, 
      user_agent, 
      resource_id, 
      resource_type 
    } = trackingData;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Check if already tracked today
      let checkSql, checkParams;
      
      if (user_id) {
        // User đã đăng nhập: check theo user_id
        checkSql = `
          SELECT id FROM view_tracking 
          WHERE user_id = ? AND resource_id = ? AND resource_type = ? AND view_date = ?
        `;
        checkParams = [user_id, resource_id, resource_type, today];
      } else {
        // User chưa đăng nhập: check theo IP (không check User-Agent để tránh người dùng khác nhau từ cùng IP)
        checkSql = `
          SELECT id FROM view_tracking 
          WHERE ip_address = ? AND resource_id = ? AND resource_type = ? AND view_date = ?
        `;
        checkParams = [ip_address, resource_id, resource_type, today];
      }

      const existing = await executeQuery(checkSql, checkParams);

      if (existing.length > 0) {
        // Đã track rồi, không làm gì
        return false;
      }

      // Chưa track, tạo record mới
      const insertSql = `
        INSERT INTO view_tracking (user_id, ip_address, user_agent, resource_id, resource_type, view_date, view_count)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `;
      const insertParams = [user_id, ip_address, user_agent, resource_id, resource_type, today];

      await executeQuery(insertSql, insertParams);

      // Không tăng view_count ở đây vì controller sẽ tự tăng
      // await ViewTracking.incrementResourceViewCount(resource_id, resource_type);

      return true;

    } catch (error) {
      console.error('Error tracking view:', error);
      return false;
    }
  }

  /**
   * Tăng view_count trong bảng resource gốc
   * @param {number} resource_id - ID của resource
   * @param {string} resource_type - Loại resource
   */
  static async incrementResourceViewCount(resource_id, resource_type) {
    try {
      let updateSql;
      
      switch (resource_type) {
        case 'post':
          updateSql = 'UPDATE posts SET view_count = view_count + 1 WHERE id = ?';
          break;
        case 'investment_knowledge':
          updateSql = 'UPDATE investment_knowledge SET view_count = view_count + 1 WHERE id = ?';
          break;
        case 'bookjourney':
          updateSql = 'UPDATE bookjourney SET view_count = view_count + 1 WHERE id = ?';
          break;
        default:
          throw new Error('Invalid resource type');
      }

      await executeQuery(updateSql, [resource_id]);
    } catch (error) {
      console.error('Error incrementing resource view count:', error);
    }
  }

  /**
   * Lấy thống kê view theo resource
   * @param {number} resource_id - ID của resource
   * @param {string} resource_type - Loại resource
   * @param {number} days - Số ngày gần đây
   * @returns {Promise<Object>} Thống kê view
   */
  static async getResourceStats(resource_id, resource_type, days = 30) {
    try {
      const sql = `
        SELECT 
          COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
          SUM(view_count) as total_views,
          COUNT(DISTINCT user_id) as logged_in_users,
          COUNT(DISTINCT CASE WHEN user_id IS NULL THEN CONCAT(ip_address, '-', user_agent) END) as anonymous_users
        FROM view_tracking 
        WHERE resource_id = ? AND resource_type = ? AND view_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      `;
      
      const result = await executeQuery(sql, [resource_id, resource_type, days]);
      return result[0] || { unique_visitors: 0, total_views: 0, logged_in_users: 0, anonymous_users: 0 };
    } catch (error) {
      console.error('Error getting resource stats:', error);
      return { unique_visitors: 0, total_views: 0, logged_in_users: 0, anonymous_users: 0 };
    }
  }

  /**
   * Lấy thống kê tổng quan
   * @param {number} days - Số ngày gần đây
   * @returns {Promise<Object>} Thống kê tổng quan
   */
  static async getOverallStats(days = 30) {
    try {
      const sql = `
        SELECT 
          resource_type,
          COUNT(DISTINCT resource_id) as unique_resources,
          COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
          SUM(view_count) as total_views
        FROM view_tracking 
        WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY resource_type
      `;
      
      const result = await executeQuery(sql, [days]);
      return result;
    } catch (error) {
      console.error('Error getting overall stats:', error);
      return [];
    }
  }

  /**
   * Lấy top content được xem nhiều nhất
   * @param {string} resource_type - Loại resource
   * @param {number} limit - Số lượng top
   * @param {number} days - Số ngày gần đây
   * @returns {Promise<Array>} Danh sách top content
   */
  static async getTopContent(resource_type = null, limit = 10, days = 30) {
    try {
      let sql = `
        SELECT 
          resource_type,
          resource_id,
          COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
          SUM(view_count) as total_views,
          MAX(view_date) as last_viewed
        FROM view_tracking 
        WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      `;
      
      const params = [days];
      
      if (resource_type) {
        sql += ' AND resource_type = ?';
        params.push(resource_type);
      }
      
      sql += `
        GROUP BY resource_type, resource_id
        ORDER BY unique_visitors DESC, total_views DESC
        LIMIT ?
      `;
      
      params.push(limit);
      
      const result = await executeQuery(sql, params);
      return result;
    } catch (error) {
      console.error('Error getting top content:', error);
      return [];
    }
  }

  /**
   * Lấy thống kê dashboard chi tiết (Admin only)
   * @param {number} days - Số ngày gần đây
   * @returns {Promise<Object>} Thống kê dashboard chi tiết
   */
  static async getDashboardStats(days = 30) {
    try {
      // Thống kê hôm nay
      const todayStats = await executeQuery(`
        SELECT 
          COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
          SUM(view_count) as total_views
        FROM view_tracking 
        WHERE DATE(view_date) = CURDATE()
      `);

      // Thống kê tuần này
      const weekStats = await executeQuery(`
        SELECT 
          COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
          SUM(view_count) as total_views
        FROM view_tracking 
        WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
      `);

      // Thống kê tháng này
      const monthStats = await executeQuery(`
        SELECT 
          COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE CONCAT(ip_address, '-', user_agent) END) as unique_visitors,
          SUM(view_count) as total_views
        FROM view_tracking 
        WHERE YEAR(view_date) = YEAR(CURDATE()) AND MONTH(view_date) = MONTH(CURDATE())
      `);

      // Thống kê thiết bị (giả lập dựa trên user_agent)
      const deviceStats = await executeQuery(`
        SELECT 
          CASE 
            WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' OR user_agent LIKE '%iPhone%' THEN 'mobile'
            ELSE 'desktop'
          END as device_type,
          COUNT(*) as count
        FROM view_tracking 
        WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY device_type
      `, [days]);

      // Tính phần trăm thiết bị
      const totalDeviceViews = deviceStats.reduce((sum, item) => sum + item.count, 0);
      const devicePercentages = {
        desktop: deviceStats.find(d => d.device_type === 'desktop')?.count || 0,
        mobile: deviceStats.find(d => d.device_type === 'mobile')?.count || 0
      };

      if (totalDeviceViews > 0) {
        devicePercentages.desktop = Math.round((devicePercentages.desktop / totalDeviceViews) * 100);
        devicePercentages.mobile = Math.round((devicePercentages.mobile / totalDeviceViews) * 100);
      }

      return {
        today: todayStats[0] || { unique_visitors: 0, total_views: 0 },
        this_week: weekStats[0] || { unique_visitors: 0, total_views: 0 },
        this_month: monthStats[0] || { unique_visitors: 0, total_views: 0 },
        device_stats: devicePercentages
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        today: { unique_visitors: 0, total_views: 0 },
        this_week: { unique_visitors: 0, total_views: 0 },
        this_month: { unique_visitors: 0, total_views: 0 },
        device_stats: { desktop: 0, mobile: 0 }
      };
    }
  }
}

module.exports = ViewTracking;
