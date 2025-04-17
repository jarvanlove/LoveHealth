const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, isAdmin } = require('../middlewares/auth');

/**
 * 用户相关路由
 */

// 公共路由
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// 需要身份验证的路由
router.get('/profile', authenticate, UserController.getUserInfo);
router.put('/profile', authenticate, UserController.updateUser);
router.delete('/account', authenticate, UserController.deleteUser);

// 管理员路由
router.get('/list', authenticate, isAdmin, UserController.getUsers);
router.post('/:userId/restore', authenticate, isAdmin, UserController.restoreUser);

module.exports = router; 