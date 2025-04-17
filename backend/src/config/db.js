require('dotenv').config();

/**
 * 数据库配置
 */
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'love_health',
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
};

module.exports = config; 