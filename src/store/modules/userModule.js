import api from '@/common/api';
import authUtil from '@/common/utils/authUtil';

const mutationType = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_USER_TOKEN: 'SET_USER_TOKEN',
};

const state = {
  userToken: authUtil.getUserToken(), // 用户token
  userInfo: { _id: '11' }, // 用户信息
};

const getters = {
  userId: state => state.userInfo?._id || '', // 用户 id
};

const mutations = {
  // 设置 用户token
  [mutationType.SET_USER_TOKEN]: (state, token) => {
    state.userToken = token;
  },
  // 设置 用户信息
  [mutationType.SET_USER_INFO]: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const actions = {
  /**
   * 用户登录
   */
  userLoginAction({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      api.userLogin({ username, password }).then(res => {
        const { data: loginedData } = res;
        console.log('登录结果：', loginedData);
        // 用户Token存储到 cookie
        authUtil.setUserToken(loginedData.token);
        // 用户Token存储到 vuex
        commit(mutationType.SET_USER_TOKEN, loginedData.token);

        resolve(loginedData);
      }).catch(error => {
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
