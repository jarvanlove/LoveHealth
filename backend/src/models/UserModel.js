const BaseModel = require('./BaseModel');
const connection = require('../config/database');

/**
 * 用户模型类
 * 继承BaseModel，添加用户特定的方法
 */
class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} - 查询结果
   */
  async findByUsername(username) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE username = ? AND is_deleted = 0`;
      const [rows] = await connection.query(sql, [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`根据用户名查找用户错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 根据邮箱查找用户
   * @param {string} email - 邮箱
   * @returns {Promise<Object|null>} - 查询结果
   */
  async findByEmail(email) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE email = ? AND is_deleted = 0`;
      const [rows] = await connection.query(sql, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`根据邮箱查找用户错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 根据手机号查找用户
   * @param {string} phone - 手机号
   * @returns {Promise<Object|null>} - 查询结果
   */
  async findByPhone(phone) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE phone = ? AND is_deleted = 0`;
      const [rows] = await connection.query(sql, [phone]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`根据手机号查找用户错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 创建用户及其资料
   * @param {Object} userData - 用户基本数据
   * @param {Object} profileData - 用户资料数据
   * @returns {Promise<Object>} - 创建的用户数据
   */
  async createWithProfile(userData, profileData) {
    let connection;

    try {
      // 获取连接并开始事务
      connection = await this.pool.getConnection();
      await connection.beginTransaction();

      // 创建用户
      const userKeys = Object.keys(userData);
      const userValues = Object.values(userData);
      const userPlaceholders = userKeys.map(() => '?').join(', ');

      const userSql = `INSERT INTO ${this.tableName} (${userKeys.join(', ')}) VALUES (${userPlaceholders})`;
      const [userResult] = await connection.query(userSql, userValues);
      const userId = userResult.insertId;

      // 创建用户资料
      profileData.user_id = userId;
      const profileKeys = Object.keys(profileData);
      const profileValues = Object.values(profileData);
      const profilePlaceholders = profileKeys.map(() => '?').join(', ');

      const profileSql = `INSERT INTO user_profiles (${profileKeys.join(', ')}) VALUES (${profilePlaceholders})`;
      await connection.query(profileSql, profileValues);

      // 提交事务
      await connection.commit();

      // 获取完整的用户数据
      return this.getUserWithProfile(userId);
    } catch (error) {
      // 回滚事务
      if (connection) {
        await connection.rollback();
      }
      console.error(`创建用户及资料错误: ${error.message}`);
      throw error;
    } finally {
      // 释放连接
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * 更新用户及其资料
   * @param {number} userId - 用户ID
   * @param {Object} userData - 用户基本数据
   * @param {Object} profileData - 用户资料数据
   * @returns {Promise<Object>} - 更新后的用户数据
   */
  async updateWithProfile(userId, userData = {}, profileData = {}) {
    let connection;

    try {
      // 获取连接并开始事务
      connection = await this.pool.getConnection();
      await connection.beginTransaction();

      // 更新用户基本信息（如果有）
      if (Object.keys(userData).length > 0) {
        const userSetClause = Object.keys(userData).map(key => `${key} = ?`).join(', ');
        const userValues = [...Object.values(userData), userId];
        const userSql = `UPDATE ${this.tableName} SET ${userSetClause} WHERE id = ? AND is_deleted = 0`;
        await connection.query(userSql, userValues);
      }

      // 更新用户资料（如果有）
      if (Object.keys(profileData).length > 0) {
        // 检查用户资料是否存在
        const [checkResult] = await connection.query(
          'SELECT id FROM user_profiles WHERE user_id = ?',
          [userId]
        );

        if (checkResult.length > 0) {
          // 资料存在，执行更新
          const profileSetClause = Object.keys(profileData).map(key => `${key} = ?`).join(', ');
          const profileValues = [...Object.values(profileData), userId];
          const profileSql = `UPDATE user_profiles SET ${profileSetClause} WHERE user_id = ?`;
          await connection.query(profileSql, profileValues);
        } else {
          // 资料不存在，创建新资料
          profileData.user_id = userId;
          const profileKeys = Object.keys(profileData);
          const profileValues = Object.values(profileData);
          const profilePlaceholders = profileKeys.map(() => '?').join(', ');
          const profileSql = `INSERT INTO user_profiles (${profileKeys.join(', ')}) VALUES (${profilePlaceholders})`;
          await connection.query(profileSql, profileValues);
        }
      }

      // 提交事务
      await connection.commit();

      // 获取更新后的完整用户数据
      return this.getUserWithProfile(userId);
    } catch (error) {
      // 回滚事务
      if (connection) {
        await connection.rollback();
      }
      console.error(`更新用户及资料错误: ${error.message}`);
      throw error;
    } finally {
      // 释放连接
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * 获取用户及其资料
   * @param {number} userId - 用户ID
   * @returns {Promise<Object|null>} - 用户数据
   */
  async getUserWithProfile(userId) {
    try {
      const sql = `
        SELECT 
          u.*, 
          p.nickname, p.gender, p.birthday, p.height, p.weight, 
          p.bio, p.preference
        FROM ${this.tableName} u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = ? AND u.is_deleted = 0
      `;
      const [rows] = await connection.query(sql, [userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`获取用户及资料错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取用户参与的社区信息
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} - 用户社区数据
   */
  async getCommunityInfo(userId) {
    try {
      // 获取发布的帖子数
      const [postsCount] = await connection.query(
        'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_deleted = 0',
        [userId]
      );

      // 获取关注数
      const [followingCount] = await connection.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE user_id = ? AND is_deleted = 0',
        [userId]
      );

      // 获取粉丝数
      const [followersCount] = await connection.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE followed_id = ? AND is_deleted = 0',
        [userId]
      );

      // 获取收藏数
      const [collectionsCount] = await connection.query(
        'SELECT COUNT(*) as count FROM collections WHERE user_id = ? AND is_deleted = 0',
        [userId]
      );

      return {
        posts: postsCount[0].count,
        following: followingCount[0].count,
        followers: followersCount[0].count,
        collections: collectionsCount[0].count
      };
    } catch (error) {
      console.error(`获取用户社区信息错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取连接池实例
   */
  get pool() {
    return connection;
  }
}

module.exports = new UserModel(); 