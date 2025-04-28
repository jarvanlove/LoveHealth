/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  status: number;
  gender?: number;
  birthday?: string;
  height?: number;
  weight?: number;
  targetWeight?: number;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  Disabled = 0,
  Active = 1,
  Pending = 2
}

/**
 * 性别枚举
 */
export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2
}

/**
 * 用户响应数据接口
 */
export interface UserResponse {
  user: UserInfo;
  token: string;
} 