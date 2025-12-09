import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import GameList from '@/views/game/GameList.vue'
import GameDetail from '@/views/game/GameDetail.vue'
import OrderList from '@/views/order/OrderList.vue'
import LibraryView from '@/views/library/LibraryView.vue' // 新增：游戏库路由

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
    meta: { title: '库', icon: 'book' } // 新增：游戏库路由
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '我的订单', icon: 'list' }
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
  next()
})

export default router