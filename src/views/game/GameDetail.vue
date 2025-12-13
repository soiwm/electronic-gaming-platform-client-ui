<template>
  <PageContainer>
    <div class="game-detail" v-if="gameDetail">
      <div class="game-detail__header">
        <div class="game-image">
          <img :src="getGameLogoUrl(gameDetail.logo)" :alt="gameDetail.name" @error.once="handleImageError">
        </div>
        <div class="game-info">
          <h1>{{ gameDetail.name }}</h1>
          <div class="game-meta">
            <span class="game-type">{{ gameDetail.type }}</span>
            <span class="game-release">发布日期: {{ gameDetail.releaseDate || '未知' }}</span>
          </div>
          <div class="game-price">¥{{ gameDetail.price.toFixed(2) }}</div>
          <button 
            v-if="isPurchased" 
            class="btn btn-disabled purchased-btn" 
            disabled
          >
            已购买
          </button>
          <button 
            v-else 
            class="btn btn-primary buy-btn" 
            @click="handleBuy"
          >
            立即购买
          </button>
        </div>
      </div>

      <div class="game-detail__content">
        <h2>游戏介绍</h2>
        <div class="game-description">
          {{ gameDetail.description || '暂无详细介绍' }}
        </div>

        <h2>游戏特点</h2>
        <ul class="game-features" v-if="gameDetail.features && gameDetail.features.length">
          <li v-for="(feature, index) in gameDetail.features" :key="index">
            <font-awesome-icon icon="check-circle" class="feature-icon" />
            {{ feature }}
          </li>
        </ul>
        <div v-else class="no-features">暂无游戏特点信息</div>
      </div>
    </div>

    <div class="loading-state" v-else>
      <el-loading :visible="true" text="加载中..."></el-loading>
    </div>

    <!-- 购买确认弹窗 -->
    <el-dialog title="确认购买" v-model="buyDialogVisible" width="400px">
      <p>您确定要购买 {{ gameDetail?.name }} 吗？</p>
      <p class="dialog-price">价格: ¥{{ gameDetail?.price.toFixed(2) }}</p>
      <template #footer>
        <el-button @click="buyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPurchase">确认购买</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import PageContainer from '@/components/common/PageContainer.vue'
import { getGameDetail } from '@/api/game.js'
import { createOrder } from '@/api/order.js'
import { checkUserPurchasedGame } from '@/api/library.js'

// 路由相关
const route = useRoute()
const router = useRouter()
const gameId = route.params.id

// 游戏详情数据
const gameDetail = ref(null)
// 购买弹窗显示状态
const buyDialogVisible = ref(false)
// 是否已购买游戏
const isPurchased = ref(false)

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

// 获取游戏详情
const loadGameDetail = async () => {
  const loading = ElLoading.service({ text: '加载中...' })
  try {
    const res = await getGameDetail(gameId)
    gameDetail.value = res.data
    
    // 检查用户是否已购买该游戏
    await checkPurchaseStatus()
  } catch (error) {
    ElMessage.error('获取游戏详情失败：' + error.message)
  } finally {
    loading.close()
  }
}

// 检查用户是否已购买游戏
const checkPurchaseStatus = async () => {
  try {
    const res = await checkUserPurchasedGame(gameId)
    isPurchased.value = res.data
  } catch (error) {
    console.error('检查购买状态失败：', error)
    // 如果检查失败，默认设置为未购买
    isPurchased.value = false
  }
}

// 打开购买弹窗
const handleBuy = () => {
  buyDialogVisible.value = true
}

// 确认购买
const confirmPurchase = async () => {
  try {
    const orderData = {
      gameId: gameDetail.value.id
    }
    await createOrder(orderData)
    ElMessage.success('购买成功！')
    buyDialogVisible.value = false
    
    // 更新购买状态
    isPurchased.value = true
    
    // 跳转到订单列表
    router.push('/orders')
  } catch (error) {
    ElMessage.error('购买失败：' + error.message)
  }
}

onMounted(() => {
  loadGameDetail()
})
</script>

<style scoped>
.game-detail__header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.game-image {
  width: 400px;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.game-info h1 {
  font-size: 28px;
  margin-bottom: 16px;
  color: #333;
}

.game-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  color: #666;
}

.game-type {
  background-color: #e6f4ff;
  color: #1989fa;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
}

.game-price {
  font-size: 24px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 24px;
}

.buy-btn {
  align-self: flex-start;
  padding: 10px 24px;
  font-size: 16px;
}

.purchased-btn {
  align-self: flex-start;
  padding: 10px 24px;
  font-size: 16px;
  background-color: #e4e7ed;
  color: #909399;
  cursor: not-allowed;
}

.game-detail__content {
  color: #333;
}

.game-detail__content h2 {
  font-size: 20px;
  margin: 24px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #1989fa;
}

.game-description {
  line-height: 1.8;
  color: #666;
}

.game-features {
  padding-left: 20px;
}

.game-features li {
  list-style: none;
  margin-bottom: 12px;
  line-height: 1.6;
  position: relative;
  padding-left: 24px;
}

.feature-icon {
  color: #36d399;
  position: absolute;
  left: 0;
}

.no-features {
  color: #999;
  padding: 10px 0;
}

.loading-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
}
</style>