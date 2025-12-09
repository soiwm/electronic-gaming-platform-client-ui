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
      :style="{ backgroundImage: `url(${game.imageUrl || '/default-game.jpg'})` }"
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