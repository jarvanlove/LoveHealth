import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 自定义全局变量类型
declare global {
  interface Window {
    __VCONSOLE_INSTANCE__?: any;
    VConsole?: any;
    eruda?: any;
  }
}

// 导入 Vant 组件
import 'vant/lib/index.css'
import { 
  Button, 
  Field, 
  Form, 
  CellGroup, 
  Cell, 
  Checkbox, 
  CheckboxGroup, 
  Toast, 
  Dialog, 
  Icon, 
  Tabbar, 
  TabbarItem,
  Image as VanImage, 
  Empty, 
  Swipe, 
  SwipeItem
} from 'vant'

// 导入全局样式
import './styles/main.scss'

// 禁用开发调试工具
if (typeof window !== 'undefined') {
  // 移除VConsole
  if (window.__VCONSOLE_INSTANCE__ || window.VConsole) {
    try {
      if (window.__VCONSOLE_INSTANCE__) window.__VCONSOLE_INSTANCE__.destroy();
      if (window.VConsole) window.VConsole = undefined;
    } catch (e) {}
  }
  
  // 移除eruda
  if (window.eruda) {
    try {
      window.eruda.destroy();
      window.eruda = undefined;
    } catch (e) {}
  }
}

const app = createApp(App)

// 注册 Vant 组件
app.use(Button)
app.use(Field)
app.use(Form)
app.use(CellGroup)
app.use(Cell)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Toast)
app.use(Dialog)
app.use(Icon)
app.use(Tabbar)
app.use(TabbarItem)
app.use(VanImage)
app.use(Empty)
app.use(Swipe)
app.use(SwipeItem)

app.use(createPinia())
app.use(router)

app.mount('#app')
