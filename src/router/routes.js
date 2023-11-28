
/**
 * 静态路由, 所有用户共享
 */
export const constantRouterMap = [
  // { path: '/', redirect: '/user/list' },
  {
    path: '/',
    name: 'IndexRoute',
    component: () => import('@/views/index/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: { title: '登录' }
  },
  // 404页面配置
  {
    path: '/:pathMatch(.*)*',
    name: '404Route',
    component: () => import('@/views/404/404.vue')
  },
];
