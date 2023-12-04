import api from '@/common/api';
import authUtil from '@/common/utils/authUtil';

const mutationType = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_USER_TOKEN: 'SET_USER_TOKEN',
  CLEAR_USER_DATA: 'CLEAR_USER_DATA',
  SET_RULE_NAMES: 'SET_RULE_NAMES'
};

const state = {
  userToken: authUtil.getUserToken(), // 用户token
  userInfo: {}, // 用户信息
  ruleNames: [], // 按钮权限组
};

const getters = {
  userId: state => state.userInfo?.id || '', // 用户 id
  sidebarMenuList: state => state.userInfo?.menus || [] // 侧边栏菜单列表
};

const mutations = {
  // 设置 用户token
  [mutationType.SET_USER_TOKEN]: (state, _token) => {
    state.userToken = _token;
  },
  // 设置 用户信息
  [mutationType.SET_USER_INFO]: (state, _userInfo) => {
    state.userInfo = _userInfo;
  },
  // 设置 按钮权限组
  [mutationType.SET_RULE_NAMES]: (state, _ruleName) => {
    state.ruleNames = _ruleName;
  },
  // 清除 信息
  [mutationType.CLEAR_USER_DATA]: (state) => {
    state.userToken = '';
    state.userInfo = {};
    authUtil.removeToken(); // 清除 cookies中的 token
  },
};

const actions = {
  /**
   * 用户登录
   */
  userLoginAction({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      api.userLoginApi({ username, password }).then(res => {
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
    return new Promise((resolve, reject) => {
      api.userLogoutApi().then(res => {
        commit(mutationType.CLEAR_USER_DATA);
        resolve(res);
      })
      .catch(err => reject(err));
    });
  },
  /**
   * 更新用户密码
   */
  updateUserPasswordAction({ commit }, { oldpassword, password, repassword }) {
    return new Promise((resolve, reject) => {
      api.updateUserPasswordApi({ oldpassword, password, repassword }).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  },
  /**
   * 拉取用户信息
   */
  fetchUserInfoAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.fetchUserInfoApi()
        .then(res => {
          const { data: userInfoData } = res;
          commit(mutationType.SET_USER_INFO, userInfoData);
          commit(mutationType.SET_RULE_NAMES, userInfoData.ruleNames);

          resolve(userInfoData);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default { namespaced: true, state, getters, mutations, actions };
