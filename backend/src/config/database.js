const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'love_health',
      connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
      waitForConnections: true,
      queueLimit: 0
    });

    Database.instance = this;
  }

  getPool() {
    return this.pool;
  }

  async execute(sql, params = []) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('数据库执行错误:', error);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const [results] = await this.pool.query(sql, params);
      return results;
    } catch (error) {
      console.error('数据库查询错误:', error);
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      connection.release();
      console.log('数据库连接测试成功');
      return true;
    } catch (error) {
      console.error('数据库连接测试失败:', error);
      return false;
    }
  }
}

// 导出数据库单例
module.exports = new Database(); 