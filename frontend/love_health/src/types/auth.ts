/**
 * 登录参数接口
 */
export interface LoginParams {
  username: string;  // 用户名/邮箱/手机号
  password: string;  // 密码
  remember: boolean; // 记住我
}

/**
 * 注册参数接口
 */
export interface RegisterParams {
  phone: string
  code: string
  password: string
  confirmPassword: string
  agreement: boolean
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number
  phone: string
  nickname: string
  avatar: string
  gender: number
  birthday: string
  height: number
  weight: number
  targetWeight: number
  createdAt: string
  updatedAt: string
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    avatar?: string;
    status: number;
    created_at: string;
    updated_at: string;
  };
  token: string;
  remember: boolean;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
}

/**
 * 重置密码参数
 */
export interface ResetPasswordParams {
  phone: string
  code: string
  password: string
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
} 