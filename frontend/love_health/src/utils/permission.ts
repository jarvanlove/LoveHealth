/**
 * 权限控制工具
 * 提供前端路由权限控制和按钮权限控制功能
 */
import type { RouteLocationNormalized, NavigationGuardNext, RouteMeta } from 'vue-router'
import { useUserStore } from '../stores/user'
import { showDialog } from 'vant'

// 扩展路由元信息接口，添加roles属性
declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[];
  }
}

// 免登录白名单路由
const whiteList = ['/login', '/register', '/forget-password', '/404', '/403', '/500']

/**
 * 路由权限验证
 * @param to 目标路由
 * @param from 来源路由
 * @param next 路由跳转函数
 */
export const permissionGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  const hasToken = userStore.token
  
  // 判断是否有token
  if (hasToken) {
    if (to.path === '/login') {
      // 已登录状态访问登录页，重定向到首页
      next({ path: '/' })
    } else {
      const hasUserInfo = userStore.userInfo && userStore.userInfo.id
      
      if (hasUserInfo) {
        // 已获取用户信息，检查是否有访问权限
        if (to.meta.roles && to.meta.roles.length > 0) {
          // 判断是否有该路由的访问权限
          const hasPermission = userStore.roles.some((role: string) => 
            (to.meta.roles as string[]).includes(role)
          )
          
          if (hasPermission) {
            next()
          } else {
            // 无访问权限，跳转到403页面
            next({ path: '/403' })
          }
        } else {
          // 没有设置权限要求，直接通过
          next()
        }
      } else {
        try {
          // 未获取用户信息，先获取
          await userStore.getUserInfo()
          
          // 重新判断权限
          if (to.meta.roles && to.meta.roles.length > 0) {
            const hasPermission = userStore.roles.some((role: string) => 
              (to.meta.roles as string[]).includes(role)
            )
            
            if (hasPermission) {
              next()
            } else {
              next({ path: '/403' })
            }
          } else {
            next()
          }
        } catch (error) {
          // 获取用户信息失败，清除token，跳转到登录页
          userStore.logout()
          showDialog({
            title: '提示',
            message: '登录已过期，请重新登录'
          })
          next({ path: '/login', query: { redirect: to.fullPath } })
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 在免登录白名单中，直接进入
      next()
    } else {
      // 否则重定向到登录页
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
}

/**
 * 检查按钮权限
 * @param permissionCode 权限代码
 * @returns 是否有权限
 */
export const hasPermission = (permissionCode: string): boolean => {
  const userStore = useUserStore()
  
  if (!permissionCode) {
    return true
  }
  
  // 超级管理员拥有所有权限
  if (userStore.roles.includes('admin')) {
    return true
  }
  
  return userStore.permissions.includes(permissionCode)
}

/**
 * 检查角色权限
 * @param role 角色代码
 * @returns 是否有角色权限
 */
export const hasRole = (role: string): boolean => {
  const userStore = useUserStore()
  
  if (!role) {
    return true
  }
  
  return userStore.roles.includes(role)
}

/**
 * 自定义指令：v-permission
 * 用法：v-permission="'user:add'"
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: { value: string | string[] }) {
    const { value } = binding
    
    // 权限值为数组或字符串
    const permissions = Array.isArray(value) ? value : [value]
    const hasAnyPermission = permissions.some(permissionCode => hasPermission(permissionCode))
    
    if (!hasAnyPermission) {
      // 无权限，移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 自定义指令：v-role
 * 用法：v-role="'admin'"
 */
export const roleDirective = {
  mounted(el: HTMLElement, binding: { value: string | string[] }) {
    const { value } = binding
    
    // 角色值为数组或字符串
    const roles = Array.isArray(value) ? value : [value]
    const hasAnyRole = roles.some(role => hasRole(role))
    
    if (!hasAnyRole) {
      // 无角色权限，移除元素
      el.parentNode?.removeChild(el)
    }
  }
} 