<template>
  <PageContainer>
    <div class="game-filter">
      <el-input 
        v-model="searchKeyword" 
        placeholder="搜索游戏名称" 
        prefix-icon="Search"
        class="search-input"
      />
      <el-select 
        v-model="selectedType" 
        placeholder="游戏类型" 
        class="type-select"
      >
        <el-option label="全部类型" value=""></el-option>
        <el-option label="MOBA" value="MOBA"></el-option>
        <el-option label="射击" value="射击"></el-option>
        <el-option label="角色扮演" value="角色扮演"></el-option>
        <el-option label="策略" value="策略"></el-option>
      </el-select>
    </div>

    <div class="game-list" v-if="filteredGames.length > 0">
      <div 
        class="game-item" 
        v-for="game in filteredGames" 
        :key="game.id"
        @click="$router.push(`/games/${game.id}`)"
      >
        <div class="game-item__image">
          <img :src="game.imageUrl || '/default-game.jpg'" alt="game.name">
        </div>
        <div class="game-item__info">
          <h3>{{ game.name }}</h3>
          <div class="game-meta">
            <span class="game-type">{{ game.type }}</span>
            <span class="game-price">¥{{ game.price.toFixed(2) }}</span>
          </div>
          <p class="game-desc">{{ game.description }}</p>
          <button class="btn btn-primary buy-btn">立即购买</button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">
        <font-awesome-icon icon="gamepad" size="4x" color="#ccc" />
      </div>
      <div class="empty-text">未找到游戏</div>
      <div class="empty-desc">请尝试其他搜索关键词或类型</div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/common/PageContainer.vue'
import { getGameList } from '@/api/game.js'

// 游戏列表数据
const gameList = ref([])
// 搜索关键词
const searchKeyword = ref('')
// 选中的类型
const selectedType = ref('')

// 获取游戏列表
const loadGameList = async () => {
  try {
    const res = await getGameList()
    gameList.value = res.data
  } catch (error) {
    ElMessage.error('获取游戏列表失败：' + error.message)
  }
}

// 过滤游戏列表
const filteredGames = computed(() => {
  return gameList.value.filter(game => {
    const matchesKeyword = game.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesType = !selectedType.value || game.type === selectedType.value
    return matchesKeyword && matchesType
  })
})

onMounted(() => {
  loadGameList()
})
</script>

<style scoped>
.game-filter {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.type-select {
  width: 180px;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-item {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.game-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #1989fa;
}

.game-item__image {
  width: 200px;
  flex-shrink: 0;
}

.game-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.game-item__info {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.game-item__info h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #333;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.game-type {
  background-color: #e6f4ff;
  color: #1989fa;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
}

.game-price {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.game-desc {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.buy-btn {
  align-self: flex-start;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #999;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}
</style>