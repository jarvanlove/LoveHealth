import request from '@/utils/request'
import type { ApiResponse, LoginParams, RegisterParams, UserInfo, LoginResponse, ChangePasswordParams, ResetPasswordParams } from '@/types/auth'

/**
 * 登录
 */
export const login = (data: LoginParams) => {
  return request.post<ApiResponse<LoginResponse>>('/api/v1/users/login', data)
}

/**
 * 注册
 */
export const register = (data: RegisterParams) => {
  return request.post<ApiResponse<null>>('/api/v1/users/register', data)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<ApiResponse<UserInfo>>('/api/v1/users/profile')
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return request.put<ApiResponse<UserInfo>>('/api/v1/users/profile', data)
}

/**
 * 发送验证码
 */
export const sendVerificationCode = (phone: string) => {
  return request.post<ApiResponse<null>>('/auth/verification-code', { phone })
}

/**
 * 退出登录
 */
export const logout = () => {
  return request.post<ApiResponse<null>>('/auth/logout')
}

/**
 * 修改密码
 */
export const changePassword = (data: ChangePasswordParams) => {
  return request.put<ApiResponse<null>>('/auth/password', data)
}

/**
 * 重置密码
 */
export const resetPassword = (data: ResetPasswordParams) => {
  return request.put<ApiResponse<null>>('/auth/password/reset', data)
} 