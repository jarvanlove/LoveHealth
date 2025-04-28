/**
 * Axios 请求封装
 * 处理请求拦截、响应拦截、错误处理
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import type { ApiResponse } from '@/types'

// 扩展 AxiosRequestConfig 类型
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  hideLoading?: boolean
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || '',
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // 允许携带 cookie
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 显示加载提示
    if (!(config as CustomAxiosRequestConfig).hideLoading) {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
    }
    
    // 添加 token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    
    return config
  },
  (error) => {
    closeToast()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    closeToast()
    const { code, message, data } = response.data
    
    // 请求成功
    if (code === 0 || code === 200) {
      return data
    }
    
    // 处理特定错误码
    switch (code) {
      case 401:
        // token 过期或未登录
        const userStore = useUserStore()
        userStore.logout()
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        break
      case 403:
        router.replace('/403')
        break
      case 404:
        router.replace('/404')
        break
      case 500:
        router.replace('/500')
        break
    }
    
    showToast({
      type: 'fail',
      message: message || '请求失败'
    })
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    closeToast()
    
    if (!error.response) {
      showToast({
        type: 'fail',
        message: '网络连接失败，请检查网络设置'
      })
      return Promise.reject(error)
    }
    
    const { status, data } = error.response
    showToast({
      type: 'fail',
      message: data?.message || `请求失败(${status})`
    })
    return Promise.reject(error)
  }
)

// 封装请求方法
export const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, { params, ...config })
}

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config)
}

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config)
}

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config)
}

export default request 