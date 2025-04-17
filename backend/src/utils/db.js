const mysql = require('mysql2/promise');
const config = require('../config/db');

/**
 * 数据库连接池
 */
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * 执行SQL查询
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Promise<Array>} - 查询结果
 */
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('SQL执行错误:', error);
    throw error;
  }
}

/**
 * 获取单个记录
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Promise<Object>} - 单条记录
 */
async function getOne(sql, params) {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * 执行事务
 * @param {Function} callback - 事务回调，接收connection参数
 * @returns {Promise<any>} - 执行结果
 */
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 支持逻辑删除的查询条件生成
 * @param {Object} conditions - 查询条件对象
 * @param {boolean} withDeleted - 是否包含已删除数据，默认false
 * @returns {Object} - 处理后的查询条件对象
 */
function addLogicDeleteCondition(conditions = {}, withDeleted = false) {
  const result = { ...conditions };
  if (!withDeleted) {
    result.is_deleted = 0;
  }
  return result;
}

/**
 * 构建带逻辑删除条件的WHERE子句
 * @param {string} whereClause - 原WHERE子句
 * @param {boolean} withDeleted - 是否包含已删除数据，默认false
 * @returns {string} - 处理后的WHERE子句
 */
function buildLogicDeleteWhereClause(whereClause = '', withDeleted = false) {
  if (!whereClause) {
    return withDeleted ? '' : 'WHERE is_deleted = 0';
  }
  
  if (withDeleted) {
    return `WHERE ${whereClause}`;
  }
  
  return `WHERE ${whereClause} AND is_deleted = 0`;
}

module.exports = {
  query,
  getOne,
  transaction,
  addLogicDeleteCondition,
  buildLogicDeleteWhereClause
}; 