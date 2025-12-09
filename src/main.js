import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faGamepad, 
  faHome, 
  faUser, 
  faList,
  faCheckCircle,
  faFileInvoiceDollar,
  faClock,
  faStar,
  faDownload,
  faUsers,
  faGun,
  faUserGear,
  faChess,
  faHeadset,
  faCog,
  faPlay,
  faInfoCircle,
  faTrash,
  faExternalLink,
  faTh,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons'

// 注册所有需要的图标
library.add(
  faGamepad, faHome, faUser, faList, faCheckCircle, faFileInvoiceDollar,
  faClock, faStar, faDownload, faUsers, faGun, faUserGear, faChess,
  faHeadset, faCog, faPlay, faInfoCircle, faTrash, faExternalLink,
  faTh, faShoppingCart
)

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')