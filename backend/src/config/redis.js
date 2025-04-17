const redis = require('redis');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  // 默认使用0号数据库
  db: process.env.REDIS_DB || 0
};

// 创建Redis客户端
const createClient = async () => {
  const client = redis.createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`,
    database: redisConfig.db
  });

  client.on('error', (err) => {
    console.error('Redis Error:', err);
  });

  client.on('connect', () => {
    console.log('Redis连接成功');
  });

  await client.connect();
  
  return client;
};

let redisClient = null;

// 获取Redis客户端的单例
const getClient = async () => {
  if (!redisClient) {
    redisClient = await createClient();
  }
  return redisClient;
};

module.exports = {
  getClient
}; 