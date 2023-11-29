import { createStore } from 'vuex';
import userModule from './modules/userModule';

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    };
  },
  mutations: {
    increment (state) {
      state.count++;
    }
  },
  modules: {
    userModule,
    // permissionModule
  }
});

export default store;
