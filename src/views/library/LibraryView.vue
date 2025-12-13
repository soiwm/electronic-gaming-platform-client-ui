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
          @install="handleInstallGame"
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
      @toggle-favorite="handleToggleFavorite"
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
import { getUserLibrary, launchGame, installGame, uninstallGame, toggleFavorite } from '@/api/library.js'

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
    // 直接使用后端返回的数据，包括安装和收藏状态
    libraryGames.value = res.data.map(game => ({
      ...game,
      // 将后端返回的0/1转换为布尔值，方便前端使用
      installed: game.installed === 1,
      favorite: game.favorite === 1,
      // 使用后端返回的购买时间
      purchaseDate: game.purchaseTime,
      // 添加一些额外的模拟数据，实际应用中应从接口返回
      playTime: Math.floor(Math.random() * 100), // 游玩小时数
      achievements: Math.floor(Math.random() * 50), // 成就数
      lastPlayed: Math.random() > 0.5 // 是否最近游玩
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
    if (activeCategory.value === 'favorite') {
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

// 切换收藏状态
const handleToggleFavorite = async (gameId) => {
  try {
    await toggleFavorite(gameId)
    const game = libraryGames.value.find(g => g.id === gameId)
    if (!game) {
      ElMessage.error('游戏不存在')
      return
    }
    
    // 切换收藏状态
    const gameIndex = libraryGames.value.findIndex(g => g.id === gameId)
    if (gameIndex !== -1) {
      libraryGames.value[gameIndex].favorite = !libraryGames.value[gameIndex].favorite
      const action = libraryGames.value[gameIndex].favorite ? '收藏' : '取消收藏'
      ElMessage.success(`已${action}《${game.name}》`)
      
      // 如果当前选中的游戏被修改，更新选中状态
      if (selectedGame.value?.id === gameId) {
        selectedGame.value.favorite = libraryGames.value[gameIndex].favorite
      }
    }
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  }
}

// 安装游戏
const handleInstallGame = async (gameId) => {
  try {
    await installGame(gameId)
    const game = libraryGames.value.find(g => g.id === gameId)
    if (!game) {
      ElMessage.error('游戏不存在')
      return
    }
    
    // 更新游戏状态为已安装
    const gameIndex = libraryGames.value.findIndex(g => g.id === gameId)
    if (gameIndex !== -1) {
      libraryGames.value[gameIndex].installed = true
      ElMessage.success(`《${game.name}》安装成功`)
    }
  } catch (error) {
    ElMessage.error('安装游戏失败：' + error.message)
  }
}

// 卸载游戏
const handleUninstallGame = async (gameId) => {
  try {
    await uninstallGame(gameId)
    const game = libraryGames.value.find(g => g.id === gameId)
    if (!game) {
      ElMessage.error('游戏不存在')
      return
    }
    
    const gameIndex = libraryGames.value.findIndex(g => g.id === gameId)
    if (gameIndex !== -1) {
      libraryGames.value[gameIndex].installed = false
      ElMessage.success(`《${game.name}》卸载成功`)
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