import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { get, post, put } from '../utils/request'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  gender?: number;
  birthday?: string;
  status: number;
  createTime: string;
  updateTime: string;
}

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 用户令牌
  const token = ref<string>(localStorage.getItem('token') || '')
  
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  
  // 用户角色
  const roles = ref<string[]>([])
  
  // 用户权限
  const permissions = ref<string[]>([])
  
  // 用户是否已登录
  const isLoggedIn = computed(() => !!token.value)
  
  /**
   * 设置令牌
   * @param newToken 新令牌
   */
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns Promise
   */
  const login = async (username: string, password: string) => {
    try {
      const response = await post<{
        token: string;
        refreshToken: string;
      }>('/api/auth/login', {
        username,
        password
      })
      
      setToken(response.token)
      
      // 存储刷新令牌，用于自动刷新
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // 登录后获取用户信息
      await getUserInfo()
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 退出登录
   */
  const logout = () => {
    // 清除令牌
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    
    // 清除用户信息
    userInfo.value = null
    roles.value = []
    permissions.value = []
  }
  
  /**
   * 获取用户信息
   * @returns Promise
   */
  const getUserInfo = async () => {
    try {
      const response = await get<{
        userInfo: UserInfo;
        roles: string[];
        permissions: string[];
      }>('/api/user/info')
      
      userInfo.value = response.userInfo
      roles.value = response.roles
      permissions.value = response.permissions
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 更新用户信息
   * @param data 用户信息
   * @returns Promise
   */
  const updateUserInfo = async (data: Partial<UserInfo>) => {
    try {
      const response = await put<{
        userInfo: UserInfo;
      }>('/api/user/info', data)
      
      userInfo.value = response.userInfo
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 修改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   * @returns Promise
   */
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await post('/api/user/change-password', {
        oldPassword,
        newPassword
      })
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 重置密码
   * @param email 邮箱
   * @param code 验证码
   * @param newPassword 新密码
   * @returns Promise
   */
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const response = await post('/api/user/reset-password', {
        email,
        code,
        newPassword
      })
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 刷新令牌
   * @returns Promise
   */
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      
      if (!refreshTokenValue) {
        throw new Error('刷新令牌不存在')
      }
      
      const response = await post<{
        token: string;
        refreshToken: string;
      }>('/api/auth/refresh-token', {
        refreshToken: refreshTokenValue
      })
      
      setToken(response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (error) {
      // 刷新令牌失败，清除登录状态
      logout()
      throw error
    }
  }
  
  return {
    token,
    userInfo,
    roles,
    permissions,
    isLoggedIn,
    setToken,
    login,
    logout,
    getUserInfo,
    updateUserInfo,
    changePassword,
    resetPassword,
    refreshToken
  }
}) 