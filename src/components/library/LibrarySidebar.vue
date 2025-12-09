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
          <a :class="{ active: activeCategory === 'recent' }" @click="setCategory('recent')">
            <font-awesome-icon icon="clock" class="icon" />
            <span>最近游玩</span>
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

    <!-- 游戏类型 -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">游戏类型</h3>
      <ul class="sidebar-menu">
        <li>
          <a :class="{ active: activeGenre === 'moba' }" @click="setGenre('moba')">
            <font-awesome-icon icon="users" class="icon" />
            <span>MOBA</span>
          </a>
        </li>
        <li>
          <a :class="{ active: activeGenre === 'shooter' }" @click="setGenre('shooter')">
            <font-awesome-icon icon="gun" class="icon" />
            <span>射击</span>
          </a>
        </li>
        <li>
          <a :class="{ active: activeGenre === 'rpg' }" @click="setGenre('rpg')">
            <font-awesome-icon icon="user-gear" class="icon" />
            <span>角色扮演</span>
          </a>
        </li>
        <li>
          <a :class="{ active: activeGenre === 'strategy' }" @click="setGenre('strategy')">
            <font-awesome-icon icon="chess" class="icon" />
            <span>策略</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 支持 -->
    <div class="sidebar-section">
      <h3 class="sidebar-title">支持</h3>
      <ul class="sidebar-menu">
        <li>
          <a href="#">
            <font-awesome-icon icon="headset" class="icon" />
            <span>客服支持</span>
          </a>
        </li>
        <li>
          <a href="#">
            <font-awesome-icon icon="cog" class="icon" />
            <span>库设置</span>
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
  },
  activeGenre: {
    type: String,
    default: ''
  }
})

// 修复：显式解构 props 并使用（让 ESLint 检测到使用）
const { activeCategory, activeGenre } = toRefs(props)

// 定义事件
const emit = defineEmits(['change-category', 'change-genre'])

// 设置分类
const setCategory = (category) => {
  emit('change-category', category)
}

// 设置游戏类型
const setGenre = (genre) => {
  emit('change-genre', genre)
}
</script>