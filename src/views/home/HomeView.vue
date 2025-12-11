<template>
  <PageContainer>
    <div class="home-banner">
      <h1>欢迎来到电子游戏平台</h1>
      <p>发现并购买最新最热门的游戏</p>
      <router-link to="/games" class="btn btn-primary">浏览游戏</router-link>
    </div>
    
    <div class="featured-games">
      <h2>热门游戏</h2>
      <div class="game-grid">
        <div 
          class="game-card" 
          v-for="game in featuredGames" 
          :key="game.id"
          @click="$router.push(`/games/${game.id}`)"
        >
          <div class="game-image">
            <img :src="getGameLogoUrl(game.logo)" :alt="game.name" @error.once="handleImageError">
          </div>
          <h3>{{ game.name }}</h3>
          <div class="game-info">
            <span class="game-type">{{ game.type }}</span>
            <span class="game-price">¥{{ game.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from '@/components/common/PageContainer.vue'
import { getGameList } from '@/api/game.js'

const featuredGames = ref([])

const getGameLogoUrl = (logo) => {
  // 无值用默认图（放在 public/images/game/ 下）
  if (!logo) return '/images/game/default-game.svg'

  // 完整 URL 直接返回
  if (/^https?:\/\//i.test(logo)) return logo

  // 以 / 开头：认为后端可直接访问的静态路径（走同域或 dev 代理）
  if (logo.startsWith('/')) return logo
  
  // 如果已经包含images/game路径，直接使用
  if (logo.includes('images/game/')) {
    return logo
  }

  // 仅文件名：补上后端静态前缀
  return `/images/game/${logo}`
}

const handleImageError = (e) => {
  // 防止无限循环，只设置一次默认图片
  if (!e.target.src.includes('default-game.svg')) {
    e.target.src = '/images/game/default-game.svg'
  }
}

const getFeaturedGames = async () => {
  try {
    const res = await getGameList()
    // 取前4个作为热门游戏
    featuredGames.value = res.data.slice(0, 4)
  } catch (error) {
    console.error('获取热门游戏失败', error)
  }
}

onMounted(() => {
  getFeaturedGames()
})
</script>

<script>
export default {
  name: 'HomeView' // 修复：多单词组件名
}
</script>

<style scoped>
.home-banner {
  background: linear-gradient(135deg, #1989fa 0%, #0e75d3 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 40px;
}

.home-banner h1 {
  font-size: 36px;
  margin-bottom: 16px;
}

.home-banner p {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.featured-games h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #1989fa;
  padding-bottom: 8px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.game-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.game-card h3 {
  padding: 16px;
  font-size: 18px;
  color: #333;
}

.game-info {
  display: flex;
  justify-content: space-between;
  padding: 0 16px 16px;
  color: #666;
}

.game-type {
  background-color: #e6f4ff;
  color: #1989fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.game-price {
  font-weight: 600;
  color: #f56c6c;
}
</style>