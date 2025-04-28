const UserModel = require('../models/UserModel');
const { hashPassword, comparePassword } = require('../utils/auth');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 用户控制器
 */
class UserController {
  /**
   * 用户注册
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async register(req, res) {
    try {
      const { username, password, email, phone, nickname, gender } = req.body;

      // 验证必要字段
      if (!username || !password) {
        return errorResponse(res, '用户名和密码不能为空', 400);
      }

      // 检查用户名是否已存在
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return errorResponse(res, '用户名已存在', 400);
      }

      // 检查邮箱是否已存在
      if (email) {
        const emailExists = await UserModel.findByEmail(email);
        if (emailExists) {
          return errorResponse(res, '邮箱已被使用', 400);
        }
      }

      // 检查手机号是否已存在
      if (phone) {
        const phoneExists = await UserModel.findByPhone(phone);
        if (phoneExists) {
          return errorResponse(res, '手机号已被使用', 400);
        }
      }

      // 加密密码
      const hashedPassword = await hashPassword(password);

      // 创建用户数据对象
      const userData = {
        username,
        password: hashedPassword,
        email,
        phone,
        status: 1,
        is_deleted: 0 // 确保新用户未被删除
      };

      // 创建用户资料数据对象
      const profileData = {
        nickname: nickname || username,
        gender: gender || null
      };

      // 创建用户及其资料
      const user = await UserModel.createWithProfile(userData, profileData);

      // 生成JWT令牌
      const token = generateToken({ id: user.id, username: user.username });

      // 从用户对象中移除敏感信息
      const { password: _, ...userWithoutPassword } = user;

      return successResponse(res, {
        message: '注册成功',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('用户注册错误:', error);
      return errorResponse(res, '注册过程中发生错误', 500);
    }
  }

  /**
   * 用户登录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async login(req, res) {
    try {
      const { username, password, remember } = req.body;

      // 验证必填参数
      if (!username) {
        return errorResponse(res, '请提供用户名、邮箱或手机号', 400);
      }

      if (!password) {
        return errorResponse(res, '密码不能为空', 400);
      }

      let user;

      // 根据username字段尝试多种方式查找用户
      // 1. 尝试作为用户名查找
      user = await UserModel.findByUsername(username);
      
      // 2. 如果未找到，尝试作为邮箱查找
      if (!user && username.includes('@')) {
        user = await UserModel.findByEmail(username);
      }
      
      // 3. 如果未找到，尝试作为手机号查找
      if (!user && /^\d+$/.test(username)) {
        user = await UserModel.findByPhone(username);
      }

      console.info("查找到的用户信息:", JSON.stringify(user));

      // 用户不存在或已被逻辑删除
      if (!user) {
        return errorResponse(res, '用户不存在或账号已被禁用', 404);
      }

      // 验证密码
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return errorResponse(res, '密码错误', 401);
      }

      // 用户状态检查
      if (user.status !== 1) {
        return errorResponse(res, '账号已被禁用', 403);
      }

      // 生成JWT令牌
      const token = generateToken({ id: user.id, username: user.username });

      // 从用户对象中移除敏感信息
      const { password: _, ...userWithoutPassword } = user;

      return successResponse(res, {
        user: userWithoutPassword,
        token,
        remember
      }, '登录成功');
    } catch (error) {
      console.error('用户登录错误:', error);
      return errorResponse(res, '登录过程中发生错误', 500);
    }
  }

  /**
   * 获取用户信息
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async getUserInfo(req, res) {
    try {
      const userId = req.user.id; // 从JWT中获取
      const user = await UserModel.getUserWithProfile(userId);

      if (!user) {
        return errorResponse(res, '用户不存在', 404);
      }

      // 从用户对象中移除敏感信息
      const { password, ...userWithoutPassword } = user;

      return successResponse(res, {
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      return errorResponse(res, '获取用户信息时发生错误', 500);
    }
  }

  /**
   * 更新用户信息
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async updateUser(req, res) {
    try {
      const userId = req.user.id; // 从JWT中获取
      const { 
        password, email, phone, avatar, status, // 用户基本信息
        nickname, gender, birthday, height, weight, bio, preference // 用户资料
      } = req.body;

      // 准备更新用户基本信息
      const userData = {};
      if (email) userData.email = email;
      if (phone) userData.phone = phone;
      if (avatar) userData.avatar = avatar;
      if (status !== undefined) userData.status = status;

      // 如果提供了新密码，加密它
      if (password) {
        userData.password = await hashPassword(password);
      }

      // 准备更新用户资料
      const profileData = {};
      if (nickname) profileData.nickname = nickname;
      if (gender !== undefined) profileData.gender = gender;
      if (birthday) profileData.birthday = birthday;
      if (height) profileData.height = height;
      if (weight) profileData.weight = weight;
      if (bio) profileData.bio = bio;
      if (preference) profileData.preference = JSON.stringify(preference);

      // 更新用户信息及资料
      const updatedUser = await UserModel.updateWithProfile(userId, userData, profileData);

      if (!updatedUser) {
        return errorResponse(res, '用户不存在或已被删除', 404);
      }

      // 从用户对象中移除敏感信息
      const { password: _, ...userWithoutPassword } = updatedUser;

      return successResponse(res, {
        message: '用户信息更新成功',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('更新用户信息错误:', error);
      return errorResponse(res, '更新用户信息时发生错误', 500);
    }
  }

  /**
   * 删除用户（逻辑删除）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async deleteUser(req, res) {
    try {
      const userId = req.user.id; // 从JWT中获取

      // 执行逻辑删除（设置is_deleted = 1）
      const result = await UserModel.delete(userId);

      if (result.affectedRows === 0) {
        return errorResponse(res, '用户不存在或已被删除', 404);
      }

      return successResponse(res, {
        message: '账号已注销成功'
      });
    } catch (error) {
      console.error('删除用户错误:', error);
      return errorResponse(res, '注销账号时发生错误', 500);
    }
  }

  /**
   * 恢复已删除用户（管理员操作）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async restoreUser(req, res) {
    try {
      const { userId } = req.params;

      // 验证当前用户是否为管理员
      if (req.user.role !== 'admin') {
        return errorResponse(res, '没有权限执行此操作', 403);
      }

      // 恢复用户（设置is_deleted = 0）
      const result = await UserModel.restore(userId);

      if (result.affectedRows === 0) {
        return errorResponse(res, '用户不存在或未被删除', 404);
      }

      return successResponse(res, {
        message: '用户已成功恢复'
      });
    } catch (error) {
      console.error('恢复用户错误:', error);
      return errorResponse(res, '恢复用户时发生错误', 500);
    }
  }

  /**
   * 获取用户列表（管理员操作）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  async getUsers(req, res) {
    try {
      // 验证当前用户是否为管理员
      if (req.user.role !== 'admin') {
        return errorResponse(res, '没有权限执行此操作', 403);
      }

      const { page = 1, limit = 10, withDeleted = false } = req.query;
      const offset = (page - 1) * limit;

      // 获取用户列表，可选包含已删除用户
      const users = await UserModel.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        withDeleted: withDeleted === 'true'
      });

      // 获取总用户数
      const total = await UserModel.count('', [], withDeleted === 'true');

      // 移除敏感信息
      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return successResponse(res, {
        users: usersWithoutPassword,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('获取用户列表错误:', error);
      return errorResponse(res, '获取用户列表时发生错误', 500);
    }
  }
}

module.exports = new UserController(); 