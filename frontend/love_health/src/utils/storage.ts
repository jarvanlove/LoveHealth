/**
 * 本地存储工具
 * 提供对localStorage和sessionStorage的封装，支持过期时间设置
 */

// 存储前缀，用于避免冲突
const PREFIX = 'love_health_'

/**
 * 本地存储项目的数据结构
 */
interface StorageData<T = any> {
  value: T;
  expire: number | null;
  timestamp: number;
}

/**
 * localStorage操作封装
 */
export const localStorage = {
  /**
   * 设置localStorage
   * @param key 键名
   * @param value 值
   * @param expire 过期时间(毫秒)，默认为null，即永不过期
   */
  set<T>(key: string, value: T, expire: number | null = null): void {
    const data: StorageData<T> = {
      value,
      expire: expire ? Date.now() + expire : null,
      timestamp: Date.now()
    }
    
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(data))
    } catch (err) {
      console.error('localStorage设置失败:', err)
    }
  },
  
  /**
   * 获取localStorage
   * @param key 键名
   * @param defaultValue 默认值，当获取失败或已过期时返回
   * @returns 存储的值或默认值
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const json = window.localStorage.getItem(PREFIX + key)
      
      if (!json) {
        return defaultValue
      }
      
      const data: StorageData<T> = JSON.parse(json)
      const { value, expire } = data
      
      // 判断是否过期
      if (expire && expire < Date.now()) {
        this.remove(key)
        return defaultValue
      }
      
      return value
    } catch (err) {
      console.error('localStorage获取失败:', err)
      return defaultValue
    }
  },
  
  /**
   * 移除localStorage
   * @param key 键名
   */
  remove(key: string): void {
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch (err) {
      console.error('localStorage移除失败:', err)
    }
  },
  
  /**
   * 清空所有以PREFIX开头的localStorage
   */
  clear(): void {
    try {
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith(PREFIX)) {
          window.localStorage.removeItem(key)
        }
      })
    } catch (err) {
      console.error('localStorage清空失败:', err)
    }
  },
  
  /**
   * 获取localStorage过期剩余时间
   * @param key 键名
   * @returns 剩余毫秒数，如果永不过期则返回-1，如果已过期或不存在则返回0
   */
  getExpire(key: string): number {
    try {
      const json = window.localStorage.getItem(PREFIX + key)
      
      if (!json) {
        return 0
      }
      
      const data: StorageData = JSON.parse(json)
      const { expire } = data
      
      // 永不过期
      if (!expire) {
        return -1
      }
      
      const remaining = expire - Date.now()
      
      // 已过期
      if (remaining <= 0) {
        this.remove(key)
        return 0
      }
      
      return remaining
    } catch (err) {
      console.error('localStorage获取过期时间失败:', err)
      return 0
    }
  }
}

/**
 * sessionStorage操作封装
 */
export const sessionStorage = {
  /**
   * 设置sessionStorage
   * @param key 键名
   * @param value 值
   */
  set<T>(key: string, value: T): void {
    const data: StorageData<T> = {
      value,
      expire: null,
      timestamp: Date.now()
    }
    
    try {
      window.sessionStorage.setItem(PREFIX + key, JSON.stringify(data))
    } catch (err) {
      console.error('sessionStorage设置失败:', err)
    }
  },
  
  /**
   * 获取sessionStorage
   * @param key 键名
   * @param defaultValue 默认值，当获取失败时返回
   * @returns 存储的值或默认值
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const json = window.sessionStorage.getItem(PREFIX + key)
      
      if (!json) {
        return defaultValue
      }
      
      const data: StorageData<T> = JSON.parse(json)
      return data.value
    } catch (err) {
      console.error('sessionStorage获取失败:', err)
      return defaultValue
    }
  },
  
  /**
   * 移除sessionStorage
   * @param key 键名
   */
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(PREFIX + key)
    } catch (err) {
      console.error('sessionStorage移除失败:', err)
    }
  },
  
  /**
   * 清空所有以PREFIX开头的sessionStorage
   */
  clear(): void {
    try {
      Object.keys(window.sessionStorage).forEach(key => {
        if (key.startsWith(PREFIX)) {
          window.sessionStorage.removeItem(key)
        }
      })
    } catch (err) {
      console.error('sessionStorage清空失败:', err)
    }
  }
}

/**
 * 获取Cookie
 * @param name Cookie名称
 * @returns Cookie值
 */
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))
  return match ? decodeURIComponent(match[3]) : null
}

/**
 * 设置Cookie
 * @param name Cookie名称
 * @param value Cookie值
 * @param days 过期天数
 * @param path 路径
 * @param domain 域名
 * @param secure 是否只在HTTPS下传输
 */
export const setCookie = (
  name: string,
  value: string,
  days = 7,
  path = '/',
  domain = '',
  secure = false
): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}${
    domain ? `; domain=${domain}` : ''
  }${secure ? '; secure' : ''}`
}

/**
 * 删除Cookie
 * @param name Cookie名称
 * @param path 路径
 * @param domain 域名
 */
export const removeCookie = (name: string, path = '/', domain = ''): void => {
  setCookie(name, '', -1, path, domain)
}

export default {
  local: localStorage,
  session: sessionStorage,
  cookie: {
    get: getCookie,
    set: setCookie,
    remove: removeCookie
  }
} 