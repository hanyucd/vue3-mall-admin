import api from '@/common/api';

const mutationType = {
  SET_USER_INFO: 'SET_USER_INFO',
};

const state = {
  userInfo: { _id: '11' }, // 用户信息
};

const getters = {
  userId: state => state.userInfo?._id || '', // 用户 id
};

const mutations = {
  // 设置 用户信息
  [mutationType.SET_USER_INFO]: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const actions = {
  /**
   * 用户登录
   */
  userLoginAction({ commit }, userAccountInfo) {
    return new Promise((resolve, reject) => {
      api.userLogin(userAccountInfo).then(res => {
        const { data: loginedData } = res;
        // console.log('登录结果：', loginedData);
        // commit('SET_USER_INFO', userInfoStorage.setStorage(loginedData));
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  },
  /**
   * 用户登出
   */
  userLogoutAction({ commit }) {
    return new Promise(resolve => {
      // commit('SET_USER_INFO', userInfoStorage.removeStorage());
      resolve();
    });
  },
  /**
   * 拉取用户信息
   */
  // fetchUserInfoAction({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     api.fetchUserInfo()
  //       .then(res => {
  //         commit('SET_USER_PERMISSION_LIST', res.role.permissions);
  //         commit('SET_USER_INFO', res);
  //         resolve(res.role.permissions);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }
};


export default { namespaced: true, state, getters, mutations, actions };
