<template>
  <PageContainer>
    <h2 class="page-title">我的订单</h2>

    <div class="order-list" v-if="orderList.length > 0">
      <div class="order-item" v-for="order in orderList" :key="order.id">
        <div class="order-header">
          <div class="order-id">订单编号: {{ order.orderNo }}</div>
          <div class="order-date">下单时间: {{ formatDate(order.createTime) }}</div>
          <div class="order-status" :class="statusClass(order.status)">
            {{ order.status === 1 ? '已完成' : '待支付' }}
          </div>
        </div>
        <div class="order-body">
          <div class="game-info">
            <div class="game-thumbnail">
              <img :src="order.gameImage || '/default-game.jpg'" alt="order.gameName">
            </div>
            <div class="game-name">{{ order.gameName }}</div>
          </div>
          <div class="order-amount">
            <span class="amount-label">订单金额:</span>
            <span class="amount-value">¥{{ order.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">
        <font-awesome-icon icon="file-invoice-dollar" size="4x" color="#ccc" />
      </div>
      <div class="empty-text">暂无订单记录</div>
      <div class="empty-desc">去浏览游戏并购买吧</div>
      <router-link to="/games" class="btn btn-primary">浏览游戏</router-link>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/common/PageContainer.vue'
import { getUserOrders } from '@/api/order.js'

// 订单列表数据
const orderList = ref([])

// 加载订单列表
const loadOrders = async () => {
  try {
    const res = await getUserOrders()
    orderList.value = res.data
  } catch (error) {
    ElMessage.error('获取订单列表失败：' + error.message)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 订单状态样式
const statusClass = (status) => {
  return status === 1 ? 'status-completed' : 'status-pending'
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.page-title {
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
  border-bottom: 2px solid #1989fa;
  padding-bottom: 8px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
}

.order-id, .order-date {
  color: #666;
  font-size: 14px;
}

.order-status {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.status-completed {
  background-color: #f0fdf4;
  color: #166534;
}

.status-pending {
  background-color: #fffbeb;
  color: #92400e;
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.game-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.game-thumbnail {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
}

.game-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-name {
  font-size: 16px;
  color: #333;
}

.order-amount {
  text-align: right;
}

.amount-label {
  color: #666;
  margin-right: 8px;
}

.amount-value {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
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

.empty-desc {
  margin-bottom: 24px;
}
</style>