/**
 * 日志工具类
 * 提供基于winston的日志记录功能
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { format } = winston;

// 确保日志目录存在
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 自定义日志格式
const customFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // 添加元数据信息
    if (Object.keys(meta).length > 0 && meta.stack !== undefined) {
      logMessage += `\n${meta.stack}`;
    } else if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    
    return logMessage;
  })
);

// 创建logger实例
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'love-health-api' },
  transports: [
    // 控制台输出（开发环境）
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        customFormat
      )
    }),
    // 普通日志文件
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 错误日志文件
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exitOnError: false
});

// 生产环境禁用控制台输出
if (process.env.NODE_ENV === 'production') {
  logger.remove(winston.transports.Console);
}

/**
 * 创建请求日志中间件
 * @returns {Function} Express中间件
 */
const requestLogger = () => {
  return (req, res, next) => {
    const start = Date.now();
    
    // 响应结束时记录请求日志
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
      };
      
      // 根据状态码决定日志级别
      if (res.statusCode >= 500) {
        logger.error('Server Error Response', logData);
      } else if (res.statusCode >= 400) {
        logger.warn('Client Error Response', logData);
      } else {
        logger.info('Request Completed', logData);
      }
    });
    
    next();
  };
};

/**
 * 创建错误日志中间件
 * @returns {Function} Express错误处理中间件
 */
const errorLogger = () => {
  return (err, req, res, next) => {
    logger.error('Unhandled Error', {
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    next(err);
  };
};

module.exports = {
  logger,
  requestLogger,
  errorLogger
}; 