import httpRequest from './httpRequest';

export default {
  // 用户登录
  userLoginApi: param => httpRequest(`/admin/login`, param, 'post'),
  // 拉取用户信息
  fetchUserInfoApi: param => httpRequest(`/admin/getinfo`, param, 'post'),
  // 用户退出登录
  userLogoutApi: param => httpRequest(`/admin/logout`, param, 'post'),
  // 更新用户密码
  updateUserPasswordApi: param => httpRequest(`/admin/updatepassword`, param, 'post'),
};
