<template>
  <div class="not-found">
    <van-empty
      image="error"
      description="页面不存在"
    >
      <van-button round type="primary" class="return-home" @click="goHome">返回首页</van-button>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.return-home {
  width: 40%;
  margin-top: 20px;
  background: linear-gradient(90deg, #5CBBF6, #60D7F9);
  border: none;
}
</style> 