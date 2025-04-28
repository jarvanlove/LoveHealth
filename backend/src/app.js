const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./middlewares/cors');
const db = require('./config/database');
const routes = require('./routes');
const { errorResponse } = require('./utils/response');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 中间件
app.use(corsMiddleware); // 使用自定义跨域中间件
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 添加路由
app.use(routes);

// 测试数据库连接
db.testConnection()
  .then(connected => {
    if (connected) {
      console.log('数据库连接成功');
    } else {
      console.error('数据库连接失败，请检查配置');
    }
  })
  .catch(err => {
    console.error('数据库连接错误:', err);
  });

// 简单的健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: '服务正常运行' });
});

// 添加测试路由验证逻辑删除功能
app.get('/test/logic-delete', async (req, res) => {
  try {
    const UserModel = require('./models/UserModel');
    const result = {
      message: '逻辑删除功能测试',
      explanation: '所有查询默认过滤已删除数据(is_deleted=1)',
      modelMethods: [
        'findById - 根据ID查询记录(默认过滤已删除)',
        'findAll - 查询所有记录(默认过滤已删除)',
        'delete - 逻辑删除记录(设置is_deleted=1)',
        'restore - 恢复已删除记录(设置is_deleted=0)',
        'forceDelete - 物理删除记录(从数据库中彻底删除)'
      ]
    };
    res.status(200).json(result);
  } catch (error) {
    console.error('测试逻辑删除功能出错:', error);
    res.status(500).json({ error: '测试失败', message: error.message });
  }
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  return errorResponse(
    res,
    process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
    500
  );
});

// 端口配置
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app; 