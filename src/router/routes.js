
/**
 * 静态路由, 所有用户共享
 */
export const constantRouterMap = [
  // { path: '/', redirect: '/user/list' },
  // 布局页面
  {
    path: '/',
    name: 'layoutRoute',
    meta: { title: '布局页面' },
    component: () => import('@/layout/layout.vue'),
  },
  // 登录页面
  {
    path: '/login',
    name: 'loginRoute',
    meta: { title: '登录' },
    component: () => import('@/views/login/login.vue'),
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: '404Route',
    meta: { title: '404' },
    component: () => import('@/views/404/404.vue')
  },
];

// 动态路由
export const asyncRouterMap = [
  {
    path: '/',
    meta: { title: '首页' },
    component: () => import('@/views/module-home/home-dashboard/home-dashboard.vue')
  },
  {
    path: '/goods/list',
    meta: { title: '商品管理' },
    component: () => import('@/views/module-goods/goods-manage/goods-manage.vue')
  },
  {
    path: '/category/list',
    meta: { title: '分类列表' },
    component: () => import('@/views/module-goods/category-manage/category-manage.vue')
  },
];
