import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { constantRouterMap } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap
});

export default router;
