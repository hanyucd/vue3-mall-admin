import router from '@/router';
import { asyncRouterMap } from '@/router/routes';
import store from '@/store';
import authUtil from '@/common/utils/authUtil';
import * as commonUtil from '@/common/utils';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false }); // 关闭右侧转轮
// 登录页面路由
const loginRoutePath = '/login';
// 不重定向白名单
const whiteRouteList = ['loginRoute'];

/**
 * 全局路由前置守卫
 */
router.beforeEach((to, from, next) => {
  console.log('路由To：', to);
  if (to.meta.title) document.title = `${ to.meta.title }-Vue3商城后台`;

  NProgress.start();

  // 获取用户token
  // const userToken = authUtil.getUserToken();
  const userToken = store.state.userModule.userToken;

  if (userToken) {
    // 防止重复登录
    if (to.path === loginRoutePath) {
      commonUtil.elNotify('请勿重复登录', 'warning');
      next({ path: from.path ? from.path : '/' });
    } else {
      // 如果 vuex 中不存在侧边栏菜单列表
      if (!store.getters['userModule/sidebarMenuList'].length) {
        // 拉取用户信息 获取用户信息的菜单列表
        store.dispatch('userModule/fetchUserInfoAction').then(res => {
          // 动态添加路由
          _addAsyncRouteFunc(res.menus);
          // console.log('所有路由列表：', router.getRoutes());
          next(to.fullPath);
        });
      } else {
        next();
      }
    }
  } else {
    // 在免登录路由名单，直接进入
    if (whiteRouteList.includes(to.name)) {
      next();
    } else {
      // 无 token 情况下则进入登录页面
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      // NProgress.done();
    }
  }
});

/**
 * 全局路由后置守卫
 */
router.afterEach((to, from) => {
  NProgress.done();
});

/**
 * 动态添加路由的方法
 */
const _addAsyncRouteFunc = menuList => {
  menuList.forEach(menuItem => {
    let _findRouteItem = asyncRouterMap.find(routeItem => routeItem.path === menuItem.frontpath);

    if (_findRouteItem) {
      // 动态添加子路由
      router.addRoute('layoutRoute', _findRouteItem);
    }
    // 递归调取自身
    if (menuItem.child && menuItem.child.length) {
      _addAsyncRouteFunc(menuItem.child);
    }
  });
};
