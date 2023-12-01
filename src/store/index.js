import { createStore } from 'vuex';
import userModule from './modules/userModule';

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    };
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    userModule,
    // permissionModule
  }
});

export default store;
