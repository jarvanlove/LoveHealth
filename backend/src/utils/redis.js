/**
 * Redis工具类
 * 提供Redis连接和操作封装
 */

const redis = require('redis');
const { promisify } = require('util');

// 从环境变量获取Redis配置
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: process.env.REDIS_DB || 0,
};

// 创建Redis客户端
const client = redis.createClient(redisConfig);

// 监听错误事件
client.on('error', (err) => {
  console.error('Redis连接错误:', err);
});

// 监听连接事件
client.on('connect', () => {
  console.log('Redis连接成功');
});

// 监听重连事件
client.on('reconnecting', () => {
  console.log('Redis正在重新连接...');
});

// 将回调形式的方法转换为Promise形式
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const hgetAsync = promisify(client.hget).bind(client);
const hsetAsync = promisify(client.hset).bind(client);
const hdelAsync = promisify(client.hdel).bind(client);
const hgetallAsync = promisify(client.hgetall).bind(client);
const incrAsync = promisify(client.incr).bind(client);
const decrAsync = promisify(client.decr).bind(client);
const lpushAsync = promisify(client.lpush).bind(client);
const rpushAsync = promisify(client.rpush).bind(client);
const lpopAsync = promisify(client.lpop).bind(client);
const rpopAsync = promisify(client.rpop).bind(client);
const lrangeAsync = promisify(client.lrange).bind(client);

