const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database configuration
 * Sử dụng connection pool để tối ưu hiệu suất
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'investment_user',
  password: process.env.DB_PASSWORD || 'your_secure_password_here',
  database: process.env.DB_NAME || 'investment_capital',
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 10, // Tăng connection limit cho production
  queueLimit: 0,
  ssl: false, // Disable SSL for VPS connection
  multipleStatements: true,
  acquireTimeout: 60000, // 60 seconds
  timeout: 60000, // 60 seconds
  reconnect: true,
  charset: 'utf8mb4'
};

// Tạo connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Execute query với error handling
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const executeQuery = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Begin transaction
 * @returns {Promise} Transaction connection
 */
const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

/**
 * Commit transaction
 * @param {Object} connection - Transaction connection
 */
const commitTransaction = async (connection) => {
  await connection.commit();
  connection.release();
};

/**
 * Rollback transaction
 * @param {Object} connection - Transaction connection
 */
const rollbackTransaction = async (connection) => {
  await connection.rollback();
  connection.release();
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction
};

