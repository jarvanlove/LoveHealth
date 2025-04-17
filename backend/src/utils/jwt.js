const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

/**
 * JWT工具函数
 * 用于生成和验证JWT令牌
 */

/**
 * 生成JWT令牌
 * @param {Object} payload - 载荷数据
 * @param {string} expiresIn - 过期时间，默认为1天
 * @returns {string} - JWT令牌
 */
function generateToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, config.secret, { expiresIn });
}

/**
 * 验证JWT令牌
 * @param {string} token - JWT令牌
 * @returns {Object|null} - 解码后的载荷或null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.secret);
  } catch (error) {
    console.error('令牌验证错误:', error.message);
    return null;
  }
}

/**
 * 从请求头中提取令牌
 * @param {Object} req - 请求对象
 * @returns {string|null} - 令牌或null
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  // 格式：Bearer xxxxx
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

module.exports = {
  generateToken,
  verifyToken,
  extractToken
}; 