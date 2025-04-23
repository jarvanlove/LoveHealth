import { get, post } from '@/utils/request'
import type { LoginParams, RegisterParams, UserInfo, ApiResponse } from '@/types'

export const login = (data: LoginParams) => {
  return post<ApiResponse<{ token: string; user: UserInfo }>>('/auth/login', data)
}

export const register = (data: RegisterParams) => {
  return post<ApiResponse<{ token: string; user: UserInfo }>>('/auth/register', data)
}

export const getUserInfo = () => {
  return get<ApiResponse<UserInfo>>('/user/info')
}

export const logout = () => {
  return post<ApiResponse<null>>('/auth/logout')
} 