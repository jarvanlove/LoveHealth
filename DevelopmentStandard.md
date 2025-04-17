# 项目开发规范

## 目录
- [技术栈](#技术栈)
- [后端开发规范](#后端开发规范)
- [前端开发规范](#前端开发规范)
- [命名规范](#命名规范)
- [数据库规范](#数据库规范)
- [Git提交规范](#git提交规范)

## 技术栈

### 后端技术栈
- Node.js
- Express
- MySQL
- Minio (对象存储服务)

### 前端技术栈
- Vue 3
- Vite
- Pinia (状态管理)
- Vue Router
- Vant UI
- Axios
- Capacitor (混合开发框架)

## 后端开发规范

### 项目结构
```
backend/
├── config/          # 配置文件
├── controllers/     # 控制器
├── middlewares/    # 中间件
├── models/         # 数据模型
├── routes/         # 路由
├── services/       # 业务逻辑
├── utils/          # 工具函数
└── app.js          # 入口文件
```

### 代码规范
1. 使用 ES6+ 语法
2. 使用 async/await 处理异步
3. 统一使用 try-catch 进行错误处理
4. 接口返回格式统一：
```javascript
{
  code: number,     // 状态码
  data: any,        // 数据
  message: string   // 消息
}
```

### API 设计规范
- 使用 RESTful 风格
- URL 使用小写字母，单词间用连字符 (-) 分隔
- 版本号放在 URL 中：/api/v1/
- HTTP 方法规范：
  - GET：查询
  - POST：创建
  - PUT：更新
  - DELETE：删除

## 前端开发规范

### 项目结构
```
frontend/
├── public/         # 静态资源
├── src/
│   ├── api/       # API 接口
│   ├── assets/    # 资源文件
│   ├── components/# 组件
│   ├── router/    # 路由配置
│   ├── stores/    # Pinia 状态
│   ├── styles/    # 样式文件
│   ├── utils/     # 工具函数
│   └── views/     # 页面
└── App.vue
```

### Vue 组件规范
1. 使用 Composition API
2. 文件名使用 PascalCase
3. 基础组件以 Base 开头
4. 单文件组件顺序：template -> script -> style

### 样式规范
1. 使用 SCSS 预处理器
2. BEM 命名规范
3. 使用 rem/vw 做移动端适配
4. 主题色统一管理

## 命名规范

### 变量命名
- 普通变量：camelCase
- 常量：UPPER_CASE
- 私有变量：_camelCase

### 函数命名
- 普通函数：camelCase
- 类/组件：PascalCase
- 事件处理函数：handleEventName

### 文件命名
- 组件文件：PascalCase.vue
- 工具文件：camelCase.ts
- 样式文件：camelCase.scss

## 数据库规范

### 数据库设计规范
1. 表名使用小写，单词间用下划线分隔
2. 必备字段：
   - id：主键
   - created_at：创建时间
   - updated_at：更新时间
   - deleted_at：删除时间（软删除）

### 字段命名规范
- 使用小写字母
- 使用下划线分隔单词
- 避免使用保留字
- 字段名称要见名知意

### 常用字段命名
- 状态：status
- 类型：type
- 名称：name
- 标题：title
- 描述：description
- 内容：content
- 排序：sort
- 是否：is_xxx

## Git提交规范

### 分支管理
- main：主分支
- develop：开发分支
- feature/*：特性分支
- hotfix/*：紧急修复分支
- release/*：发布分支

### 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### type 类型
- feat：新功能
- fix：修复
- docs：文档
- style：格式
- refactor：重构
- test：测试
- chore：构建过程或辅助工具的变动

### scope 范围
- 用于说明 commit 影响的范围
- 例如：user、order、cart 等

### subject 描述
- 简短描述，不超过50个字符
- 以动词开头，使用第一人称现在时
- 第一个字母小写
- 结尾不加句号

### 示例
```
feat(user): 添加用户登录功能

- 实现用户名密码登录
- 添加登录验证码
- 集成JWT认证

Closes #123