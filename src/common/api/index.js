import httpRequest from './httpRequest';

export default {
  // 用户登录
  userLogin: param => httpRequest(`/admin/login`, param, 'post'),
};
