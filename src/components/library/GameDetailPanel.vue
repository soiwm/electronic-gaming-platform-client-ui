<template>
  <div :class="['library-detail-panel', { 'panel-hidden': !selectedGame }]">
    <div v-if="selectedGame" class="game-detail-header">
      <img 
        :src="getGameLogoUrl(selectedGame.logo)" 
        :alt="selectedGame.name"
        class="game-detail-cover"
        @error.once="handleImageError"
      >
      <h2 class="game-detail-title">{{ selectedGame.name }}</h2>
      <div class="game-detail-meta">
        <span>{{ selectedGame.type }}</span>
        <span>购买于 {{ formatDate(selectedGame.purchaseDate) }}</span>
      </div>
      <div class="game-detail-actions">
        <button class="game-btn launch-btn" @click="handleLaunch">
          <font-awesome-icon icon="play" /> 启动游戏
        </button>
        <button 
          class="game-btn favorite-btn" 
          :class="{ 'is-favorite': selectedGame.favorite }"
          @click="handleToggleFavorite"
        >
          <font-awesome-icon :icon="selectedGame.favorite ? 'heart' : 'heart-broken'" /> 
          {{ selectedGame.favorite ? '已收藏' : '收藏' }}
        </button>
        <button class="game-btn details-btn" @click="handleDetails">
          <font-awesome-icon icon="external-link" /> 商店页面
        </button>
      </div>
    </div>

    <div v-if="selectedGame" class="game-detail-section">
      <h3 class="section-title">游戏介绍</h3>
      <div class="game-description">
        {{ selectedGame.description || '暂无详细介绍' }}
      </div>
    </div>

    <div v-if="selectedGame && selectedGame.features && selectedGame.features.length" class="game-detail-section">
      <h3 class="section-title">游戏特点</h3>
      <ul class="game-features">
        <li v-for="(feature, index) in selectedGame.features" :key="index">
          {{ feature }}
        </li>
      </ul>
    </div>

    <div v-if="!selectedGame" class="empty-panel">
      <div style="display: flex; flex-direction: column; align-items: center; padding: 50px 0; color: #8f98a0;">
        <font-awesome-icon icon="gamepad" size="4x" style="margin-bottom: 20px;" />
        <h3>选择一个游戏</h3>
        <p style="margin-top: 10px; font-size: 13px;">点击游戏卡片查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义props
const props = defineProps({
  selectedGame: {
    type: Object,
    default: null
  }
})

// 定义事件
const emit = defineEmits(['launch', 'details', 'toggle-favorite'])

// 获取游戏logo URL：仅做最小规则，避免拼错路径
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

// 处理图片加载错误
const handleImageError = (e) => {
  // 防止无限循环，只设置一次默认图片
  if (!e.target.src.includes('default-game.svg')) {
    e.target.src = '/images/game/default-game.svg'
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 切换收藏状态
const handleToggleFavorite = () => {
  if (props.selectedGame) {
    emit('toggle-favorite', props.selectedGame.id)
  }
}

// 启动游戏
const handleLaunch = () => {
  if (props.selectedGame) {
    emit('launch', props.selectedGame.id)
  }
}

// 查看商店页面
const handleDetails = () => {
  if (props.selectedGame) {
    emit('details', props.selectedGame.id)
  }
}
</script>

<style scoped>
.library-detail-panel {
  width: 350px;
  background-color: #1a1a1a;
  border-left: 1px solid #333;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.panel-hidden {
  transform: translateX(100%);
}

.game-detail-header {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.game-detail-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.game-detail-title {
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}

.game-detail-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #aaa;
}

.game-detail-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.launch-btn {
  background-color: #4CAF50;
  color: white;
}

.launch-btn:hover {
  background-color: #45a049;
}

.favorite-btn {
  background-color: #555;
  color: white;
}

.favorite-btn:hover {
  background-color: #444;
}

.favorite-btn.is-favorite {
  background-color: #e91e63;
}

.favorite-btn.is-favorite:hover {
  background-color: #d81b60;
}

.details-btn {
  background-color: #2196F3;
  color: white;
}

.details-btn:hover {
  background-color: #0b7dda;
}

.game-detail-section {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #fff;
}

.game-description {
  color: #ccc;
  line-height: 1.5;
  font-size: 14px;
}

.game-features {
  margin: 0;
  padding: 0 0 0 20px;
  color: #ccc;
}

.game-features li {
  margin-bottom: 8px;
  line-height: 1.4;
}

.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>