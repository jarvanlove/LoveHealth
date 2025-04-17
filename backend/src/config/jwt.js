require('dotenv').config();

/**
 * JWT配置
 */
const config = {
  secret: process.env.JWT_SECRET || 'love_health_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  algorithm: process.env.JWT_ALGORITHM || 'HS256'
};

module.exports = config; 