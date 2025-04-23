// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 用户相关类型
export interface UserInfo {
  id: number
  username: string
  phone: string
  avatar?: string
  email?: string
  gender?: 0 | 1 | 2 // 0-未知 1-男 2-女
  birthday?: string
  height?: number
  weight?: number
  createdAt: string
  updatedAt: string
}

export interface LoginParams {
  phone: string
  password: string
  remember?: boolean
}

export interface RegisterParams {
  phone: string
  password: string
  code: string
}

// 健康相关类型
export interface HealthData {
  steps: number
  calories: number
  distance: number
  heartRate: number
  sleepHours: number
  weight: number
  bmi: number
  date: string
}

export interface HealthGoal {
  type: 'steps' | 'calories' | 'sleep' | 'weight'
  target: number
  startDate: string
  endDate: string
}

// 分页参数类型
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应类型
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
} 