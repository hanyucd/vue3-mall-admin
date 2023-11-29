
/**
 * 静态路由, 所有用户共享
 */
export const constantRouterMap = [
  // { path: '/', redirect: '/user/list' },
  {
    path: '/',
    name: 'IndexRoute',
    meta: { title: '后台首页' },
    component: () => import('@/views/index/index.vue'),
  },
  {
    path: '/login',
    name: 'loginRoute',
    meta: { title: '登录' },
    component: () => import('@/views/login/login.vue'),
  },
  // 404页面配置
  {
    path: '/:pathMatch(.*)*',
    name: '404Route',
    meta: { title: '404' },
    component: () => import('@/views/404/404.vue')
  },
];
