import router from '@/router';
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
    // console.log('用户token', userToken);
    // 防止重复登录
    if (to.path === loginRoutePath) {
      commonUtil.elNotify('请勿重复登录', 'warning');
      next({ path: from.path ? from.path : '/' });
      // next({ path: '/' });
    } else {
      if (!store.getters['userModule/sidebarMenuList'].length) {
        store.dispatch('userModule/fetchUserInfoAction').then(res => {
          console.log(res);
        });
      }
      next();
    }
  } else {
    // 在免登录路由名单，直接进入
    if (whiteRouteList.includes(to.name)) {
      // console.log('白名单路由');
      next();
    } else {
      // 无 token 情况下则进入登录页面
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      // console.log('无 token');
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

// console.log(router);

/**
 * 
 * 动态添加路由的方法
 */
const _generateAsyncRoutes = menuList => {
  console.log(menuList);
  // menuList.forEach()
  
};
