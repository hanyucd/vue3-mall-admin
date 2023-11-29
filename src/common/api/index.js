import httpRequest from './httpRequest';

export default {
  // 用户登录
  userLogin: param => httpRequest(`/admin/login`, param, 'post'),
  // 拉取用户信息
  fetchUserInfo: param => httpRequest(`/admin/getinfo`, param, 'post'),
  // 用户退出登录
  userLogout: param => httpRequest(`/admin/ogout`, param, 'post'),
};
