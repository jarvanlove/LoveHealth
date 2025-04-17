# 爱健康 APP

配料表+营养食谱APP，为用户提供食材营养知识、健康食谱和社区交流平台。

## 项目概述

- 项目名称：爱健康 APP
- 开发周期：30天
- 核心功能：食材营养知识、健康食谱分享、社区交流、AI智能助手

## 技术栈

### 前端技术栈

- 框架：Vue 3
- 构建工具：Vite
- 状态管理：Pinia
- 路由管理：Vue Router
- UI组件库：Vant UI
- 网络请求：Axios
- 跨平台：Capacitor

### 后端技术栈

- 运行环境：Node.js
- Web框架：Express
- 数据库：MySQL
- 对象存储：Minio
- 认证方案：JWT
- 缓存：Redis

## 环境配置

### 开发环境需求

- Node.js 18+
- MySQL 5.7+
- Redis 3.0+
- Minio Server

### 本地开发环境配置

#### MySQL配置

- 端口：3306
- 用户名：root
- 密码：root
- 数据库名称：love_health

#### Redis配置

- 端口：6379
- 无需用户名和密码
- 默认使用0号库

#### Minio配置

- 下载地址：https://minio.org.cn/download.shtml
- 服务端端口：9001 
- API端口：9000
- 用户名：admin
- 密码：minioadmin

## 项目结构

### 前端项目结构

```
frontend/
├── public/                # 静态资源
├── src/
│   ├── api/               # API接口
│   │   ├── modules/       # 按模块划分的API
│   │   └── index.ts       # API统一出口
│   ├── assets/            # 项目资源
│   │   ├── images/        # 图片资源
│   │   ├── icons/         # 图标资源
│   │   └── styles/        # 全局样式
│   ├── components/        # 全局组件
│   │   ├── base/          # 基础组件
│   │   └── business/      # 业务组件
│   ├── composables/       # 组合式函数
│   ├── config/            # 配置文件
│   ├── hooks/             # 自定义钩子
│   ├── layouts/           # 布局组件
│   ├── router/            # 路由配置
│   │   ├── modules/       # 路由模块
│   │   └── index.ts       # 路由实例
│   ├── stores/            # 状态管理
│   │   ├── modules/       # 按模块划分的状态
│   │   └── index.ts       # Store统一出口
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   │   ├── auth/          # 认证相关页面
│   │   ├── home/          # 首页相关
│   │   ├── community/     # 社区相关
│   │   ├── recipe/        # 食谱相关
│   │   ├── knowledge/     # 知识库相关
│   │   ├── profile/       # 个人中心
│   │   └── ai/            # AI助手相关
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── env.d.ts           # 环境变量类型声明
├── .env                   # 公共环境变量
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── index.html             # HTML模板
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── README.md              # 项目说明
```

### 后端项目结构

