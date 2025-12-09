<template>
  <div :class="['library-detail-panel', { 'panel-hidden': !selectedGame }]">
    <div v-if="selectedGame" class="game-detail-header">
      <img 
        :src="selectedGame.imageUrl || '/default-game.jpg'" 
        alt="selectedGame.name"
        class="game-detail-cover"
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

    <div v-if="selectedGame" class="game-detail-section">
      <h3 class="section-title">游戏统计</h3>
      <div class="game-stats">
        <div class="stat-item">
          <div class="stat-value">{{ selectedGame.playTime || 0 }}</div>
          <div class="stat-label">游玩小时数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ selectedGame.achievements || 0 }}</div>
          <div class="stat-label">已解锁成就</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ selectedGame.lastPlayed ? '是' : '否' }}</div>
          <div class="stat-label">最近游玩</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ selectedGame.installed ? '已安装' : '未安装' }}</div>
          <div class="stat-label">安装状态</div>
        </div>
      </div>
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
const emit = defineEmits(['launch', 'details'])

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString()
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