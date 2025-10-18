const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * JWT Configuration
 * Quản lý JWT tokens cho authentication và authorization
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-very-long-and-random';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-here-make-it-very-long-and-random';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
//   throw new Error('JWT secrets must be defined in environment variables');
// }

/**
 * Generate access token
 * @param {Object} payload - User data to encode
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'yt-capital-api',
    audience: 'yt-capital-client'
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { 
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'yt-capital-api',
    audience: 'yt-capital-client'
  });
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'yt-capital-api',
    audience: 'yt-capital-client'
  });
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET, {
    issuer: 'yt-capital-api',
    audience: 'yt-capital-client'
  });
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} user - User object
 * @returns {Object} Token pair
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWT_EXPIRES_IN
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
};

