const connection = require('../config/database');

/**
 * 基础模型类
 * 提供通用的数据库操作方法，包括逻辑删除功能
 */
class BaseModel {
  /**
   * 构造函数
   * @param {string} tableName - 表名
   * @param {string} primaryKey - 主键字段名，默认为'id'
   */
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * 查询单条记录
   * @param {number|string} id - 主键值
   * @param {boolean} withDeleted - 是否包含已删除记录
   * @returns {Promise<Object|null>} - 查询结果
   */
  async findById(id, withDeleted = false) {
    try {
      let sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
      const params = [id];

      // 默认过滤已删除记录
      if (!withDeleted && this.hasIsDeletedField()) {
        sql += ' AND is_deleted = ?';
        params.push(0);
      }

      const [rows] = await connection.query(sql, params);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`查询记录错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 查询多条记录
   * @param {Object} options - 查询选项
   * @param {string} options.where - WHERE条件语句
   * @param {Array} options.params - 查询参数
   * @param {number} options.limit - 限制返回记录数
   * @param {number} options.offset - 查询起始位置
   * @param {string} options.orderBy - 排序语句
   * @param {boolean} options.withDeleted - 是否包含已删除记录
   * @returns {Promise<Array>} - 查询结果数组
   */
  async findAll(options = {}) {
    const {
      where = '',
      params = [],
      limit = 100,
      offset = 0,
      orderBy = `${this.primaryKey} DESC`,
      withDeleted = false
    } = options;

    try {
      let sql = `SELECT * FROM ${this.tableName}`;
      const queryParams = [...params];

      if (where) {
        sql += ` WHERE ${where}`;
      }

      // 默认过滤已删除记录
      if (!withDeleted && this.hasIsDeletedField()) {
        sql += where ? ' AND' : ' WHERE';
        sql += ' is_deleted = ?';
        queryParams.push(0);
      }

      if (orderBy) {
        sql += ` ORDER BY ${orderBy}`;
      }

      sql += ` LIMIT ? OFFSET ?`;
      queryParams.push(parseInt(limit, 10), parseInt(offset, 10));

      const [rows] = await connection.query(sql, queryParams);
      return rows;
    } catch (error) {
      console.error(`查询记录列表错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 计算记录总数
   * @param {string} where - WHERE条件语句
   * @param {Array} params - 查询参数
   * @param {boolean} withDeleted - 是否包含已删除记录
   * @returns {Promise<number>} - 记录总数
   */
  async count(where = '', params = [], withDeleted = false) {
    try {
      let sql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      const queryParams = [...params];

      if (where) {
        sql += ` WHERE ${where}`;
      }

      // 默认过滤已删除记录
      if (!withDeleted && this.hasIsDeletedField()) {
        sql += where ? ' AND' : ' WHERE';
        sql += ' is_deleted = ?';
        queryParams.push(0);
      }

      const [rows] = await connection.query(sql, queryParams);
      return rows[0].total;
    } catch (error) {
      console.error(`计算记录总数错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 创建记录
   * @param {Object} data - 记录数据
   * @returns {Promise<Object>} - 创建的记录
   */
  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');

      const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
      const [result] = await connection.query(sql, values);

      if (result.insertId) {
        return this.findById(result.insertId);
      }
      return data;
    } catch (error) {
      console.error(`创建记录错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 更新记录
   * @param {number|string} id - 主键值
   * @param {Object} data - 要更新的数据
   * @returns {Promise<Object>} - 更新结果
   */
  async update(id, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      if (keys.length === 0) {
        throw new Error('没有提供更新数据');
      }

      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;

      values.push(id);
      const [result] = await connection.query(sql, values);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows
      };
    } catch (error) {
      console.error(`更新记录错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 逻辑删除记录（设置is_deleted = 1）
   * @param {number|string} id - 主键值
   * @returns {Promise<Object>} - 删除结果
   */
  async delete(id) {
    try {
      if (!this.hasIsDeletedField()) {
        throw new Error(`表 ${this.tableName} 不支持逻辑删除，请使用 forceDelete 方法`);
      }

      const sql = `UPDATE ${this.tableName} SET is_deleted = 1 WHERE ${this.primaryKey} = ?`;
      const [result] = await connection.query(sql, [id]);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows
      };
    } catch (error) {
      console.error(`逻辑删除记录错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 恢复已删除记录（设置is_deleted = 0）
   * @param {number|string} id - 主键值
   * @returns {Promise<Object>} - 恢复结果
   */
  async restore(id) {
    try {
      if (!this.hasIsDeletedField()) {
        throw new Error(`表 ${this.tableName} 不支持恢复，因为没有 is_deleted 字段`);
      }

      const sql = `UPDATE ${this.tableName} SET is_deleted = 0 WHERE ${this.primaryKey} = ?`;
      const [result] = await connection.query(sql, [id]);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows
      };
    } catch (error) {
      console.error(`恢复记录错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 物理删除记录（从数据库中永久删除）
   * @param {number|string} id - 主键值
   * @returns {Promise<Object>} - 删除结果
   */
  async forceDelete(id) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
      const [result] = await connection.query(sql, [id]);

      return {
        affectedRows: result.affectedRows
      };
    } catch (error) {
      console.error(`物理删除记录错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 检查表是否有is_deleted字段
   * @returns {boolean} - 是否有is_deleted字段
   */
  hasIsDeletedField() {
    // TODO: 实际使用时可以通过查询表结构来检查，或者在构造函数中传入
    return true;
  }

  /**
   * 执行自定义SQL语句
   * @param {string} sql - SQL语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Array>} - 查询结果
   */
  async query(sql, params = []) {
    try {
      const [rows] = await connection.query(sql, params);
      return rows;
    } catch (error) {
      console.error(`执行SQL错误: ${error.message}`);
      throw error;
    }
  }
}

module.exports = BaseModel; 