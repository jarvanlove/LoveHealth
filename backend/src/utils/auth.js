const bcrypt = require('bcrypt');

/**
 * 密码加密工具
 * 使用bcrypt对密码进行单向加密
 */

/**
 * 加密密码
 * @param {string} password - 原始密码
 * @returns {Promise<string>} - 加密后的密码
 */
async function hashPassword(password) {
  try {
    // 生成盐值, 10为加密强度
    const salt = await bcrypt.genSalt(10);
    // 使用盐值加密密码
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('密码加密错误:', error);
    throw error;
  }
}

/**
 * 验证密码
 * @param {string} password - 原始密码
 * @param {string} hash - 加密后的密码
 * @returns {Promise<boolean>} - 验证结果
 */
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('密码验证错误:', error);
    throw error;
  }
}

module.exports = {
  hashPassword,
  comparePassword
}; 