/**
 * 文件上传工具类
 * 基于Minio实现文件存储功能
 */

const Minio = require('minio');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');

// 从环境变量获取Minio配置
const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  buckets: {
    public: process.env.MINIO_PUBLIC_BUCKET || 'lovehealth-public',
    private: process.env.MINIO_PRIVATE_BUCKET || 'lovehealth-private'
  }
};

// 生成唯一文件名
const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  
  // 生成格式: 原始名称-时间戳-随机字符串.扩展名
  return `${name}-${timestamp}-${randomString}${ext}`;
};

// 创建Minio客户端
const minioClient = new Minio.Client({
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: minioConfig.useSSL,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey
});

// 文件上传工具对象
const fileUpload = {
  /**
   * 初始化存储桶
   * 检查桶是否存在，不存在则创建
   * @returns {Promise<void>}
   */
  async initBuckets() {
    try {
      // 检查并创建公开桶
      const publicBucketExists = await minioClient.bucketExists(minioConfig.buckets.public);
      if (!publicBucketExists) {
        await minioClient.makeBucket(minioConfig.buckets.public, 'us-east-1');
        console.log(`创建公开桶 ${minioConfig.buckets.public} 成功`);
        
        // 设置公开桶策略
        const publicPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${minioConfig.buckets.public}/*`]
            }
          ]
        };
        
        await minioClient.setBucketPolicy(
          minioConfig.buckets.public, 
          JSON.stringify(publicPolicy)
        );
      }
      
      // 检查并创建私有桶
      const privateBucketExists = await minioClient.bucketExists(minioConfig.buckets.private);
      if (!privateBucketExists) {
        await minioClient.makeBucket(minioConfig.buckets.private, 'us-east-1');
        console.log(`创建私有桶 ${minioConfig.buckets.private} 成功`);
      }
      
      console.log('Minio存储桶初始化完成');
    } catch (error) {
      console.error('初始化Minio存储桶失败:', error);
      throw error;
    }
  },

  /**
   * 上传文件到公开桶
   * @param {string|Buffer|ReadableStream} file 文件路径、Buffer或可读流
   * @param {string} originalFilename 原始文件名
   * @param {string} [contentType] 文件MIME类型，如未提供则自动检测
   * @returns {Promise<object>} 上传结果，包含url和objectName
   */
  async uploadPublicFile(file, originalFilename, contentType) {
    return await this.uploadFile(file, originalFilename, contentType, true);
  },

  /**
   * 上传文件到私有桶
   * @param {string|Buffer|ReadableStream} file 文件路径、Buffer或可读流
   * @param {string} originalFilename 原始文件名
   * @param {string} [contentType] 文件MIME类型，如未提供则自动检测
   * @returns {Promise<object>} 上传结果，包含url和objectName
   */
  async uploadPrivateFile(file, originalFilename, contentType) {
    return await this.uploadFile(file, originalFilename, contentType, false);
  },

  /**
   * 上传文件
   * @param {string|Buffer|ReadableStream} file 文件路径、Buffer或可读流
   * @param {string} originalFilename 原始文件名
   * @param {string} [contentType] 文件MIME类型，如未提供则自动检测
   * @param {boolean} isPublic 是否为公开文件
   * @returns {Promise<object>} 上传结果，包含url和objectName
   */
  async uploadFile(file, originalFilename, contentType, isPublic = true) {
    try {
      // 目标桶名
      const bucketName = isPublic ? 
        minioConfig.buckets.public : 
        minioConfig.buckets.private;
      
      // 生成唯一文件名
      const objectName = generateUniqueFilename(originalFilename);
      
      // 如果未提供内容类型，尝试从文件名检测
      if (!contentType) {
        contentType = mime.lookup(originalFilename) || 'application/octet-stream';
      }
      
      // 元数据
      const metaData = {
        'Content-Type': contentType,
        'X-Amz-Meta-Original-Filename': originalFilename
      };
      
      // 处理不同类型的文件输入
      let fileStream;
      
      if (Buffer.isBuffer(file)) {
        // 如果是Buffer
        const tempFilePath = path.join(require('os').tmpdir(), objectName);
        fs.writeFileSync(tempFilePath, file);
        fileStream = fs.createReadStream(tempFilePath);
        
        // 记录临时文件路径，上传后删除
        const cleanup = () => {
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.error('删除临时文件失败:', err);
          }
        };
        
        fileStream.on('end', cleanup);
        fileStream.on('error', cleanup);
      } else if (typeof file === 'string') {
        // 如果是文件路径
        fileStream = fs.createReadStream(file);
      } else {
        // 如果是可读流
        fileStream = file;
      }
      
      // 获取文件大小
      let fileSize;
      if (typeof file === 'string') {
        const stats = fs.statSync(file);
        fileSize = stats.size;
      }
      
      // 上传文件
      await minioClient.putObject(
        bucketName,
        objectName,
        fileStream,
        fileSize,
        metaData
      );
      
      // 构建URL
      let url;
      if (isPublic) {
        // 公开文件URL
        if (minioConfig.useSSL) {
          url = `https://${minioConfig.endPoint}:${minioConfig.port}/${bucketName}/${objectName}`;
        } else {
          url = `http://${minioConfig.endPoint}:${minioConfig.port}/${bucketName}/${objectName}`;
        }
      } else {
        // 私有文件需要临时URL
        url = await minioClient.presignedGetObject(bucketName, objectName, 60 * 60); // 默认1小时有效
      }
      
      return {
        url,
        bucket: bucketName,
        objectName,
        originalFilename,
        size: fileSize,
        contentType
      };
    } catch (error) {
      console.error('上传文件失败:', error);
      throw error;
    }
  },

  /**
   * 获取私有文件的临时访问URL
   * @param {string} objectName 对象名称
   * @param {number} [expiry=3600] 过期时间（秒），默认1小时
   * @returns {Promise<string>} 临时访问URL
   */
  async getPresignedUrl(objectName, expiry = 3600) {
    try {
      return await minioClient.presignedGetObject(
        minioConfig.buckets.private, 
        objectName, 
        expiry
      );
    } catch (error) {
      console.error('获取临时URL失败:', error);
      throw error;
    }
  },

  /**
   * 删除文件
   * @param {string} bucket 桶名称
   * @param {string} objectName 对象名称
   * @returns {Promise<void>}
   */
  async deleteFile(bucket, objectName) {
    try {
      await minioClient.removeObject(bucket, objectName);
      console.log(`删除文件成功: ${bucket}/${objectName}`);
    } catch (error) {
      console.error('删除文件失败:', error);
      throw error;
    }
  },

  /**
   * 检查文件是否存在
   * @param {string} bucket 桶名称
   * @param {string} objectName 对象名称
   * @returns {Promise<boolean>} 是否存在
   */
  async fileExists(bucket, objectName) {
    try {
      await minioClient.statObject(bucket, objectName);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  },

  /**
   * 获取文件信息
   * @param {string} bucket 桶名称
   * @param {string} objectName 对象名称
   * @returns {Promise<object>} 文件信息
   */
  async getFileStats(bucket, objectName) {
    try {
      return await minioClient.statObject(bucket, objectName);
    } catch (error) {
      console.error('获取文件信息失败:', error);
      throw error;
    }
  },

  /**
   * 复制文件
   * @param {string} sourceBucket 源桶名称
   * @param {string} sourceObject 源对象名称
   * @param {string} destBucket 目标桶名称
   * @param {string} destObject 目标对象名称
   * @returns {Promise<object>} 复制结果
   */
  async copyFile(sourceBucket, sourceObject, destBucket, destObject) {
    try {
      const conds = new Minio.CopyConditions();
      return await minioClient.copyObject(
        destBucket, 
        destObject, 
        `${sourceBucket}/${sourceObject}`, 
        conds
      );
    } catch (error) {
      console.error('复制文件失败:', error);
      throw error;
    }
  },

  /**
   * 列出桶中的文件
   * @param {string} bucket 桶名称
   * @param {string} [prefix=''] 前缀过滤
   * @param {boolean} [recursive=true] 是否递归查询
   * @returns {Promise<Array<object>>} 文件列表
   */
  async listFiles(bucket, prefix = '', recursive = true) {
    try {
      const fileList = [];
      const stream = minioClient.listObjects(bucket, prefix, recursive);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          fileList.push(obj);
        });
        
        stream.on('error', (err) => {
          reject(err);
        });
        
        stream.on('end', () => {
          resolve(fileList);
        });
      });
    } catch (error) {
      console.error('列出文件失败:', error);
      throw error;
    }
  }
};

module.exports = fileUpload; 