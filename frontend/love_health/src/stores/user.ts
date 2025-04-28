import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginParams, ChangePasswordParams, ResetPasswordParams } from '@/types/auth'
import type { UserInfo, UserResponse } from '@/types/user'
//import type { ApiResponse } from '@/types'
//import { login as loginApi, getUserInfo as getUserInfoApi, logout as logoutApi, updateUserInfo as updateUserInfoApi, changePassword as changePasswordApi, resetPassword as resetPasswordApi } from '@/api/auth'
import { login as loginApi, getUserInfo as getUserInfoApi, logout as logoutApi, changePassword as changePasswordApi, resetPassword as resetPasswordApi } from '@/api/auth'
import { showToast } from 'vant'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 用户令牌
  const token = ref<string>('')
  
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  
  // 用户是否已登录
  const isLogin = ref(false)

  // 用户角色
  const roles = ref<string[]>([])

  // 用户权限
  const permissions = ref<string[]>([])
  
  /**
   * 设置令牌
   */
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  
  /**
   * 用户登录
   */
  async function login(params: LoginParams): Promise<boolean> {
    try {
      const response = await loginApi(params)
      if (response.data) {
        const responseData = response.data as unknown as UserResponse
        const { user, token: newToken } = responseData
        setToken(newToken)
        userInfo.value = user
        roles.value = user.roles
        permissions.value = user.permissions
        isLogin.value = true
        return true
      }
      return false
    } catch (error: any) {
      showToast(error.message || '登录失败')
      return false
    }
  }
  
  /**
   * 退出登录
   */
  async function logout(): Promise<boolean> {
    try {
      await logoutApi()
      token.value = ''
      userInfo.value = null
      roles.value = []
      permissions.value = []
      isLogin.value = false
      localStorage.removeItem('token')
      return true
    } catch (error: any) {
      showToast(error.message || '退出失败')
      return false
    }
  }
  
  /**
   * 获取用户信息
   */
  const fetchUserInfo = async (): Promise<UserInfo> => {
    try {
      const response = await getUserInfoApi()
      if (response.data) {
        const user = response.data as unknown as UserInfo
        userInfo.value = user
        roles.value = user.roles
        permissions.value = user.permissions
        return user
      }
      throw new Error('获取用户信息失败')
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 更新用户信息
   */
  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
      if (info.roles) {
        roles.value = info.roles
      }
      if (info.permissions) {
        permissions.value = info.permissions
      }
    }
  }
  
  /**
   * 修改密码
   */
  const changePassword = async (params: ChangePasswordParams): Promise<boolean> => {
    try {
      await changePasswordApi(params)
      return true
    } catch (error) {
      throw error
    }
  }
  
  /**
   * 重置密码
   */
  const resetPassword = async (params: ResetPasswordParams): Promise<boolean> => {
    try {
      await resetPasswordApi(params)
      return true
    } catch (error) {
      throw error
    }
  }
  
  return {
    token,
    userInfo,
    isLogin,
    roles,
    permissions,
    login,
    logout,
    fetchUserInfo,
    updateUserInfo,
    changePassword,
    resetPassword
  }
}) 