<template>
  <div class="library-container">
    <!-- 左侧侧边栏 -->
    <LibrarySidebar 
      :active-category="activeCategory"
      @change-category="handleCategoryChange"
    />

    <!-- 中间游戏列表区域 -->
    <div class="library-content">
      <div class="library-header">
        <h1 class="library-title">我的游戏库</h1>
        <div class="view-controls">
          <button 
            class="view-btn" 
            :class="{ active: viewMode === 'grid' }"
            @click="setViewMode('grid')"
          >
            <font-awesome-icon icon="th" />
          </button>
          <button 
            class="view-btn" 
            :class="{ active: viewMode === 'list' }"
            @click="setViewMode('list')"
          >
            <font-awesome-icon icon="list" />
          </button>
        </div>
      </div>

      <!-- 游戏列表/网格 -->
      <div :class="{ 'game-grid': viewMode === 'grid', 'game-list': viewMode === 'list' }">
        <GameCard 
          v-for="game in filteredGames" 
          :key="game.id"
          :game="game"
          :view-mode="viewMode"
          @launch="handleLaunchGame"
          @details="handleGameDetails"
          @uninstall="handleUninstallGame"
          @click="setSelectedGame(game)"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredGames.length === 0 && !loading" class="empty-state" style="padding: 100px 0; text-align: center;">
        <font-awesome-icon icon="gamepad" size="4x" color="#384452" style="margin-bottom: 20px;" />
        <h3 style="font-size: 18px; margin-bottom: 10px;">您的游戏库是空的</h3>
        <p style="color: #8f98a0; margin-bottom: 20px;">购买游戏后会显示在这里</p>
        <router-link to="/games" class="game-btn launch-btn">
          <font-awesome-icon icon="shopping-cart" /> 前往商店
        </router-link>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state" style="padding: 100px 0; text-align: center;">
        <el-loading :visible="true" text="加载游戏库..." style="color: #fff;" />
      </div>
    </div>

    <!-- 右侧详情面板 -->
    <GameDetailPanel 
      :selected-game="selectedGame"
      @launch="handleLaunchGame"
      @details="handleGameDetails"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import LibrarySidebar from '@/components/library/LibrarySidebar.vue'
import GameCard from '@/components/library/GameCard.vue'
import GameDetailPanel from '@/components/library/GameDetailPanel.vue'
import { getUserLibrary, launchGame, uninstallGame } from '@/api/library.js'

// 路由
const router = useRouter()

// 状态管理
const loading = ref(false)
const libraryGames = ref([])
const viewMode = ref('grid') // grid/list
const activeCategory = ref('all')
const selectedGame = ref(null)

// 获取游戏库数据
const loadLibraryGames = async () => {
  loading.value = true
  const loadInstance = ElLoading.service({ 
    text: '加载游戏库...',
    background: 'rgba(0, 0, 0, 0.5)',
    target: '.library-content'
  })
  
  try {
    const res = await getUserLibrary()
    // 模拟添加一些额外字段（实际应从接口返回）
    libraryGames.value = res.data.map(game => ({
      ...game,
      playTime: Math.floor(Math.random() * 100), // 游玩小时数
      achievements: Math.floor(Math.random() * 50), // 成就数
      lastPlayed: Math.random() > 0.5, // 是否最近游玩
      installed: Math.random() > 0.3, // 是否安装
      favorite: Math.random() > 0.7, // 是否收藏
      purchaseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // 购买日期
    }))
  } catch (error) {
    ElMessage.error('加载游戏库失败：' + error.message)
  } finally {
    loading.value = false
    loadInstance.close()
  }
}

// 过滤游戏
const filteredGames = computed(() => {
  return libraryGames.value.filter(game => {
    // 分类过滤
    let categoryMatch = true
    if (activeCategory.value === 'recent') {
      categoryMatch = game.lastPlayed
    } else if (activeCategory.value === 'favorite') {
      categoryMatch = game.favorite
    } else if (activeCategory.value === 'installed') {
      categoryMatch = game.installed
    }

    return categoryMatch
  })
})

// 切换视图模式
const setViewMode = (mode) => {
  viewMode.value = mode
}

// 处理分类变化
const handleCategoryChange = (category) => {
  activeCategory.value = category
}

// 选择游戏（显示详情面板）
const setSelectedGame = (game) => {
  selectedGame.value = game
}

// 启动游戏
const handleLaunchGame = async (gameId) => {
  try {
    await launchGame(gameId)
    const game = libraryGames.value.find(g => g.id === gameId)
    ElMessage.success(`正在启动《${game?.name || '游戏'}》...`)
    // 模拟更新最近游玩状态
    if (game) {
      game.lastPlayed = true
    }
  } catch (error) {
    ElMessage.error('启动游戏失败：' + error.message)
  }
}

// 查看游戏详情（跳转到商店详情页）
const handleGameDetails = (gameId) => {
  router.push(`/games/${gameId}`)
}

// 卸载游戏
const handleUninstallGame = async (gameId) => {
  try {
    await uninstallGame(gameId)
    const gameIndex = libraryGames.value.findIndex(g => g.id === gameId)
    if (gameIndex !== -1) {
      libraryGames.value[gameIndex].installed = false
      ElMessage.success('游戏卸载成功')
      // 如果卸载的是当前选中的游戏，清空选中状态
      if (selectedGame.value?.id === gameId) {
        selectedGame.value = null
      }
    }
  } catch (error) {
    ElMessage.error('卸载游戏失败：' + error.message)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadLibraryGames()
})
</script>

<style scoped>
@import "@/assets/css/library.css";
</style>