/**
 * 统一响应工具
 */

// 成功响应
const successResponse = (res, data = null, message = '操作成功', code = 200) => {
  return res.status(code).json({
    code,
    success: true,
    message,
    data,
    timestamp: Date.now()
  });
};

// 错误响应
const errorResponse = (res, message = '操作失败', code = 400, data = null) => {
  return res.status(code).json({
    code,
    success: false,
    message,
    data,
    timestamp: Date.now()
  });
};

// 常用HTTP状态码
const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

module.exports = {
  successResponse,
  errorResponse,
  httpStatus
}; 