const cors = require('cors');

/**
 * 跨域中间件配置
 * 提供更精细的CORS控制
 */
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的源列表，生产环境应该限制具体域名
    const allowedOrigins = [
      'http://localhost:3000',  // 前端开发服务器
      'http://localhost:5173',  // Vite默认端口
      'http://127.0.0.1:5173',
      'capacitor://localhost',  // Capacitor应用
      'http://localhost'        // 通用本地测试
    ];
    
    // 允许没有来源的请求（如移动应用）或在允许列表中的来源
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域请求'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,  // 允许携带凭证
  maxAge: 86400,      // 预检请求结果缓存24小时
  optionsSuccessStatus: 200
};

/**
 * 导出配置好的CORS中间件
 */
module.exports = cors(corsOptions); 