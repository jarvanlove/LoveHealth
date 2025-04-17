const database = require('./database');
const redis = require('./redis');
const minio = require('./minio');
const jwt = require('./jwt');

// 测试所有连接
const testAllConnections = async () => {
  const dbConnected = await database.testConnection();
  const minioConnected = await minio.testConnection();
  
  // Redis连接会在使用时自动创建
  
  return {
    dbConnected,
    minioConnected
  };
};

module.exports = {
  database,
  redis,
  minio,
  jwt,
  testAllConnections
}; 