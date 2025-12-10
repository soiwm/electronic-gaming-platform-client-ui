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
        <span class="username">{{ displayName }}</span>
      </div>
      <el-button v-if="isLoggedIn" size="small" @click="logout">退出</el-button>
    </div>
  </header>
</template>

<script>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearToken, getTokenPayload, getToken } from '@/utils/auth'

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter()
    // 过滤掉不需要展示在导航栏的路由
    const routes = router.options.routes.filter(route => 
      route.meta && route.meta.title && !['GameDetail', 'Login'].includes(route.name)
    )

    const tokenRef = ref(getToken())
    const isLoggedIn = computed(() => !!tokenRef.value)
    const displayName = computed(() => {
      const payload = getTokenPayload(tokenRef.value)
      return payload?.sub || payload?.username || '游客'
    })

    const syncToken = () => {
      tokenRef.value = getToken()
    }

    const logout = () => {
      clearToken()
      tokenRef.value = ''
      // 退出登录后直接跳转到登录页面，并添加logout参数标识
      router.push({ path: '/login', query: { logout: 'true' } })
    }

    let tokenCheckInterval = null
    onMounted(() => {
      window.addEventListener('storage', syncToken)
      // 添加定时检查token的机制，确保登录状态能及时更新
      tokenCheckInterval = setInterval(syncToken, 1000)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('storage', syncToken)
      // 清理定时器
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval)
      }
    })

    return { routes, isLoggedIn, displayName, logout }
  }
}
</script>

<style scoped>
@import "@/assets/css/header.css";
</style>