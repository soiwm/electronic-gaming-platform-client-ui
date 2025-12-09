<template>
  <header class="header">
    <div class="header-left">
      <router-link to="/" class="logo">
        <font-awesome-icon icon="gamepad" />
        <span class="logo-text">游戏平台</span>
      </router-link>
    </div>
    <div class="header-center">
      <ul class="nav-list">
        <li v-for="route in routes" :key="route.path">
          <router-link 
            :to="route.path"
            :class="{ active: $route.path === route.path }"
          >
            <font-awesome-icon :icon="route.meta.icon" class="nav-icon" />
            <span>{{ route.meta.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <div class="user-info">
        <font-awesome-icon icon="user" />
        <span class="username">游客</span>
      </div>
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter()
    // 过滤掉游戏详情页路由，只显示主要导航
    const routes = router.options.routes.filter(route => 
      route.meta && route.meta.title && route.name !== 'GameDetail'
    )
    return { routes }
  }
}
</script>

<style scoped>
@import "@/assets/css/header.css";
</style>