import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from '@/router';
import store from '@/store';
import App from './App.vue';
import api from '@/common/api';
import * as commonUtil from '@/common/utils';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import 'virtual:windi.css';
import '@/router/permission'; // 执行路由全局守卫

const app = createApp(App);

// 全局注册 elementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 添加到全局属性
app.config.globalProperties.$api = api;
app.config.globalProperties.$commonUtil = commonUtil;

app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount('#app');

// createApp(App).mount('#app')
// console.log(import.meta.env);
// console.log(app);

