/**
 * 通用工具函数库
 */

/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: Date | string | number,
  format = 'YYYY-MM-DD HH:mm:ss'
): string => {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  
  return format
    .replace(/YYYY/g, year.toString())
    .replace(/MM/g, month.toString().padStart(2, '0'))
    .replace(/DD/g, day.toString().padStart(2, '0'))
    .replace(/HH/g, hour.toString().padStart(2, '0'))
    .replace(/mm/g, minute.toString().padStart(2, '0'))
    .replace(/ss/g, second.toString().padStart(2, '0'))
}

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币符号，默认 '¥'
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的金额字符串
 */
export const formatCurrency = (
  amount: number,
  currency = '¥',
  decimals = 2
): string => {
  return `${currency}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param wait 等待时间(ms)，默认 300ms
 * @returns 防抖处理后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timer: number | null = null
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timer) clearTimeout(timer)
    
    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, wait)
  }
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param wait 等待时间(ms)，默认 300ms
 * @returns 节流处理后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const now = Date.now()
    
    if (now - lastTime >= wait) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise对象，表示复制操作是否成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('复制到剪贴板失败:', err)
    return false
  }
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 获取URL参数
 * @param name 参数名
 * @returns 参数值
 */
export const getUrlParam = (name: string): string | null => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const match = window.location.search.substr(1).match(reg)
  
  if (match) {
    return decodeURIComponent(match[2])
  }
  
  return null
}

/**
 * 检查对象是否为空
 * @param obj 要检查的对象
 * @returns 是否为空对象
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * 文件大小格式化
 * @param bytes 字节大小
 * @returns 格式化后的文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

/**
 * 休眠函数
 * @param ms 毫秒数
 * @returns Promise对象
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 判断是否为移动设备
 * @returns 是否为移动设备
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

/**
 * 深拷贝
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (obj instanceof Object) {
    const copy = {} as Record<string, any>
    
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key])
    })
    
    return copy as T
  }
  
  return obj
} 