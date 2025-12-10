import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import GameList from '@/views/game/GameList.vue'
import GameDetail from '@/views/game/GameDetail.vue'
import OrderList from '@/views/order/OrderList.vue'
import LibraryView from '@/views/library/LibraryView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import { getToken, isTokenExpired, clearToken } from '@/utils/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: '首页', icon: 'home' }
  },
  {
    path: '/games',
    name: 'GameList',
    component: GameList,
    meta: { title: '商店', icon: 'gamepad' } // 原「游戏列表」改为「商店」
  },
  {
    path: '/games/:id',
    name: 'GameDetail',
    component: GameDetail,
    meta: { title: '游戏详情', icon: 'gamepad' }
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryView,
    meta: { title: '库', icon: 'book', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '我的订单', icon: 'list', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登录', icon: 'user' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 电子游戏平台`
  }

  const token = getToken()
  const expired = isTokenExpired(token)
  const isAuthed = !!token && !expired

  if (expired) {
    clearToken()
  }

  if (!isAuthed && to.name !== 'Login') {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (isAuthed && to.name === 'Login') {
    // 如果是从退出操作跳转到登录页，则允许访问
    if (from.query.logout === 'true') {
      next()
      return
    }
    next({ path: '/' })
    return
  }

  next()
})

export default router