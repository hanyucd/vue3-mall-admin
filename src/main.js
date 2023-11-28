import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import 'virtual:windi.css';

const app = createApp(App);

// 全局注册 elementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(router);
app.mount('#app');

// createApp(App).mount('#app')
