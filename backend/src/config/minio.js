const Minio = require('minio');

const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucketName: process.env.MINIO_BUCKET || 'lovehealth'
};

// 创建Minio客户端
const minioClient = new Minio.Client({
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: minioConfig.useSSL,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey
});

// 确保bucket存在
const ensureBucketExists = async () => {
  try {
    const exists = await minioClient.bucketExists(minioConfig.bucketName);
    if (!exists) {
      await minioClient.makeBucket(minioConfig.bucketName);
      console.log(`Bucket '${minioConfig.bucketName}' created successfully.`);
    } else {
      console.log(`Bucket '${minioConfig.bucketName}' already exists.`);
    }
    return true;
  } catch (error) {
    console.error('Minio Bucket Error:', error);
    return false;
  }
};

// 测试连接
const testConnection = async () => {
  try {
    // 列出所有Bucket作为连接测试
    await minioClient.listBuckets();
    console.log('Minio连接成功');
    
    // 确保bucket存在
    await ensureBucketExists();
    
    return true;
  } catch (error) {
    console.error('Minio连接失败:', error);
    return false;
  }
};

module.exports = {
  minioClient,
  minioConfig,
  testConnection,
  ensureBucketExists
}; 