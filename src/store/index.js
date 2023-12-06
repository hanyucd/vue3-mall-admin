import { createStore } from 'vuex';
import userModule from './modules/userModule';

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      isCollapseSidebarMenu: false, // 侧边栏是否折叠
    };
  },
  getters: {},
  mutations: {
    // 切换展开/关闭侧边栏
    'SWITCH_SIDEBAR_MENU_STATE'(state, ) {
      state.isCollapseSidebarMenu = !state.isCollapseSidebarMenu;
    },
  },
  actions: {},
  modules: {
    userModule,
    // permissionModule
  }
});

export default store;
