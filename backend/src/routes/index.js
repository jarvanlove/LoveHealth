const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');

/**
 * API路由统一入口
 */

// API版本控制
router.use('/api/v1/users', userRoutes);

// 未来可以添加其他模块的路由
// router.use('/api/v1/recipes', recipeRoutes);
// router.use('/api/v1/ingredients', ingredientRoutes);
// router.use('/api/v1/posts', postRoutes);

// 404处理
router.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '未找到请求的API资源'
  });
});

module.exports = router; 