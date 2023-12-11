
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
    meta: { title: '主控台' },
    component: () => import('@/views/module-home/home-dashboard.vue')
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
  { 
    path: '/skus/list',
    meta: { title: '规格管理' },
    component: () => import('@/views/module-goods/sku-manage/sku-manage.vue')
  },
  { 
    path: '/coupon/list',
    meta: { title: '优惠券' },
    component: () => import('@/views/module-goods/coupon-manage/coupon-manage.vue')
  },
  {
    path: '/user/list',
    meta: { title: '用户列表' },
    component: () => import('@/views/module-user/user-manage/user-manage.vue')
  },
  { 
    path: '/level/list',
    meta: { title: '会员等级' },
    component: () => import('@/views/module-user/vip-level/vip-level.vue')
  },
  { 
    path: '/order/list',
    meta: { title: '订单列表' },
    component: () => import('@/views/module-order/order-manage/order-manage.vue')
  },
  { 
    path: '/comment/list',
    meta: { title: '评价列表' },
    component: () => import('@/views/module-order/comment-manage/comment-manage.vue')
  },
  { 
    path: '/image/list',
    meta: { title: '图库列表' },
    component: () => import('@/views/module-other/image-manage/image-manage.vue')
  },
  { 
    path: '/notice/list',
    meta: { title: '公告列表' },
    component: () => import('@/views/module-other/notice-manage/notice-manage.vue')
  },
  { 
    path: '/setting/base',
    meta: { title: '基础配置' },
    component: () => import('@/views/module-setting/setting-base/setting-base.vue')
  },
  { 
    path: '/setting/buy',
    meta: { title: '交易配置' },
    component: () => import('@/views/module-setting/setting-buy/setting-buy.vue')
  },
  { 
    path: '/setting/ship',
    meta: { title: '物流配置' },
    component: () => import('@/views/module-setting/setting-ship/setting-ship.vue')
  },
  // { 
  //   path: '/setting/buy',
  //   meta: { title: '支付设置' },
  //   component: () => import('~/pages/setting/Buy.vue')
  // },
  // { 
  //   path: '/setting/ship',
  //   meta: { title: '物流设置' },
  //   component: () => import('~/pages/setting/Ship.vue')
  // },
  { 
    path: '/manager/list',
    meta: { title: '管理员管理' },
    component: () => import('@/views/module-manager/manager-manage/manager-manage.vue')
  },
  { 
    path: '/access/list',
    meta: { title: '权限管理' },
    component: () => import('@/views/module-manager/access-manage/access-manage.vue')
  },
  { 
    path: '/role/list',
    meta: { title: '角色管理' },
    component: () => import('@/views/module-manager/role-manage/role-manage.vue')
  },
  // { 
  //   path: '/distribution/index',
  //   meta: { title: '分销员管理' },
  //   component: () => import('~/pages/distribution/Index.vue')
  // },
  // { 
  //   path: '/distribution/setting',
  //   meta: { title: '分销设置' },
  //   component: () => import('~/pages/distribution/Setting.vue')
  // },
];
