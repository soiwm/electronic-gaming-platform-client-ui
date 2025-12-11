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
        <button class="game-btn launch-btn" @click.stop="handleLaunch">
          <font-awesome-icon icon="play" /> 启动游戏
        </button>
        <button class="game-btn details-btn" @click.stop="handleDetails">
          <font-awesome-icon icon="info-circle" /> 详情
        </button>
        <button class="game-btn uninstall-btn" @click.stop="handleUninstall">
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
const emit = defineEmits(['launch', 'details', 'uninstall', 'click'])

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