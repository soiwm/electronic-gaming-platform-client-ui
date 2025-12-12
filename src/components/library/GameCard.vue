<template>
  <div 
    :class="['game-card', { 
      'game-card-grid': viewMode === 'grid', 
      'game-card-list': viewMode === 'list' 
    }]"
    @click="handleCardClick"
  >
    <div 
      class="game-card-image"
      :style="{ backgroundImage: `url(${getGameLogoUrl(game.logo)})` }"
      @error.once="handleImageError"
    >
      <div class="game-card-overlay">
        <h3 class="game-card-title">{{ game.name }}</h3>
        <div class="game-card-meta">
          <span>{{ game.type }}</span>
          <span>{{ formatDate(game.purchaseDate) }}</span>
        </div>
      </div>
    </div>
    <div class="game-card-content">
      <div class="game-card-actions">
        <button 
          v-if="game.installed" 
          class="game-btn launch-btn" 
          @click.stop="handleLaunch"
        >
          <font-awesome-icon icon="play" /> 启动游戏
        </button>
        <button 
          v-else 
          class="game-btn install-btn" 
          @click.stop="handleInstall"
        >
          <font-awesome-icon icon="download" /> 安装
        </button>
        <button class="game-btn details-btn" @click.stop="handleDetails">
          <font-awesome-icon icon="info-circle" /> 详情
        </button>
        <button 
          v-if="game.installed" 
          class="game-btn uninstall-btn" 
          @click.stop="handleUninstall"
        >
          <font-awesome-icon icon="trash" /> 卸载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'


// 定义props
const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})

// 定义事件
const emit = defineEmits(['launch', 'details', 'uninstall', 'install', 'click'])

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
const handleImageError = (event) => {
  event.target.style.backgroundImage = `url('/images/game/default-game.svg')`
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 卡片点击
const handleCardClick = () => {
  emit('click', props.game)
}

// 安装游戏
const handleInstall = () => {
  emit('install', props.game.id)
}

// 启动游戏
const handleLaunch = () => {
  emit('launch', props.game.id)
}

// 查看详情
const handleDetails = () => {
  emit('details', props.game.id)
}

// 卸载游戏
const handleUninstall = () => {
  emit('uninstall', props.game.id)
}
</script>

<style scoped>
.game-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background-color: #1a1a1a;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.game-card-grid {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-card-list {
  display: flex;
  flex-direction: row;
  height: 120px;
}

.game-card-image {
  position: relative;
  height: 150px;
  background-size: cover;
  background-position: center;
  background-color: #2a2a2a;
}

.game-card-list .game-card-image {
  width: 200px;
  height: 100%;
  flex-shrink: 0;
}

.game-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 15px;
  color: white;
}

.game-card-title {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.8;
}

.game-card-content {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.game-card-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.game-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.launch-btn {
  background-color: #4CAF50;
  color: white;
}

.launch-btn:hover {
  background-color: #45a049;
}

.install-btn {
  background-color: #2196F3;
  color: white;
}

.install-btn:hover {
  background-color: #0b7dda;
}

.details-btn {
  background-color: #555;
  color: white;
}

.details-btn:hover {
  background-color: #444;
}

.uninstall-btn {
  background-color: #f44336;
  color: white;
}

.uninstall-btn:hover {
  background-color: #d32f2f;
}
</style>