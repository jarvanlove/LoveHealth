<template>
  <div class="base-layout" :class="{ 'has-navbar': hasNavbar, 'has-tabbar': hasTabbar }">
    <!-- 导航栏 -->
    <van-nav-bar
      v-if="hasNavbar"
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      :left-arrow="showBack"
      :fixed="true"
      :placeholder="true"
      :safe-area-inset-top="true"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    
    <!-- 内容区域 -->
    <div class="base-layout__content">
      <slot></slot>
    </div>
    
    <!-- 底部标签栏 -->
    <van-tabbar v-if="hasTabbar" v-model="activeTab" :placeholder="true" :safe-area-inset-bottom="true">
      <slot name="tabbar"></slot>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  leftText: {
    type: String,
    default: ''
  },
  rightText: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  hasNavbar: {
    type: Boolean,
    default: true
  },
  hasTabbar: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click-left', 'click-right', 'update:active-tab'])

const router = useRouter()
const activeTab = ref(0)

const onClickLeft = () => {
  emit('click-left')
  if (props.showBack) {
    router.back()
  }
}

const onClickRight = () => {
  emit('click-right')
}
</script>

<style lang="scss" scoped>
.base-layout {
  min-height: 100vh;
  background-color: var(--background-color);
  
  &__content {
    padding: var(--spacing-md);
    
    .has-navbar & {
      padding-top: calc(46px + var(--spacing-md));
    }
    
    .has-tabbar & {
      padding-bottom: calc(50px + var(--spacing-md));
    }
  }
}
</style> 