const { verifyToken, extractToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const UserModel = require('../models/UserModel');

/**
 * 身份验证中间件
 * 验证请求中的JWT令牌
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const authenticate = async (req, res, next) => {
  // 从请求头中提取令牌
  const token = extractToken(req);
  
  if (!token) {
    return errorResponse(res, '未提供身份令牌', 401);
  }
  
  // 验证令牌
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return errorResponse(res, '无效或已过期的身份令牌', 401);
  }
  
  try {
    // 检查用户是否存在且未被删除
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return errorResponse(res, '用户不存在或已被禁用', 401);
    }
    
    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('身份验证错误:', error);
    return errorResponse(res, '身份验证过程中发生错误', 500);
  }
};

/**
 * 管理员权限验证中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, '需要管理员权限', 403);
  }
  
  next();
};

/**
 * 可选身份验证中间件
 * 如果有令牌则验证，没有则跳过
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const optionalAuthenticate = async (req, res, next) => {
  // 从请求头中提取令牌
  const token = extractToken(req);
  
  if (!token) {
    return next(); // 没有令牌，跳过验证
  }
  
  // 验证令牌
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return next(); // 令牌无效，跳过验证
  }
  
  try {
    // 检查用户是否存在且未被删除
    const user = await UserModel.findById(decoded.id);
    
    if (user) {
      // 将用户信息添加到请求对象
      req.user = user;
    }
    
    next();
  } catch (error) {
    console.error('可选身份验证错误:', error);
    next(); // 出错时也跳过验证
  }
};

module.exports = {
  authenticate,
  isAdmin,
  optionalAuthenticate
}; 