```
backend/
├── src/
│   ├── config/            # 配置文件
│   │   ├── database.js    # 数据库配置
│   │   ├── redis.js       # Redis配置
│   │   ├── minio.js       # Minio配置
│   │   ├── jwt.js         # JWT配置
│   │   └── index.js       # 配置聚合
│   ├── controllers/       # 控制器
│   │   ├── auth/          # 认证相关
│   │   ├── user/          # 用户相关
│   │   ├── recipe/        # 食谱相关
│   │   ├── community/     # 社区相关
│   │   ├── knowledge/     # 知识相关
│   │   └── ai/            # AI助手相关
│   ├── middlewares/       # 中间件
│   │   ├── auth.js        # 认证中间件
│   │   ├── error.js       # 错误处理中间件
│   │   └── validator.js   # 数据验证中间件
│   ├── models/            # 数据模型
│   │   ├── user.js        # 用户模型
│   │   ├── recipe.js      # 食谱模型
│   │   ├── ingredient.js  # 食材模型
│   │   ├── post.js        # 帖子模型
│   │   └── comment.js     # 评论模型
│   ├── routes/            # 路由定义
│   │   ├── v1/            # V1版本API路由
│   │   └── index.js       # 路由聚合
│   ├── services/          # 业务逻辑
│   │   ├── auth.js        # 认证服务
│   │   ├── user.js        # 用户服务
│   │   ├── recipe.js      # 食谱服务
│   │   └── file.js        # 文件服务
│   ├── utils/             # 工具函数
│   │   ├── response.js    # 响应工具
│   │   ├── logger.js      # 日志工具
│   │   └── validator.js   # 验证工具
│   ├── sql/               # SQL文件
│   │   ├── init.sql       # 初始化SQL
│   │   ├── user.sql       # 用户相关SQL
│   │   └── recipe.sql     # 食谱相关SQL
│   └── app.js             # 应用入口
├── .env                   # 环境变量
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 数据库设计

数据库共包含以下主要表：

1. users - 用户表
2. user_profiles - 用户详情表
3. recipes - 食谱表
4. recipe_steps - 食谱步骤表
5. recipe_ingredients - 食谱食材关联表
6. ingredients - 食材表
7. ingredient_categories - 食材分类表
8. ingredient_nutrition - 食材营养成分表
9. posts - 社区帖子表
10. comments - 评论表
11. likes - 点赞表
12. collections - 收藏表
13. messages - 消息表
14. ai_chat_records - AI对话记录表
15. user_health_data - 用户健康数据表
16. weight_records - 体重记录表
17. daily_activities - 每日活动记录表
18. meal_records - 饮食记录表
19. health_metrics - 健康指标记录表
20. health_goals - 健康目标表

详细的数据库表结构见 `backend/src/sql/init.sql`

## 开发指南

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 启动开发环境

#### 前端开发服务器

```bash
cd frontend
npm run dev
```

前端开发服务器将在 http://localhost:5173 启动

#### 后端开发服务器

```bash
cd backend
npm run dev
```

后端API服务器将在 http://localhost:3000 启动

### 开发规范

- 前端代码遵循 Vue 3 组合式 API 风格
- 后端遵循 RESTful API 设计原则
- 使用 ESLint 进行代码规范检查
- 使用 Prettier 进行代码格式化
- Git提交信息遵循约定式提交规范

## 构建与部署

### 前端构建

```bash
cd frontend
npm run build
```

构建产物将生成在 `frontend/dist` 目录

### 后端构建

```bash
cd backend
npm run build
```

构建产物将生成在 `backend/dist` 目录

### 测试环境部署

```bash
# 部署前端
cd frontend
npm run deploy:test

# 部署后端
cd ../backend
npm run deploy:test
```

### 生产环境部署

```bash
# 部署前端
cd frontend
npm run deploy:prod

# 部署后端
cd ../backend
npm run deploy:prod
```

## 移动应用打包

### Android应用打包

```bash
cd frontend
npm run build
npx cap add android
npx cap copy android
npx cap open android
```

### iOS应用打包

```bash
cd frontend
npm run build
npx cap add ios
npx cap copy ios
npx cap open ios
```

## API文档

API文档使用Swagger生成，访问地址：

- 开发环境：http://localhost:3000/api-docs
- 测试环境：https://test-api.lovehealth.com/api-docs
- 生产环境：https://api.lovehealth.com/api-docs

## 测试

### 前端测试

```bash
cd frontend
npm run test:unit    # 单元测试
npm run test:e2e     # 端到端测试
```

### 后端测试

```bash
cd backend
npm run test         # 运行所有测试
npm run test:unit    # 只运行单元测试
npm run test:api     # 只运行API测试
```

## 监控与日志

- 前端错误监控：Sentry
- 后端日志：Winston + ELK
- 服务监控：Prometheus + Grafana
- 性能监控：New Relic

## 常见问题

### 数据库连接问题

确保MySQL服务已经启动，并且配置信息正确：

```js
// backend/src/config/database.js
module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'love_health',
}
```

### Minio连接问题

确保Minio服务已经启动，并创建了对应的bucket：

```js
// backend/src/config/minio.js
module.exports = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: process.env.MINIO_PORT || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucket: process.env.MINIO_BUCKET || 'lovehealth'
}
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 联系方式

项目负责人：[jarvanlovehhz@gmail.com]

技术负责人：[jarvanlovehhz@gmail.com]

## 许可证

MIT