// Redis工具对象
const redisUtils = {
  /**
   * 设置字符串类型的键值对
   * @param {string} key 键名
   * @param {string|number|object} value 值
   * @param {number} expireTime 过期时间(秒)，不传则永不过期
   * @returns {Promise<string>} 操作结果
   */
  async set(key, value, expireTime) {
    try {
      // 如果值是对象，则转换为JSON字符串
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      
      if (expireTime) {
        return await setAsync(key, stringValue, 'EX', expireTime);
      } else {
        return await setAsync(key, stringValue);
      }
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    }
  },

  /**
   * 获取字符串类型的键值
   * @param {string} key 键名
   * @returns {Promise<any>} 值，如果键不存在则返回null
   */
  async get(key) {
    try {
      const value = await getAsync(key);
      
      if (!value) return null;
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      throw error;
    }
  },

  /**
   * 删除键
   * @param {string|string[]} keys 键名或键名数组
   * @returns {Promise<number>} 删除的键数量
   */
  async del(keys) {
    try {
      return await delAsync(keys);
    } catch (error) {
      console.error('Redis del error:', error);
      throw error;
    }
  },

  /**
   * 设置键的过期时间
   * @param {string} key 键名
   * @param {number} seconds 过期时间(秒)
   * @returns {Promise<number>} 1表示成功，0表示键不存在
   */
  async expire(key, seconds) {
    try {
      return await expireAsync(key, seconds);
    } catch (error) {
      console.error('Redis expire error:', error);
      throw error;
    }
  },

  /**
   * 检查键是否存在
   * @param {string} key 键名
   * @returns {Promise<boolean>} 是否存在
   */
  async exists(key) {
    try {
      const result = await existsAsync(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      throw error;
    }
  },

  /**
   * 根据模式获取键名列表
   * @param {string} pattern 匹配模式，如user:*
   * @returns {Promise<string[]>} 键名数组
   */
  async keys(pattern) {
    try {
      return await keysAsync(pattern);
    } catch (error) {
      console.error('Redis keys error:', error);
      throw error;
    }
  },

  /**
   * 设置哈希表字段值
   * @param {string} key 哈希表键名
   * @param {string} field 字段名
   * @param {string|number|object} value 字段值
   * @returns {Promise<number>} 1表示新建，0表示更新
   */
  async hset(key, field, value) {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      return await hsetAsync(key, field, stringValue);
    } catch (error) {
      console.error('Redis hset error:', error);
      throw error;
    }
  },

  /**
   * 获取哈希表字段值
   * @param {string} key 哈希表键名
   * @param {string} field 字段名
   * @returns {Promise<any>} 字段值
   */
  async hget(key, field) {
    try {
      const value = await hgetAsync(key, field);
      
      if (!value) return null;
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      console.error('Redis hget error:', error);
      throw error;
    }
  },

  /**
   * 获取哈希表所有字段和值
   * @param {string} key 哈希表键名
   * @returns {Promise<object>} 包含所有字段和值的对象
   */
  async hgetall(key) {
    try {
      const data = await hgetallAsync(key);
      
      if (!data) return null;
      
      // 尝试将值转换为JSON对象
      Object.keys(data).forEach(field => {
        try {
          data[field] = JSON.parse(data[field]);
        } catch (e) {
          // 如果不是JSON，保持原样
        }
      });
      
      return data;
    } catch (error) {
      console.error('Redis hgetall error:', error);
      throw error;
    }
  },

  /**
   * 删除哈希表字段
   * @param {string} key 哈希表键名
   * @param {string|string[]} fields 字段名或字段名数组
   * @returns {Promise<number>} 删除的字段数量
   */
  async hdel(key, fields) {
    try {
      const fieldArray = Array.isArray(fields) ? fields : [fields];
      return await hdelAsync(key, ...fieldArray);
    } catch (error) {
      console.error('Redis hdel error:', error);
      throw error;
    }
  },

  /**
   * 将键的值加1
   * @param {string} key 键名
   * @returns {Promise<number>} 增加后的值
   */
  async incr(key) {
    try {
      return await incrAsync(key);
    } catch (error) {
      console.error('Redis incr error:', error);
      throw error;
    }
  },

  /**
   * 将键的值减1
   * @param {string} key 键名
   * @returns {Promise<number>} 减少后的值
   */
  async decr(key) {
    try {
      return await decrAsync(key);
    } catch (error) {
      console.error('Redis decr error:', error);
      throw error;
    }
  },

  /**
   * 将一个或多个值插入到列表头部
   * @param {string} key 列表键名
   * @param {any[]} values 要插入的值
   * @returns {Promise<number>} 插入后列表的长度
   */
  async lpush(key, values) {
    try {
      const valueArray = Array.isArray(values) ? values : [values];
      const stringValues = valueArray.map(v => 
        typeof v === 'object' ? JSON.stringify(v) : v
      );
      return await lpushAsync(key, ...stringValues);
    } catch (error) {
      console.error('Redis lpush error:', error);
      throw error;
    }
  },

  /**
   * 将一个或多个值插入到列表尾部
   * @param {string} key 列表键名
   * @param {any[]} values 要插入的值
   * @returns {Promise<number>} 插入后列表的长度
   */
  async rpush(key, values) {
    try {
      const valueArray = Array.isArray(values) ? values : [values];
      const stringValues = valueArray.map(v => 
        typeof v === 'object' ? JSON.stringify(v) : v
      );
      return await rpushAsync(key, ...stringValues);
    } catch (error) {
      console.error('Redis rpush error:', error);
      throw error;
    }
  },

  /**
   * 移出并获取列表的第一个元素
   * @param {string} key 列表键名
   * @returns {Promise<any>} 第一个元素值
   */
  async lpop(key) {
    try {
      const value = await lpopAsync(key);
      
      if (!value) return null;
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      console.error('Redis lpop error:', error);
      throw error;
    }
  },

  /**
   * 移出并获取列表的最后一个元素
   * @param {string} key 列表键名
   * @returns {Promise<any>} 最后一个元素值
   */
  async rpop(key) {
    try {
      const value = await rpopAsync(key);
      
      if (!value) return null;
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      console.error('Redis rpop error:', error);
      throw error;
    }
  },

  /**
   * 获取列表指定范围内的元素
   * @param {string} key 列表键名
   * @param {number} start 开始索引
   * @param {number} stop 结束索引
   * @returns {Promise<any[]>} 指定范围的元素数组
   */
  async lrange(key, start, stop) {
    try {
      const values = await lrangeAsync(key, start, stop);
      
      // 尝试将列表中的元素解析为JSON对象
      return values.map(value => {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      });
    } catch (error) {
      console.error('Redis lrange error:', error);
      throw error;
    }
  },

  /**
   * 关闭Redis连接
   */
  quit() {
    client.quit();
    console.log('Redis连接已关闭');
  }
};

module.exports = redisUtils; 