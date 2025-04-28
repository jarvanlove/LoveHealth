const BaseModel = require('./BaseModel');

/**
 * 用户模型类
 * 继承BaseModel，添加用户特定的方法
 */
class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  /**
   * 记录事务日志
   * @param {string} operation - 操作类型
   * @param {string} sql - SQL语句
   * @param {Array} params - 参数
   * @param {string} stage - 事务阶段
   * @param {Error} error - 错误对象（如果有）
   */
  logTransaction(operation, sql, params, stage, error = null) {
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', `事务操作失败 [${stage}] >>>>>>>>>>>>>>>>>>>>>`);
      console.error('操作:', operation);
      console.error('SQL:', sql);
      console.error('参数:', params);
      console.error('错误:', error.message);
      console.error('\x1b[31m%s\x1b[0m', '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    } else {
      console.log('\x1b[36m%s\x1b[0m', `事务操作成功 [${stage}] >>>>>>>>>>>>>>>>>>>>>`);
      console.log('操作:', operation);
      console.log('SQL:', sql);
      console.log('参数:', params);
      console.log('\x1b[36m%s\x1b[0m', '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }
  }

  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} - 查询结果
   */
  async findByUsername(username) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE username = ? AND is_deleted = 0`;
      const rows = await this.query(sql, [username]);
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
      const rows = await this.query(sql, [email]);
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
      const rows = await this.query(sql, [phone]);
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
    const connection = await this.getConnection();
    
    try {
      console.log('\x1b[33m%s\x1b[0m', '开始创建用户事务 >>>>>>>>>>>>>>>>>>');
      // 开始事务
      await connection.beginTransaction();

      // 创建用户
      const userKeys = Object.keys(userData);
      const userValues = Object.values(userData);
      const userPlaceholders = userKeys.map(() => '?').join(', ');
      const userSql = `INSERT INTO ${this.tableName} (${userKeys.join(', ')}) VALUES (${userPlaceholders})`;
      
      this.logTransaction('INSERT', userSql, userValues, '创建用户');
      const [userResult] = await connection.execute(userSql, userValues);
      const userId = userResult.insertId;

      // 创建用户资料
      profileData.user_id = userId;
      const profileKeys = Object.keys(profileData);
      const profileValues = Object.values(profileData);
      const profilePlaceholders = profileKeys.map(() => '?').join(', ');
      const profileSql = `INSERT INTO user_profiles (${profileKeys.join(', ')}) VALUES (${profilePlaceholders})`;
      
      this.logTransaction('INSERT', profileSql, profileValues, '创建用户资料');
      await connection.execute(profileSql, profileValues);

      // 提交事务
      await connection.commit();
      console.log('\x1b[33m%s\x1b[0m', '事务提交成功 <<<<<<<<<<<<<<<<<<<');

      // 获取完整的用户数据
      return this.getUserWithProfile(userId);
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      this.logTransaction('TRANSACTION', '', [], '事务回滚', error);
      throw error;
    } finally {
      // 释放连接
      connection.release();
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
    const connection = await this.getConnection();
    
    try {
      console.log('\x1b[33m%s\x1b[0m', '开始更新用户事务 >>>>>>>>>>>>>>>>>>');
      // 开始事务
      await connection.beginTransaction();

      // 更新用户基本信息（如果有）
      if (Object.keys(userData).length > 0) {
        const userSetClause = Object.keys(userData).map(key => `${key} = ?`).join(', ');
        const userValues = [...Object.values(userData), userId];
        const userSql = `UPDATE ${this.tableName} SET ${userSetClause} WHERE id = ? AND is_deleted = 0`;
        
        this.logTransaction('UPDATE', userSql, userValues, '更新用户基本信息');
        await connection.execute(userSql, userValues);
      }

      // 更新用户资料（如果有）
      if (Object.keys(profileData).length > 0) {
        // 检查用户资料是否存在
        const checkSql = 'SELECT id FROM user_profiles WHERE user_id = ?';
        this.logTransaction('SELECT', checkSql, [userId], '检查用户资料');
        const [checkResult] = await connection.execute(checkSql, [userId]);

        if (checkResult.length > 0) {
          // 资料存在，执行更新
          const profileSetClause = Object.keys(profileData).map(key => `${key} = ?`).join(', ');
          const profileValues = [...Object.values(profileData), userId];
          const profileSql = `UPDATE user_profiles SET ${profileSetClause} WHERE user_id = ?`;
          
          this.logTransaction('UPDATE', profileSql, profileValues, '更新用户资料');
          await connection.execute(profileSql, profileValues);
        } else {
          // 资料不存在，创建新资料
          profileData.user_id = userId;
          const profileKeys = Object.keys(profileData);
          const profileValues = Object.values(profileData);
          const profilePlaceholders = profileKeys.map(() => '?').join(', ');
          const profileSql = `INSERT INTO user_profiles (${profileKeys.join(', ')}) VALUES (${profilePlaceholders})`;
          
          this.logTransaction('INSERT', profileSql, profileValues, '创建用户资料');
          await connection.execute(profileSql, profileValues);
        }
      }

      // 提交事务
      await connection.commit();
      console.log('\x1b[33m%s\x1b[0m', '事务提交成功 <<<<<<<<<<<<<<<<<<<');

      // 获取更新后的完整用户数据
      return this.getUserWithProfile(userId);
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      this.logTransaction('TRANSACTION', '', [], '事务回滚', error);
      throw error;
    } finally {
      // 释放连接
      connection.release();
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
      const rows = await this.query(sql, [userId]);
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
      const postsCount = await this.query(
        'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_deleted = 0',
        [userId]
      );

      // 获取关注数
      const followingCount = await this.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE user_id = ? AND is_deleted = 0',
        [userId]
      );

      // 获取粉丝数
      const followersCount = await this.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE followed_id = ? AND is_deleted = 0',
        [userId]
      );

      // 获取收藏数
      const collectionsCount = await this.query(
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
}

module.exports = new UserModel(); 