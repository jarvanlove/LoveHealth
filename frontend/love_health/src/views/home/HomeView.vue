<template>
  <div class="app-container">
    <div class="header">
      <div class="avatar-container" @click="navigateTo('/ai-assistant')">
        <div class="user-avatar">
          <van-image 
            :src="userStore.userInfo?.avatar || defaultAvatar" 
            width="40" 
            height="40" 
            round
          />
        </div>
        <div class="ai-badge">AI</div>
      </div>
      
      <div class="search-bar" @click="navigateTo('/search')">
        <div class="search-icon">
          <van-icon name="search" />
        </div>
        <div class="search-placeholder">搜索食物营养和热量</div>
        <div class="scan-icon" @click.stop="navigateTo('/scan')">
          <van-icon name="qr" />
        </div>
      </div>
      
      <div class="message-icon" @click="navigateTo('/message')">
        <van-icon name="envelop-o" size="24" />
        <div class="message-badge">4</div>
      </div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-header">
          <div class="section-title">每日营养小贴士</div>
          <div class="section-action" @click="navigateTo('/nutrition-tips')">查看全部</div>
        </div>
        
        <div class="advice-card" @click="navigateTo('/nutrition-tips/detail')">
          <div class="advice-header">
            <div class="advice-icon nutrition-icon">
              <van-icon name="shop-o" />
            </div>
            <div class="advice-title">今日蛋白质提醒</div>
          </div>
          <div class="advice-content">
            <div class="advice-text">今日蛋白质摄入不足，建议午餐或晚餐增加鸡胸肉、鱼类等优质蛋白。适量的蛋白质摄入有助于维持肌肉量和提高代谢水平。</div>
            <div class="advice-actions">
              <div class="advice-btn primary" @click.stop="navigateTo('/recipe')">查看食谱</div>
              <div class="advice-btn" @click.stop="navigateTo('/diet/record')">记录饮食</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-title">食品安全知识</div>
          <div class="section-action" @click="navigateTo('/knowledge?category=food-safety')">更多</div>
        </div>
        
        <div class="knowledge-container">
          <div class="knowledge-card" @click="navigateTo('/knowledge/article/1')">
            <van-image src="https://img.yzcdn.cn/vant/cat.jpeg" class="knowledge-img" />
            <div class="knowledge-content">
              <div class="knowledge-title">常见食品添加剂安全指南</div>
              <div class="knowledge-desc">解读食品标签中的添加剂成分，哪些是安全的，哪些应当尽量避免...</div>
            </div>
          </div>
          <div class="knowledge-card" @click="navigateTo('/knowledge/article/2')">
            <van-image src="https://img.yzcdn.cn/vant/cat.jpeg" class="knowledge-img" />
            <div class="knowledge-content">
              <div class="knowledge-title">蔬果正确清洗方法大全</div>
              <div class="knowledge-desc">不同蔬菜水果的科学清洗方式，有效去除农药残留和细菌污染...</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section recipe-section">
        <div class="section-header">
          <div class="section-title">热门食谱推荐</div>
          <div class="section-action" @click="navigateTo('/recipe')">查看全部</div>
        </div>
        
        <div class="recipe-list">
          <div class="recipe-card" v-for="recipe in recipes" :key="recipe.id" @click="navigateTo(`/recipe/detail/${recipe.id}`)">
            <van-image :src="recipe.image" class="recipe-img" />
            <div class="recipe-content">
              <div class="recipe-title">{{ recipe.title }}</div>
              <div class="recipe-stats">
                <div class="recipe-author">
                  <van-image :src="recipe.authorAvatar" class="author-avatar" round />
                  <span>{{ recipe.authorName }}</span>
                </div>
                <div class="recipe-likes">
                  <van-icon name="like" class="likes-icon" />
                  <span>{{ recipe.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/community" icon="friends-o">社区</van-tabbar-item>
      <van-tabbar-item replace to="/recipe" icon="fire-o">食谱</van-tabbar-item>
      <van-tabbar-item replace to="/knowledge" icon="bookmark-o">知识</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

// 默认头像
const defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'

const router = useRouter()
const userStore = useUserStore()

// 食谱数据
const recipes = ref([
  {
    id: 1,
    title: '低脂鸡胸肉蔬菜沙拉',
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorName: '健身厨房',
    likes: 328
  },
  {
    id: 2,
    title: '五谷杂粮糙米饭',
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorName: '营养师王小明',
    likes: 156
  },
  {
    id: 3,
    title: '香煎三文鱼配芦笋',
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorName: '美食达人李厨',
    likes: 219
  },
  {
    id: 4,
    title: '蒸蛋羹配紫菜',
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    authorName: '儿童营养师',
    likes: 187
  }
])

onMounted(async () => {
  // 获取用户信息
  if (userStore.isLogin && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }
})

// 导航到对应页面
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-bottom: 60px;
}

.header {
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-container {
  position: relative;
  width: 44px;
  height: 44px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.ai-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #333;
  color: white;
  font-size: 10px;
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  text-align: center;
  padding: 0 4px;
  border-radius: 9px;
  font-weight: bold;
}

.search-bar {
  flex: 1;
  margin: 0 12px;
  background: #f5f5f5;
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #939393;
}

.search-icon {
  font-size: 18px;
  margin-right: 6px;
}

.search-placeholder {
  font-size: 14px;
  flex: 1;
}

.scan-icon {
  font-size: 20px;
  margin-left: 6px;
  color: #939393;
}

.message-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-badge {
  position: absolute;
  top: 0;
  right: 2px;
  background: #FF4B4B;
  color: white;
  font-size: 10px;
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  text-align: center;
  padding: 0 4px;
  border-radius: 9px;
}

.content {
  padding: 16px;
  position: relative;
  z-index: 8;
}

.section {
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f2f3f5;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(to bottom, #42C3FF, #2E94FF);
  border-radius: 2px;
}

.section-action {
  font-size: 14px;
  color: #2E94FF;
}

.advice-card {
  background: white;
  padding: 16px;
}

.advice-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.advice-icon {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.nutrition-icon {
  background: linear-gradient(135deg, #42C3FF, #2E94FF);
}

.advice-title {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
}

.advice-content {
  padding: 0 0 0 44px;
}

.advice-text {
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.advice-actions {
  display: flex;
}

.advice-btn {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  background: #f2f3f5;
  color: #333333;
  margin-right: 8px;
}

.advice-btn.primary {
  background: linear-gradient(135deg, #42C3FF, #2E94FF);
  color: white;
}

.knowledge-container {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 16px;
}

.knowledge-card {
  flex: 0 0 250px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f2f3f5;
}

.knowledge-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.knowledge-content {
  padding: 12px;
}

.knowledge-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.knowledge-desc {
  font-size: 12px;
  color: #666666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.recipe-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f2f3f5;
}

.recipe-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.recipe-content {
  padding: 12px;
}

.recipe-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999999;
}

.recipe-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.recipe-likes {
  display: flex;
  align-items: center;
}

.likes-icon {
  font-size: 12px;
  margin-right: 2px;
  color: #2E94FF;
}

@media (max-width: 375px) {
  .knowledge-container {
    flex-wrap: nowrap;
  }
  
  .knowledge-card {
    flex: 0 0 200px;
  }
  
  .recipe-list {
    grid-template-columns: 1fr;
  }
}
</style>
