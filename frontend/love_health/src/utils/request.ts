/**
 * Axios 请求封装
 * 处理请求拦截、响应拦截、错误处理
 */
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { showNotify, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '../stores/user'

// 扩展AxiosRequestConfig接口，添加自定义属性
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  retry?: number;
  retryDelay?: number;
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as unknown as CustomAxiosRequestConfig
    // 是否显示loading
    if (customConfig.showLoading) {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
    }
    
    // 获取token
    const userStore = useUserStore()
    const token = userStore.token
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 关闭loading
    closeToast()
    
    const res = response.data
    
    // 根据响应状态码处理
    if (res.code && res.code !== 200) {
      // 显示错误信息
      showNotify({
        type: 'danger',
        message: res.message || '服务器错误',
      })
      
      // 处理特定错误码
      if (res.code === 401) {
        // token过期或未登录
        const userStore = useUserStore()
        userStore.logout()
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || '服务器错误'))
    } else {
      return res
    }
  },
  (error) => {
    closeToast()
    
    // 处理网络错误
    let message = '网络请求错误'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请登录'
          // 处理401未授权
          const userStore = useUserStore()
          userStore.logout()
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址错误'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败(${error.response.status})`
      }
    } else if (error.request) {
      message = '服务器无响应'
    } else {
      message = '请求配置错误'
    }
    
    showNotify({
      type: 'danger',
      message,
    })
    
    // 处理请求重试
    const config = error.config as CustomAxiosRequestConfig
    if (config && config.retry && config.retry > 0) {
      config.retry -= 1
      const backoff = config.retryDelay || 1000
      
      // 延时重试
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(service(config))
        }, backoff)
      })
    }
    
    return Promise.reject(error)
  }
)

/**
 * 封装GET请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise
 */
export function get<T>(url: string, params?: any, config: CustomAxiosRequestConfig = {}) {
  return service.get<T, T>(url, {
    params,
    ...config,
  })
}

/**
 * 封装POST请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise
 */
export function post<T>(url: string, data?: any, config: CustomAxiosRequestConfig = {}) {
  return service.post<T, T>(url, data, config)
}

/**
 * 封装PUT请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise
 */
export function put<T>(url: string, data?: any, config: CustomAxiosRequestConfig = {}) {
  return service.put<T, T>(url, data, config)
}

/**
 * 封装DELETE请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise
 */
export function del<T>(url: string, params?: any, config: CustomAxiosRequestConfig = {}) {
  return service.delete<T, T>(url, {
    params,
    ...config,
  })
}

/**
 * 封装上传文件请求
 * @param url 请求地址
 * @param file 文件对象
 * @param name 文件字段名
 * @param data 其他数据
 * @param config 请求配置
 * @returns Promise
 */
export function uploadFile<T>(
  url: string,
  file: File,
  name: string = 'file',
  data?: Record<string, any>,
  config: CustomAxiosRequestConfig = {}
) {
  const formData = new FormData()
  formData.append(name, file)
  
  if (data) {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
  }
  
  return service.post<T, T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}

// 导出请求实例
export default service 