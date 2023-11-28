import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import App from './App.vue';
import api from '@/common/api';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import 'virtual:windi.css';

const app = createApp(App);

// 全局注册 elementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 添加到全局属性
app.config.globalProperties.$api = api;

app.use(ElementPlus);
app.use(router);
app.mount('#app');

// createApp(App).mount('#app')
// console.log(import.meta.env);

