<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column; padding: 30px 24px; background: #f8f8f8; position: relative;">
    <div style="margin-top: 40px; margin-bottom: 40px;">
      <h1 style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 12px;">欢迎回来</h1>
      <p style="font-size: 14px; color: #999;">登录爱健康，开启健康生活</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <van-form @submit="onSubmit">
        <div style="position: relative; margin-bottom: 24px;">
          <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block;">用户名/邮箱/手机号</label>
          <van-field
            v-model="formData.username"
            type="text"
            placeholder="请输入用户名或邮箱或手机号"
            :rules="[{ required: true, message: '请输入用户名或邮箱或手机号' }]"
            class="form-input"
          />
        </div>
        
        <div style="position: relative; margin-bottom: 24px;">
          <label style="font-size: 14px; color: #666; margin-bottom: 8px; display: block;">密码</label>
          <van-field
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            class="form-input"
          />
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <div style="display: flex; align-items: center;">
            <van-checkbox v-model="formData.remember" shape="square" class="remember-checkbox">
              <span style="font-size: 14px; color: #666;">记住我</span>
            </van-checkbox>
          </div>
          <router-link to="/forget-password" style="font-size: 14px; color: var(--primary-color); text-decoration: none;">忘记密码？</router-link>
        </div>
        
        <van-button 
          class="login-button" 
          type="primary" 
          block 
          round
          native-type="submit"
          :loading="loading"
        >
          登录
        </van-button>
      </van-form>
      
      <div style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
        还没有账号？<router-link to="/register" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">立即注册</router-link>
      </div>
    </div>
    
    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50vh; z-index: -1; opacity: 0.05; background: url('@/assets/images/login-bg.jpg') no-repeat center bottom; background-size: cover;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '../../stores/user'
import type { LoginParams } from '../../types/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const formData = reactive<LoginParams>({
  username: '',
  password: '',
  remember: false
})

// 检查是否已登录
onMounted(async () => {
  if (userStore.isLogin) {
    // 如果是从其他页面重定向过来的，登录后返回原页面
    const redirectPath = (router.currentRoute.value.query.redirect as string) || '/'
    router.replace(redirectPath)
  }
})

const onSubmit = async () => {
  try {
    loading.value = true
    await userStore.login(formData)
    showToast({
      type: 'success',
      message: '登录成功'
    })
    
    // 如果是从其他页面重定向过来的，登录后返回原页面
    const redirectPath = (router.currentRoute.value.query.redirect as string) || '/'
    router.replace(redirectPath)
  } catch (error: any) {
    showToast({
      type: 'fail',
      message: error.message || '登录失败'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/_index.scss';

:deep(body) {
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 30px 24px;
  background: #f8f8f8;
  position: relative;
  flex: 1;
}

.login-header {
  margin-top: 40px;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
}

.login-form {
  margin-bottom: 20px;
}

.form-item {
  position: relative;
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  :deep(.van-field__control) {
    height: 48px;
    font-size: 15px;
  }
  
  :deep(.van-field__body) {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    
    &:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(92, 187, 246, 0.1);
    }
  }
}

.form-footer {
  @include flex(row, space-between, center);
  margin-bottom: 30px;
}

.remember-me {
  @include flex(row, flex-start, center);
}

.remember-checkbox {
  :deep(.van-checkbox__label) {
    font-size: 14px;
    color: #666;
  }
}

.forgot-password {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: bold;
  @include gradient(90deg, var(--primary-color), var(--primary-light));
  border: none;
  margin-bottom: 20px;
  
  &::before {
    background: var(--primary-color) !important;
  }
}

.register-now {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
}

.bg-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  z-index: -1;
  opacity: 0.05;
  object-fit: cover;
}

// 响应式适配
@include responsive(phone) {
  .login-container {
    padding: 20px 16px;
  }
  
  .login-header {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  
  .login-title {
    font-size: 24px;
  }
}
</style> 