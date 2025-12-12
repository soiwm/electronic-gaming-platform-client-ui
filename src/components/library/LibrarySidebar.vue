<template>
  <div class="library-sidebar">
    <!-- 游戏分类 -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">游戏分类</h3>
      <ul class="sidebar-menu">
        <li>
          <a :class="{ active: activeCategory === 'all' }" @click="setCategory('all')">
            <font-awesome-icon icon="gamepad" class="icon" />
            <span>所有游戏</span>
          </a>
        </li>
        <li>
          <a :class="{ active: activeCategory === 'favorite' }" @click="setCategory('favorite')">
            <font-awesome-icon icon="star" class="icon" />
            <span>已收藏</span>
          </a>
        </li>
        <li>
          <a :class="{ active: activeCategory === 'installed' }" @click="setCategory('installed')">
            <font-awesome-icon icon="download" class="icon" />
            <span>已安装</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, toRefs } from 'vue' // 新增：导入 toRefs

// 定义props
const props = defineProps({
  activeCategory: {
    type: String,
    default: 'all'
  }
})

// 修复：显式解构 props 并使用（让 ESLint 检测到使用）
const { activeCategory } = toRefs(props)

// 定义事件
const emit = defineEmits(['change-category'])

// 设置分类
const setCategory = (category) => {
  emit('change-category', category)
}
</script>